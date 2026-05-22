import React, { useEffect, useState } from 'react';
import './BarFilter.css'
import { useAppDispatch } from '../../hooks/redux';
import { setFilters } from '../../store/reducers/Films/FilmSlice';

const BarFilter: React.FC = () => {

  const dispatch = useAppDispatch()


  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);

  useEffect(() => {
    dispatch(setFilters({ genre, year, sortOrder }));
  }, [genre, year, sortOrder, dispatch]);


  return (
    <div className="filter-bar">
      <div className="filter-bar__container">
        <div className="filter-bar__left">
          <div className="filter-select-wrapper">
            <select 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)} 
              className="filter-select"
            >
              <option value="">Все жанры</option>
              <option value="action">Боевик</option>
              <option value="comedy">Комедия</option>
              <option value="drama">Драма</option>
              <option value="thriller">Детектив</option>
              <option value="sci-fi">Фантастика</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              className="filter-select"
            >
              <option value="">Все годы</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-bar__right">
          <span className="filter-bar__label">Сортировка:</span>
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortOrder === 'asc' ? 'sort-btn_active' : ''}`}
              onClick={() => setSortOrder('asc')}
            >
              А — Я
            </button>
            <button 
              className={`sort-btn ${sortOrder === 'desc' ? 'sort-btn_active' : ''}`}
              onClick={() => setSortOrder('desc')}
            >
              Я — А
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BarFilter;