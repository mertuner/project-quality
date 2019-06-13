import React from 'react';

const Button = (props) => {
    return (
    <button className= {`${props.width} h-7 ${props.color} hover:cursor-pointer focus:outline-none rounded-sm flex justify-center items-center shadow-custom-vote`} onClick={props.clicked}>
        <p className='text-white tracking-wide font-semibold text-xxs'  >{props.children}</p>
    </button>
    )
}

export default Button;