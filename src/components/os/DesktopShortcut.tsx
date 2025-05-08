import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconName } from '../../assets/icons';
import colors from '../../constants/colors';
import { Icon } from '../general';

export interface DesktopShortcutProps {
    icon: IconName;
    shortcutName: string;
    invertText?: boolean;
    onOpen: () => void;
    selected?: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

const DesktopShortcut: React.FC<DesktopShortcutProps> = ({
                                                             icon,
                                                             shortcutName,
                                                             invertText,
                                                             onOpen,
                                                             selected = false,
                                                         }) => {
    const [isSelected, setIsSelected] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [shortcutId, setShortcutId] = useState('');
    const [doubleClickTimerActive, setDoubleClickTimerActive] = useState(false);

    const requiredIcon = require(`../../assets/icons/${icon}.png`);

    const getShortcutId = useCallback(() => {
        return `desktop-shortcut-${shortcutName.replace(/\s/g, '')}`;
    }, [shortcutName]);

    useEffect(() => {
        setShortcutId(getShortcutId());
    }, [getShortcutId]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsSelected(false);
        }
    }, []);

    const handleClickShortcut = useCallback(() => {
        if (doubleClickTimerActive) {
            onOpen();
            setIsSelected(false);
            setDoubleClickTimerActive(false);
            return;
        }
        setIsSelected(true);
        setDoubleClickTimerActive(true);
        setTimeout(() => {
            setDoubleClickTimerActive(false);
        }, 300);
    }, [doubleClickTimerActive, onOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const isActive = selected || isSelected;

    return (
        <div
            id={shortcutId}
            ref={containerRef}
            onMouseDown={handleClickShortcut}
            style={{
                ...styles.appShortcut,
                top: `0px`,
                left: `0px`,
            }}
        >
            <div style={styles.iconContainer}>
                <div
                    className="desktop-shortcut-icon"
                    style={{
                        ...styles.iconOverlay,
                        ...(isActive && styles.checkerboard),
                        ...(isActive && {
                            WebkitMask: `url(${requiredIcon})`,
                        }),
                    }}
                />
                <Icon icon={icon} style={styles.icon} />
            </div>
            <div
                className={
                    isActive ? 'selected-shortcut-border' : 'shortcut-border'
                }
                style={isActive ? { backgroundColor: colors.blue } : {}}
            >
                <p
                    style={{
                        ...styles.shortcutText,
                        ...(invertText && !isActive ? { color: 'black' } : {}),
                    }}
                >
                    {shortcutName}
                </p>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    appShortcut: {
        position: 'absolute',
        width: 112, // Увеличено в 2 раза
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        userSelect: 'none',
    },
    shortcutText: {
        cursor: 'pointer',
        fontFamily: 'MSSerif',
        color: 'white',
        fontSize: 16, // Увеличен в 2 раза
        padding: '0 4px',
        userSelect: 'none', // Отключение выделения текста
        outline: 'none',     // Убираем рамку при фокусе
        margin: 0,
    },
    iconContainer: {
        cursor: 'pointer',
        paddingBottom: 6,
    },
    iconOverlay: {
        position: 'absolute',
        top: 0,
        width: 64, // увеличено
        height: 64,
    },
    checkerboard: {
        backgroundImage: `linear-gradient(45deg, ${colors.blue} 25%, transparent 25%),
                          linear-gradient(-45deg, ${colors.blue} 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, ${colors.blue} 75%),
                          linear-gradient(-45deg, transparent 75%, ${colors.blue} 75%)`,
        backgroundSize: `4px 4px`,
        backgroundPosition: `0 0, 0 2px, 2px -2px, -2px 0px`,
        pointerEvents: 'none',
    },
    icon: {
        width: 64,
        height: 64,
    },
};

export default DesktopShortcut;
