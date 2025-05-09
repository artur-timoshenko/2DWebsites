import React from 'react';

import kakashiPose from '../../../../assets/icons/copy-ninja.png';

export interface ShowReelProps {}  // Измените имя интерфейса

const ShowReel: React.FC<ShowReelProps> = (props) => {  // Используйте новый интерфейс
    return (
        <div className="site-page-content">
            <h1>ShowReel</h1>
            <h3>A Lot of Varians</h3>
            <br />
            <h2>hkjkhj</h2>
        </div>
    );
};

export default ShowReel;
