import React, { useState } from 'react';
import './Form.css'
import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login } from '../../store/reducers/User/userActions';

function FormLogin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useAppDispatch();
    const {error, isLoading} = useAppSelector(state => state.userReducer);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(login({email, password}))
    }

    return (      
        <form className='wrap-form-content' onSubmit={handleSubmit}>
            <div className='wrap-vhod'>
                <h2 className='vhod'>Вход</h2>
            </div>

            {error && <div className="error-message-block">{error}</div>}

            <div className='wrap-inputs'>
                <div className='wrap-input'>
                    <label className='text-input'>
                        Email
                    </label>
                    <input 
                        className='input-login-reg'
                        placeholder='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='wrap-input'>
                    <label className='text-input'>
                        Password
                    </label>
                    <input 
                        type='password'
                        className='input-login-reg'
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
            </div>
            <Button type="submit" disabled={isLoading}>Вход</Button>
            <Link to={'/registration'} className='under-log-reg'>Регистрация</Link>
        </form>
    )
}

export default FormLogin;