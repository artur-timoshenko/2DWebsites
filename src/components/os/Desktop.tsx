import React, { useCallback, useEffect, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import ShutdownSequence from './ShutdownSequence';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import { IconName } from '../../assets/icons';
import Doom from '../applications/Doom';
import BG from '../../assets/pictures/BG.png';
import Pacman from '../applications/Pacman';
import Tetris from '../applications/Tetris';



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
    doom: {
        key: 'doom',
        name: 'Doom',
        shortcutIcon: 'doomIcon',
        component: Doom,
    },

    pacman: {
        key: 'pacman',
        name: 'pacman',
        shortcutIcon: 'pacmanIcon',
        component: Pacman,
    },
    tetris: {
        key: 'tetris',
        name: 'tetris',
        shortcutIcon: 'doomIcon',
        component: Tetris,
    },
};



const Desktop: React.FC<DesktopProps> = () => {
    const [windows, setWindows] = useState<DesktopWindows>({});
    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);
    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        transitioning: false,
    });

    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const [selection, setSelection] = useState({
        isSelecting: false,
        startX: 0,
        startY: 0,
        width: 0,
        height: 0,
        originX: 0,
        originY: 0,
    });


    const [dragging, setDragging] = useState<{ x: number; y: number; id: string | null }>({
        x: 0,
        y: 0,
        id: null,
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

    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.visible) {
                setContextMenu((prev) => ({
                    ...prev,
                    transitioning: true, // Start the transition to hide the menu
                }));

                setTimeout(() => {
                    setContextMenu({
                        visible: false,
                        x: 0,
                        y: 0,
                        transitioning: false, // End the transition
                    });
                }, 300); // Adjust the timing to match the transition duration
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu]);

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

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            transitioning: false,  // Start the fade-in effect immediately
        });
    };

    return !shutdown ? (
        <div
            style={styles.desktop}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
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
                {shortcuts.map((shortcut) => (
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
            {contextMenu.visible && (
                <div
                    style={{
                        position: 'absolute',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        backgroundColor: '#C0C0C0',
                        boxShadow: 'inset -2px -2px 0px #808080, inset 2px 2px 0px #FFFFFF',
                        zIndex: 9999,
                        padding: '2px 0',
                        fontFamily: 'Millennium, sans-serif',
                        width: 160,
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: contextMenu.transitioning ? 0 : 1,  // Opacity transition
                        visibility: contextMenu.transitioning ? 'hidden' : 'visible', // Ensure visibility toggles
                        transition: 'opacity 0.3s ease, visibility 0s 0.3s' // Transition applied here
                    }}
                    onClick={() => setContextMenu({ ...contextMenu, visible: false })}
                >
                    <div
                        style={{
                            ...contextItemStyle,
                            ...(hoveredItem === 'arrangeIcons' ? contextItemHoverStyle : {})
                        }}
                        onMouseEnter={() => setHoveredItem('arrangeIcons')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Websites
                    </div>
                    <div
                        style={{
                            ...contextItemStyle,
                            ...(hoveredItem === 'lineUpIcons' ? contextItemHoverStyle : {})
                        }}
                        onMouseEnter={() => setHoveredItem('lineUpIcons')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Motion
                    </div>
                    <div style={menuDividerStyle} />
                    <div
                        style={{
                            ...contextItemStyle,
                            ...(hoveredItem === 'paste' ? contextItemHoverStyle : {}),
                            ...specialItemStyle  // Apply white color for Paste
                        }}
                        onMouseEnter={() => setHoveredItem('paste')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Paste
                    </div>
                    <div
                        style={{
                            ...contextItemStyle,
                            ...(hoveredItem === 'undoDelete' ? contextItemHoverStyle : {}),
                            ...specialItemStyle  // Apply white color for Delete
                        }}
                        onMouseEnter={() => setHoveredItem('undoDelete')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Delete
                    </div>
                    <div style={menuDividerStyle} />
                    <div
                        style={{
                            ...contextItemStyle,
                            ...(hoveredItem === 'new' ? contextItemHoverStyle : {})
                        }}
                        onMouseEnter={() => setHoveredItem('new')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        New Project
                    </div>
                    <div
                        style={{
                            ...contextItemStyle,
                            ...(hoveredItem === 'properties' ? contextItemHoverStyle : {})
                        }}
                        onMouseEnter={() => setHoveredItem('properties')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        Properties
                    </div>
                </div>
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

const contextItemStyle: React.CSSProperties = {
    padding: '2px 8px',  // уменьшенные отступы
    cursor: 'default',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    userSelect: 'none',
    color: 'black',  // базовый цвет текста
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    display: 'block',
    width: 'auto',    // автоматическая ширина
    boxSizing: 'border-box',
    transition: 'background-color 0.2s, color 0.2s', // плавный переход
    margin: '0' // убрали дополнительные отступы
};

// Add hover effect for changing text color to white
const contextItemHoverStyle: React.CSSProperties = {
    color: 'white',  // цвет текста на ховере
    backgroundColor: '#0000a3'  // эффект на ховер
};

// Specific styles for "Paste" and "Delete" to change their text color to white
const specialItemStyle: React.CSSProperties = {
    color: '#808080',  // белый цвет текста для Paste и Delete
    backgroundColor: 'transparent', // прозрачный фон
};

const menuDividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: '#808080',
    margin: '4px 6px',
    borderTop: '1px solid #FFF'
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f'
    },
    shortcutContainer: {
        position: 'absolute'
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
