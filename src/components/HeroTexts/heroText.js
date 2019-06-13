import React from 'react';
import Cinema from '../../media/fantasy.jpg'

const HeroText = () => {
    return (
        <div className='w-3.25/5 h-40  mt-10 mb-5 flex flex-col justify-center md-0:w-full shadow-custom rounded-lg' style={{ fontFamily: 'Open Sans', backgroundImage: `url(${Cinema})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className='flex flex-row justify-start items-center' >
                <div className='text-white text-base ml-3 sm-0:text-xs'>
                    <p className='font-hairline mb-4'>Your guidance to discover</p>
                    <p className='font-bold ml-28 sm-0:ml-12'>quality channels</p>
                </div>
                {/* <div className = 'w-28 h-28 mr-5 sm-0:hidden rounded-lg' style={{ backgroundImage: `url(${Cinema})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'rotate(-12deg)'}}>
                </div> */}
            </div>
        </div>
    )
}

export default HeroText;