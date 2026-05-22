import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchFilm, fetchScroll, IFilm, OneFilm } from "./FilmActions";




interface FilmState{
    films: IFilm[];
    film: OneFilm | null
    currentPage: number; 
    hasMore: boolean;
    isLoading: boolean;
    error: string;
    genre: string;
    year: string;
    sortOrder: string;
}

const initialState: FilmState = {
    films: [],
    film: null,
    currentPage: 1,
    hasMore: true,
    isLoading: false,
    error: '',
    genre: '',  
    year: '',    
    sortOrder: 'asc'
}

export const filmSlice = createSlice({
    name: 'film',
    initialState,
    reducers: {
        resetFilms(state) {
            state.films = [];
            state.currentPage = 1;
            state.hasMore = true;
            state.error = '';
        },
        setFilters(state, action: PayloadAction<{ genre: string; year: string; sortOrder: string }>) {
            state.genre = action.payload.genre;
            state.year = action.payload.year;
            state.sortOrder = action.payload.sortOrder;
        }
    },
    extraReducers: (builder) => {
        builder
            //Бесконечный скролл
            .addCase(fetchScroll.pending, (state) => {
                state.isLoading = true;
                state.error = '';
            })
            .addCase(fetchScroll.fulfilled, (state, action: PayloadAction<IFilm[]>) => {
                state.isLoading = false;
                if (action.payload.length < 10) {
                    state.hasMore = false;
                }
                state.films.push(...action.payload);
                if (state.hasMore){
                    state.currentPage += 1;
                }
            })
            .addCase(fetchScroll.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            //Получение одного фильма
            .addCase(fetchFilm.pending, (state)=> {
                state.isLoading = true;
                state.error = '';
            })
            .addCase(fetchFilm.fulfilled, (state, action: PayloadAction<OneFilm>) => {
                state.isLoading = false;
                state.film = action.payload;
            })
            .addCase(fetchFilm.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            }) 
    }
});

export const { resetFilms, setFilters } = filmSlice.actions;
export default filmSlice.reducer;