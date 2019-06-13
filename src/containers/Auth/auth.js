import React, { Component } from 'react';
import Navigation from '../../components/Navigation/navigation';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import { Redirect } from 'react-router-dom';
import Google from '../../media/btn_google.svg';
import Facebook from '../../media/btn_fb.svg';
import Github from '../../media/btn_github.png';
import validator from 'validator';


const initialState = {
    email: '',
    password: '',
    rePassword: '',
    displayName: '',
    rules: {
        validDisplayName: false,
        validPassword: false,
        validRePassword: false,
        validEmail: false
    },
    invalidLabels: {
        displayName: '',
        password: '',
        rePassword: '',
        email: '',

    },
    image: null,
    isSignUp: false,
    error: null
}
//The email address is already in use by another account.
class Auth extends Component {


    state = initialState;
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.error === 'The email address is already in use by another account.' && prevState.isSignUp !== this.props.isSignUp){
            this.props.onAuthFail(null);
        }
        if(prevState.isSignUp !== this.props.isSignUp){
            this.setState({
                ...initialState,
                isSignUp: this.props.isSignUp
            })
        }
    }

    componentDidMount(){
        this.props.onAuthFail(null);
    }

    fileHandler = e => {
        if(e.target.files[0]){
            const image = e.target.files[0]
            this.setState({image: image})
        }
    }

    componentWillUnmount(){
            this.props.onSwitchMode(false);
    }

    handleInputChange = (event, type) => {
        if (type === 'email') {
            this.setState({
                ...this.state,
                email: event.target.value
            });
            if (validator.isEmail(event.target.value)) {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validEmail: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validEmail: false
                    }
                })
            }
        }

        if (type === 'password') {
            this.setState({
                ...this.state,
                password: event.target.value
            });
            if (event.target.value.length >= 6) {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validPassword: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validPassword: false
                    }
                })
            }
        }

        if (type === 'rePassword') {
            this.setState({
                ...this.state,
                rePassword: event.target.value
            });
            if (event.target.value === this.state.password) {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validRePassword: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validRePassword: false
                    }
                })
            }
        }
        if (type === 'displayName') {
            this.setState({
                ...this.state,
                displayName: event.target.value
            });
            if (event.target.value !== '') {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validDisplayName: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validDisplayName: false
                    }
                })
            }
        }
    };




    handleFacebookSubmit = (event) => {
        event.preventDefault();
        this.props.onAuthFacebook();
    }

    handleGoogleSubmit = (event) => {
        event.preventDefault();
        this.props.onAuthGoogle();
    }

    handleGithubSubmit = (event) => {
        event.preventDefault();
        this.props.onAuthGithub();
    }

    handleEmailSubmit(event, email, password) {
        event.preventDefault();
        this.props.onEmailAuth(email, password);
        
    }


    handleEmailSignUp = (event, email, password, displayName, image) => {
        event.preventDefault();
        if (this.state.rules.validDisplayName && this.state.rules.validPassword &&
            this.state.rules.validEmail && this.state.rules.validRePassword) {
            this.props.onEmailSignUp(email, password, displayName, image);
            this.setState({
                invalidLabels: {
                    ...initialState.invalidLabels
                },
                isSignUp: this.props.isSignUp
            })
        }

        else {
            if (this.state.rules.validDisplayName === false || this.state.rules.validPassword === false || this.state.rules.validEmail === false || this.state.rules.validRePassword === false) {
                this.setState({
                    invalidLabels: {
                        ...this.state.invalidLabels,
                        displayName: this.state.rules.validDisplayName === false ? "   -Display Name can't be blank" : '',
                        password: this.state.rules.validPassword === false ? '   - Password must be at least 6 characters.' : '',
                        rePassword: this.state.rules.validRePassword === false ? ' - Password is not match' : '',
                        email: this.state.rules.validEmail === false ? '   - Invalid Email address' : ''
                    }
                })
            }
        }
    }

    render() {

        let auth = localStorage.getItem('auth');
        if (auth) {
            return (
                <Redirect to={'/'} />)
        }
        return (
            <div className='h-full' style={{ fontFamily: 'Open Sans' }}>
                <Navigation {...this.props} />
                <div className={`flex  w-full h-full sm-0:flex-col ${!this.props.isSignUp ? 'flex-col items-center' : 'flex-row justify-start'}`}>
                    <form onSubmit={!this.props.isSignUp ? (event) => this.handleEmailSubmit(event, this.state.email, this.state.password): event => this.handleEmailSignUp(event, this.state.email, this.state.password, this.state.displayName, this.state.image)} className='flex flex-col justify-center items-center  mt-12 w-72'>
                        {this.props.isSignUp ? <div className='flex flex-col'>
                            <label><span className='text-red text-xs pl-6' >{this.state.invalidLabels.displayName}</span></label>
                            <input value={this.state.displayName} onChange={(event) => this.handleInputChange(event, 'displayName')} className={this.state.rules.validDisplayName ? validInputStyle : invalidInputStyle} type='text' placeholder='Display Name' style={{WebkitAppearance: 'none'}}/>
                        </div> : null}

                        {this.props.isSignUp ? <div className='flex m-3 flex-row justify-between items-center w-72 h-10'>
                            <div className='bg-white focus:outline-none focus:shadow-custom h-full shadow-md text-xs text-grey-ph flex flex-row items-center pl-6 rounded-lg w-40'><span>{this.state.image ? this.state.image.name.slice(0, 10) : 'Profile Picture'}</span></div>
                            <input className='text-xs w-24  rounded-lg text-transparent' type='file' accept='image/*' onChange={e => this.fileHandler(e)} />
                        </div> : null}
                        <div className='flex flex-col'>
                            <label><span className='text-red text-xs pl-6' >{this.props.error === 'The email address is already in use by another account.' ? 'The email address is already in use' : this.state.invalidLabels.email}</span></label>
                            <input value={this.state.email} onChange={(event) => this.handleInputChange(event, 'email')} className={this.props.isSignUp && this.state.rules.validEmail ? validInputStyle : !this.props.isSignUp ? inputStyle : invalidInputStyle} type='email' placeholder='E-mail' style={{WebkitAppearance: 'none'}}/>
                        </div>
                        <div className='flex flex-col'>
                            <label><span className='text-red text-xs pl-6' >{this.state.invalidLabels.password}</span></label>
                            <input value={this.state.password} onChange={(event) => this.handleInputChange(event, 'password')} className={this.props.isSignUp && this.state.rules.validPassword ? validInputStyle : !this.props.isSignUp ? inputStyle : invalidInputStyle} type='password' placeholder='Password' style={{WebkitAppearance: 'none'}}/>
                        </div>
                        {this.props.isSignUp ? <div className='flex flex-col'>
                            <label><span className='text-red text-xs pl-6' >{this.state.invalidLabels.rePassword}</span></label>
                            <input value={this.state.rePassword} onChange={(event) => this.handleInputChange(event, 'rePassword')} className={this.state.rules.validRePassword ? validInputStyle : invalidInputStyle} type='password' placeholder='Confirm Password' style={{WebkitAppearance: 'none'}}/>
                        </div> : null}
                        {!this.props.isSignUp ? <button className='w-32 h-7 bg-green-pastel m-6 hover:cursor-pointer focus:outline-none rounded-sm flex justify-center items-center shadow-custom-vote'>
                            <p className='text-white tracking-wide font-medium text-xs' >LOG IN</p>
                        </button> : null}
                        {this.props.isSignUp ? <button className='w-32 h-7 bg-orange-custom m-6 hover:cursor-pointer focus:outline-none rounded-sm flex justify-center items-center shadow-custom-vote'>
                            <p className='text-white tracking-wide font-medium text-xs' >SIGN UP</p>
                        </button> : null}
                    </form>
                    {!this.props.isSignUp && this.props.error ?
                        <div className='w-3/5 text-center leading-normal rounded-sm mb-6 bg-white p-8'>
                            <p className='text-xs text-grey-dark'>
                                {this.props.error}
                            </p>
                        </div> : null}
                        <div className={`flex flex-col  ${!this.props.isSignUp ? 'ml-0' : 'ml-20'} items-center justify-center sm-0:w-72 sm-0:ml-0 sm-0:items-center`}>
                    <div className='h-9 w-56 rounded-sm bg-white mb-6 select-none hover:shadow-md shadow hover:cursor-pointer flex flex-row items-center' onClick={this.handleGoogleSubmit}>
                        <div className='ml-1 h-6 w-10' style={{ fontFamily: 'Roboto Medium', backgroundImage: `url(${Google})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                        <div className='h-9 flex items-center text-grey-dark justify-start pl-2 w-full text-xs font-semibold'>LOG IN WITH GOOGLE</div>
                    </div>
                    {/* <div className='h-9 w-56 rounded-sm bg-white select-none mb-6 hover:shadow-md border-0.5  border-grey-light hover:cursor-pointer flex flex-row items-center' onClick={this.handleFacebookSubmit}>
                        <div className='ml-1 h-5 w-10' style={{ fontFamily: 'Roboto Medium', backgroundImage: `url(${Facebook})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                        <div className='h-9 flex items-center text-grey-dark justify-start pl-2 w-full text-xs font-bold'>LOG IN WITH FACEBOOK</div>
                    </div> */}
                    <div className='h-9 w-56 rounded-sm bg-white select-none mb-6 hover:shadow-md shadow hover:cursor-pointer flex flex-row items-center' onClick={this.handleGithubSubmit}>
                        <div className='ml-1 h-5 w-10' style={{ fontFamily: 'Roboto Medium', backgroundImage: `url(${Github})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                        <div className='h-9 flex items-center text-grey-dark justify-start pl-2 w-full text-xs font-semibold'>LOG IN WITH GITHUB</div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

let invalidInputStyle = 'm-3 bg-white focus:outline-none focus:border focus:border-red shadow-md text-xs  h-10 pl-6 rounded-lg w-72';
let validInputStyle = 'm-3 bg-white focus:outline-none focus:border focus:border-green shadow-md text-xs  h-10 pl-6 rounded-lg w-72'
let inputStyle = 'm-3 bg-white focus:outline-none  shadow-md text-xs  h-10 pl-6 rounded-lg w-72';

const mapStateToProps = state => {
    return {
        // loading: state.auth.loading,
        error: state.auth.error,
        userId: state.auth.userId,
        isSignUp: state.auth.isSignUp,
        photoUrl: state.auth.photoURL
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuthFacebook: () => dispatch(actions.authFacebook()),
        onAuthGoogle: () => dispatch(actions.authGoogle()),
        onAuthGithub: () => dispatch(actions.authGithub()),
        onEmailAuth: (email, password) => dispatch(actions.authEmail(email, password)),
        onEmailSignUp: (email, password, displayName, image) => dispatch(actions.authEmailSignup(email, password, displayName, image)),
        onUserUpdates: () => dispatch(actions.updateUserDetails()),
        onImageUpload: (image, uid, displayName) => dispatch(actions.imageUpload(image, uid, displayName)),
        onAuthFail: (error) => dispatch(actions.authFail(error)),
        onSwitchMode: mode => dispatch(actions.switchMode(mode))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);