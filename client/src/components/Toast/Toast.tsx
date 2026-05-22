import React, { useEffect } from 'react';
import './Toast.css';

type ToastType = 'success' | 'error';

type Props = {
    message: string;
    type: ToastType; // Строго 'success' или 'error'
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: Props) {
    
    // Автоматическое скрытие плашки
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const isSuccess = type === 'success';

    return (
        <div className={`toast-plate toast-plate_${type}`} onClick={onClose} title="Кликните, чтобы закрыть">
            <div className="toast-plate__icon">
                {isSuccess ? (
                    /* Иконка Галочки для Success */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#107C41" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
                    /* Иконка Восклицательного знака для Error */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                )}
            </div>
            
            <div className="toast-plate__content">
                <span className={`toast-plate__title toast-plate__title_${type}`}>
                    {isSuccess ? 'Успешно' : 'Ошибка'}
                </span>
                <p className="toast-plate__text">{message}</p>
            </div>
            
            <button className="toast-plate__close-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
}
