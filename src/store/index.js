import Vue from "vue";
import Vuex from "vuex";
const fb = require("@/firebaseConfig.js");

Vue.use(Vuex);

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit("setUserProfile", doc.data());
    });

    // realtime updates from our songs collection
    fb.songsCollection
      .where("userId", "==", user.uid)
      .orderBy("createdOn", "desc")
      .onSnapshot(querySnapshot => {
        // check if created by currentUser

        let songsArray = [];

        querySnapshot.forEach(doc => {
          let song = doc.data();
          song.id = doc.id;
          songsArray.push(song);
        });

        store.commit("setSongs", songsArray);
      });

    fb.playlistsCollection
      .where("userId", "==", user.uid)
      .orderBy("createdOn", "desc")
      .onSnapshot(
        querySnapshot => {
          // check if created by currentUser

          let playlistsArray = [];

          querySnapshot.forEach(doc => {
            let playlist = doc.data();
            playlist.id = doc.id;
            playlistsArray.push(playlist);
          });

          store.commit("setPlaylists", playlistsArray);
        },
        error => console.error("there was an error", error)
      );
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    currentSong: null,
    currentPlaylist: null,
    userProfile: {},
    songs: [],
    playlists: []
  },
  actions: {
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setSongs", null);
      commit("setPlaylists", null);
      commit("setCurrentSong", null);
      commit("setCurrentPlaylist", null);
    },
    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit("setUserProfile", res.data());
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setSongs(state, val) {
      if (val) {
        state.songs = val;
      } else {
        state.songs = [];
      }
    },
    setCurrentSong(state, val) {
      state.currentSong = val;
    },
    setCurrentPlaylist(state, val) {
      state.currentPlaylist = val;
    },
    setPlaylists(state, val) {
      if (val) {
        state.playlists = val;
      } else {
        state.playlists = [];
      }
    }
  }
});
