import { Link, useLocation } from 'react-router-dom';
import { useState, useContext, useMemo } from 'react';
import '../CSS/Header.css';
import Profile from './Profile';
import SearchSortFilterBar from './SearchSortFilterBar';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
import { useAuthorization } from '../Context/AuthorizationContext';
import { PERMISSIONS } from '../utils/permissions';
import { SORT_OPTIONS } from '../utils/sortOptions';
import GenreContext from '../Context/GenreContext';
import LandingFilterContext from '../Context/LandingFilterContext';
import StackFilterContext from '../Context/StackFilterContext';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth0();
    const { checkPermission } = useAuthorization();
    const location = useLocation();
    const { genres } = useContext(GenreContext);
    const landingFilter = useContext(LandingFilterContext);
    const stackFilter = useContext(StackFilterContext);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const genreOptions = useMemo(() => genres.map(g => g.name), [genres]);
    // Hardcoded two-route allowlist (not a denylist), so any future route
    // defaults to no filter bar rather than accidentally showing a broken one.
    const isStackRoute = location.pathname === '/my-stack';
    const showFilters = isAuthenticated && (location.pathname === '/landing' || isStackRoute);
    const activeFilter = isStackRoute ? stackFilter : landingFilter;

    return (
        <>
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
                                {checkPermission(PERMISSIONS.MANAGE_USERS) && (
                                    <li className="dropdown-item">
                                        <Link to="/admin/users" onClick={() => setIsOpen(false)}>Admin: Users</Link>
                                    </li>
                                )}
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
            {showFilters && (
                <SearchSortFilterBar
                    variant={isStackRoute ? 'stack' : 'landing'}
                    search={activeFilter.search}
                    onSearchChange={activeFilter.setSearch}
                    searchPlaceholder={isStackRoute ? 'Search your stack…' : 'What would you like to listen to?'}
                    genreOptions={genreOptions}
                    selectedGenres={activeFilter.selectedGenres}
                    onGenresChange={activeFilter.setSelectedGenres}
                    selectedSort={activeFilter.selectedSort}
                    onSortChange={activeFilter.setSelectedSort}
                    sortOptions={SORT_OPTIONS}
                    genreOrder={activeFilter.genreOrder}
                    onGenreOrderToggle={() => activeFilter.setGenreOrder(activeFilter.genreOrder === 'asc' ? 'desc' : 'asc')}
                    viewMode={activeFilter.viewMode}
                    onViewModeToggle={() => activeFilter.setViewMode(activeFilter.viewMode === 'carousel' ? 'grid' : 'carousel')}
                />
            )}
        </>
    );
};

export default Header;
