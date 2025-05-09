import './App.css';
import Desktop from './components/os/Desktop';
import { useEffect } from 'react';
import cursorImage from './assets/icons/arrow.png'; // Імпортуємо кастомний курсор
import handCursorImage from './assets/icons/hand.png'; // Імпортуємо курсор для клікабельних елементів

function App() {
    useEffect(() => {
        // Зміна курсора для всього сайту
        document.body.style.cursor = `url(${cursorImage}), auto`;

        // Зміна курсора для клікабельних елементів через CSS
        const clickableElements = document.querySelectorAll('.clickable');
        clickableElements.forEach((element) => {
            // Типізуємо елементи як HTMLElement
            const clickableElement = element as HTMLElement;
            clickableElement.addEventListener('mouseenter', () => {
                clickableElement.classList.add('hand-cursor'); // Додаємо клас для зміни курсора
            });
            clickableElement.addEventListener('mouseleave', () => {
                clickableElement.classList.remove('hand-cursor'); // Видаляємо клас для повернення звичайного курсора
            });
        });
    }, []);

    return (
        <div className="App">
            <Desktop />
        </div>
    );
}

export default App;
