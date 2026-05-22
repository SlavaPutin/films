import React from 'react'
import './Modal.css';

type Props = {
    setActiveReviewToDelete: (value: number | null) => void;
    handleConfirmDelete: () => void;
}

export default function Modal({setActiveReviewToDelete, handleConfirmDelete}: Props) {
    return (
        <div className="modal-overlay" onClick={() => setActiveReviewToDelete(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-card__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <h3 className="modal-card__title">Удалить отзыв?</h3>
                <p className="modal-card__text">Это действие нельзя будет отменить. Ваш отзыв и оценка будут полностью удалены.</p>
                <div className="modal-card__actions">
                    <button onClick={() => setActiveReviewToDelete(null)} className="modal-card__btn modal-card__btn_cancel">
                        Отмена
                    </button>
                    <button onClick={handleConfirmDelete} className="modal-card__btn modal-card__btn_danger">
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    )
}