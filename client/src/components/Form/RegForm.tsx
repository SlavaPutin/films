import React, { useState } from 'react';
import './Form.css'
import Button from '../UI/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registration } from '../../store/reducers/User/userActions';

function RegForm() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {error, isLoading} = useAppSelector(state => state.userReducer);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registration({email, password, name}))

    }

    


    return (      
        <form className='wrap-form-content' onSubmit={handleSubmit}>
            <div className='wrap-vhod'>
                <h2 className='vhod'>Регистрация</h2>
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
                <div className='wrap-input'>
                    <label className='text-input'>
                        Name
                    </label>
                    <input 
                        className='input-login-reg'
                        placeholder='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            <Button type='submit' disabled={isLoading}>Регистрация</Button>
            <Link to={'/login'} className='under-log-reg'>Вход</Link>
        </form>
    )
}

export default RegForm;