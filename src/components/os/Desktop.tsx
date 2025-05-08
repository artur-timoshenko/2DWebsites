import React, { useCallback, useEffect, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import ShutdownSequence from './ShutdownSequence';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import { IconName } from '../../assets/icons';

export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

const APPLICATIONS: {
    [key: string]: {
        key: string;
        name: string;
        shortcutIcon: IconName;
        component: React.FC<ExtendedWindowAppProps<any>>;
    };
} = {
    showcase: {
        key: 'showcase',
        name: 'My Showcase',
        shortcutIcon: 'showcaseIcon',
        component: ShowcaseExplorer,
    },
};

const Desktop: React.FC<DesktopProps> = () => {
    const [windows, setWindows] = useState<DesktopWindows>({});
    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);
    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);

    const [selection, setSelection] = useState({
        isSelecting: false,
        startX: 0,
        startY: 0,
        width: 0,
        height: 0,
        originX: 0,
        originY: 0,
    });

    useEffect(() => {
        if (shutdown === true) rebootDesktop();
    }, [shutdown]);

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [];
        Object.keys(APPLICATIONS).forEach((key, index) => {
            const app = APPLICATIONS[key];
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => {
                    addWindow(
                        app.key,
                        <app.component
                            onInteract={() => onWindowInteract(app.key)}
                            onMinimize={() => minimizeWindow(app.key)}
                            onClose={() => removeWindow(app.key)}
                            key={app.key}
                        />
                    );
                },
                x: 6,
                y: 16 + index * 104,
                width: 64,
                height: 80,
                selected: false,
            });
        });
        newShortcuts.forEach((shortcut) => {
            if (shortcut.shortcutName === 'My Showcase') {
                shortcut.onOpen();
            }
        });
        setShortcuts(newShortcuts);
    }, []);

    const rebootDesktop = useCallback(() => {
        setWindows({});
    }, []);

    const removeWindow = useCallback((key: string) => {
        setTimeout(() => {
            setWindows((prev) => {
                const newWindows = { ...prev };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prev) => {
            const newWindows = { ...prev };
            newWindows[key].minimized = true;
            return newWindows;
        });
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let highest = 0;
        Object.values(windows).forEach((win) => {
            if (win?.zIndex > highest) highest = win.zIndex;
        });
        return highest;
    }, [windows]);

    const toggleMinimize = useCallback((key: string) => {
        const newWindows = { ...windows };
        const highestIndex = getHighestZIndex();
        if (newWindows[key].minimized || newWindows[key].zIndex === highestIndex) {
            newWindows[key].minimized = !newWindows[key].minimized;
        }
        newWindows[key].zIndex = highestIndex + 1;
        setWindows(newWindows);
    }, [windows, getHighestZIndex]);

    const onWindowInteract = useCallback((key: string) => {
        setWindows((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                zIndex: 1 + getHighestZIndex(),
            },
        }));
    }, [getHighestZIndex]);

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns((n) => n + 1);
        }, 600);
    }, []);

    const addWindow = useCallback((key: string, element: JSX.Element) => {
        setWindows((prev) => ({
            ...prev,
            [key]: {
                zIndex: getHighestZIndex() + 1,
                minimized: false,
                component: element,
                name: APPLICATIONS[key].name,
                icon: APPLICATIONS[key].shortcutIcon,
            },
        }));
    }, [getHighestZIndex]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const originX = e.clientX;
        const originY = e.clientY;
        setSelection({
            isSelecting: true,
            originX,
            originY,
            startX: originX,
            startY: originY,
            width: 0,
            height: 0,
        });

        // Сброс выделения
        setShortcuts((prev) =>
            prev.map((s) => ({
                ...s,
                selected: false,
            }))
        );
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!selection.isSelecting) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const startX = Math.min(selection.originX, mouseX);
        const startY = Math.min(selection.originY, mouseY);
        const width = Math.abs(mouseX - selection.originX);
        const height = Math.abs(mouseY - selection.originY);

        setSelection((prev) => ({
            ...prev,
            startX,
            startY,
            width,
            height,
        }));
    };

    const isIntersecting = (a: any, b: any) => {
        return !(
            a.x > b.x + b.width ||
            a.x + a.width < b.x ||
            a.y > b.y + b.height ||
            a.y + a.height < b.y
        );
    };

    const handleMouseUp = () => {
        if (!selection.isSelecting) return;

        const box = {
            x: selection.startX,
            y: selection.startY,
            width: selection.width,
            height: selection.height,
        };

        setShortcuts((prevShortcuts) =>
            prevShortcuts.map((shortcut) => {
                const iconBox = {
                    x: shortcut.x ?? 0,
                    y: shortcut.y ?? 0,
                    width: shortcut.width ?? 64,
                    height: shortcut.height ?? 80,
                };
                return {
                    ...shortcut,
                    selected: isIntersecting(box, iconBox),
                };
            })
        );

        setSelection((prev) => ({
            ...prev,
            isSelecting: false,
        }));
    };

    return !shutdown ? (
        <div
            style={styles.desktop}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                return (
                    <div
                        key={`win-${key}`}
                        style={{
                            zIndex: windows[key].zIndex,
                            ...(windows[key].minimized && styles.minimized),
                        }}
                    >
                        {React.cloneElement(element, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}
            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => (
                    <div
                        key={shortcut.shortcutName}
                        style={{
                            ...styles.shortcutContainer,
                            top: shortcut.y,
                            left: shortcut.x,
                        }}
                    >
                        <DesktopShortcut
                            icon={shortcut.icon}
                            shortcutName={shortcut.shortcutName}
                            onOpen={shortcut.onOpen}
                            selected={shortcut.selected}
                        />
                    </div>
                ))}
            </div>
            {selection.isSelecting && (
                <div
                    style={{
                        position: 'absolute',
                        left: selection.startX,
                        top: selection.startY,
                        width: selection.width,
                        height: selection.height,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        border: '2px solid blue',
                        pointerEvents: 'none',
                    }}
                />
            )}
            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
        </div>
    ) : (
        <ShutdownSequence setShutdown={setShutdown} numShutdowns={numShutdowns} />
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
        position: 'relative',
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
};

export default Desktop;
