import { createAsyncThunk } from "@reduxjs/toolkit";
import { $api } from "../../../api";

interface AuthResponse {
    user: {
        id: number;
        email: string;
        name: string;
        isActivated: boolean;
        roles: Array<{ id: number; name: string }>;
    };
}

// 1. Экшен Логина
export const login = createAsyncThunk(
    'user/login',
    async ({ email, password }: any, thunkAPI) => {
        try {
            const response = await $api.post<AuthResponse>('/auth/login', { email, password });
            return response.data.user; // Отдаем данные юзера на склад Redux
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || "Неверный логин или пароль";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// 2. Экшен Регистрации
export const registration = createAsyncThunk(
    'user/registration',
    async ({ email, password, name }: any, thunkAPI) => {
        try {
            const response = await $api.post<AuthResponse>('/auth/registration', { email, password, name });
            return response.data.user;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Ошибка при регистрации");
        }
    }
);

// 3. Экшен Проверки авторизации (Вызывается при обновлении страницы)
export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, thunkAPI) => {
        try {
            // Отправляем запрос на рефреш. Браузер сам прикрепит куку refreshToken
            const response = await $api.post<AuthResponse>('/auth/refresh');
            return response.data.user; // Перевыпущенный юзер летит на склад
        } catch (e: any) {
            return thunkAPI.rejectWithValue("Сессия истекла");
        }
    }
);

// 4. Экшен Выхода из аккаунта
export const logout = createAsyncThunk(
    'user/logout',
    async (_, thunkAPI) => {
        try {
            await $api.post('/auth/logout');
            // Кука сотрется на бэкенде, нам возвращать ничего не нужно
        } catch (e: any) {
            return thunkAPI.rejectWithValue("Ошибка при выходе");
        }
    }

);

//5. Получение профиля
export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (profileId: number, thunkAPI) => {
        try{
            const response = await $api.get(`/user/profile/${profileId}`);
        return response.data;
        } catch(e: any){
            return thunkAPI.rejectWithValue(e.response?.data?.message || 'Ошибка при получение профиля')
        }
        
    }
)


//6. Повторная отправка письма
export const resendMail = createAsyncThunk(
    'user/resend',
    async (_, thunkAPI) => {
        try{
            const response = await $api.post('/auth/resend-activation')
            return response.data.message;
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Не удалось отправит повторное письмо";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
)

export const removeUser = createAsyncThunk<string, number, { rejectValue: string }>(
    'user/deleteByAdmin',
    async (id: number, thunkAPI) => {
        try {
            const response = await $api.post<{ message: string }>(`/user/ADMIN/delete/${id}`);
            return response.data.message || "Пользователь успешно удален";
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || "Ошибка при удалении пользователя";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const deleteAccount = createAsyncThunk<string, number, { rejectValue: string }>(
    'user/deleteAccount',
    async (id: number, thunkAPI) => {
        try {
            const response = await $api.post<{ message: string }>(`/user/delete/${id}`); 
            return response.data.message || "Аккаунт успешно удален";
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || "Не удалось удалить аккаунт";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);