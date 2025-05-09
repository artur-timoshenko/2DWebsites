import React from 'react';
import { Link } from '../general';
import { useNavigate } from 'react-router-dom';

import portfolioIcon from '../../assets/icons/portfolio.png';
import experienceIcon from '../../assets/icons/experience.png';
import aboutIcon from '../../assets/icons/about.png';
import contactIcon from '../../assets/icons/contact.png';

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
                    to="projects"
                    containerStyle={styles.link}
                    text={
                        <div style={styles.iconBlock}>
                            <img src={portfolioIcon} alt="Portfolio" style={styles.icon} />
                            <div style={styles.label}>Portfolio</div>
                        </div>
                    }
                />
                <Link
                    to="experience"
                    containerStyle={styles.link}
                    text={
                        <div style={styles.iconBlock}>
                            <img src={experienceIcon} alt="Experience" style={styles.icon} />
                            <div style={styles.label}>Experience</div>
                        </div>
                    }
                />
                <Link
                    to="about"
                    containerStyle={styles.link}
                    text={
                        <div style={styles.iconBlock}>
                            <img src={aboutIcon} alt="About" style={styles.icon} />
                            <div style={styles.label}>About</div>
                        </div>
                    }
                />
                <Link
                    to="contact"
                    containerStyle={styles.link}
                    text={
                        <div style={styles.iconBlock}>
                            <img src={contactIcon} alt="Contact" style={styles.icon} />
                            <div style={styles.label}>Contact</div>
                        </div>
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
    link: {
        padding: 16,
        textDecoration: 'none',
        color: '#0000ee',
    },
    icon: {
        width: 96,
        height: 96,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        filter: 'brightness(0.9)',
    },
    iconBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        marginTop: 8,
        fontSize: 18,
        textAlign: 'center',
        color: '#0000ee',
    },
    name: {
        fontSize: 72,
        marginBottom: 16,
        lineHeight: 0.9,
    },
};

export default Home;
