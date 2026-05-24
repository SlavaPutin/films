import React, { useEffect, useRef } from 'react'
import Header from '../components/Header/Header';
import BarFilter from '../components/BarFilter/BarFilter';
import '../style/Main.css'
import Lenta from '../components/Lenta/Lenta';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { resetFilms } from '../store/reducers/Films/FilmSlice';
import { fetchScroll } from '../store/reducers/Films/FilmActions';

function Main() {

    const dispatch = useAppDispatch();
    
    const { films, currentPage, hasMore, isLoading, error, genre, year, sortOrder } = useAppSelector(state => state.filmReducer);

    const observerTarget = useRef<HTMLDivElement | null>(null);
    
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        dispatch(resetFilms());
        dispatch(fetchScroll({ 
            page: 1, 
            genre, 
            year, 
            sortOrder 
        }));
    }, [dispatch, genre, year, sortOrder]);

    useEffect(() => {
        if (!hasMore || isLoading || error || films.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    dispatch(fetchScroll({ 
                                page: currentPage, 
                                genre, 
                                year, 
                                sortOrder 
                            }));
                }
            },
            { threshold: 0.5 } 
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, isLoading, dispatch, error, currentPage, genre, year, sortOrder, films.length]);
    return (
        <>
            <Header/>
            <div className='wrap-center-main'>
                <div className='wrap-filmsAndFilter'>
                    {error && <div className="error-message-block">{error}</div>}
                    <BarFilter/>
                    <Lenta films={films}/>
                    {isLoading && (
                        <div className="main-page__loader">
                            <h3>Загрузка фильмов...</h3>
                        </div>
                    )}
                    <div ref={observerTarget} className="main-page__scroll-trigger"></div>
                </div>
            </div>
        </>
    )
}

export default Main;