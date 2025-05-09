import React from 'react';

import kakashiPose from '../../../../assets/icons/copy-ninja.png';

export interface ExplainersProps {}  // Измените имя интерфейса

const Explainers: React.FC<ExplainersProps> = (props) => {  // Используйте новый интерфейс
    return (
        <div className="site-page-content">
            <h1>Explainers</h1>
            <h3>A Lot of Varians</h3>
            <br />
            <h2>minecraft</h2>
        </div>
    );
};

export default Explainers;
