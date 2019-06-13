import React from 'react';
import Exit from './exitButton';

const Backdrop = (props) => {
    return (
        <div className='h-screen w-full pin-l pin-t z-40 flex justify-center fixed items-center'>
            <div className='h-full w-full bg-black  opacity-90'>
                <Exit clicked={props.exited} />
            </div>
            {props.children}
        </div>
    )
}

export default Backdrop;