import * as actions from '../actions/actionTypes';


const initialState = {
    posts: [],
    error: false,
    loading: true,
    submittedPost: null,
    exitDrop: false,
    dates: null,
    modalPost: null,
    editablePost: null,
    promotedPost: null,
    comments: null,
    commentators: {},
    likedpostIds: {},
    userLikedPosts: [],
    likedChannelsDetails: [],
    risingStars: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_POSTS:
            return {
                ...state,
                posts: action.posts,
                loading: action.loading
            }
        case actions.SET_ERROR:
            return {
                ...state,
                error: action.error
            }
        case actions.PUT_POST:
            return {
                ...state,
                submittedPost: action.submittedPost,
            }
        case actions.EXIT_DROP:
            return {
                ...state,
                exitDrop: action.exit,
                modalPost: null
            }
        case actions.OPEN_DROP:
            return {
                ...state,
                exitDrop: action.exit,
                modalPost: action.modalPost
            }
        case actions.SET_DATES:
            return{
                ...state,
                dates: action.dates
            }
        case actions.POST_EDITABLE:
            return{
                ...state,
                editablePost: action.editablePost
            }
        case actions.PROMOTED_POST:
            return{
                ...state,
                promotedPost: action.promotedPost
            }
        case actions.SET_COMMENTS:
            return{
                ...state,
                comments: action.comments
            }
        case actions.SET_COMMENTATORS_DETAILS:
            return{
                ...state,
                commentators: action.commentators
            }
        case actions.USER_LIKED_POSTS:
            return{
                ...state,
                likedpostIds: action.userPostsIds
            }
        case actions.SET_LIKED_CHANNEL_DETAILS:
            return{
                ...state,
                likedChannelsDetails: action.likedChannels
            }
        case actions.SET_RISING_STARS:
            return{
                ...state,
                risingStars: action.risingStars
            }
        default:
            return state;
    }
}


export default reducer;