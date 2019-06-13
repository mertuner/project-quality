import React, { Component } from 'react';
import Card from '../Card/card';
import Navigation from '../Navigation/navigation';
import { postRating, openDropAction, getPosts, removePost, exitDrop, editablePost } from '../../store/actions/post';
import { connect } from 'react-redux';
import Modal from '../Modal/modal';
import { Link } from 'react-router-dom';
import { logout } from '../../store/actions/auth';
import Button from '../UI/button';

class Submissions extends Component {

    componentDidMount() {
        this.props.onLoadPosts();
    }


    removePost = (postId) => {
        let answer = prompt('Please type DELETE');
        if (answer !== null && answer.toLowerCase() === 'delete') {
            this.props.onRemovePosts(postId);
        }
    }

    commentPropHandler = event => { event.stopPropagation() };


    modalHandler(postId) {
        this.props.openDropAction(postId);
    }

    ratingClickHandler = (event, id, uid) => {
        event.stopPropagation();
        this.props.onPostRating(id, uid);
    }

    editHandler = post => {
        this.props.onEditablePost(post);
    }

    render() {
        let mychannels = [];
        let mysubs = this.props.posts.map(card => {
            if (this.props.uid === card.private.submitter) {
                mychannels.push(card);
                return (
                    <div key={card.private.id} className='flex flex-row sm-0:flex-col items-center  w-full' style={{ fontFamily: 'Nunito' }}>
                        <Card
                            channel={card.private.channel}
                            desc={card.private.description}
                            category={card.private.category}
                            rating={card.public.rating}
                            logoUrl={card.private.logoURL}
                            cid={card.private.id}
                            comment = {card.public.comments}
                            commentProp={this.commentPropHandler}
                            ratingClicked={(event) => this.ratingClickHandler(event, card.private.id, this.props.uid)}
                            clicked={() => this.modalHandler(card.private.id)}
                            voted={card.private.voters && Object.keys(card.private.voters).includes(this.props.uid) ? true : false}
                        />
                        <div className='flex flex-col sm-0:flex-row justify-around sm-0:w-full sm-0:h-16  sm-0:ml-0  items-center ml-8 h-24'>
                            <div className = 'ml-3 mb-2'>
                                <Link to='/submit' onClick={() => this.editHandler(card)} style={{ textDecoration: 'none' }}>
                                    <Button width={'w-28'} color={'bg-green-pastel'}>EDIT</Button>
                                </Link>
                            </div>
                            <div className = 'ml-3 mb-2'>
                                <Button clicked={() => this.removePost(card.private.id)} color={'bg-red-pastel'} width={'w-28'}>DELETE</Button>
                            </div>
                        </div>
                    </div>
                )
            }
            return undefined;
        })

        if (!this.props.loading && mychannels.length < 1) {
            mysubs = (
                <div className='flex flex-col justify-between items-center h-24  w-full  mt-10 text-base font-semibold'>
                    <p>Oops! You do not have any channel submission yet</p>
                    <Link to='/submit' style={{ textDecoration: 'none' }}>
                        <Button width={'w-32'} color={'bg-green-pastel'}>SUBMIT NEW POST</Button>
                    </Link>
                </div>
            )
        }

        return (
            <div className='h-full  w-full' style={{ fontFamily: 'Nunito' }}>
                <Navigation {...this.props} />
                <div className='w-full flex flex-col'>
                    <p className='text-lg font-semibold pt-16 pb-12'>My Submissions</p>
                    {mysubs}
                    {this.props.exitDrop & !this.props.loading ? <Modal exited={this.props.onExitDrop} /> : null}
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        uid: state.auth.userId,
        posts: state.post.posts,
        loading: state.post.loading,
        exitDrop: state.post.exitDrop,
        userPopUp: state.user.userPopUp
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openDropAction: (postId) => dispatch(openDropAction(postId)),
        onPostRating: (postId, uid) => dispatch(postRating(postId, uid)),
        onLoadPosts: () => dispatch(getPosts()),
        onRemovePosts: (postId) => dispatch(removePost(postId)),
        onExitDrop: () => dispatch(exitDrop()),
        onLogOut: () => dispatch(logout()),
        onEditablePost: post => dispatch(editablePost(post))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Submissions);