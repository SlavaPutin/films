import React, { useEffect, useState } from 'react';
import '../style/Profile.css';
import Lenta from '../components/Lenta/Lenta';
import Header from '../components/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { deleteAccount, fetchProfile, logout, resendMail } from '../store/reducers/User/userActions';
import Toast from '../components/Toast/Toast';
import Modal from '../components/Modal/Modal';

const Profile: React.FC = () => {
    
    const {id} = useParams()
    const dispatch = useAppDispatch();
    
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { profileData, user, isProfileLoading, error } = useAppSelector(state => state.userReducer);

    useEffect(() => {
        if (id) {
            dispatch(fetchProfile(Number(id)));
        }
    }, [id, dispatch]);

    const navigate = useNavigate()

    const handleLogoutClick = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                navigate('/login'); 
            })
            .catch((err) => {
                setToast({
                    message: err || "Не удалось выйти из аккаунта",
                    type: 'error'
                });
            });
    }

    const handleConfirmDeleteAccount = () => {
        dispatch(deleteAccount(Number(id)))
            .unwrap()
            .then((msg) => {
                setToast({ message: msg, type: 'success' });
                setShowDeleteModal(false);
                navigate('/login')
            })
            .catch((err) => {
                setToast({ message: err || "Ошибка при удалении", type: 'error' });
                setShowDeleteModal(false);
            });
    };
    const resend = () => {
        dispatch(resendMail());
    }

    if (isProfileLoading) {
        return <div className="profile-page"><h1>Загрузка профиля...</h1></div>;
    }

    if (error) {
        return <div className="profile-page"><h1>Ошибка: {error}</h1></div>;
    }

    if (!profileData) return null;

    
    const isOwner = user?.id === profileData.id;



    return (<>
        <Header/>
        <div className="profile-page">
            <div className="profile-page__container">
                
                {isOwner && !profileData.isActivated && (
                    <div className="activation-banner">
                        <div className="activation-banner__text">
                            Ваш аккаунт не подтвержден. Проверьте почту <strong>{profileData.email}</strong>.
                        </div>
                        <div className="activation-banner__actions">
                            <button className="activation-banner__btn" onClick={resend}>Повторить письмо</button>
                            <button className="activation-banner__btn activation-banner__btn_secondary">Изменить почту</button>
                        </div>
                    </div>
                )}

                <section className="profile-info">
                    <div className="profile-info__avatar">
                        {profileData.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="profile-info__details">
                        <div className="profile-info__name-row">
                            <h1 className="profile-info__name">{profileData.name}</h1>
                            <div className="profile-info__roles">
                                {profileData.roles.map((role: any) => (
                                    <span key={role.id} className="profile-info__role-badge">
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {isOwner && <p className="profile-info__email">{profileData.email}</p>}
                        <div className="profile-info__stats">
                            Оценил фильмов: <strong>{profileData.ratedFilms.length}</strong>
                        </div>
                        {isOwner && (
                            <div className="profile-info__actions-row">
                                <button onClick={handleLogoutClick} className="profile-info__logout-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Выйти из аккаунта
                                </button>

                                <button onClick={() => setShowDeleteModal(true)} className="profile-info__delete-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Удалить профиль
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="profile-content">
                    <h2 className="profile-content__title">Оцененные фильмы</h2>
                    
                    {profileData.ratedFilms.length === 0 ? (
                        <p className="profile-content__empty">Вы еще не выставили ни одной оценки.</p>
                    ) : (
                        <Lenta films={profileData.ratedFilms} isProfile={true} />
                    )}
                </section>

            </div>
        </div>
        {toast && (
            <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
        {showDeleteModal && (
            <Modal
                setActiveReviewToDelete={() => setShowDeleteModal(false)} 
                handleConfirmDelete={handleConfirmDeleteAccount}
            />
        )}
        </>
    );
};

export default Profile;
