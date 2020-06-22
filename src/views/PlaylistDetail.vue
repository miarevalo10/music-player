<template>
  <div id="playlist-detail" class="main-container">
    <el-page-header
      v-if="currentPlaylist"
      @back="goBack"
      title="Back to playlists"
      :content="currentPlaylist.name"
    >
    </el-page-header>
    <div v-if="songs">
      <el-table
        :data="
          songs.filter(
            data =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        empty-text="No songs"
      >
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-video-play"
              @click="playSong(songs[scope.$index])"
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="Title"></el-table-column>
        <el-table-column prop="artist" label="Artist"></el-table-column>
        <el-table-column prop="album" label="Album"></el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              content="Remove from playlist"
              placement="bottom-end"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDeleteSong(songs[scope.$index])"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="Remove song"
      :visible.sync="deleteDialogVisible"
      width="40%"
    >
      <span v-if="currentSong">
        Are you sure you want to remove
        <i>{{ this.currentSong.title }}</i> by
        <i>{{ this.currentSong.artist }} </i>from this playlist ?
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" round>Cancel</el-button>
        <el-button type="danger" @click="deleteSong" :loading="loading" round
          >Remove</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");

export default {
  data() {
    return {
      search: "",
      songs: [],
      deleteDialogVisible: false,
      currentSong: null,
      loading: false
    };
  },
  created() {
    this.currentPlaylist ? this.fetchSongs() : this.fetchPlaylistAndSongs();
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "currentPlaylist"])
  },
  methods: {
    goBack() {
      this.$router.push({ name: "playlists" });
    },
    playSong(song) {
      this.currentSong = song;
      this.$store.commit("setCurrentSong", this.currentSong);
    },
    handleDeleteSong(song) {
      this.deleteDialogVisible = true;
      this.currentSong = song;
    },
    deleteSong() {
      this.loading = true;
      console.log("cuurent song", this.currentSong);
      fb.playlistsCollection
        .doc("FR5u9cb8MbAqhgDMELOf")
        .update({
          songs: fb.fieldValue.arrayRemove(this.currentSong.id)
        })
        .then(() => {
          console.log("Document successfully deleted!");
          this.deleteDialogVisible = false;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    fetchSongs() {
      this.currentPlaylist.songs.forEach(songId => {
        fb.songsCollection
          .doc(songId)
          .get()
          .then(doc => {
            if (doc.exists) {
              this.songs.push(doc.data());
            } else {
              console.log("No such document!");
            }
          })
          .catch(error => {
            console.log("Error getting document:", error);
          });
      });
    },
    fetchPlaylistAndSongs() {
      fb.playlistsCollection
        .doc(this.$route.params.id)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.$store.commit("setCurrentPlaylist", doc.data());
            this.fetchSongs();
          } else {
            console.log("No such document!");
          }
        })
        .catch(error => {
          console.log("Error getting document:", error);
        });
    }
  }
};
</script>
