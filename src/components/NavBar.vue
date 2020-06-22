<template>
  <el-menu
    id="navBar"
    :default-active="activeLink"
    mode="horizontal"
    :router="true"
  >
    <!-- @click="goTo('/songs')" -->

    <el-menu-item style="flex-grow: 2" index="/songs">Songs</el-menu-item>
    <el-menu-item style="flex-grow: 2" index="/playlists"
      >Playlists</el-menu-item
    >
    <div style="flex-grow: 1">
      <div class="profile-container">
        <p class="profile">{{ this.userProfile.name }}</p>
        <el-tooltip class="item" content="Log out" placement="bottom-end">
          <el-popconfirm
            confirmButtonText="Log out"
            cancelButtonText="Cancel"
            icon="el-icon-info"
            iconColor="red"
            @onConfirm="logout"
            title="Are you sure you want to log out?"
          >
            <a slot="reference" class="profile" style="float:right">
              <i class="el-icon-switch-button"></i
            ></a>
          </el-popconfirm>
        </el-tooltip>
      </div>
    </div>
  </el-menu>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      activeLink: "/songs"
    };
  },
  computed: {
    ...mapState(["userProfile"])
  },
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
  },
  mounted() {
    this.activeLink = this.$route.path;
  },
  watch: {
    $route(to) {
      this.activeLink = to.path;
    }
  }
};
</script>
