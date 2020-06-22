<template>
  <transition name="fade" mode="out-in">
    <el-card class="box-card" v-if="currentSong" id="player">
      <p>{{ this.currentSong.title }} - {{ this.currentSong.artist }}</p>
      <audio
        ref="player"
        :src="this.currentSong.url"
        @loadedmetadata="onLoadedMetadata"
      ></audio>
      <div class="player-container">
        <el-button
          @click="togglePlay"
          class="play-button"
          v-bind:class="{
            'el-icon-video-play': !isPlaying,
            'el-icon-video-pause': isPlaying
          }"
          :loading="loading"
          circle
        >
        </el-button>
        <p>{{ currentTime }}</p>
        <input
          type="range"
          class="slider"
          v-model="progressBarValue"
          v-on:change="handleTouchProgressBar"
        />
        <p>{{ totalTime }}</p>
        <i class="el-icon-headset music-icon large-icon"></i>
        <input type="range" v-model="volume" v-on:change="handleTouchVolume" />
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
      progressBarValue: 0,
      currentTime: "0:00",
      totalTime: "",
      isPlaying: false,
      timer: "",
      loading: true,
      volume: 0
    };
  },
  computed: {
    ...mapState(["currentSong"])
  },
  methods: {
    togglePlay() {
      this.isPlaying ? this.pause() : this.play();
    },
    play() {
      this.$refs.player.play();
      this.isPlaying = true;
    },
    pause() {
      this.$refs.player.pause();
      this.isPlaying = false;
    },
    volumeUp() {
      this.$refs.player.volume += this.$refs.player.volume < 1 ? 0.1 : 0;
    },
    volumeDown() {
      this.$refs.player.volume -= this.$refs.player.volume > 0 ? 0.1 : 0;
    },
    toMin(sec) {
      const result = Math.round(sec);
      let resultStr = "0:00" + result;
      let newSec = (result % 60).toString();
      if (+newSec < 10) {
        newSec = "0" + newSec;
      }
      if (sec > 59) {
        let min = Math.floor(result / 60).toString();
        if (+min < 10) {
          min = "0" + min;
        }
        resultStr = min + ":" + newSec;
      } else {
        resultStr = "0:" + newSec;
      }
      return resultStr;
    },
    onLoadedMetadata() {
      this.loading = false;
      this.play();
      this.totalTime = this.toMin(this.$refs.player.duration);
      this.updateValue();
      this.volume = this.$refs.player.volume * 100;
    },
    updateValue() {
      this.progressBarValue =
        (this.$refs.player.currentTime / this.$refs.player.duration) * 100;
      this.currentTime = this.toMin(this.$refs.player.currentTime);

      this.timer = setInterval(() => {
        if (this.$refs.player) {
          this.progressBarValue =
            (this.$refs.player.currentTime / this.$refs.player.duration) * 100;
          this.currentTime = this.toMin(this.$refs.player.currentTime);
        }
      }, 1000);
    },
    handleTouchProgressBar(val) {
      this.progressBarValue = val.target.value;
      const newTime = this.$refs.player.duration * (val.target.value / 100);
      this.$refs.player.currentTime = newTime;
    },
    handleTouchVolume(val) {
      this.volume = val.target.value;
      this.$refs.player.volume = val.target.value / 100;
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  },
  watch: {
    currentSong: {
      deep: true,
      handler() {
        this.progressBarValue = 0;
        this.currentTime = "0:00";
        this.totalTime = "";
        this.isPlaying = false;
        this.loading = true;
      }
    }
  }
};
</script>
