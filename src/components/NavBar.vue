<template>
  <el-menu id="navBar" default-active="1" mode="horizontal">
    <el-menu-item style="flex-grow: 1" index="1" @click="goTo('/songs')"
      >Songs</el-menu-item
    >
    <el-menu-item style="flex-grow: 1" index="2" @click="goTo('/playlists')"
      >Playlists</el-menu-item
    >

    <el-popconfirm
      style="flex-grow: 1"
      confirmButtonText="Log out"
      cancelButtonText="Cancel"
      icon="el-icon-info"
      iconColor="red"
      @onConfirm="logout"
      title="Are you sure you want to log out?"
    >
      <!-- @click=" -->
      <a slot="reference">Logout</a>
    </el-popconfirm>
  </el-menu>
</template>

<script>
const fb = require("../firebaseConfig.js");
export default {
  name: "NavBar",

  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    },
    goTo(path) {
      if (this.$route.path !== path) this.$router.push(path);
    }
  }
};
</script>
