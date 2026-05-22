import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Toast from '../components/Toast/Toast';
import Modal from '../components/Modal/Modal'; 
import { useAppDispatch } from '../hooks/redux';
import { createFilm, removeFilm } from '../store/reducers/Films/FilmActions';
import { removeUser } from '../store/reducers/User/userActions';
import { $api } from '../api';
import '../style/AdminPage.css';

// Локальные интерфейсы для вывода списков в админке
interface IAdminFilm { id: number; title: string; director: string; year: number | string; }
interface IAdminUser { id: number; name: string; email: string; }

const AdminPage: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const [activeTab, setActiveTab] = useState<'create' | 'films' | 'users'>('create');

    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('боевик');
    const [poster, setPoster] = useState<File | null>(null);

    const [filmsList, setFilmsList] = useState<IAdminFilm[]>([]);
    const [usersList, setUsersList] = useState<IAdminUser[]>([]);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: 'film' | 'user' } | null>(null);

    useEffect(() => {
        if (activeTab === 'films') {
            $api.get<IAdminFilm[]>('/films').then(res => setFilmsList(res.data)).catch(() => {});
        }
        if (activeTab === 'users') {
           
            $api.get<IAdminUser[]>('/user').then(res => setUsersList(res.data)).catch(() => {});
        }
    }, [activeTab]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPoster(e.target.files[0]);
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!poster) return;

        dispatch(createFilm({ title, director, year, genre, poster }))
            .unwrap()
            .then((msg) => {
                setToast({ message: msg, type: 'success' });
                setTitle(''); 
                setDirector(''); 
                setYear(''); 
                setPoster(null);
            })
            .catch((err) => setToast({ message: err, type: 'error' }));
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;

        if (deleteTarget.type === 'film') {
            dispatch(removeFilm(deleteTarget.id))
                .unwrap()
                .then((msg) => {
                    setToast({ message: msg, type: 'success' });
                    setFilmsList(prev => prev.filter(f => f.id !== deleteTarget.id));
                })
                .catch((err) => setToast({ message: err, type: 'error' }));
        } else if (deleteTarget.type === 'user') {
            dispatch(removeUser(deleteTarget.id))
                .unwrap()
                .then((msg) => {
                    setToast({ message: msg, type: 'success' });
                    setUsersList(prev => prev.filter(u => u.id !== deleteTarget.id));
                })
                .catch((err) => setToast({ message: err, type: 'error' }));
        }

        setDeleteTarget(null); 
    };

    return (
        <>
        <Header />
        <div className="admin-page">
            <div className="admin-page__container">
                <h1 className="admin-page__title">Панель администратора</h1>
                <div className="admin-tabs">
                    <button 
                        className={`admin-tab-btn ${activeTab === 'create' ? 'admin-tab-btn_active' : ''}`} 
                        onClick={() => setActiveTab('create')}
                    >
                        Добавить фильм
                    </button>
                    <button 
                        className={`admin-tab-btn ${activeTab === 'films' ? 'admin-tab-btn_active' : ''}`} 
                        onClick={() => setActiveTab('films')}
                    >
                        Управление фильмами
                    </button>
                    <button 
                        className={`admin-tab-btn ${activeTab === 'users' ? 'admin-tab-btn_active' : ''}`} 
                        onClick={() => setActiveTab('users')}
                    >
                        Управление пользователями
                    </button>
                </div>

                <div className="admin-content">
                    {activeTab === 'create' && (
                        <section className="admin-section">
                            <h2 className="admin-section__title">Добавить новый фильм</h2>
                            <form onSubmit={handleCreateSubmit} className="admin-form">
                                <div className="admin-form__group">
                                    <label>Название фильма</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={e => setTitle(e.target.value)} 
                                        placeholder="Например, Начало" 
                                        required 
                                    />
                                </div>
                                <div className="admin-form__group">
                                    <label>Режиссер</label>
                                    <input 
                                        type="text" 
                                        value={director} 
                                        onChange={e => setDirector(e.target.value)} 
                                        placeholder="Например, Кристофер Нолан" 
                                        required 
                                    />
                                </div>
                                <div className="admin-form__row">
                                    <div className="admin-form__group">
                                        <label>Год выпуска</label>
                                        <input 
                                            type="number" 
                                            value={year} 
                                            onChange={e => setYear(e.target.value)} 
                                            placeholder="2010" 
                                            min="1895" 
                                            max={new Date().getFullYear()} 
                                            required 
                                        />
                                    </div>
                                    <div className="admin-form__group">
                                        <label>Жанр</label>
                                        <select value={genre} onChange={e => setGenre(e.target.value)}>
                                            <option value="боевик">Боевик</option>
                                            <option value="комедия">Комедия</option>
                                            <option value="драма">Драма</option>
                                            <option value="детектив">Детектив</option>
                                            <option value="фантастика">Фантастика</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="admin-form__group">
                                    <label>Постер фильма</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="admin-form__submit-btn">
                                    Опубликовать фильм
                                </button>
                            </form>
                        </section>
                    )}
                    {activeTab === 'films' && (
                        <section className="admin-section">
                            <h2 className="admin-section__title">Список всех фильмов ({filmsList.length})</h2>
                            <div className="admin-list">
                                {filmsList.length === 0 ? (
                                    <p className="admin-list__empty">Фильмы не найдены</p>
                                ) : (
                                    filmsList.map(film => (
                                        <div key={film.id} className="admin-list__item">
                                            <div className="admin-list__info">
                                                <span className="admin-list__name">{film.title}</span>
                                                <span className="admin-list__sub">{film.year} • {film.director}</span>
                                            </div>
                                            <button 
                                                onClick={() => setDeleteTarget({ id: film.id, type: 'film' })} 
                                                className="admin-list__delete-btn"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'users' && (
                        <section className="admin-section">
                            <h2 className="admin-section__title">Список пользователей ({usersList.length})</h2>
                            <div className="admin-list">
                                {usersList.length === 0 ? (
                                    <p className="admin-list__empty">Пользователи не найдены</p>
                                ) : (
                                    usersList.map(u => (
                                        <div key={u.id} className="admin-list__item">
                                            <div className="admin-list__info">
                                                <span className="admin-list__name">{u.name}</span>
                                                <span className="admin-list__sub">{u.email}</span>
                                            </div>
                                            <button 
                                                onClick={() => setDeleteTarget({ id: u.id, type: 'user' })} 
                                                className="admin-list__delete-btn"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>

        {deleteTarget !== null && (
            <Modal 
                setActiveReviewToDelete={() => setDeleteTarget(null)} 
                handleConfirmDelete={handleConfirmDelete} 
            />
        )}

        {toast && (
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(null)} 
            />
        )}
    </>
    )

}

export default AdminPage