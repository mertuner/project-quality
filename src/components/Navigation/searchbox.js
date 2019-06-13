import React from 'react';
import MaterialIcon from 'material-icons-react';

const SearchBox = (props) => {
    return (
        <div className=" xs:hidden text-center  flex flex-row items-center justify-center">
            <input className=" ml-10 text-grey rounded text-sm shadow-custom w-72 h-8 pl-4 focus:outline-none" type='text' placeholder='Search' style={{fontFamily: 'Nunito'}}/>
            <div className='h-8  w-12 flex rounded mr-10 hover:cursor-pointer items-center justify-center pt-1  shadow-custom'>
                <MaterialIcon icon='search' size={24} color='#b8c2cc'/>
            </div>
        </div>
    )
}

export default SearchBox;