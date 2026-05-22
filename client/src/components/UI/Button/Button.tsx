import React, { ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

function Button({children, ...props}: ButtonProps) {
    return (
        <button className='myButton' {...props}>
            {children}
        </button>
    )
}

export default Button;