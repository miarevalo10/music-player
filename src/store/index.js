import Vue from "vue";
import Vuex from "vuex";
const fb = require("@/firebaseConfig.js");

Vue.use(Vuex);

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    console.log("USER", user);
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit("setUserProfile", doc.data());
    });

    // realtime updates from our songs collection
    fb.songsCollection
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
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    currentSong: null,
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
    setPlaylists(state, val) {
      if (val) {
        // make sure not to add duplicates
        if (!state.playlists.some(x => x.id === val.id)) {
          state.playlis.unshift(val);
        }
      } else {
        state.playlists = [];
      }
    }
  }
});
