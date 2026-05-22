import { createAsyncThunk } from "@reduxjs/toolkit"
import { $api } from "../../../api"


interface IRatePayload {
    value: number;
    text: string;
    filmId: number;
}

export const rate = createAsyncThunk<
    string,             
    IRatePayload,         
    { rejectValue: string } 
>(
    'rate',
    async ({value, text, filmId}, thunkAPI) => {
        try{
            const response = await $api.post(`/rating/rate/${filmId}`, {value, text})
            return response.data.message
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Ошибка при написание отзыва";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
)

export const deleteReview = createAsyncThunk(
    'rate/delete',
    async (id: number, thunkAPI) => {
        try{
            const response = await $api.post(`/rating/delete/${id}`)
            return response.data.message
        } catch(e: any){
            const errorMessage = e.response?.data?.message || "Ошибка при удалении отзыва";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
)