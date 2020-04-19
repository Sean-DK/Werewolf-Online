<template>
  <div class="lobby">
    <h2>Room Code:<br></h2>
    <h1>{{ code }}</h1>
    <ul>
      <li v-for="(member, index) in members" :key=index>
        <span v-if="index==0">♔</span>
        {{ member }}
      </li>
    </ul>
    <br>
    <button :disabled="members.length < 3" v-if="isHost" v-on:click="onUnload()">Start Game</button>
    <h3 v-if="!isHost">Waiting for host...</h3>
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  data: () => {
    return {
      refreshID: Number,
      loaded: Boolean,
      hasStarted: false
    }
  },
  computed: {
    members: function() {
      return this.$store.state.Lobby.Members;
    },
    code: function() {
      return this.$store.state.Lobby.Code;
    },
    isHost: function() {
      return this.$store.state.Player.isHost;
    }
  },
  mounted: function () {
    this.loaded = false;
    this.hasStarted = false;
    setTimeout(this.onLoad, 1);
  },
  methods: {
    onLoad: async function() {
      if (!this.loaded) {
        document.getElementsByClassName("lobby")[0].style.opacity = 1;
        this.refreshID = setInterval(this.refresh, 2000);
        await this.sleep(2000);
        this.loaded = true;
      }
    },
    onUnload: async function() {
      if (this.loaded) {
        this.axios.post("https://werewolf-functions.azurewebsites.net/api/StartGame", {
          lobbyGuid: this.$store.state.Lobby.GUID
        })
        .then(() => {
          // Do nothing on success, game start is handled in the refresh() method
        }, error => {
          alert("Error starting game, please try creating a new lobby.");
          console.log(error);
        });
      }
    },
    refresh: async function() {
      this.axios.get("https://werewolf-functions.azurewebsites.net/api/RefreshLobby?lobbyGuid=" + this.$store.state.Lobby.GUID)
      .then(response => {
        this.$store.commit("LobbyMembers", response.data.members);
        this.hasStarted = response.data.hasStarted;
        if (this.hasStarted) {
          clearInterval(this.refreshID);
          this.$router.push("/roles");
        }
      });
    }
  }
}
</script>

<style scoped>
@media only screen and (max-device-width : 719px) {
.lobby {
  transition: opacity 2s ease-in;
  opacity: 0;
}

h2 {
  margin-top: 40%;
}

ul {
  font-size: 24px;
  list-style: none;
  padding: 0px;
  margin: auto;
  width: 200px;
  height: 180px;
  background: #424242;
}

li {
  padding: 0;
  background: #212121;
  border: 1px solid #000000;
  white-space: pre;
}

button {
  border-radius: 5px;
  margin-top: 20px;
  font-size: 20px;
  border: none;
  background: #646464;
}
}

@media only screen and (min-device-width : 720px) {
.lobby {
  transition: opacity 2s ease-in;
  opacity: 0;
}

h2 {
  margin-top: 10%;
}

ul {
  font-size: 24px;
  list-style: none;
  padding: 0px;
  margin: auto;
  width: 200px;
  height: 180px;
  background: #424242;
}

li {
  padding: 0;
  background: #212121;
  border: 1px solid #000000;
  white-space: pre;
}

button {
  border-radius: 5px;
  margin-top: 20px;
  font-size: 20px;
  border: none;
  background: #646464;
}
}
</style>
