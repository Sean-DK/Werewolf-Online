<template>
  <div class="home">
    <h1 id="title">Werewolf Online</h1>
    <h2 id="create" v-on:click="onUnload('create')">Create</h2>
    <h2 id="join" v-on:click="onUnload('join')">Join</h2>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => {
    return {
      loaded: Boolean
    }
  },
  mounted: function () {
    this.loaded = false
    setTimeout(this.onLoad, 1);
  },
  methods: {
    onLoad: async function() {
      if (!this.loaded) {
        document.getElementById("title").style.opacity = 1;
        await this.sleep(300);
        document.getElementById("create").style.opacity = 0.5;
        document.getElementById("join").style.opacity = 0.5;
        this.loaded = true;
      }
    },
    onUnload: async function(route) {
      if (this.loaded) {
        this.loaded = false;
        document.getElementById(route).style.background = "#545454";
        document.getElementById("create").style.opacity = 0;
        document.getElementById("join").style.opacity = 0;
        document.getElementById("title").style.opacity = 0;
        await this.sleep(1000);
        this.$router.push("/" + route);
      }
    }
  }
}
</script>

<style scoped>
@media only screen and (max-device-width : 719px) {
.home {
  user-select: none;
}

h1 {
  margin-top: 40%;
  font-size: 48px;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

h2 {
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.7s ease-in-out;
}

h2:active {
  background: #424242;
}
}

@media only screen and (min-device-width : 720px) {
.home {
  user-select: none;
}

h1 {
  margin-top: 10%;
  font-size: 72px;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

h2 {
  font-size: 48px;
  opacity: 0;
  transition: opacity 0.7s ease-in-out;
}

h2:hover {
  background: #424242;
}
}
</style>
