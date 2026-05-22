import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './reducers/User/userSlice'
import filmReducer from './reducers/Films/FilmSlice'
import ratingReducer from './reducers/Rating/RatingSlice'

// Главный редюсер
const rootReducer = combineReducers({
    userReducer,
    filmReducer,
    ratingReducer
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    });
}; //начтройка глобального склада сердце приложения

// Эти 3 строчки нужны для идеальной типизации TypeScript, чтобы автокомплит знал всё о нашем складе
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];