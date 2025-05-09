import React from 'react';

import kakashiPose from '../../../../assets/icons/copy-ninja.png';

export interface AlcoTradingProps {}  // Измените имя интерфейса

const AlcoTrading: React.FC<AlcoTradingProps> = (props) => {  // Используйте новый интерфейс
    return (
        <div className="site-page-content">
            <h1>Alco-Trading</h1>
            <h3>Glo Glo GLo</h3>
            <br />
            <h2>10000$</h2>
        </div>
    );
};

export default AlcoTrading;
