<template>
  <div class="create">
    <h1 id="nickname">Nickname ({{nickname.length}}/12)</h1>
    <input type="text" maxlength="12" v-model="nickname"/>
    <br>
    <button :disabled="nickname.length < 1" v-on:click="onUnload('lobby')">Submit</button>
    <br>
    <button v-on:click="onUnload('home')">Exit</button>
  </div>
</template>

<script>
export default {
  name: 'Create',
  data: () => {
    return {
      loaded: Boolean,
      nickname: String
    }
  },
  mounted: function () {
    this.loaded = false;
    this.nickname = "";
    setTimeout(this.onLoad, 1);
  },
  methods: {
    onLoad: async function() {
      if (!this.loaded) {
        document.getElementsByClassName("create")[0].style.opacity = 1;
        await this.sleep(1000);
        this.loaded = true;
      }
    },
    onUnload: async function(route) {
      if (this.loaded) {
        this.loaded = false;
        if (route === "lobby")
        {
          document.body.style.cursor = "progress";
          this.axios.post("https://werewolf-functions.azurewebsites.net/api/CreateLobby", {
            nickname: this.nickname
          })
          .then(async response => {
            this.$store.commit("PlayerName", response.data.playerName);
            this.$store.commit("PlayerGUID", response.data.playerGuid);
            this.$store.commit("LobbyGUID", response.data.lobbyGuid);
            this.$store.commit("LobbyCode", response.data.roomCode);
            this.$store.commit("LobbyMembers", response.data.members);
            this.$store.commit("PlayerHost", true);
            document.getElementsByClassName("create")[0].style.transition = "opacity 1s ease";
            document.getElementsByClassName("create")[0].style.opacity = 0;
            await this.sleep(1000);
            document.body.style.cursor = "default";
            this.$router.push("/lobby");
          }, error => {
            this.loaded = true;
            document.body.style.cursor = "default";
            alert("Error creating lobby. Try a different name.");
            console.log(error);
          });
        }
        else if (route === "home")
        {
          document.getElementsByClassName("create")[0].style.transition = "opacity 1s ease";
          document.getElementsByClassName("create")[0].style.opacity = 0;
          await this.sleep(1000);
          this.$router.push("/");
        }
      }
    }
  }
}
</script>

<style scoped>
@media only screen and (max-device-width : 719px) {
.create {
  transition: opacity 1s ease-in;
  opacity: 0;
}

h1 {
  margin-top: 50%;
}

input {
  border: none;
  height: 32px;
  width: 160px;
  text-align: center;
  font-size: 20px;
  background: #646464;
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
.create {
  transition: opacity 1s ease-in;
  opacity: 0;
}

h1 {
  margin-top: 15%;
}

input {
  border: none;
  height: 32px;
  width: 160px;
  text-align: center;
  font-size: 20px;
  background: #646464;
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
