<template>
  <div class="join">
    <h2 id="nickname">Nickname ({{nickname.length}}/12)</h2>
    <input type="text" maxlength="12" v-model="nickname"/>
    <h2 id="code">Room Code</h2>
    <input type="text" maxlength="4" style="text-transform:uppercase" v-model="code"/>
    <br>
    <button :disabled="nickname.length < 1 || code.length != 4" v-on:click="onUnload('lobby')">Submit</button>
    <br>
    <button v-on:click="onUnload('home')">Exit</button>
  </div>
</template>

<script>
export default {
  name: 'Join',
  data: () => {
    return {
      loaded: Boolean,
      nickname: String,
      code: String
    }
  },
  mounted: function () {
    this.loaded = false;
    this.nickname = "";
    this.code = "";
    setTimeout(this.onLoad, 1);
  },
  methods: {
    onLoad: async function() {
      if (!this.loaded) {
        document.getElementsByClassName("join")[0].style.opacity = 1;
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
          this.axios.post("https://werewolf-functions.azurewebsites.net/api/JoinLobby", {
            nickname: this.nickname,
            code: this.code
          })
          .then(async response => {
            this.$store.commit("PlayerName", response.data.playerName);
            this.$store.commit("PlayerGUID", response.data.playerGuid);
            this.$store.commit("PlayerHost", false);
            this.$store.commit("LobbyGUID", response.data.lobbyGuid);
            this.$store.commit("LobbyCode", response.data.roomCode);
            this.$store.commit("LobbyMembers", response.data.members);
            document.getElementsByClassName("join")[0].style.transition = "opacity 1s ease";
            document.getElementsByClassName("join")[0].style.opacity = 0;
            await this.sleep(1000);
            document.body.style.cursor = "default";
            this.$router.push("/lobby");
          }, error => {
            this.loaded = true;
            document.body.style.cursor = "default";
            alert("Invalid room code or name");
            console.log(error);
          });
          
        }
        if (route === "home")
        {
          document.getElementsByClassName("join")[0].style.transition = "opacity 1s ease";
          document.getElementsByClassName("join")[0].style.opacity = 0;
          await this.sleep(1000);
          this.$router.push("/");
        }
      }
    }
  }
}
</script>

<style scoped>
.join {
  transition: opacity 1s ease-in;
  opacity: 0;
}

#nickname {
  margin-top: 10%;
}

h2 {
  margin-bottom: 5px;
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
</style>
