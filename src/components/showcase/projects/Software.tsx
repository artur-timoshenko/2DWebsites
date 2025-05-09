import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import software from '../../../assets/pictures/projects/software.gif';
import art from '../../../assets/pictures/projects/art.gif';
import copyNinjaImage from '../../../assets/icons/copy-ninja.png';

export interface ProjectsProps {}

interface ProjectBoxProps {
    icon: string;
    title: string;
    subtitle: string;
    route: string;
    iconStyle: React.CSSProperties;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({
                                                   icon,
                                                   title,
                                                   subtitle,
                                                   route,
                                                   iconStyle,
                                               }) => {
    const [, setIsHovering] = useState(false);

    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    return (
        <Link
            to={`/projects/${route}`}
            className="big-button-container"
            style={{ ...styles.projectLink, textDecoration: 'none', color: 'inherit' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={styles.projectLinkLeft}>
                <img
                    src={icon}
                    style={{ ...styles.projectLinkImage, ...iconStyle }}
                    alt=""
                />
                <div style={styles.projectText}>
                    <h1 style={{ fontSize: 48 }}>{title}</h1>
                    <h3>{subtitle}</h3>
                </div>
            </div>
            <div style={styles.projectLinkRight}></div>
        </Link>


    );
};

const Projects: React.FC<ProjectsProps> = () => {
    return (
        <div className="site-page-content">
            <h1>Website</h1>
            <h3>Projects</h3>
            <br />
            <p>
                Below you will find all the websites I have created previously.
                I have tried to include as many visuals and interactive elements as possible to showcase each project.
                Enjoy exploring!
            </p>
            <br />
            <div style={styles.projectLinksContainer}>
                <ProjectBox
                    icon={software}
                    iconStyle={styles.computerIcon}
                    title="AlcoTrading"
                    subtitle="Website"
                    route="AlcoTrading"
                />
                <ProjectBox
                    icon={art}
                    iconStyle={styles.artIcon}
                    title="Lviv Knyazhy"
                    subtitle="Landing Page"
                    route="LvivKnyazhy"
                />
                <ProjectBox
                    icon={copyNinjaImage}
                    iconStyle={styles.ninjaIcon}
                    title="The Copy Ninja"
                    subtitle="Landing Page"
                    route="the-copy-ninja"
                />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    projectLinksContainer: {
        flexDirection: 'column',
        width: '100%',
        display: 'flex',
        flex: 1,
    },
    projectLink: {
        marginBottom: 24,
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',

        alignItems: 'center',
        justifyContent: 'space-between',
    },
    projectText: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    projectLinkImage: {
        width: 48,
        // height: 48,
        marginRight: 38,
    },
    projectLinkLeft: {
        marginLeft: 16,
        alignItems: 'center',
    },
    computerIcon: {
        width: 56,
        height: 56,
    },
    arrowIcon: {
        width: 48,
        height: 48,
    },
    artIcon: {
        width: 21 * 2,
        height: 37 * 2,
    },
    ninjaIcon:{
        width: 75,
        height: 75,
    }
};

export default Projects;
