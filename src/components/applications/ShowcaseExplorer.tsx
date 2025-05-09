import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../showcase/Home';
import About from '../showcase/About';
import Window from '../os/Window';
import Experience from '../showcase/Experience';
import Projects from '../showcase/Projects';
import Contact from '../showcase/Contact';
import TheCopyNinja from '../showcase/projects/website project/the-copy-ninja';
import LvivKnyazhy from '../showcase/projects/website project/LvivKnyazhy';
import AlcoTrading from '../showcase/projects/website project/AlcoTrading';
import LogoAnimation from '../showcase/projects/motion design project/LogoAnimation';
import CharacterAnimation from '../showcase/projects/motion design project/CharacterAnimation';
import Explainers from '../showcase/projects/motion design project/Explainers';
import Reels from '../showcase/projects/motion design project/Reels';
import WebsiteAnimation from '../showcase/projects/motion design project/WebsiteAnimation';
import Animation25D from '../showcase/projects/motion design project/Animation25D';
import ShowReel from '../showcase/projects/motion design project/ShowReel';
import SoftwareProjects from '../showcase/projects/Software';
import ArtProjects from '../showcase/projects/Art';
import VerticalNavbar from '../showcase/VerticalNavbar';
import useInitialWindowSize from '../../hooks/useInitialWindowSize';

export interface ShowcaseExplorerProps extends WindowAppProps {}

const ShowcaseExplorer: React.FC<ShowcaseExplorerProps> = (props) => {
    const { initWidth, initHeight } = useInitialWindowSize({ margin: 100 });

    return (
        <Window
            top={24}
            left={56}
            width={initWidth}
            height={initHeight}
            windowTitle="Tymoshenko Production - Showcase 2025"
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2025 Tymoshenko Production'}
        >
            <Router>
                <div className="site-page">
                    <VerticalNavbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/experience" element={<Experience />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/projects/the-copy-ninja" element={<TheCopyNinja />} />
                        <Route path="/projects/LvivKnyazhy" element={<LvivKnyazhy />} />
                        <Route path="/projects/AlcoTrading" element={<AlcoTrading />} />
                        <Route path="/projects/LogoAnimation" element={<LogoAnimation />} />
                        <Route path="/projects/CharacterAnimation" element={<CharacterAnimation />} />
                        <Route path="/projects/Explainers" element={<Explainers />} />
                        <Route path="/projects/Reels" element={<Reels />} />
                        <Route path="/projects/WebsiteAnimation" element={<WebsiteAnimation />} />
                        <Route path="/projects/Animation25D" element={<Animation25D />} />
                        <Route path="/projects/ShowReel" element={<ShowReel />} />
                        <Route
                            path="/projects/software"
                            element={<SoftwareProjects />}
                        />
                        <Route path="/projects/art" element={<ArtProjects />} />
                    </Routes>
                </div>
            </Router>
        </Window>
    );
};

export default ShowcaseExplorer;
