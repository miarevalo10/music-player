<template>
  <div>
    <NavBar />

    <router-view class="transition"></router-view>

    <Player />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import Player from "@/components/Player";

export default {
  name: "Home",
  components: {
    NavBar,
    Player
  }
};
</script>
