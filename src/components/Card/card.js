import React from 'react';
import MaterialIcon from 'material-icons-react';
import { Link } from 'react-router-dom';


const Card = (props) => {

    return (
        <div className='md-0:w-full p-4 hover:cursor-pointer z-10  mb-4   border-b border-grey-light text-white w-3.25/5 hover:bg-grey-lightest hover:shadow-md' style={{ fontFamily: 'Open Sans' }} onClick={props.clicked}>
            <div className='flex flex-row   items-center w-auto  justify-between'>
                <div className='flex flex-row  justify-between h-full'>
                    <div className='w-18 h-18 flex-no-shrink mr-4 ml-3' style={{ backgroundImage: `url(${props.logoUrl})`, backgroundSize: 'cover', backgroundPosition: 'fixed' }}>
                    </div>
                    <div className='flex flex-col flex-auto  justify-between'>
                        <p className='text-black sm-0:pb-2 sm-0:pr-1 text-xs font-semibold'>{props.channel}</p>
                        <div className='text-xxs  sm-0:pb-3 sm-0:pr-2 text-grey-dark font-normal'>{props.desc}</div>
                        <p className='text-xxs text-grey-dark font-normal'>{props.category}</p>
                    </div>
                </div>
                <div className='flex flex-row  justify-between sm-0:flex-col items-center pr-2'>
                    <Link style={{textDecoration: 'none'}} to={'/post/' + props.cid} onClick={props.commentProp}>
                        <div className='hover:shadow-md flex flex-col justify-between mr-3 sm-0:mr-0 sm-0:mb-1 items-center select-none  text-xs pt-1.4 pb-1 pl-2 pr-2'>
                            <MaterialIcon icon='mode_comment' color={'black'} size={15} />
                            <span className='text-grey-dark pt-2'>{props.comment}</span>
                        </div>
                    </Link>
                    <button  className={`hover:shadow-md focus:outline-none  flex flex-col pt-1 pb-1 pl-2 pr-2 ml-3 sm-0:ml-0 sm-0:mt-1 justify-between items-center select-none text-xs  ${props.voted ? 'bg-blue-new shadow-md text-white' : 'text-grey-dark'}`} onClick={props.ratingClicked}>
                        <div className='pointer-events-none'>
                        <MaterialIcon  icon='star' color={'black'} size={15}/>
                        </div>
                        <span className='pt-2 pointer-events-none'>{props.rating}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Card;