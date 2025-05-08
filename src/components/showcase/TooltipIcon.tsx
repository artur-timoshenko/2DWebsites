import React, { useState } from 'react';

interface TooltipIconProps {
    src: string;
    alt: string;
    tooltip: string;
    style?: React.CSSProperties;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ src, alt, tooltip, style }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onMouseMove={handleMouseMove}
        >
            <img src={src} alt={alt} style={style} />
            {visible && (
                <div
                    style={{
                        position: 'fixed',
                        top: position.y + 10,
                        left: position.x -50,
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: 6,
                        fontSize: 30,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        transition: 'opacity 0.2s ease-in-out',
                    }}
                >
                    {tooltip}
                </div>
            )}
        </div>
    );
};

export default TooltipIcon;
