import React from 'react';
import { Link } from '../general';
import { useNavigate } from 'react-router-dom';

import portfolioIcon from '../../assets/icons/portfolio.png';
import experienceIcon from '../../assets/icons/experience.png';
import aboutIcon from '../../assets/icons/about.png';
import contactIcon from '../../assets/icons/contact.png';

import TooltipIcon from './TooltipIcon'; // убедись, что путь верный

export interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    const navigate = useNavigate();

    const goToContact = () => {
        navigate('/contact');
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.name}>Tymoshenko Production</h1>
                <h2>Motion Designer and Web Developer</h2>
            </div>
            <div style={styles.buttons}>
                <Link
                    containerStyle={styles.link}
                    to="projects"
                    text={
                        <TooltipIcon
                            src={portfolioIcon}
                            alt="Portfolio"
                            tooltip="Portfolio"
                            style={styles.icon}
                        />
                    }
                />
                <Link
                    containerStyle={styles.link}
                    to="experience"
                    text={
                        <TooltipIcon
                            src={experienceIcon}
                            alt="Experience"
                            tooltip="Experience"
                            style={styles.icon}
                        />
                    }
                />
                <Link
                    containerStyle={styles.link}
                    to="about"
                    text={
                        <TooltipIcon
                            src={aboutIcon}
                            alt="About"
                            tooltip="About"
                            style={styles.icon}
                        />
                    }
                />
                <Link
                    containerStyle={styles.link}
                    to="contact"
                    text={
                        <TooltipIcon
                            src={contactIcon}
                            alt="Contact"
                            tooltip="Contact"
                            style={styles.icon}
                        />
                    }
                />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    page: {
        left: 0,
        right: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        textAlign: 'center',
        marginBottom: 64,
        marginTop: 64,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        display: 'flex',
        gap: 32,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    image: {
        width: 800,
    },
    link: {
        padding: 16,
    },
    icon: {
        width: 96,
        height: 96,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        filter: 'brightness(0.9)',
    },
    forHireContainer: {
        marginTop: 64,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        display: 'flex',
    },
    name: {
        fontSize: 72,
        marginBottom: 16,
        lineHeight: 0.9,
    },
};

export default Home;
