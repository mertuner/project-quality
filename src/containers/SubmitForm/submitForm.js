import React, { Component } from 'react';
import Navigation from '../../components/Navigation/navigation';
import Promoted from '../../components/PostDescription/promoted';
import { logout } from '../../store/actions/auth';
import { connect } from 'react-redux';
import { writeNewPost, editPost, editablePost } from '../../store/actions/post';
import MaterialIcon from 'material-icons-react';
import { Redirect } from 'react-router-dom';
import Button from '../../components/UI/button';


class SubmitForm extends Component {


    state = {
        post: {
            description: '',
            channel: '',
            rating: 0,
            videoId: '',
            logoURL: '',
            channelId: '',
            facebook: "",
            twitter: "",
            youtube: '',
            submitter: localStorage.getItem('auth'),
            category: 'Auto & Vehicles',
            promoted: false,
        },
        categories: ['Science', 'Technology', 'Auto & Vehicles', 'Daily Vlog', 'Travel', 'Education',
            'Sport', 'Entertainment', 'Food', 'Music', 'Pets & Animals', 'News'],
        helper: false,
        rules: {
            validChannel: false,
            validDescription: false,
            validChannelId: false,
            validYoutubeLink: false,
            validTwitterLink: true,
            validFacebookLink: true,
        },
        invalidLabels: {
            channelId: '',
            youtube: '',
            facebook: '',
            twitter: '',
            channel: '',
            description: ''
        }
    }
    // UCnKPQUoCRb1Vu-qWwWituGQ
    // UCsqjHFMB_JYTaEnf_vmTNqg
    // UC0BGhWsIbV7Dm-lsvhdlMbA
    componentDidMount() {
        if (this.props.editablePost) {
            localStorage.setItem('editable', true);
            this.setState({ post: this.props.editablePost.private,
                rules: {
                    validChannel: true,
                    validDescription: true,
                    validChannelId: true,
                    validYoutubeLink: true,
                    validTwitterLink: true,
                    validFacebookLink: true,
                }
            });
        }
        else {
            localStorage.removeItem('editable');
        }
    }

    componentWillUnmount() {
        this.props.onEditablePost(null);
        localStorage.removeItem('editable');
    }

    editPostHandler(event, postId, post) {
        event.preventDefault();
        this.checkValidity(() => this.props.onEditPost(postId, post));
    }

    
    newPostHandler = (event) => {
        event.preventDefault();
        this.checkValidity(() => this.props.onSubmitPost(this.state.post));
    }
    
    //Edit or Submit if the post is valid
    checkValidity(func){
        if (this.state.rules.validChannelId && this.state.rules.validYoutubeLink &&
            this.state.rules.validFacebookLink && this.state.rules.validTwitterLink &&
            this.state.rules.validChannel && this.state.rules.validDescription) {
                func();
        }
        else {
            if (this.state.rules.validChannelId === false || this.state.rules.validYoutubeLink === false || this.state.rules.validFacebookLink === false ||
                this.state.rules.validTwitterLink === false || this.state.rules.validChannel === false || this.state.rules.validDescription === false) {
                this.setState({
                    invalidLabels: {
                        ...this.state.invalidLabels,
                        channelId: this.state.rules.validChannelId === false ? '   - Invalid Channel ID' : '',
                        youtube: this.state.rules.validYoutubeLink === false ? '   - Invalid Youtube Link Hint: Make sure it starts with https://' : '',
                        facebook: this.state.rules.validFacebookLink === false ? '   - Invalid Facebook Link Hint: Make sure it starts with https://' : '',
                        twitter: this.state.rules.validTwitterLink === false ? '   - Invalid Twitter Link Hint: Make sure it starts with https://' : '',
                        channel: this.state.rules.validChannel === false ? "   -Channel Name can't be blank" : '',
                        description: this.state.rules.validDescription === false ? "   -Description can't be blank" : ''
                    }
                })
            }
        }
    }

    /// Rules Here for Facebook, Twitter, ChannelId, VideoLink
    handleInputChange = (event, inputType) => {
        if (inputType === 'description') {
            this.setState({
                post: {
                    ...this.state.post,
                    description: event.target.value
                }
            });
            if (event.target.value !== '') {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validDescription: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validDescription: false
                    }
                })
            }
        };
        if (inputType === 'channel') {
            this.setState({
                post: {
                    ...this.state.post,
                    channel: event.target.value
                }
            });

            if (event.target.value !== '') {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validChannel: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validChannel: false
                    }
                })
            }
        };
        if (inputType === 'facebook') {
            this.setState({
                post: {
                    ...this.state.post,
                    facebook: event.target.value
                }
            });
            if (event.target.value.slice(0, 25) === 'https://www.facebook.com/') {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validFacebookLink: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validFacebookLink: event.target.value === '' ? true : false
                    }
                })
            }
        };
        if (inputType === 'twitter') {
            this.setState({
                post: {
                    ...this.state.post,
                    twitter: event.target.value
                }
            });
            if (event.target.value.slice(0, 20) === 'https://twitter.com/') {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validTwitterLink: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validTwitterLink: event.target.value === '' ? true : false
                    }
                })
            }
        };
        if (inputType === 'channelId') {
            this.setState({
                post: {
                    ...this.state.post,
                    channelId: event.target.value,
                    youtube: 'https://www.youtube.com/channel/' + event.target.value
                }
            });
            if (event.target.value.slice(0, 2) === 'UC' && event.target.value.length === 24) {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validChannelId: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validChannelId: false
                    }
                })
            }
        };
        if (inputType === 'videoId') {
            this.setState({
                post: {
                    ...this.state.post,
                    videoId: event.target.value
                }
            });
            if (event.target.value.slice(0, 32) === 'https://www.youtube.com/watch?v=') {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validYoutubeLink: true
                    }
                })
            }
            else {
                this.setState({
                    rules: {
                        ...this.state.rules,
                        validYoutubeLink: false
                    }
                })
            }
        };

        if (inputType === 'select') {
            this.setState({
                post: {
                    ...this.state.post,
                    category: event.target.value
                }
            });
        }
    }


    //Toogle channelid helper
    helperToggler = () => {
        this.setState(prevState => {
            return { helper: !prevState.helper }
        });
    }




    render() {
        if (localStorage.getItem('submissionSuccess')) {
            return (
                <Redirect to='/success' />
            )
        }
        else if (localStorage.getItem('submissionFail')) {
            return (
                <Redirect to='/fail' />
            )
        }
        // fontlar duzelicek
        return (
            <div className='h-full w-full' style={{ fontFamily: 'Nunito' }}>
                <Navigation {...this.props} />
                <div className='flex flex-col items-start h-full mt-10 mb-10'>
                    <p className='font-semibold text-base pb-6'>Share with us!</p>
                    <form onKeyDown={(e) => e.keyCode === 13 ? e.preventDefault() : ''} onSubmit={localStorage.getItem('editable') ? (event) => this.editPostHandler(event, this.state.post.id, this.state.post) : this.newPostHandler}
                        className='z-30 bg-white rounded-lg w-3/5 h-full md-0:w-full flex text-sm flex-col justify-around items-start font-bold'>
                        <div className='flex flex-col w-4/5 mt-3'>
                            <label className='ml-3'>Channel Name<span className='text-red text-xs'>{this.state.invalidLabels.channel}</span></label>
                            <input value={this.state.post.channel} onChange={(event) => this.handleInputChange(event, 'channel')} placeholder='Full channel name' className={this.state.rules.validChannel ? validInputStyle : invalidInputStyle} style={{WebkitAppearance: 'none'}}></input>
                        </div>
                        <div className='flex flex-col w-4/5'>
                            <label className='ml-3'>Description<span className='text-red text-xs'>{this.state.invalidLabels.description}</span></label>
                            <input value={this.state.post.description} maxLength={50} onChange={(event) => this.handleInputChange(event, 'description')} style={{WebkitAppearance: 'none'}} placeholder='A short description. Max: 50 chars' className={this.state.rules.validDescription ? validInputStyle : invalidInputStyle}></input>
                        </div>
                        <div className='flex flex-col w-4/5'>
                            <div className='flex flex-row justify-between items-center'>
                                <label className='ml-3'>Channel ID<span className='text-red text-xs'>{this.state.invalidLabels.channelId}</span></label>
                                <div className='hover:cursor-default select-none' onMouseEnter={this.helperToggler} onMouseLeave={this.helperToggler}>
                                    <MaterialIcon icon={'help'} size={15} />
                                </div>
                            </div>
                            {this.state.helper ?
                                <div className='z-20  h-4 bg-channel mt-1 ml-3'></div> : null}
                            <input value={this.state.post.channelId} style={{WebkitAppearance: 'none'}} onChange={(event) => this.handleInputChange(event, 'channelId')} placeholder='Youtube channel id' className={this.state.rules.validChannelId ? validInputStyle : invalidInputStyle}></input>

                        </div>
                        <div className='flex flex-col w-4/5'>
                            <label className='ml-3'>Video Link<span className='text-red text-xs'>{this.state.invalidLabels.youtube}</span></label>
                            <input value={this.state.post.videoId} style={{WebkitAppearance: 'none'}}  onChange={(event) => this.handleInputChange(event, 'videoId')} placeholder='A sample Youtube video that describes the content' className={this.state.rules.validYoutubeLink ? validInputStyle : invalidInputStyle} ></input>
                        </div>
                        <div className='flex flex-col w-4/5'>
                            <label className='ml-3'>Facebook<span className='text-red text-xs'>{this.state.invalidLabels.facebook}</span></label>
                            <input value={this.state.post.facebook} style={{WebkitAppearance: 'none'}} onChange={(event) => this.handleInputChange(event, 'facebook')} placeholder='Facebook Page If available' className={this.state.rules.validFacebookLink ? validInputStyle : invalidInputStyle}></input>
                        </div>
                        <div className='flex flex-col w-4/5'>
                            <label className='ml-3'>Twitter<span className='text-red text-xs'>{this.state.invalidLabels.twitter}</span></label>
                            <input value={this.state.post.twitter} style={{WebkitAppearance: 'none'}} onChange={(event) => this.handleInputChange(event, 'twitter')} placeholder='Twitter Page If available' className={this.state.rules.validTwitterLink ? validInputStyle : invalidInputStyle}></input>
                        </div>
                        <div className='flex flex-col w-4/5'>
                            <label className='ml-3'>Category</label>
                            <select className='m-3 ' value={this.state.post.category} onChange={(event) => this.handleInputChange(event, 'select')}>
                                {this.state.categories.sort().map(category => {
                                    return (
                                        <option key={category} value={category}>{category}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='ml-3 mb-2'>
                            <Button width={'w-28'} color={'bg-green-pastel'} >SUBMIT</Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

let invalidInputStyle = 'm-2 bg-white focus:outline-none focus:border focus:border-red shadow-md text-xs  h-8 pl-2 rounded-lg w-full';
let validInputStyle = 'm-2 bg-white focus:outline-none focus:border focus:border-green shadow-md text-xs  h-8 pl-2 rounded-lg w-full'

const mapStateToProps = state => {
    return {
        userPopUp: state.user.userPopUp,
        uid: state.auth.userId,
        editablePost: state.post.editablePost
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSubmitPost: (postData) => dispatch(writeNewPost(postData)),
        onLogOut: () => dispatch(logout()),
        onEditPost: (postId, post) => dispatch(editPost(postId, post)),
        onEditablePost: (post) => dispatch(editablePost(post))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmitForm);