import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

// useAppDispatch — чтобы отправлять команды на склад
export const useAppDispatch = () => useDispatch<AppDispatch>();

// useAppSelector — чтобы брать данные со склада
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;