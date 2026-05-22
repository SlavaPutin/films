import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import { privateRouts, publicRouts } from './route'; 
import { useAppSelector } from '../hooks/redux';

function AppRouter() {
    const { isAuth, user } = useAppSelector(state => state.userReducer);
    return (
        <Routes>
            {publicRouts.map(route => {
                if (isAuth && (route.path === '/login' || route.path === '/registration')) {
                    return (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={<Navigate to={`/`} replace />} 
                        />
                    );
                }
                return (
                    <Route 
                        key={route.path} 
                        path={route.path} 
                        element={<route.element />}
                    />
                );
            })}
            {privateRouts.map(route => (
                <Route 
                    key={route.path} 
                    path={route.path} 
                    element={
                        isAuth ? (
                                ('role' in route) ? (
                                    user?.roles?.some(r => r.name === route.role) ? (
                                        <route.element /> 
                                    ) : (
                                        <Navigate to="/" replace />
                                    )
                                ) : (
                                    <route.element /> 
                                )
                            ) : (
                                <Navigate to="/login" replace /> 
                            )
                    } 
                />
            ))}
            <Route 
                path="*" 
                element={<Navigate to={isAuth ? "/" : "/login"} replace />} 
            />
        </Routes>
    );
}

export default AppRouter;
