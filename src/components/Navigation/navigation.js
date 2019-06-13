import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { onPageLoad, logout, switchMode} from '../../store/actions/auth';
import { userPopUp } from '../../store/actions/user';
import MaterialIcon from 'material-icons-react';
import BlankUser from '../../media/user.png';
import UserPopUp from './userPopUp';

class Navbar extends Component {
    

    state = {
        userPopUp: false,
    }

    logOut = () => {
        this.props.onLogOut()
            .then(() => {
                this.props.onUserPopUpToggle(true);
                this.props.history.push('/')
            })
            .catch(err => err);
    }

    userPopUpToggler = () => {
        this.setState(prevState => {
           return {userPopUp: !prevState.userPopUp}});
        this.props.onUserPopUpToggle(this.state.userPopUp)
    }

    signUpModeHandler = bool => {
        this.props.onSwitchMode(bool);
    }

    userPopUpClickHandler = () => {
        this.props.onUserPopUpToggle(true);
    }

    componentWillUnmount(){
        console.log('cwu')
        this.props.onUserPopUpToggle(true)
    }

    render() {

        let publicButtons =  <div className='flex w-56 justify-between'>
        <Link style={{ textDecorationLine: 'none',  fontFamily: 'Open Sans'}} to='/login'  onClick={() => this.signUpModeHandler(false)}>
            <div className='w-24 h-7 bg-green-pastel  hover:cursor-pointer rounded-sm flex justify-center items-center shadow-custom-vote'>
                <p className='text-white tracking-wide font-medium text-xxs'>LOG IN</p>
            </div>
        </Link>
        <Link style={{ textDecorationLine: 'none',  fontFamily: 'Open Sans' }} to='/login' onClick={() => this.signUpModeHandler(true)}>
            <div className='w-24 h-7 bg-orange-custom  hover:cursor-pointer rounded-sm flex justify-center items-center shadow-custom-vote'>
                <p className='text-white tracking-wide font-medium text-xxs'>SIGN UP</p>
            </div>
        </Link> 
    </div> 

        let authUserActions = null;
        
        
        let auth = localStorage.getItem('auth');
        if(auth) {
            authUserActions = <div className='flex flex-row'>
            <div className='mr-6 hover:cursor-pointer select-none'>
            <Link style={{ textDecorationLine: 'none' }}  to='/submit' onClick={this.props.userPopUp ? this.userPopUpToggler : null}>
            <MaterialIcon icon='playlist_add' size={24} color='grey'/>
            </Link>
            </div>
            {/* <div className='mr-6 hover:cursor-pointer'>
            <MaterialIcon icon='notifications' size={21} color='grey'/>
            </div> */}
            </div>
            publicButtons = null;
        }


        return (
            <div className='flex flex-row  justify-between items-center  pt-3 pb-2'>
            <div className='absolute w-full  pin-t pin-l z-0 bg-white h-16 shadow'></div>
                <div className='flex flex-row justify-between z-20 items-center'>
                <Link style={{ textDecorationLine: 'none' }}  to='/' onClick={this.props.userPopUp ? this.userPopUpToggler : null}>
                    <div className='text-2xl text-white bg-red-pastel  p-2 rounded-sm 
                    hover:cursor-pointer select-none' style={{ fontFamily: 'Lobster' }}>PQ</div>
                </Link>
                    {/* <SearchBox /> */}
                    <div style={{fontFamily: 'Helvetica'}} className='sm-0:hidden text-lg font-medium select-none text-grey-dark hover:cursor-default pl-4'>
                        <span className='font-semibold'>p</span>roject <span className='font-semibold'>q</span>uality
                    </div>
                </div>
                <div className='flex flex-row justify-between items-center  z-20' style={{ fontFamily: 'Nunito' }}>
                    {publicButtons}
                    {authUserActions}
                    {this.props.userId && !this.props.photoUrl ? <div className = 'hover:cursor-pointer w-10 h-10 rounded-lg bg-grey-light flex flex-col justify-center items-center text-lg text-white' onClick={this.userPopUpToggler}>{this.props.displayName && this.props.displayName.length > 1 ? this.props.displayName.slice(0,2).toUpperCase() : this.props.displayName && this.props.displayName.length == 1 ? this.props.displayName.toUpperCase() : null} </div> : null}
                    {this.props.userId && this.props.photoUrl ? <div className='hover:cursor-pointer w-10 h-10 rounded-lg' style={{backgroundImage: `url(${this.props.photoUrl})`, backgroundSize: 'cover'}} onClick={this.userPopUpToggler}></div> : null}
                </div>
                {this.props.userPopUp ? <UserPopUp 
                    logOut={this.logOut} clicked={this.userPopUpClickHandler}
                /> : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // loading: state.auth.loading,
        error: state.auth.error,
        userId: state.auth.userId,
        email: state.auth.email,
        photoUrl: state.auth.photoURL,
        displayName: state.auth.displayName,
        userPopUp: state.user.userPopUp
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onPageMount: () => dispatch(onPageLoad()),
        onLogOut: () => dispatch(logout()),
        onUserPopUpToggle: (status) => dispatch(userPopUp(status)),
        onSwitchMode: mode => dispatch(switchMode(mode))
        // onSwitchMode: mode => dispatch(switchMode(mode))
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Navbar );