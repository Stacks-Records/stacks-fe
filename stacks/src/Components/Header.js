import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../CSS/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <header className="header">
            <Link to='/' className="header-link">
                <h1>Stacks</h1>
            </Link>
            <nav className={`nav ${isOpen ? 'open' : ''}`}>
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/mystack">My Stack</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/add-stack">Add to Stacks</Link>
                    </li>
                </ul>
            </nav>
            <button className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
        </header>
    );
};

export default Header;
