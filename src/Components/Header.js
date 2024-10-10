import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../CSS/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <Link to='/landing' className="header-link">
                <h1 className='logo'>STACKS</h1>
            </Link>
            <button id="hamburger-button" className="hamburger-button" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            {isOpen && (
                <div className="dropdown">
                    <ul className="dropdown-list">
                        <li className="dropdown-item">
                            <Link to="/my-stack" onClick={() => setIsOpen(false)}>My Stack</Link>
                        </li>
                        <li className="dropdown-item">
                            <Link to="/add-stack" onClick={() => setIsOpen(false)}>Add to Stacks</Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;
