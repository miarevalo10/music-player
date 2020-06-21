<template>
  <div id="songs">
    <div class="top-row">
      <h1>Your songs</h1>

      <el-button type="primary" @click="dialogFormVisible = true" round
        >Add Song</el-button
      >

      <el-dialog
        :title="!isEditForm ? 'Add Song' : 'Edit Song'"
        :visible.sync="dialogFormVisible"
        @close="resetForm"
        width="40%"
      >
        <el-form :model="song" :rules="rules" ref="songForm" id="form">
          <el-form-item
            label="Title"
            :label-width="formLabelWidth"
            prop="title"
          >
            <el-input v-model="song.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="Artist"
            :label-width="formLabelWidth"
            prop="artist"
          >
            <el-input v-model="song.artist" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="Album"
            :label-width="formLabelWidth"
            prop="album"
          >
            <el-input v-model="song.album" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" round>Cancel</el-button>
          <el-button type="primary" @click="submitSong" :loading="loading" round
            >{{ !isEditForm ? "Add Song" : "Edit Song" }}
          </el-button>
        </span>
      </el-dialog>
    </div>

    <div v-if="songs.length">
      <el-table
        :data="songs"
        style="width: 100%; height: 100%"
        @current-change="handleCurrentChange"
        ref="songsTable"
      >
        <el-table-column width="80">
          <el-button
            type="text"
            icon="el-icon-video-play"
            @click="playSong"
          ></el-button>
        </el-table-column>

        <el-table-column prop="title" label="Title"> </el-table-column>
        <el-table-column prop="artist" label="Artist"> </el-table-column>
        <el-table-column prop="album" label="Album"> </el-table-column>
        <el-table-column width="50">
          <el-dropdown
            split-button
            type="text"
            trigger="click"
            @command="handleCommand"
          >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" command="addToPlaylist"
                >Add to playlist</el-dropdown-item
              >
              <el-dropdown-item icon="el-icon-edit" command="edit"
                >Edit Song</el-dropdown-item
              >
              <el-dropdown-item icon="el-icon-delete" command="delete"
                >Delete</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-table-column>
        <el-table-column width="50"> </el-table-column>
      </el-table>
    </div>

    <div v-else>
      <p class="no-results">There are currently no songs</p>
    </div>
    <el-dialog
      title="Delete song"
      :visible.sync="deleteDialogVisible"
      width="40%"
    >
      <span v-if="currentSong"
        >Are you sure you want to delete <i>{{ this.currentSong.title }}</i> by
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
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  data() {
    return {
      closeOnClick: false,
      dialogFormVisible: false,
      deleteDialogVisible: false,
      song: {
        title: "",
        artist: "",
        album: ""
      },
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
        ]
      },
      formLabelWidth: "120px",
      loading: false,
      isEditForm: false,
      currentSong: null
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "songs"])
  },
  methods: {
    updateSong() {
      this.loading = true;
      fb.songsCollection
        .doc(this.currentSong.id)
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
          userId: this.currentUser.uid,
          userName: "Maria"
        })
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
    deleteSong() {
      this.loading = true;
      fb.songsCollection
        .doc(this.currentSong.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.deleteDialogVisible = false;
          this.loading = false;
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
          this.loading = false;
        });
    },
    submitSong() {
      this.$refs["songForm"].validate(valid => {
        if (valid) {
          console.log("the song", this.song);
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
    handleCommand(command) {
      switch (command) {
        case "addToPlaylist":
          break;
        case "edit":
          this.handleEditSong();
          break;
        case "delete":
          this.handleDeleteSong();
          break;
      }
    },
    handleEditSong() {
      this.song = this.currentSong;
      this.isEditForm = true;
      this.dialogFormVisible = true;
    },
    handleDeleteSong() {
      this.deleteDialogVisible = true;
    },
    handleCurrentChange(val) {
      this.currentSong = { ...val };
    },
    playSong() {
      console.log("play song");
      this.$store.commit("setCurrentSong", this.currentSong);
      console.log("finished");
    }
  }
};
</script>
