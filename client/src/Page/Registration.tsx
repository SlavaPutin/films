import React from 'react';
import '../style/LoginRegistration.css';
import RegForm from '../components/Form/RegForm';

function Registration() {
    return (
        <div className='center-wrap'>
            <div className='wrap-formlogo'>
                <div className='wrap-logo'>
                    <h1 className='logo'>Films</h1>
                </div>
                <div className='wrap-form-center'>
                    <div className='wrap-form'>
                        <RegForm/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration;