<template>
  <div id="playlists" class="main-container">
    <h1>Your playlists</h1>
    <div v-if="playlists">
      <el-input v-model="search" placeholder="Search by name" />
      <el-table
        :data="
          playlists.filter(
            data =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        class="songs-table"
        highlight-current-row
        @current-change="handleCurrentChange"
        ref="playlistsTable"
        empty-text="No playlists, add a song to a new playlist to create one"
      >
        <el-table-column prop="name" label="Name"> </el-table-column>

        <el-table-column width="100">
          <el-button icon="el-icon-arrow-right" round></el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapState(["playlists"])
  },
  methods: {
    handleCurrentChange(playlist) {
      this.$store.commit("setCurrentPlaylist", playlist);
      this.$router.push({
        name: "playlistDetails",
        params: { id: playlist.id }
      });
    }
  }
};
</script>
