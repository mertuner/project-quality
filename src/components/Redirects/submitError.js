import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth';
import { userPopUp } from '../../store/actions/user';
import Navigation from '../Navigation/navigation';
import UserPopUp from '../Navigation/userPopUp';

class SubmitError extends Component {

    logOut = () => {
        this.props.onLogOut()
            .then(() => {
                this.props.onUserPopUpToggle(true);
                this.props.history.push('/')
            })
            .catch(err => err);
    }

    componentDidMount () {
        setTimeout(() => {
            this.props.history.push('/');
        }, 3500)
    }


    render() {
        return (
            <div className='h-screen w-full' style={{ fontFamily: 'Nunito' }}>
                <Navigation {...this.props} />
                {this.props.userPopUp ? <UserPopUp
                    logOut={this.logOut}
                /> : null}
                <div className='w-full text-center flex flex-col justify-between font-medium text-sm pt-48'>
                    <span>An error has been occured. Please try again</span><br />
                    <span>Redirecting...</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userPopUp: state.user.userPopUp,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogOut: () => dispatch(logout()),
        onUserPopUpToggle: (status) => dispatch(userPopUp(status)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmitError);