import {
    authRef, providerFacebook, providerGoogle,
    providerGithub, databaseRef, storageRef, storage
} from '../../config/firebase';
import * as actions from '../actions/actionTypes';
import { setError } from './post';


export const authStart = () => {
    return {
        type: actions.AUTH_START
    };
};

export const authSuccess = (userId, email) => {
    return {
        type: actions.AUTH_SUCCESS,
        userId: userId,
        email: email
    };
};



export const imageUpload = (image, uid, displayName) => {
    return async dispatch => {
        // console.log(image, 'image')
        if (image) {
            var uploadTask = storageRef.child('images/users/' + uid + '/' + image.name).put(image);
            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes   
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', function (snapshot) {
                console.log(snapshot)
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                // Handle unsuccessful uploads
                console.log(error);
                dispatch(authFail(error))
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log(downloadURL);
                    dispatch(updateProfileName(displayName, downloadURL));
                });
            });
        }
        else {
            let user = authRef.currentUser;
            dispatch(updateProfileName(displayName, user.photoURL));
        }
    }
}

export const authFail = (error) => {
    return {
        type: actions.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    return dispatch =>
        authRef.signOut()
            .then(() => {
                console.log('Success sign outed');
                localStorage.removeItem('auth');
                dispatch(signout());
            })
            .catch(err => dispatch(authFail(err)));
};

export const signout = () => {
    return {
        type: actions.AUTH_LOGOUT,
        userId: null,
        displayName: null,
        photoURL: null,
        email: null
    };
}

export const onPageLoad = () => {
    return dispatch => {
        authRef.onAuthStateChanged(user => {
            if (user) {
                dispatch(autoSetUserInfo(user.uid, user.email, user.displayName, user.photoURL));
            }
        })
    }

};

export const updateUserProfile = (displayName, photoURL) => {
    return {
        type: actions.AUTH_DETAILS,
        displayName: displayName,
        photoURL: photoURL
    }
}

export const updateProfileName = (displayName, photoURL) => {
    return async dispatch => {
        let user = authRef.currentUser;
        await user.updateProfile({
            displayName: displayName,
            photoURL: photoURL
        })
        dispatch(updateUserProfile(user.displayName, user.photoURL))
        dispatch(updateUserDetails(user));
        console.log(user.displayName, user.photoURL);
    }
}


export const autoSetUserInfo = (userId, email, displayName, photoURL) => {
    return {
        type: actions.AUTH_ON_PAGE_LOAD,
        userId: userId,
        email: email,
        displayName: displayName,
        photoURL: photoURL
    }
}

/*Email sign up/sign in will be set up later*/

export const switchMode = isSignUp => {
    return {
        type: actions.AUTH_SWITCH,
        isSignUp: isSignUp
    }
}

// export const updateUserDetails = () => {
//     return dispatch => {
//         let user = authRef.currentUser;
//         user.updateProfile({
//             displayName: "Jane Q. User",
//             photoURL: "https://example.com/jane-q-user/profile.jpg"
//         }).then(function () {
//             // Update successful.
//         }).catch(function (error) {
//             // An error happened.
//         });
//         dispatch(autoSetUserInfo(user.uid, user.email, user.displayName, user.photoURL))
//     }
// }

// export const authEmailSignup = (email, password) => {

//     return dispatch => {
//         let user = null;
//         dispatch(authStart());
//         authRef.createUserWithEmailAndPassword(email, password)
//             .then(() => {
//                 user = authRef.currentUser;
//             })
//             .then(() => {
//                 user.updateProfile({
//                     displayName: 'diablo',
//                     photoURL: 'https://yt3.ggpht.com/a-/AAuE7mC1lVGxCoei02P969qPNhk999fnMwWDXhpTRw=s240-mo-c-c0xffffffff-rj-k-no'
//                 });
//             })
//             .then(() => {
//                 localStorage.setItem('auth', user.uid);
//                 dispatch(authSuccess(user.uid, user.email, user.displayName, user.photoURL))
//             })
//             .catch(function (error) {
//                 // Handle Errors here.
//                 var errorCode = error.code;
//                 var errorMessage = error.message;
//                 // [START_EXCLUDE]
//                 if (errorCode === 'auth/weak-password') {
//                     alert('The password is too weak.');
//                 } else {
//                     alert(errorMessage);
//                 }
//                 console.log(errorMessage);
//                 dispatch(authFail(error));
//                 // [END_EXCLUDE]
//             });
//         // [END createwithemail]
//     }
// }
export const updateUserDetails = user => {
    return async dispatch => {
        // await databaseRef.child('/users/' + user.uid).once('value', snapshot => {
        //     let userDetails = {
        //         ...snapshot.val(),
        //         displayName: user.displayName,
        //         photoURL: user.photoURL
        //     }
        //     databaseRef.child('/users/' + user.uid).update(userDetails);
        // })
        console.log(user);
        let userDetails = {
            displayName: user.displayName,
            photoUrl: user.photoURL
        }
        await databaseRef.child('/users/' + user.uid).update(userDetails);
        console.log('updateduserDetails');
    }
}

export const authAccountDeleted = () => {
    return {
        type: actions.AUTH_ACCOUNT_DELETED,
    }
}

export const authDeleteAccount = () => {
    return dispatch => {
        let user = authRef.currentUser;
        user.delete().then(function () {
            localStorage.removeItem('auth');
            dispatch(authAccountDeleted());
        }).catch(function (error) {
            console.log(error.message)
            dispatch(setError(error))
        });
    }
}

export const authEmailSignup = (email, password, displayName, image) => {

    return dispatch => {
        dispatch(authStart());
        let user;
        authRef.createUserWithEmailAndPassword(email, password)
            .then(user => {
                dispatch(authSuccess(user.user.uid, user.user.email));
                dispatch(imageUpload(image, user.user.uid, displayName));
                localStorage.setItem('auth', user.user.uid);
            })
            .catch(err => {
                dispatch(authFail(err.message))
            })
        if (user && image === null) {
            dispatch(updateProfileName(displayName, null))
        }
    }
}

export const authEmail = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        if (email) {
            const authData = {
                email: email,
                password: password,
            };
            authRef.signInWithEmailAndPassword(authData.email, authData.password)
                .then(user => {
                    // console.log(user);
                    localStorage.setItem('auth', user.user.uid);
                    dispatch(authSuccess(user.user.uid, user.user.email));
                })
                .catch(err => {
                    console.log(err.message);
                    dispatch(authFail(err.message));
                })
        }
    }
}



export const authGoogle = () => {
    return dispatch => {
        authRef.signInWithPopup(providerGoogle).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            console.log(user);
            localStorage.setItem('auth', user.uid);
            dispatch(authSuccess(user.uid, user.email));
            dispatch(updateUserDetails(user));
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorMessage = error.message;
            console.log(errorMessage);
            // ...
        });
    }
}



export const authGithub = () => {
    return dispatch => {
        // Github Login Handler
        authRef.signInWithPopup(providerGithub)
            .then(function (result) {
                // This gives you a Github Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                console.log(token);
                // The signed-in user info.
                let user = result.user;
                console.log(user);
                localStorage.setItem('auth', user.uid);
                dispatch(authSuccess(user.uid, user.email));
                dispatch(updateUserDetails(user));
                // ...
            }).catch(function (error) {
                // Handle Errors here.
                // var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                // The email of the user's account used.
                // var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                // var credential = error.credential;
                // ...
            });
    }
}

export const authFacebook = () => {
    return dispatch => {

        // Facebook Login Handler
        authRef.signInWithPopup(providerFacebook)
            .then(function (result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                console.log(token);
                // The signed-in user info.
                let user = result.user;
                console.log(user);
                localStorage.setItem('auth', user.uid);
                dispatch(authSuccess(user.uid, user.email));
                // ...
            }).catch(function (error) {
                // Handle Errors here.
                // var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                dispatch(authFail(errorMessage));
                // The email of the user's account used.
                // var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                // var credential = error.credential;
                // ...
            });
    }
}



