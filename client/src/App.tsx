import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuth } from './store/reducers/User/userActions';

function App() {

  const dispatch = useAppDispatch() //создаем «пульт управления» для отправки команд.
  const {isLoading} = useAppSelector(state => state.userReducer)//достаем из userReducer isLoading как только оно изменится то компонент перерендириться
  
  useEffect(() => {
    dispatch(checkAuth()); //при каждом запуске приложения проверяем аунтификацию
  }, [dispatch]);//массив с dispatch гарантирует что сработает только один раз

  if (isLoading) {
    return <h1>Загрузка приложения...</h1>;
  }

  return (
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    );
}

export default App;
