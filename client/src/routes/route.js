import Login from "../Page/Login";
import Registration from "../Page/Registration";
import Main from "../Page/Main";
import Profile from "../Page/Profile";
import FilmPage from "../Page/FilmPage";
import AdminPage from "../Page/AdminPage";

export const privateRouts = [
    {path: '/profile/:id', element: Profile},
    {path: '/admin', element: AdminPage, role: 'ADMIN'}, 
]

export const publicRouts = [
    {path: '/', element: Main},
    {path: '/login', element: Login},
    {path: '/registration', element: Registration},
    {path: '/film/:id', element: FilmPage},
]