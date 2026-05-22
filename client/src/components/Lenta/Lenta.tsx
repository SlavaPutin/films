import React from 'react'
import './Lenta.css';
import Film from '../Film/Film';

interface IFilm {
    id: number;
    title: string;
    poster: string;
    year: number | string;
    director: string;
    rating: number;
    Rating?: {
        value: number
    }
}

type Props = {
    films: IFilm[]; 
    isProfile?: boolean
}

export default function Lenta({films, isProfile =false}: Props) {
    return (
        <div className='wrap-films'>
            {films.map(film => (
                <Film 
                key={film.id} 
                id={film.id}
                year={film.year} 
                title={film.title} 
                poster={film.poster} 
                director={film.director} 
                rating={film.rating} 
                userScore={film.Rating?.value}
                isProfile={isProfile}
                />
            ))}
        </div>
    )
}