import React from 'react';
import './Film.css';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

interface FilmProps {
    id: number;
    title: string;
    poster: string;
    year: number | string;
    director: string;
    rating: number;        
    userScore?: number;    
    isProfile?: boolean;   
}

const Film: React.FC<FilmProps> = ({
    id,
    title,
    poster,
    year,
    director,
    rating,
    userScore,
    isProfile = false
}) => {
    const getRatingClass = (score: number) => {
        if (score >= 8) return 'film-card__score_high';
        if (score >= 6) return 'film-card__score_mid';
        return 'film-card__score_low';
    };
    const poster_path = `${API_URL}/${poster}` 

    const navigate = useNavigate();

    return (
        <div className="film-card" onClick={() => navigate(isProfile ?`/film/${id}` : `./film/${id}`)}>
            <div className="film-card__poster-block">
                <img src={poster_path} alt={title} className="film-card__image" />
                <div className={`film-card__badge ${getRatingClass(rating)}`}>
                    {rating.toFixed(1)}
                </div>
            </div>

            <div className="film-card__content">
                <h3 className="film-card__title" title={title}>
                    {title}
                </h3>
                <p className="film-card__info">
                    {year} • {director}
                </p>

                {isProfile && userScore !== undefined && (
                    <div className="film-card__user-rating">
                        <span className="film-card__user-label">Моя оценка:</span>
                        <span className={`film-card__user-score ${getRatingClass(userScore)}`}>
                            {userScore}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Film;