import { createAsyncThunk } from "@reduxjs/toolkit";
import { $api } from "../../../api";

export interface IFilm {
    id: number;
    title: string;
    year: string | number;
    genre: string;
    director: string;
    poster: string;
    Rating: {
        value: number
    },
    rating: number;
}

export interface OneFilm{
    id: number;
    title: string;
    year: string | number;
    genre: string;
    director: string;
    poster: string;
    rating: number;
    ratings : IRatings[];
}

interface IRatings{
    id: number;
    value: number;
    text: string;
    user: {
        id: number;
        name: string
    };
}

interface IFetchFilmsParams {
    page: number;
    genre?: string;   
    year?: string;      
    sortOrder?: string; 
}

export interface createFIlmsAttr {
    title: string;
    year: string | number;
    genre: string;
    director: string;
    poster: File;
}

export const fetchScroll = createAsyncThunk<IFilm[], IFetchFilmsParams, { rejectValue: string }>(
    'films/scroll',
    async ({ page, genre, year, sortOrder }, thunkAPI) => {
        try{
            const response = await $api.get<IFilm[]>('/films/scroll', {
                params: { 
                    page, 
                    genre: genre || undefined,
                    year: year || undefined,
                    sortOrder: sortOrder || undefined
                }
            });
            return response.data
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Ошибка при получение фильмов";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
)

export const fetchFilm = createAsyncThunk(
    'film/getOne',
    async (id: number, thunkAPI) => {
        try{
            const response = await $api.get<OneFilm>(`films/${id}`)
            return response.data
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Ошибка при получение фильма";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const fetchSearchSuggestions = createAsyncThunk<IFilm[], string, { rejectValue: string }>(
    'films/fetchSuggestions',
    async (search, thunkAPI) => {
        try {
            const response = await $api.get<IFilm[]>('films/search/suggestions', {
                params: {search: search}
            })
            return response.data;
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Ошибка при получение фильма";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
)


export const createFilm = createAsyncThunk<string, createFIlmsAttr, {rejectValue: string}>(
    'films/create',
    async({title, year, genre, director, poster}, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('year', String(year));
            formData.append('genre', genre);
            formData.append('director', director);
            formData.append('poster', poster);
            const response = await $api.post<{message: string}>('/films', formData)
            return response.data.message || "Фильм успешно создан"
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Ошибка при создании фильма";
            return thunkAPI.rejectWithValue(errorMessage);
        }

    }
)


export const removeFilm = createAsyncThunk<string, number, { rejectValue: string }>(
    'films/delete',
    async(id: number, thunkAPI) => {
        try{
            const response = await $api.post<{message: string}>(`/films/delete/${id}`)
            return response.data.message
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Ошибка при удаление фильма";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
)