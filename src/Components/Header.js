import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../CSS/Header.css';
import Profile from './Profile';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated} = useAuth0();
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <header className="header">
            <Link to='/landing' className="header-link">
                <h1 className='logo'>STACKS</h1>
            </Link>

            {isAuthenticated && 
            <button id="hamburger-button" className="hamburger-button" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            }
            {isOpen  && (
                <div className="dropdown">
                    <ul className="dropdown-list">
                        <div className='stack-wrapper'>
                            <li className='dropdown-item-profile'>
                                <Profile/>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/my-stack" onClick={() => setIsOpen(false)}>My Stack</Link>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/add-stack" onClick={() => setIsOpen(false)}>Add to Stacks</Link>
                            </li>
                    
                        </div>
                        <div>
                           
                        </div>
                        <li>
                                <LogoutButton/>
                            </li>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;
