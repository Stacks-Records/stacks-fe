import {Link} from 'react-router-dom'
import '../CSS/Header.css';

const Header = () => {
    return (
        <header className="header">
            <Link to='/' className="header-link">
                <h1>Stacks</h1>
            </Link>
        </header>
    );
};

export default Header;
