<template>
  <div></div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  data() {
    return {
      closeOnClick: false,
      dialogFormVisible: false,
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
      loading: false
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser"])
  },
  methods: {
    updateSong() {
      this.loading = true;
      fb.songsCollection
        .doc("asd")
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
    submitSong() {
      this.$refs["songForm"].validate(valid => {
        if (valid) {
          console.log("the song", this.song);
          this.createSong();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["songForm"].resetFields();
    },
    handleMenuClick() {}
  }
};
</script>
