import React from 'react';

import kakashiPose from '../../../../assets/icons/copy-ninja.png';

export interface WebsiteAnimationProps {}  // Измените имя интерфейса

const WebsiteAnimation: React.FC<WebsiteAnimationProps> = (props) => {  // Используйте новый интерфейс
    return (
        <div className="site-page-content">
            <h1>WebsiteAnimation</h1>
            <h3>A Lot of Varians</h3>
            <br />
            <h2>hkjkhj</h2>
        </div>
    );
};

export default WebsiteAnimation;
