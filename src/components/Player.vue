<template>
  <transition name="fade" mode="out-in">
    <el-card class="box-card" v-if="currentSong" id="player">
      <h2>{{ this.currentSong.title }}</h2>
      <audio
        ref="player"
        src="https://firebasestorage.googleapis.com/v0/b/music-player-78833.appspot.com/o/Black%20Eyed%20Peas%2C%20El%20Alfa%20-%20NO%20MAN%CC%83ANA%20(Official%20Music%20Video).mp3?alt=media&token=34a6eea3-e173-4f57-ba8a-4916450204dd"
      ></audio>
      <div>
        <el-button @click="play" icon="el-icon-video-play"> </el-button>
        <el-button @click="pause" icon="el-icon-video-pause"> </el-button>
        <el-slider v-model="value" range :marks="marks"> </el-slider>
        <el-button @click="volumeUp">
          Vol +
        </el-button>
        <el-button @click="volumeDown">
          Vol -
        </el-button>
      </div>
    </el-card>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Player",
  data() {
    return {
      value: [0, 100],
      marks: {
        0: "0:00",
        100: "0:00"
      }
    };
  },
  mounted() {
    if (this.$refs.player) {
      this.marks = { 100: "100" };
    }
  },
  computed: {
    ...mapState(["currentSong"])
  },
  methods: {
    play() {
      console.log(this.currentSong);
      this.$refs.player.play();
    },
    pause() {
      this.$refs.player.pause();
    },
    volumeUp() {
      this.$refs.player.volume += this.$refs.player.volume < 1 ? 0.1 : 0;
    },
    volumeDown() {
      this.$refs.player.volume -= this.$refs.player.volume > 0 ? 0.1 : 0;
    }
  }
};
</script>
