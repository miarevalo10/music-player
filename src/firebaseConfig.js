import * as firebase from "firebase/app";
import "firebase/firestore";

// firebase init goes here
const config = {
  apiKey: "AIzaSyCUm0WqIVDntNDzM-va26PLge3A-x62C2A",
  authDomain: "music-player-78833.firebaseapp.com",
  databaseURL: "https://music-player-78833.firebaseio.com",
  projectId: "music-player-78833",
  storageBucket: "music-player-78833.appspot.com",
  messagingSenderId: "515956915446",
  appId: "1:515956915446:web:0e45bd66b6e32d78e2c0d7"
};

firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const fieldValue = firebase.firestore.FieldValue;

const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase collections
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const playlistsCollection = db.collection("playlists");

export {
  db,
  auth,
  fieldValue,
  currentUser,
  usersCollection,
  songsCollection,
  playlistsCollection
};
