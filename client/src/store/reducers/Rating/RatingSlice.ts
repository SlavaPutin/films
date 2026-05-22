import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteReview, rate } from "./RatingAction";



interface RatingState{
    message: string,
    errorRating: string,
    isLoading: boolean
}

const initialState: RatingState = {
    message: '',
    errorRating: '',
    isLoading: false
}

export const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Рейтинг
            .addCase(rate.pending, (state) => {
                state.isLoading = false;
                state.errorRating = ''
            })
            .addCase(rate.fulfilled, (state, action: PayloadAction<string>) => {
                state.message = action.payload;
                state.isLoading = false
            })
            .addCase(rate.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.errorRating = action.payload
            })

            //Удаление отзыва
            .addCase(deleteReview.pending, (state) => {
                state.isLoading = true;
                state.errorRating = '';
            })
            .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.message = action.payload;
            })
            .addCase(deleteReview.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.errorRating = action.payload
            })
    }
});

export default ratingSlice.reducer;