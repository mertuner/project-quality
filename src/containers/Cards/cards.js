import React, { Component } from 'react';
import Card from '../../components/Card/card';
import { connect } from 'react-redux';
import { writeNewPost, postRating, openDropAction, getLikes} from '../../store/actions/post';
class CategoryCards extends Component {


    //This infinite scroll feature will be added later on.
    componentDidMount() {
        this.props.onGetUserLikedChannels(this.props.uid);
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillMount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }
    


    trackScrolling = () => {
        const wrappedElement = document.body;
        if (this.isBottom(wrappedElement)) {
            // console.log('body bottom reached');
            document.removeEventListener('scroll', this.trackScrolling);
        }
    };


    ratingClickHandler = (event, postId, uid) => {
        if(!localStorage.getItem('auth')){
            this.props.history.push('/login');
        }
        event.stopPropagation();
        this.props.onPostRating(postId, uid);

    }


    modalHandler(postId){
        this.props.openDropAction(postId);
    }

    commentPropHandler = event => {
        event.stopPropagation();
    };

    render() {

        let cards = null
        if (!this.props.loading) {
            cards = this.props.posts.map(card => {
                if (this.props.date === card.private.date) {
                    return (
                        <Card
                            channel={card.private.channel}
                            desc={card.private.description}
                            category={card.private.category}
                            rating={card.public.rating}
                            cid={card.private.id}
                            logoUrl={card.private.logoURL}
                            comment = {card.public.comments}
                            ratingClicked={(event) => this.ratingClickHandler(event, card.private.id, this.props.uid)}
                            clicked={() => this.modalHandler(card.private.id)}
                            key={card.private.id}
                            commentProp={this.commentPropHandler}
                            voted={Object.keys(this.props.likedChannels).includes(card.private.id) ? true : false}
                        />
                    )
                }
                return undefined;
            })
        }


        return (
            <div className={!this.props.loading ? 'w-full  flex justify-between flex-col' : 'w-full flex flex-col'}>
                <div className='text-black flex flex-row  md-0:w-full items-center justify-end w-3.25/5 pt-10 pb-6' style={{ fontFamily: 'Open Sans' }}>
                    <div className='text-xs font-semibold'>{this.props.date}</div>
                </div>
                {cards}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        posts: state.post.posts,
        error: state.post.error,
        loading: state.post.loading,
        submittedPost: state.post.submittedPost,
        exitDrop: state.post.exitDrop,
        dates: state.post.dates,
        uid: state.auth.userId,
        likedChannels: state.post.likedpostIds
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSubmitPost: (postData) => dispatch(writeNewPost(postData)),
        onPostRating: (postId, uid) => dispatch(postRating(postId, uid)),
        openDropAction: (postId) => dispatch(openDropAction(postId)),
        onGetUserLikedChannels: uid => dispatch(getLikes(uid))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoryCards);