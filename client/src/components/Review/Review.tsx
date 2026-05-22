import React from 'react';
import './Review.css';
import { useAppSelector } from '../../hooks/redux';
import { Link } from 'react-router-dom';

interface ReviewProps {
    id: number;
    value: number;
    text: string;
    user: {
        id: number;
        name: string;
    };
}

type Props = {
    review: ReviewProps;
    onDeleteRequest: (reviewId: number) => void;
}

export default function Review({review, onDeleteRequest}: Props) {

    const getRatingColorClass = (score: number) => {
        if (score >= 8) return 'score_high';
        if (score >= 6) return 'score_mid';
        return 'score_low';
    };

    const { user } = useAppSelector(state => state.userReducer); 

    const isAuthor = user && user.id === review.user.id;

    return (
        <div className="review-card">
            <div className="review-card__header">
                <div className="review-card__user">
                    <div className="review-card__avatar">
                        {review.user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <Link className="review-card__username" to={`/profile/${review.user.id}`}>{review.user.name}</Link>
                </div>
                
                <div className="review-card__actions">
                    <div className={`review-card__score ${getRatingColorClass(review.value)}`}>
                        {review.value.toFixed(1)}
                    </div>
                    {isAuthor && (
                        <button onClick={() => onDeleteRequest(review.id)} className="review-card__delete-btn" title="Удалить отзыв">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            {review.text && (
                <p className="review-card__text">{review.text}</p>
            )}
        </div>
    );
}