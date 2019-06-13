import React from 'react';
import MaterialIcon from 'material-icons-react';

const Exit = (props) => {
    return (
        <div className = 'hover:cursor-pointer z-50 pin-r mr-1/10 select-none absolute mt-20' onClick={props.clicked}>
            <MaterialIcon color='white' icon = 'cancel' size={30} />
            </div>
    )
}

export default Exit;