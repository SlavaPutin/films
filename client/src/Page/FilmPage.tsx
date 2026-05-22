import React, { useEffect, useState } from 'react';
import '../style/FilmPage.css';
import Header from '../components/Header/Header';
import Review from '../components/Review/Review';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFilm } from '../store/reducers/Films/FilmActions';
import { API_URL } from '../api';
import { deleteReview, rate } from '../store/reducers/Rating/RatingAction';
import Modal from '../components/Modal/Modal';
import Toast from '../components/Toast/Toast';

const FilmPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const {film, error, isLoading} = useAppSelector(state => state.filmReducer);
    const navigate = useNavigate();
    const {id} = useParams()

    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(10);

    const [activeReviewToDelete, setActiveReviewToDelete] = useState<null | number>(null);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        dispatch(fetchFilm(Number(id)))
    }, [dispatch])

    const getRatingColorClass = (score: number) => {
        if (score >= 8) return 'score_high';
        if (score >= 6) return 'score_mid';
        return 'score_low';
    };

    const rateFIlm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim()) return;
        dispatch(rate({ 
            value: reviewRating, 
            text: reviewText, 
            filmId: Number(id) 
        }))
            .unwrap()
            .then((successMessage) => {
                setToast({ 
                    message: successMessage || "Отзыв успешно добавлен!", 
                    type: 'success' 
                });
                setReviewText('');
                dispatch(fetchFilm(Number(id))); 
            })
            .catch((errorMessage) => {
                setToast({ 
                    message: errorMessage || "Не удалось отправить отзыв", 
                    type: 'error' 
                });
            });
            
        }
    
    const handleConfirmDelete = () => {
        if (activeReviewToDelete) {
            dispatch(deleteReview(activeReviewToDelete))
                .unwrap()
                .then((successMessage) => {
                    setToast({ 
                        message: successMessage || "Отзыв успешно удален", 
                        type: 'success' 
                    });
                    setActiveReviewToDelete(null);
                    dispatch(fetchFilm(Number(id))); 
                })
                .catch((errorMessage) => {
                    setToast({ 
                        message: errorMessage || "Не удалось удалить отзыв", 
                        type: 'error' 
                    });
                });
        }
    };

    if (isLoading) {
        return <div className="film-page"><h1>Загрузка профиля...</h1></div>;
    }

    if (error) {
        return <div className="film-page"><h1>Ошибка: {error}</h1></div>;
    }

    if (!film) {
        return <div className="film-page"><h1>Фильм не найден</h1></div>;
    }

    const poster_path = `${API_URL}/${film.poster}` 


    return (<>
        <Header/>
        <div className="film-page">
            <div className="film-page__container">

                <button onClick={() => navigate(-1)} className="film-page__back-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Назад
                </button>

                <section className="film-main">
                    <div className="film-main__poster-block">
                        <img src={poster_path} alt={film?.title} className="film-main__poster" />
                    </div>
                    
                    <div className="film-main__details">
                        <h1 className="film-main__title">{film?.title}</h1>
                        <p className="film-main__meta">{film?.year} • {film?.genre}</p>
                        
                        <div className="film-main__row">
                            <span className="film-main__label">Режиссер:</span>
                            <span className="film-main__value">{film?.director}</span>
                        </div>

                        <div className="film-main__rating-block">
                            <span className="film-main__rating-label">Рейтинг ScoreApp:</span>
                            <span className={`film-main__rating-value ${getRatingColorClass(film?.rating)}`}>
                                {film?.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </section>
                <section className="film-reviews">
                    <h2 className="film-reviews__title">Отзывы пользователей ({film?.ratings?.length})</h2>
                    
                    {film?.ratings.length === 0 ? (
                        <p className="film-reviews__empty">У этого фильма еще нет отзывов. Станьте первым!</p>
                    ) : (
                        <div className="reviews-list">
                            {film?.ratings?.map(review => (
                                <Review key={review.id} review={review} onDeleteRequest={(reviewId: number) => setActiveReviewToDelete(reviewId)}/>
                            ))}
                        </div>
                    )}
                </section>

                <section className="add-review-section">
                    <h3 className="add-review-section__title">Оставить отзыв</h3>
                    <form  className="add-review-form" onSubmit={rateFIlm}>
                        <div className="add-review-form__row">
                            <label className="add-review-form__label">Ваша оценка:</label>
                            <select 
                                value={reviewRating} 
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                                className="add-review-form__select"
                            >
                                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        
                        <textarea 
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Поделитесь вашим мнением о фильме..."
                            className="add-review-form__textarea"
                            rows={4}
                            required
                        />
                            
                        <button type="submit" className="add-review-form__submit-btn">
                            Отправить отзыв
                        </button>
                    </form>
                </section>
            </div>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
        {activeReviewToDelete !== null && (
            <Modal setActiveReviewToDelete={setActiveReviewToDelete} handleConfirmDelete={handleConfirmDelete}/>
        )}
        </>
    );
};

export default FilmPage;
