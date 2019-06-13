import * as actions from './actionTypes';
import { databaseRef } from '../../config/firebase';
import axios from 'axios';


export const getPosts = () => {
    return async dispatch => {
        try {
            //Only fetch last week's enteries
            let dayEndTimeStamp = new Date().setHours(23, 59, 59, 999);
            console.log(dayEndTimeStamp);
            let weekInSeconds = 60 * 60 * 24 * 7 * 10000;
            let timeFrame = dayEndTimeStamp - weekInSeconds;
            await databaseRef.child('/posts').orderByChild('private/timeStamp').startAt(timeFrame).on("value", snapshot => {
                let posts = []
                snapshot.forEach(child => {
                    let data = {}
                    data[child.key] = child.val();
                    posts.push({ ...data[child.key] });
                });
                posts.reverse();
                let dates = []
                for (let post of posts) {
                    if (!dates.includes(post.private.date)) {
                        dates.push(post.private.date);
                    }
                }
                //SetDates in descending order by date
                dispatch(setDates(dates.sort(
                    function (a, b) {
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(b) - new Date(a);
                    }
                )));

                let byRate = posts.slice(0);
                console.log(byRate);
                byRate.sort(function (a, b) {
                    return b.public.rating - a.public.rating;
                });
                localStorage.removeItem('submissionSuccess');
                localStorage.removeItem('submissionFail')
                dispatch(setPosts(byRate));
                dispatch(setRisingStars(byRate.slice(0, 3)))
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].private.promoted) {
                        dispatch(promotedPost(posts[i]));
                    }
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }

}

export const setRisingStars  = arr => {
    return {
        type: actions.SET_RISING_STARS,
        risingStars: arr
    }
} 


export const userPostsIds = (postsIds) => {
    return {
        type: actions.USER_LIKED_POSTS,
        userPostsIds: postsIds
    }
}
export const getLikes = uid => {
    return async dispatch => {
        let likes;
        try {
            await databaseRef.child('/users/' + uid + '/likes/').on("value", snapshot => {
                likes = snapshot.val() ? snapshot.val() : [];
                dispatch(userPostsIds(likes))
            })
            let myChannels = [];
            for await (let i of Object.keys(likes)) {
                databaseRef.child('posts/' + i).once("value", snapshot => {
                    let collection = snapshot.val();
                    myChannels.push({ ...collection })
                })
            }
            myChannels.reverse();
            dispatch(setLikedChannelsDetails(myChannels));
        } catch (error) {
            dispatch(setError(error));
        }
    }
}

//TODO Fetch Liked Channels Details
// export const fetchLikedChannelsDetails = (likes = {}) => {
//     return async dispatch => {
//     let myChannels = [];
//     for await (let i of Object.keys(likes)){
//         databaseRef.child('posts/' + i).once("value", snapshot => {
//             let collection = snapshot.val();
//             myChannels.push({...collection})
//         })
//     }
//     // myChannels.reverse();
//     dispatch(setLikedChannelsDetails(myChannels));
//     }
// }

export const setLikedChannelsDetails = (arr) => {
    return {
        type: actions.SET_LIKED_CHANNEL_DETAILS,
        likedChannels: arr
    }
}

export const setDates = dates => {
    return {
        type: actions.SET_DATES,
        dates: dates
    }
}

export const setPosts = data => {
    return {
        type: actions.SET_POSTS,
        posts: data,
        loading: false,
    }
}

export const setError = error => {
    return {
        type: actions.SET_ERROR,
        error: error
    }
}

export const setCommentatorsDetails = commentators => {
    return {
        type: actions.SET_COMMENTATORS_DETAILS,
        commentators: commentators
    }
}


export const getCommentatorsDetails = (postId) => {
    return async dispatch => {
        let commentators = []
        await databaseRef.child('/comments/' + postId).once("value", snapshot => {
            let comments = snapshot.val() ? snapshot.val() : {};
            for (let comment in comments) {
                commentators.push(comments[comment].private.commentator)
            }
        })

        let users = {}
        for await (let commentator of commentators) {
            await databaseRef.child('/users/' + commentator).once("value", snapshot => {
                let userDetail = snapshot.val();
                users[commentator] = { ...userDetail }
            })
        }
        dispatch(setCommentatorsDetails(users));
    }
}

export const writeNewPost = (post) => {

    return async dispatch => {
        // A post entry.
        let postData = {
            public: {
                comments: 0,
                rating: post.rating
            },
            private: {
                channel: post.channel,
                description: post.description,
                category: post.category,
                videoId: post.videoId,
                channelId: post.channelId,
                logoURL: null,
                id: null,
                facebook: post.facebook,
                twitter: post.twitter,
                youtube: post.youtube,
                submitter: post.submitter,
                promoted: post.promoted,
                timeStamp: new Date().getTime(),
                date: new Date((new Date().getTime() + new Date().getTimezoneOffset() * 60000) - (420 * 60000)).toDateString()
            },
        };

        // Get youtube channel icon
        await axios.get('https://www.googleapis.com/youtube/v3/channels?part=snippet&id=%27+,' + post.channelId + '+%E2%80%99&fields=items(id%2Csnippet%2Fthumbnails)&key=AIzaSyDF8OacjC8B7ghEJffUYRe8_3-8cOvHN-M')
            .then((res) => {
                let logo = res.data.items[0].snippet.thumbnails.default.url;
                postData.private.logoURL = logo;
            })
            .catch(err => console.log(err));

        // Get a key for a new Post.
        let newPostKey = databaseRef.child('/posts').push().key;
        postData.private.id = newPostKey;
        let updates = {};
        updates = postData;
        console.log(updates);
        let today;
        // databaseRef.child(now) create new parent node with new date
        // if the current date exists, it only will update
        // if not it will create new path with new date
        await databaseRef.child('/posts/' + newPostKey).update(updates)
            .then(() => {
                localStorage.setItem('submissionSuccess', true);
                dispatch(putPost(postData))
            })
            .catch(err => {
                localStorage.setItem('submissionFail', true);
                dispatch(setError(err))
            })
    }
}

export const exitDrop = () => {
    document.body.classList.remove('modal-open');
    return {
        type: actions.EXIT_DROP,
        exit: false,
        modalPost: null
    }
}

export const promotedPost = (post) => {
    return {
        type: actions.PROMOTED_POST,
        promotedPost: post
    }
}



export const openDropAction = (postId) => {
    return async dispatch => {
        try {
            await databaseRef.child('/posts/' + postId).once('value', snapshot => {
                const post = snapshot.val();
                dispatch(openDrop(post));
            })
        }
        catch (err) {
            dispatch(setError(err));
        }
    }
}

export const openDrop = (post) => {
    document.body.classList.add('modal-open');
    return {
        type: actions.OPEN_DROP,
        exit: true,
        modalPost: post
    }
}

export const removePost = (postId) => {
    return async dispatch => {
        try {
            await databaseRef.child('/posts/' + postId).remove();
            await databaseRef.child('/comments/' + postId).remove();
            await databaseRef.child('/likes/' + postId).remove();
        }
        catch (err) {
            dispatch(setError(err));
        }
    }
}

export const editablePost = post => {
    return {
        type: actions.POST_EDITABLE,
        editablePost: post
    }
}



export const editPost = (postId, newPost) => {
    return async dispatch => {
        if (localStorage.getItem('editable')) {
            try {
                // Get youtube channel icon
                await axios.get('https://www.googleapis.com/youtube/v3/channels?part=snippet&id=%27+,' + newPost.channelId + '+%E2%80%99&fields=items(id%2Csnippet%2Fthumbnails)&key=AIzaSyDF8OacjC8B7ghEJffUYRe8_3-8cOvHN-M')
                    .then((res) => {
                        let logo = res.data.items[0].snippet.thumbnails.default.url;
                        newPost.logoURL = logo;
                    })
                    .catch(err => console.log(err));
                let editPostRef = databaseRef.child('/posts/' + postId + '/private');
                await editPostRef.update(newPost);
                localStorage.removeItem('editable');
                localStorage.setItem('submissionSuccess', true);
                dispatch(editablePost(null))
            } catch (error) {
                dispatch(setError(error))
                localStorage.setItem('submissionFail', true);
            }
        }
    }
}



export const setComments = comments => {
    return {
        type: actions.SET_COMMENTS,
        comments: comments
    }
}

export const getComments = (postid) => {
    return async dispatch => {
        try {
            let commentRef = databaseRef.child('/comments/' + postid);
            commentRef.on('value', snapshot => {
                const collection = snapshot.val();
                let comments = [];
                for (let c in collection) {
                    comments.push({ ...collection[c] })
                }
                dispatch(setComments(comments));
                dispatch(getCommentatorsDetails(postid))
            })
        } catch (error) {
            dispatch(setError(error));
        }
    }
}

export const addComment = (post, user, comment) => {
    return async dispatch => {

        try {
            let commentData = {
                public: {
                    likes: 0
                },
                private: {
                    comment: comment,
                    commentId: null,
                    commentator: user.userId,
                    displayName: user.displayName,
                    photoUrl: user.photoURL,
                    timeStamp: new Date((new Date().getTime() + new Date().getTimezoneOffset() * 60000) - (420 * 60000)).getTime(),
                }
            }
            let userRef = databaseRef.child('/users/' + user.userId + '/comments');
            let commentRef = databaseRef.child('/comments/' + post.private.id);
            let newCommentKey = commentRef.push().key;
            commentData.private.commentId = newCommentKey;
            let comments = {};
            comments = commentData;
            commentRef.child(newCommentKey).update(comments);
            let userCommentsUpdate = {};
            userCommentsUpdate[comments.private.commentId] = true;
            userRef.update(userCommentsUpdate)
            let commentCount = 0;
            commentRef.on('value', snapshot => {
                for (let i in snapshot.val()) {
                    commentCount++;
                }
            })
            databaseRef.child('/posts/' + post.private.id + '/public/comments/').set(commentCount);
        } catch (error) {
            dispatch(setError(error))
        }
    }
}

export const removeComment = (postId, commentId) => {
    return async dispatch => {
        try {
            let commentRef = databaseRef.child('/comments/' + postId);
            let commentCount = 0;
            await commentRef.on('value', snapshot => {
                for (let i in snapshot.val()) {
                    commentCount++
                }
            })
            databaseRef.child('/posts/' + postId + '/public').update({ comments: commentCount - 1 });
            databaseRef.child('/comments/' + postId + '/' + commentId).remove();
        
        } catch (error) {
            dispatch(setError(error.message))
        }
    }
}

export const likeComment = (postId, commentId, uid) => {
    return async dispatch => {

        try {
            if (localStorage.getItem('auth')) {
                let likers = {};
                let likersRef = databaseRef.child('/comments/' + postId + '/' + commentId + '/public/likers/');
                likersRef.once('value', snapshot => {
                    let likes = snapshot.val() ? Object.keys(snapshot.val()).length : 0;
                    const userCollection = snapshot.val() ? snapshot.val() : likers;
                    if (!userCollection[uid]) {
                        // likers[uid] = true;
                        likersRef.child(uid).set(true);
                        databaseRef.child('/comments/' + postId + '/' + commentId + '/public/likes/').set(likes + 1 );
                    }
                    else {
                        likersRef.child(uid).remove();
                        databaseRef.child('/comments/' + postId + '/' + commentId + '/public/likes/').set(likes - 1 );
                    }
                })
            }
        } catch (error) {
            console.log(error)
            dispatch(setError(error.message));
        }
    }
}

export const postRating = (postId, uid) => {
    return async dispatch => {
        if (localStorage.getItem('auth')) {
            try {
                let voters = {};
                let userLike = {};
                let votersRef = databaseRef.child('/likes/' + postId);
                let userRef = databaseRef.child('/users/' + uid + '/likes');
                await votersRef.once('value', snapshot => {
                    const userCollection = snapshot.val() ? snapshot.val() : voters;
                    let rating = snapshot.val() ? Object.keys(snapshot.val()).length : 0
                    if (!userCollection[uid]) {
                        let votingData = {
                            voted: true,
                            timeStamp: new Date().getTime()
                        };
                        userLike[postId] = true
                        votersRef.child(uid).update(votingData)
                        databaseRef.child('/posts/' + postId + '/public/rating/').set(rating + 1)
                        userRef.update(userLike)
                    }
                    else {
                        votersRef.child(uid).remove();
                        userRef.child(postId).remove();
                        databaseRef.child('/posts/' + postId + '/public/rating/').set(rating - 1)
                    }
                })
            }
            catch (err) {
                dispatch(setError(err));
            }
        }
        if (!localStorage.getItem('auth')) {
            dispatch(setError('login error'));
        }
    }
}



export const putPost = (post) => {

    return {
        type: actions.PUT_POST,
        valid: true,
        submittedPost: post
    }
}