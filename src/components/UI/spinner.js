import React from 'react';
import Loader from 'react-loader-spinner'

const Spinner = (props) => {
    return (
        <div className='mt-24'>
            <Loader
                type='Rings'
                color="#00BFFF"
                height="100"
                width="100"
            />
        </div>
    )
}

export default Spinner;