import React, { Component } from 'react';
import Navigation from '../Navigation/navigation';
import BlankUser from '../../media/user.png';
import { connect } from 'react-redux';
import { getLikes, getPosts } from '../../store/actions/post';
import { imageUpload, authDeleteAccount } from '../../store/actions/auth';
import Likes from './likes';
import Button from '../UI/button';
import { Redirect } from 'react-router-dom';

class Profile extends Component {

    state = {
        mode: '',
        displayName: '',
        photoUrl: '',
        rules: {
            validDisplayName: true,
            validPassword: false,
            validRePassword: false,
        },
        invalidLabels: {
            displayName: '',
            password: '',
            rePassword: ''
        },
        image: null
    }

    likedChannelHandler = (uid) => {
        this.props.onGetUserLikedChannels(uid);
        this.setState({ mode: 'likes' })
    }

    fileHandler = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0]
            this.setState({ image: image })
        }
    }

    updateProfileHandler(event, image, uid, displayName) {
        event.preventDefault();
        if (this.state.rules.validDisplayName) {
            this.props.onImageUpload(image, uid, displayName)
        }
    }

    accountRemoveHandler = (event) => {
        event.preventDefault();
        let answer = prompt('Please type DELETE');
        if (answer !== null && answer.toLowerCase() === 'delete') {
            this.props.onDeleteAccount();
        }
    } 

    displayNameChangeHandler = (event) => {
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

    componentDidUpdate() {
        console.log(this.state)
    }

    componentDidMount() {
        if (this.props.posts.length < 1) {
            this.props.onLoadPosts();
        }
        this.likedChannelHandler(localStorage.getItem('auth'));
    }

    settingsHandler = () => {
        this.setState({
            mode: 'default',
            displayName: this.props.displayName,
            photoUrl: this.props.photoUrl
        })
    }


    render() {
        console.log(this.props.likedChannelsDetails);
        let auth = localStorage.getItem('auth');
        if (!auth) {
            return (
                <Redirect to={'/'} />)
        }
        return (
            <div className='h-screen w-full' style={{ fontFamily: 'Open Sans' }}>
                <Navigation {...this.props} />
                <div className='w-full h-48 mt-6 bg-blue-ht rounded-sm'></div>
                <div className='flex flex-row absolute z-20 ml-12 -mt-16 
                sm-0:flex-col sm-0:ml-0 sm-0:items-center sm-0:static sm-0:-mt-44'>
                    <div className='rounded-full w-32 h-32 mr-4 sm-0:w-28 sm-0:h-28 sm-0:mr-0' style={{
                        backgroundImage: `url(${this.props.userId && this.props.photoUrl ? this.props.photoUrl : this.props.userId && !this.props.photoUrl ? BlankUser : null})`,
                        backgroundSize: 'cover'
                    }}>
                    </div>
                    <div className='flex flex-col justify-around items-start h-16 sm-0:items-center'>
                        <p className='text-white text-base font-semibold'>{this.props.displayName}</p>
                        <p className='text-white text-base'>{this.props.email}</p>
                    </div>
                </div>
                <ul className='flex flex-col absolute mt-24 select-none h-12 justify-between items-start text-sm text-grey-dark ml-12 list-reset
                sm-0:mt-5 sm-0:ml-0 sm-0:w-full sm-0:items-center sm-0:static  sm-0:text-sm sm-0:h-16'>
                    <li className='hover:cursor-pointer sm-0:bg-grey-light sm-0:w-full sm-0:text-center sm-0:pt-1 sm-0:pb-1' onClick={() => this.likedChannelHandler(this.props.userId)}>
                        Liked Channels
                        </li>
                    <li className='hover:cursor-pointer sm-0:w-full sm-0:bg-grey-light sm-0:text-center sm-0:pt-1 sm-0:pb-1' onClick={this.settingsHandler}>
                        Settings
                        </li>
                </ul>
                {this.state.mode === 'default' ?
                    <form className='rounded-sm bg-white h-3/5 mb-4 ml-48 mt-10 font-semibold text-xs text-grey-darker flex flex-col
                    sm-0:ml-0'>
                        <div className='flex flex-col w-full pt-8'>
                            <label className='ml-4 text'>Display Name</label>
                            <input onChange={(e) => this.displayNameChangeHandler(e)} placeholder={this.state.displayName} className={this.state.rules.validDisplayName ? validInputStyle : invalidInputStyle}></input>
                        </div>
                        <div>
                            <div className='ml-3 mt-2'>Profile Picture</div>
                            <div className='flex flex-row  w-3.25/5 justify-between items-center md-0:flex-col md-0:items-start'>
                                <div className='m-3 bg-white shadow-md text-xs  font-thin text-grey-ph pt-3 h-10 pl-4 rounded-lg w-72 sm-0:w-56'>{this.state.photoUrl ? this.state.photoUrl.slice(0, 35) + '...' : ''}</div>
                                <input className='md-0:ml-4' type='file' accept='image/*' onChange={e => this.fileHandler(e)}></input>
                            </div>
                        </div>
                        <div className='ml-4 mt-4'>
                            <Button clicked={(e) => this.updateProfileHandler(e, this.state.image, this.props.userId, this.state.displayName)} width={'w-32'} color={'bg-green-pastel'}>UPDATE</Button>
                        </div>
                        <div className='ml-4 mt-4'>
                            <Button clicked={(e) => this.accountRemoveHandler(e)} width={'w-32'} color={'bg-red-pastel'}>DELETE ACCOUNT</Button>
                        </div>
                    </form> : null}
                {this.state.mode === 'likes'  ? <Likes channels={this.props.likedChannelsDetails} /> : null}
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
        likedChannels: state.post.likedpostIds,
        likedChannelsDetails: state.post.likedChannelsDetails,
        posts: state.post.posts
    };
};

let invalidInputStyle = 'm-3 bg-white focus:outline-none focus:border focus:border-red shadow-md text-xs  h-10 pl-4 rounded-lg w-72 sm-0:w-56';
let validInputStyle = 'm-3 bg-white focus:outline-none focus:border focus:border-green shadow-md text-xs  h-10 pl-4 rounded-lg w-72 sm-0:w-56';

const mapDispatchToProps = dispatch => {
    return {
        onLoadPosts: () => dispatch(getPosts()),
        onGetUserLikedChannels: uid => dispatch(getLikes(uid)),
        onImageUpload: (image, uid, displayName) => dispatch(imageUpload(image, uid, displayName)),
        onDeleteAccount: () => dispatch(authDeleteAccount())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);