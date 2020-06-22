<template>
  <div id="songs" class="main-container">
    <div class="top-row">
      <h1>Your songs</h1>
      <el-button type="primary" @click="dialogFormVisible = true" round
        >Add Song</el-button
      >
    </div>

    <el-input v-model="search" placeholder="Search by title" />

    <!-- Songs table -->
    <el-table
      :data="
        songs.filter(
          data =>
            !search || data.title.toLowerCase().includes(search.toLowerCase())
        )
      "
      class="songs-table"
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
      <el-table-column align="right">
        <!-- Edit, add to playlist and delete buttons -->
        <template slot-scope="scope">
          <div class="actions">
            <el-tooltip class="item" content="Edit song" placement="bottom-end">
              <el-button
                icon="el-icon-edit"
                @click="handleEditSong(songs[scope.$index])"
                circle
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              content="Add to playlist"
              placement="bottom-end"
            >
              <el-button
                icon="el-icon-plus"
                @click="handleAddToPlaylist(songs[scope.$index])"
                circle
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              content="Delete song"
              placement="bottom-end"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDeleteSong(songs[scope.$index])"
                circle
              >
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="50"></el-table-column>
    </el-table>

    <!-- Add song dialog -->
    <el-dialog
      :title="!isEditForm ? 'Add Song' : 'Edit Song'"
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      width="40%"
    >
      <el-form
        :model="song"
        :rules="rules"
        ref="songForm"
        id="form"
        label-position="top"
      >
        <el-form-item
          style="padding:0"
          label="Title"
          :label-width="formLabelWidth"
          prop="title"
        >
          <el-input
            v-model="song.title"
            autocomplete="off"
            placeholder="Daydreaming"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Artist"
          :label-width="formLabelWidth"
          prop="artist"
        >
          <el-input
            v-model="song.artist"
            autocomplete="off"
            placeholder="Radiohead"
          ></el-input>
        </el-form-item>
        <el-form-item label="Album" :label-width="formLabelWidth" prop="album">
          <el-input
            v-model="song.album"
            autocomplete="off"
            placeholder="A moon shaped pool"
          ></el-input>
        </el-form-item>
        <el-form-item label="Url" :label-width="formLabelWidth" prop="url">
          <el-input
            v-model="song.url"
            autocomplete="off"
            placeholder="https://music.com/cello82.mp3"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" round>Cancel</el-button>
        <el-button
          type="primary"
          @click="submitSong"
          :loading="loading"
          round
          >{{ !isEditForm ? "Add Song" : "Edit Song" }}</el-button
        >
      </span>
    </el-dialog>

    <!-- Delete song dialog -->
    <el-dialog
      title="Delete song"
      :visible.sync="deleteDialogVisible"
      width="40%"
    >
      <span v-if="currentSong">
        Are you sure you want to delete
        <i>{{ this.currentSong.title }}</i> by
        <i>{{ this.currentSong.artist }}</i
        >?
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" round>Cancel</el-button>
        <el-button type="danger" @click="deleteSong" :loading="loading" round
          >Delete</el-button
        >
      </span>
    </el-dialog>

    <!-- Add song to playlist dialog -->
    <el-dialog
      title="Add to playlist"
      :visible.sync="addToPlaylistDialogVisible"
      width="40%"
    >
      <p>Add this song to a new playlist</p>
      <el-input
        v-model="newPlaylistName"
        autocomplete="off"
        placeholder="New playlist name"
      ></el-input>
      <div v-if="playlists.length > 0" class="playlist-list">
        <p>Or select one of your playlists</p>
        <el-table
          :data="playlists"
          :show-header="false"
          @selection-change="handlePlaylistsSelection"
          empty-text="There are no playlists"
          style="margin-top: 0"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column property="name"></el-table-column>
        </el-table>
      </div>
      <div class="error-msg" v-if="showAddPlaylistError">
        <p>You must select or create a playlist</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addToPlaylistDialogVisible = false" round
          >Cancel</el-button
        >
        <el-button
          type="primary"
          @click="addSongToPlaylist"
          :loading="loading"
          round
          >Add to playlist</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";
var validateMp3Url = (rule, value, callback) => {
  const urlReg = /^(https?|ftp|file):\/\/(www.)?(.*?)\.(mp3)$/;
  if (value === "") {
    callback(new Error("Please input an url"));
  } else if (value.match(urlReg) === null) {
    callback(new Error("Please input a valid mp3 url"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      closeOnClick: false,
      dialogFormVisible: false,
      deleteDialogVisible: false,
      addToPlaylistDialogVisible: false,
      showAddPlaylistError: false,
      song: {
        title: "",
        artist: "",
        album: "",
        url: ""
      },
      newPlaylistName: "",
      rules: {
        title: [
          {
            required: true,
            message: "Please input a title",
            trigger: "blur"
          }
        ],
        album: [
          {
            required: true,
            message: "Please input an album",
            trigger: "blur"
          }
        ],
        artist: [
          {
            required: true,
            message: "Please input an artist",
            trigger: "blur"
          }
        ],
        url: [{ required: true, validator: validateMp3Url, trigger: "blur" }]
      },
      formLabelWidth: "120px",
      loading: false,
      isEditForm: false,
      currentSong: null,
      play: false,
      search: "",
      selectedPlaylists: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "songs", "playlists"])
  },
  methods: {
    updateSong() {
      this.loading = true;
      fb.songsCollection
        .doc(this.song.id)
        .set(
          {
            ...this.song
          },
          { merge: true }
        )
        .then(() => {
          this.song = {};
          this.resetForm();
          this.dialogFormVisible = false;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    createSong() {
      this.loading = true;
      fb.songsCollection
        .add({
          ...this.song,
          createdOn: new Date(),
          userId: this.currentUser.uid
        })
        .then(() => {
          this.song = {};
          this.resetForm();
          this.dialogFormVisible = false;
          this.loading = false;
          this.$message("New song added");
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    deleteSong() {
      this.loading = true;
      fb.songsCollection
        .doc(this.currentSong.id)
        .delete()
        .then(() => {
          this.deleteDialogVisible = false;
          this.loading = false;
          this.$message("Song deleted succesfully");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
          this.loading = false;
        });
    },
    submitSong() {
      this.$refs["songForm"].validate(valid => {
        if (valid) {
          this.isEditForm ? this.updateSong() : this.createSong();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["songForm"].resetFields();
      this.song = {
        title: "",
        artist: "",
        album: ""
      };
    },
    handleEditSong(songToEdit) {
      this.song = { ...songToEdit };
      this.isEditForm = true;
      this.dialogFormVisible = true;
    },
    handleDeleteSong(song) {
      this.deleteDialogVisible = true;
      this.currentSong = song;
    },
    handleAddToPlaylist(song) {
      this.addToPlaylistDialogVisible = true;
      this.currentSong = song;
    },
    handleCurrentChange(val) {
      this.currentSong = { ...val };
    },
    playSong(song) {
      this.currentSong = song;
      this.$store.commit("setCurrentSong", this.currentSong);
    },
    handlePlaylistsSelection(val) {
      this.selectedPlaylists = val;
    },
    async addSongToPlaylist() {
      this.loading = true;
      if (this.newPlaylistName !== "") {
        this.showAddPlaylistError = false;
        await fb.playlistsCollection.add({
          name: this.newPlaylistName,
          createdOn: new Date(),
          userId: this.currentUser.uid,
          songs: [this.currentSong.id]
        });
        this.addToPlaylistDialogVisible = false;
        this.$message("Song added to playlist successfully");
      } else if (this.selectedPlaylists.length > 0) {
        this.showAddPlaylistError = false;
        this.selectedPlaylists.forEach(async playlist => {
          await fb.playlistsCollection.doc(playlist.id).update({
            songs: fb.fieldValue.arrayUnion(this.currentSong.id)
          });
        });
        this.addToPlaylistDialogVisible = false;
        this.$message("Song added to playlist successfully");
      } else {
        this.showAddPlaylistError = true;
      }
      this.loading = false;
    }
  }
};
</script>
