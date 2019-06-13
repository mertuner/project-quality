import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Risings extends Component {

    render() {
        
        let stars = this.props.risingStars.map((star, ind) => {
            return (
                <Link style={{textDecoration: 'none'}} to={'/post/' + star.private.id} key={star.private.id}>
                <div className='flex flex-row  mb-4 hover:shadow-md items-center hover:bg-grey-lightest'>
                    <div className='text-base ml-2 text-grey p-1'>{(ind + 1)}</div>
                    <div className='h-8 w-8 m-2 rounded-sm' style={{ backgroundImage: `url(${star.private.logoURL})`, backgroundSize: 'cover', backgroundPosition: 'fixed' }}>
                    </div>
                    <div className='h-8 flex flex-col justify-between m-2'>
                        <p className='text-xxxs text-grey-dark'>{star.private.channel}</p>
                        <p className='text-xxxs text-grey-dark'>{star.private.category}</p>
                    </div>
                </div>
                </Link>
            )
        })


        return (
            <div className='md-0:hidden flex flex-col justify-start items-end mt-12 w-4/5 absolute' style={{ fontFamily: 'Open Sans' }}>
            <div className='flex flex-col justify-start'>
                <p className='text-base font-semibold select-none mb-4 ml-2'>Rising Stars</p>
                <div className='flex flex-col w-76'>
                    {stars}
                </div>
                </div>
            </div>
        )
    }
}

export default Risings;