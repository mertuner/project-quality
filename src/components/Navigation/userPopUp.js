import React from 'react';
import MaterialIcon from 'material-icons-react';
import { Link } from 'react-router-dom';

const UserPopUp = (props) => {
    return (
        <div className={props.fullWidth ? 'flex justify-end w-full z-40 border absolute font-bold items-center -mt-1' : 'flex mt-24 justify-end w-4/5 z-40 absolute font-bold items-center'}>
            <ul className='w-32 h-32 shadow-custom mt-2 text-center bg-white rounded-sm shadow-custom text-xs text-grey list-reset pt-1' style={{ fontFamily: 'Open Sans' }}>
                <li className='pt-4 flex items-end  pl-3 select-none'>
                    <MaterialIcon icon='person' size={14} color='#b8c2cc' />
                    <Link to={'/user/' + localStorage.getItem('auth')} style={{ textDecoration: 'none' }}  onClick={props.clicked}>
                        <div className='pl-2 hover:cursor-pointer text-grey-dark'>Profile</div>
                    </Link>
                </li>

                <li className='pt-4 flex items-end  pl-3 select-none'>
                    <MaterialIcon icon='playlist_play' size={14} color='#b8c2cc' />
                    <Link to='/submissions' style={{ textDecoration: 'none' }}  onClick={props.clicked}>
                        <div className='pl-2 hover:cursor-pointer text-grey-dark'>Submissions</div>
                    </Link>
                </li>
                <li className='pt-4 flex items-end  pl-3 select-none' onClick={props.logOut}>
                    <MaterialIcon icon='exit_to_app' size={14} color='#b8c2cc' />
                    <div className='pl-2  hover:cursor-pointer text-grey-dark'>Log Out</div>
                </li>
            </ul>
        </div>
    )
}

export default UserPopUp;