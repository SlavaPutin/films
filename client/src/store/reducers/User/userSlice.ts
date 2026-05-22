import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, registration, checkAuth, logout, fetchProfile, resendMail, deleteAccount } from "./userActions";

interface IUser {
    id: number;
    email: string;
    name: string;
    isActivated: boolean;
    roles: Array<{ id: number; name: string }>;
}

interface UserState {
    user: IUser | null;
    profileData: any | null;
    isAuth: boolean;
    isLoading: boolean;        // Для глобальных процессов (логин, проверка сессии, регистрация)
    isProfileLoading: boolean; // ВАЖНО: отдельный флаг загрузки только для страниц профилей
    error: string;
}

const initialState: UserState = {
    user: null,
    profileData: null,
    isAuth: false,
    isLoading: false,
    isProfileLoading: false,   // Изначально профиль не загружается
    error: ""
};

export const userSlice = createSlice({
    name: "user", 
    initialState, 
    reducers: {}, 
    extraReducers: (builder) => {
        builder
            // ЛОГИН
            .addCase(login.pending, (state) => { 
                state.isLoading = true;
                state.error = "";
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => { 
                state.isLoading = false;
                state.isAuth = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => { 
                state.isLoading = false;
                state.error = action.payload;
            })

            // РЕГИСТРАЦИЯ
            .addCase(registration.pending, (state) => {
                state.isLoading = true;
                state.error = '';
            })
            .addCase(registration.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.isLoading = false;
                state.isAuth = true;
                state.user = action.payload;
            })
            .addCase(registration.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ПРОВЕРКА АВТОРИЗАЦИИ (При перезагрузке вкладки)
            .addCase(checkAuth.pending, (state) => { 
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.isLoading = false;
                state.isAuth = true;
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuth = false;
                state.user = null;
            })

            // ВЫХОД (LOGOUT)
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuth = false;
                state.isLoading = false;
                state.profileData = null; // Очищаем данные профиля при выходе
            })

            // ПОЛУЧЕНИЕ ПРОФИЛЯ (Используем новый флаг)
            .addCase(fetchProfile.pending, (state) => {
                state.isProfileLoading = true; // Включаем загрузку ТОЛЬКО для профиля
                state.error = '';
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<any>) => {
                state.isProfileLoading = false; // Выключаем загрузку профиля
                state.profileData = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
                state.isProfileLoading = false;
                state.error = action.payload;
            })

            // ПОВТОРНАЯ ОТПРАВКА ПИСЬМА
            .addCase(resendMail.pending, (state) => {
                state.error = '';
            })
            .addCase(resendMail.fulfilled, (state) => {
                state.error = ''; 
            })
            .addCase(resendMail.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload; 
            })

            //Удаление аккаунта
            .addCase(deleteAccount.fulfilled, (state) => {
                state.isAuth = false;
            })
    }
});

export default userSlice.reducer;

