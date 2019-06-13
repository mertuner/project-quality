import React, { Component } from 'react';
import Navigation from '../Navigation/navigation';
import { connect } from 'react-redux';
import { openDropAction, getPosts, exitDrop, addComment, removeComment, likeComment, getComments } from '../../store/actions/post';
import Button from '../UI/button';
import Youtube from 'react-youtube';
import MaterialIcon from 'material-icons-react';
import { Link } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { IconContext } from "react-icons";
import BlankUser from '../../media/user.png';

class Commented extends Component {

    state = {
        comment: '',
    }

    componentDidMount() {
        this.props.onGetComment(this.props.match.params.id);
        this.props.onLoadPosts();
    }


    removeCommentHandler = (postId, commentId) => {
        let answer = prompt('Please type DELETE');
        if (answer !== null && answer.toLowerCase() === 'delete') {
            this.props.onRemoveComment(postId, commentId);
        }
    }

    likeCommentHandler = (postId, commentId, uid) => {
        this.props.onLikeComment(postId, commentId, uid);
    }

    commentHandler = (post, user, comment) => {
        if(comment){
        this.props.onAddComment(post, user, comment);
        this.setState({ comment: '' });
        }
    }

    handleInputChange = event => {
        this.setState({
            comment: event.target.value
        })
    }


    render() {
        let commentedVideo = {};
        let play_youtube = null;
        let commentedList = [];
        this.props.posts.map(card => {
            if (this.props.match.params.id === card.private.id) {
                commentedVideo = card;
                console.log(commentedVideo);
                for (let cm in this.props.comments) {
                    commentedList.push(this.props.comments[cm])
                }
                if (card.private.videoId) {
                    play_youtube = <div className='md-0:hidden bg-grey-lightest rounded-lg p-6 shadow-custom'>
                        <Youtube
                            videoId={card.private.videoId.slice(32)}
                            opts={{
                                height: '300',
                                width: '420'
                            }}
                        />
                    </div>
                }
            }
            return undefined
        })

        let comments;
        // Array yapmam lazim
        if (commentedVideo) {
            comments = commentedList.map(comment => {
                let userKey = comment.private.commentator
                console.log(this.props.commentators[userKey]);
                return (
                    <div className='w-4.5/5 text-xxs  flex flex-col items-start mb-4' key={comment.private.commentId}>
                        <div className='flex flex-row pb-2 w-full items-center '>
                        {this.props.commentators[userKey] && !this.props.commentators[userKey].photoUrl ? <div className = 'hover:cursor-pointer w-8 h-8 rounded-full bg-grey-light flex flex-col justify-center items-center text-sm text-white'>{this.props.commentators[userKey].displayName && this.props.commentators[userKey].displayName.length > 1 ? this.props.commentators[userKey].displayName.slice(0,2).toUpperCase() : this.props.commentators[userKey].displayName.toUpperCase()} </div> : null}
                        {this.props.commentators[userKey] && this.props.commentators[userKey].photoUrl ? <div className='hover:cursor-pointer w-8 h-8 rounded-full' style={{backgroundImage: `url(${this.props.commentators[userKey].photoUrl})`, backgroundSize: 'cover'}} onClick={this.userPopUpToggler}></div> : null}
                            {/* <div className='h-8 w-8 rounded-full' style={{ backgroundImage: `url(${this.props.commentators[userKey] && this.props.commentators[userKey].photoUrl ? this.props.commentators[userKey].photoUrl : BlankUser})`, backgroundSize: 'cover' }}>
                            </div> */}
                            <div className='pl-3 font-semibold'>
                                {this.props.commentators[userKey] ? this.props.commentators[userKey].displayName : null}
                            </div>
                        </div>
                        <div className='w-4.5/5 rounded-sm text-grey-darker leading-normal font-medium bg-grey-lighter mt-2 pt-3 pl-6 pr-2 pb-4'>
                            {comment.private.comment}
                        </div>
                        <div className='flex flex-row items-center justify-center'>
                            {this.props.user.userId === comment.private.commentator ?
                                <div className='text-xxs font-medium mt-3 text-grey-dark ml-8 hover:cursor-pointer select-none pr-3'
                                    onClick={() => this.removeCommentHandler(commentedVideo.private.id, comment.private.commentId)}>DELETE</div> : null}
                            <div className='text-xxs font-semibold mt-3 text-grey-dark ml-4 hover:cursor-pointer select-none flex flex-row items-center justify-center'
                                onClick={() => this.likeCommentHandler(commentedVideo.private.id, comment.private.commentId, this.props.user.userId)}>
                                {comment.public.likers && comment.public.likers[this.props.user.userId] ? <MaterialIcon icon={'favorite'} size={11.5} color={'#EF3E36'} /> :
                                    null}
                                {!comment.public.likers || !comment.public.likers[this.props.user.userId] ? <MaterialIcon icon={'favorite'} size={11.5} /> :
                                    null}
                                <span className='pl-1'>{comment.public.likes}</span>
                            </div>
                        </div>
                    </div>
                )
            })
        }

        return (
            <div className='h-full  w-full' style={{ fontFamily: 'Open Sans' }}>
                <Navigation {...this.props}/>
                <div className='flex flex-col items-center justify-center mt-16 bg-white shadow-custom rounded-lg w-full mb-4 pb-6'>
                    <div className='pt-8 pb-8 flex flex-row w-full items-center justify-around' style={{ fontFamily: 'Open Sans' }}>
                        {play_youtube}
                        <div className='flex flex-row  justify-end' style={{ fontFamily: 'Open Sans' }}>
                            <div className='h-80 flex flex-col justify-around  items-center  bg-white rounded-lg'>
                                <div className=' h-32 w-32  rounded' style={{ backgroundImage: `url(${commentedVideo.private ? commentedVideo.private.logoURL : ''})`, backgroundSize: 'cover' }}>
                                </div>
                                <div className='w-12 flex flex-row items-end justify-around'>
                                    <MaterialIcon icon='star' color='#FDBE13' size={19} />
                                    <span className='text-grey text-sm font-bold'>{commentedVideo.public ? commentedVideo.public.rating : ''}</span>
                                </div>
                                <h4 className='text-grey-darkest'>{commentedVideo.private ? commentedVideo.private.channel : ''}</h4>
                                <p className='text-xs text-center  text-grey'>{commentedVideo.private ? commentedVideo.private.description : ''}</p>
                                <div className='flex flex-row  w-32 items-center justify-around'>
                                    {commentedVideo.private && commentedVideo.private.facebook ? <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                        <a target='_blank' rel="noopener noreferrer" href={commentedVideo.private.facebook}>
                                            <FaFacebook />
                                        </a>
                                    </IconContext.Provider> : null}
                                    {commentedVideo.private && commentedVideo.twitter ? <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                        <a target='_blank' rel="noopener noreferrer" href={commentedVideo.private.twitter}>
                                            <FaTwitter />
                                        </a>
                                    </IconContext.Provider> : null}
                                    <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                        <a target='_blank' rel="noopener noreferrer" href={commentedVideo.private ? commentedVideo.private.youtube : ''}>
                                            <FaYoutube />
                                        </a>
                                    </IconContext.Provider>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className={`w-4.5/5 text-start text-sm font-medium ${commentedVideo.public && commentedVideo.public.comments ? 'mb-4' : ''}`}>Comments</p>
                    {comments}
                    <div className='w-4.5/5 mt-2'>
                        <textarea value={this.state.comment} onChange={event => this.handleInputChange(event)} type='textarea' rows={3} maxLength='600' className='w-4.5/5 leading-normal border rounded-sm text-xs text-grey-dark pl-4 pt-2 mb-2' placeholder='What do you think about this channel?'>
                        </textarea>
                        {localStorage.getItem('auth') ? <Button color={'bg-yellow-pastel'} width={'w-28'} clicked={() => this.commentHandler(commentedVideo, this.props.user, this.state.comment)}>Add Comment</Button>
                            : <Link to='/login' style={{textDecoration: 'none'}}><Button color={'bg-yellow-pastel'} width={'w-28'}>Add Comment</Button></Link>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        posts: state.post.posts,
        loading: state.post.loading,
        exitDrop: state.post.exitDrop,
        user: state.auth,
        comments: state.post.comments,
        commentators: state.post.commentators,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openDropAction: (postId) => dispatch(openDropAction(postId)),
        onLoadPosts: () => dispatch(getPosts()),
        onExitDrop: () => dispatch(exitDrop()),
        onAddComment: (post, user, comment) => dispatch(addComment(post, user, comment)),
        onRemoveComment: (postId, commentId) => dispatch(removeComment(postId, commentId)),
        onLikeComment: (postId, commentId, uid) => dispatch(likeComment(postId, commentId, uid)),
        onGetComment: (postId) => dispatch(getComments(postId)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Commented);