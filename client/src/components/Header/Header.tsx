import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchSearchSuggestions, IFilm } from '../../store/reducers/Films/FilmActions';
import { API_URL } from '../../api';

function Header() {

    const dispatch = useAppDispatch()
    const {isAuth, user} = useAppSelector(state => state.userReducer)
    const navigate = useNavigate()

    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState<IFilm[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    const isAdmin = isAuth && user?.roles?.some(role => role.name === 'ADMIN');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchValue.trim().length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchSearchSuggestions(searchValue))
                .unwrap() 
                .then((data) => {
                    setSuggestions(data);
                    setIsOpen(true); 
                })
                .catch(() => {
                    setSuggestions([]);
                });
        }, 350); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue, dispatch]);


    const handleSuggestionClick = (filmId: number) => {
        setIsOpen(false);
        setSearchValue(''); 
        navigate(`/film/${filmId}`);
    };

    

    return (
        <header className="header">
            <div className="header__container">
                <Link to="/" className="header__logo">
                    <h1 className='logo'>Films</h1>
                </Link>
                <nav className="header__menu">
                    <NavLink to="/" className={({ isActive }) => isActive ? "header__link header__link_active" : "header__link"}>
                        Лента
                    </NavLink>
                    {isAdmin && (
                        <NavLink to="/admin" className={({ isActive }) => isActive ? "header__link header__link_active" : "header__link"}>
                            Админ-панель
                        </NavLink>
                    )}
                    <div className="header__search-container" ref={searchRef}>
                        <input 
                            type="text" 
                            className="header__search-input" 
                            placeholder="Поиск фильмов..." 
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                        />
                        {isOpen && (
                            <div className="search-dropdown">
                                {suggestions.length === 0 ? (
                                    <div className="search-dropdown__empty">Ничего не найдено</div>
                                ) : (
                                    suggestions.map((film) => (
                                        <div 
                                            key={film.id} 
                                            className="search-dropdown__item"
                                            onClick={() => handleSuggestionClick(film.id)}
                                        >
                                            <img 
                                                src={`${API_URL}/${film.poster}`} 
                                                alt={film.title} 
                                                className="search-dropdown__poster" 
                                            />
                                            <div className="search-dropdown__info">
                                                <span className="search-dropdown__title">{film.title}</span>
                                                <span className="search-dropdown__meta">{film.year} • {film.director}</span>
                                            </div>
                                            <div className="search-dropdown__rating">
                                                {film.rating.toFixed(1)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </nav>
                <div className="header__actions">
                    <Link to={isAuth ? `/profile/${user?.id}` : '/login'} className={isAuth ? 'profile__btn'  :"header__btn"}>
                        {isAuth
                        ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_405_1531)">
                            <path d="M11.4524 14.0188C7.19063 14.404 3.94378 18.0051 4.00036 22.2838V22.5008C4.00036 23.3292 4.67194 24.0008 5.50036 24.0008C6.32878 24.0008 7.00036 23.3292 7.00036 22.5008V22.2238C6.95527 19.5967 8.89402 17.3564 11.5004 17.0238C14.2516 16.751 16.7031 18.7601 16.9759 21.5114C16.9921 21.674 17.0002 21.8373 17.0003 22.0008V22.5008C17.0003 23.3292 17.6719 24.0008 18.5003 24.0008C19.3288 24.0008 20.0003 23.3292 20.0003 22.5008V22.0008C19.9955 17.5775 16.4057 13.9957 11.9825 14.0006C11.8057 14.0008 11.6288 14.0069 11.4524 14.0188Z" fill="#1D1D1F"/>
                            <path d="M12.0004 12C15.3141 12 18.0004 9.31369 18.0004 6C18.0004 2.68631 15.3141 0 12.0004 0C8.68668 0 6.00037 2.68631 6.00037 6C6.00365 9.31233 8.68804 11.9967 12.0004 12ZM12.0004 3C13.6572 3 15.0004 4.34316 15.0004 6C15.0004 7.65684 13.6572 9 12.0004 9C10.3435 9 9.00037 7.65684 9.00037 6C9.00037 4.34316 10.3435 3 12.0004 3Z" fill="#1D1D1F"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_405_1531">
                            <rect width="24" height="24" fill="white"/>
                            </clipPath>
                            </defs>
                            </svg>
                        : "Войти"
                        }
                    </Link>
                </div>
            </div>
            </header>
    )
}

export default Header;