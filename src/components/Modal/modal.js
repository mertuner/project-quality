import React from 'react';
import Backdrop from '../UI/backdrop';
import Description from '../PostDescription/description';

const Modal = props => {
    return (
        <Backdrop exited = {props.exited}>
            <Description loading = {props.loading}/>
        </Backdrop>
    )
}

export default Modal;