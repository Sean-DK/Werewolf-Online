<template>
  <div class="roles">
    <div class="img-container">
      <img 
        v-for="role in roles" 
        :key="role.id" 
        :src="role.src" 
        v-bind:class="{selected: role.selected}"
        v-on:click="select(role)">
    </div>
    <button v-if="isHost" :disabled="numberOfRolesSelected != (numberOfPlayers + 3)" v-on:click="confirm">Confirm</button>
    <br>
    <span v-if="numberOfRolesSelected < (numberOfPlayers + 3) && isHost">
      Please select {{ (numberOfPlayers + 3) - numberOfRolesSelected }} more roles.
    </span>
    <span v-if="numberOfRolesSelected > (numberOfPlayers + 3) && isHost">
      Please remove {{ numberOfRolesSelected - (numberOfPlayers + 3) }} roles.
    </span>
    <span v-if="!isHost">
      Host is selecting roles...
    </span>
  </div>
</template>

<script>
import { roles } from '@/data/roles.js'

export default {
  name: 'Roles',
  data: () => {
    return {
      roles: Array,
      refreshID: Number
    }
  },
  computed: {
    isHost: function() {
      return this.$store.state.Player.isHost;
    },
    numberOfPlayers: function() {
      return this.$store.state.Lobby.Members.length;
    },
    numberOfRolesSelected: function() {
      var count = 0;
      Object.values(this.roles).forEach(role => {
        if (role.selected) {
          count++;
        }
      })
      return count;
    }
  },
  mounted: function () {
    this.roles = roles;
    this.refreshID = setInterval(this.refresh, 2000);
  },
  methods: {
    select: function(role) {
      if (this.isHost) {
        this.axios.post("https://werewolf-functions.azurewebsites.net/api/SelectRole", {
          playerGuid: this.$store.state.Player.GUID,
          role: role.id,
          value: !role.selected ? true : false
        })
        .then(() => {
          role.selected = !role.selected;
        }, error => {
          alert("Error selecting role. Please try again.");
          console.log(error);
        });
      }
    },
    refresh: async function() {
      this.axios.get("https://werewolf-functions.azurewebsites.net/api/RefreshRoles?lobbyGuid=" + this.$store.state.Lobby.GUID)
      .then(response => {
        for (var i in response.data) {
          this.roles[i].selected = response.data[i].value;
        }
      }, error => {
        console.log(error);
      });
      this.axios.get("https://werewolf-functions.azurewebsites.net/api/CheckCurrentTurn?lobbyGuid=" + this.$store.state.Lobby.GUID)
      .then(response => {
        if (response.data.currentTurn === "Deal cards") {
          clearInterval(this.refreshID);
          this.$store.commit("ActiveRoles", this.roles);
          this.$router.push("/game");
        }
      })
    },
    confirm: function() {
      this.axios.post("https://werewolf-functions.azurewebsites.net/api/ConfirmRoles", {
        lobbyGuid: this.$store.state.Lobby.GUID
      })
      .then(() => {
          // Do nothing on success, game start is handled in the refresh() method
      }, error => {
        alert("Error confirming roles, please try again later.");
        console.log(error);
      });
    }
  }
}
</script>

<style scoped>
.img-container {
  width: 800px;
  margin: auto;
  margin-top: 5%;
}

img {
  height: 200px;
  margin-right: 5px;
  border: 2px solid #212121;
  border-radius: 10px;
  opacity: 0.3;
  filter: grayscale(1);
}

img:hover {
  opacity: 0.7;
  cursor: pointer;
}

.selected {
  opacity: 1;
  filter: grayscale(0);
}

button {
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  border: none;
  background: #646464;
}

span {
  color: #884242;
}
</style>
