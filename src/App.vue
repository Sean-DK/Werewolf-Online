<template>
  <div id="app">
    <router-view/>
    <button class="home-btn" v-on:click="returnHome">🏠</button>
    <div class="bg-mute">
      Music<br>
      <button class="bg-mute-btn" v-on:click="toggleMusic">
        <span v-if="!bgMuted">🔊</span>
        <span v-if="bgMuted">🔈</span>
      </button>
    </div>
    <div class="narr-mute">
      Narrator<br>
      <button class="narr-mute-btn" v-on:click="toggleNarrator">
        <span v-if="!narrMuted">🔊</span>
        <span v-if="narrMuted">🔈</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      backgroundMusic: Audio,
      narratorAudio: Audio,
      bgMuted: true
    }
  },
  computed: {
    narrMuted: function() {
      return this.$store.state.NarratorMute;
    }
  },
  mounted: function() {
    this.backgroundMusic = new Audio(require("@/assets/Audio/menu.mp3"));
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0;
    this.backgroundMusic.play();
  },
  methods: {
    toggleMusic: function() {
      this.bgMuted = !this.bgMuted;
      if (this.bgMuted) {
        this.backgroundMusic.volume = 0;
      }
      else {
        this.backgroundMusic.volume = 1;
      }
    },
    toggleNarrator: function() {
      this.$store.commit("NarratorMute", !this.narrMuted);
    },
    returnHome: function() {
      this.$router.push("/");
      location.reload();
    }
  }
}
</script>

<style>
@media only screen and (max-device-width : 719px) {
body {
  background: #303030;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}

.home-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  border: none;
  font-size: 24px;
  width: 24px;
  padding: 0px;
  padding-bottom: 10px;
  background: inherit;
  border-radius: 50%;
}

.home-btn:active {
  background: #424242;
}

.bg-mute {
  position: absolute;
  left: 10px;
  bottom: 10px;
  border-radius: 10px;
  font-size: 8px;
  z-index: 2;
}

.bg-mute-btn {
  border: none;
  font-size: 24px;
  width: 24px;
  padding: 0px;
  padding-bottom: 5px;
  background: inherit;
  border-radius: 50%;
  text-align: left;
}

.bg-mute:active {
  background: #424242;
}

.narr-mute {
  position: absolute;
  left: 50px;
  bottom: 10px;
  border-radius: 10px;
  font-size: 8px;
  z-index: 2;
}

.narr-mute-btn {
  border: none;
  font-size: 24px;
  width: 26px;
  padding: 0px;
  padding-bottom: 5px;
  background: inherit;
  border-radius: 50%;
  text-align: left;
}

.narr-mute:active {
  background: #424242;
}
}

@media only screen and (min-device-width : 720px) {
body {
  background: #303030;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}

.home-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  border: none;
  font-size: 48px;
  width: 68px;
  padding: 0px;
  padding-bottom: 10px;
  background: inherit;
  border-radius: 50%;
}

.home-btn:hover {
  background: #424242;
}

.bg-mute {
  position: absolute;
  left: 10px;
  bottom: 10px;
  border-radius: 10px;
  z-index: 2;
}

.bg-mute-btn {
  border: none;
  font-size: 48px;
  width: 66px;
  padding: 0px;
  padding-bottom: 5px;
  background: inherit;
  border-radius: 50%;
  text-align: left;
}

.bg-mute:hover {
  background: #424242;
}

.narr-mute {
  position: absolute;
  left: 100px;
  bottom: 10px;
  border-radius: 10px;
  z-index: 2;
}

.narr-mute-btn {
  border: none;
  font-size: 48px;
  width: 66px;
  padding: 0px;
  padding-bottom: 5px;
  border-radius: 50%;
  background: inherit;
  text-align: left;
}

.narr-mute:hover {
  background: #424242;
}
}
</style>
