import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';



//Firebase Project Configuration
var config = {
    apiKey: "AIzaSyBBGXiVM43csgWpmzqvs3N7-Gx_zZuZ57M",
    authDomain: "project-quality.firebaseapp.com",
    databaseURL: "https://project-quality.firebaseio.com",
    projectId: "project-quality",
    storageBucket: "project-quality.appspot.com",
    messagingSenderId: "370658469136"
  };

  

  firebase.initializeApp(config);
  export const authRef = firebase.auth();

  export const databaseRef = firebase.database().ref();
  export const storageRef = firebase.storage().ref();
  export const storage = firebase.storage;

  export const providerFacebook = new firebase.auth.FacebookAuthProvider();
  export const providerGoogle = new firebase.auth.GoogleAuthProvider()
  export const providerGithub = new firebase.auth.GithubAuthProvider();
  
  export const serverTime = firebase.database.ServerValue.TIMESTAMP;
