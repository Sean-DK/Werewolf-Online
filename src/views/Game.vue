<template>
  <div class="game">
    <Self
      :role="selfRole"
    />
    <div class="night" id="night"></div>
    <div class="player-container">
      <Player
        v-for="player in playersFiltered"
        :key="player.name"
        :name="player.name"
        :role="player.role"
        v-on:click.native="select(player)"
        :class="{selected: player.isSelected, dead: player.isDead}"
      />
    </div>
    <br>
    <div class="extras-container">
      <Player
        v-for="extra in extras"
        :key="extra.name"
        :name="extra.name"
        :role="extra.role"
        v-on:click.native="select(extra)"
        :class="{selected: extra.isSelected, dead: extra.isDead}"
      />
    </div>
    <div class="timer" v-if="remainingTime > 0">{{ remainingTime }}</div>
    <div class="msg">{{ message }}</div>
    <br>
    <button v-if="allowSelection" v-on:click="submitAction" :disabled="selectedPlayers.length != maxSelections">Submit</button>
    <button v-if="isHost && currentTurn === 'Awake'" v-on:click="skipToVote">Skip to vote</button>
    <button v-if="currentTurn === 'Results'" v-on:click="goHome">Main Menu</button>
    <br>
    <button v-if="allowSelection && currentTurn === 'Voting'" v-on:click="abstainFromVoting">Abstain</button>
  </div>
</template>

<script>
import Self from '@/components/Self.vue'
import Player from '@/components/Player.vue'
import { roles } from '@/data/roles.js'

export default {
  name: 'Game',
  components: {
    Self,
    Player
  },
  data: () => {
    return {
      loaded: Boolean,
      players: Array,
      currentTurn: String,
      narratorAudio: Audio,
      allowSelection: false,
      maxSelections: 0,
      remainingTime: 0,
      checkTurnInterval: Number,
      turnCountdownInterval: Number,
      voteTurnTimeout: Number,
      message: String,
      selectMode: "Any" // Any, Player, Extra
    }
  },
  computed: {
    selfRole: function() {
      return this.$store.state.Player.Role;
    },
    playersFiltered: function() {
      return Object.values(this.players).filter(player => {
        return player.name != "Extra 1" &&
               player.name != "Extra 2" &&
               player.name != "Extra 3";
      }).sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
    extras: function() {
      return Object.values(this.players).filter(player => {
        return player.name === "Extra 1" ||
               player.name === "Extra 2" ||
               player.name === "Extra 3";
      }).sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
    narrMuted: function() {
      return this.$store.state.NarratorMute;
    },
    selectedPlayers: function() {
      return Object.values(this.players).filter(player => {
        return player.isSelected;
      })
    },
    isHost: function() {
      return this.$store.state.Player.isHost;
    },
    hasAwoken: function() {
      return this.$store.state.Player.wokeUp;
    }
  },
  mounted: function () {
    this.axios.get("https://werewolf-functions.azurewebsites.net/api/PlayerList?playerGuid=" + this.$store.state.Player.GUID)
    .then(async response => {
      var self = response.data.filter(player => {
        return player.name === this.$store.state.Player.Name;
      });
      var selfRole = roles.filter(role => {
        return role.id === self[0].role;
      })[0].name;
      this.$store.commit("PlayerRole", selfRole);
      this.players = response.data.filter(player => {
        return player.name != this.$store.state.Player.Name;
      });
      this.checkTurnInterval = setInterval(this.checkCurrentTurn, 2000);
      this.message = "";
      this.currentTurn = "Deal cards";
      console.log("Game loaded");
      await this.sleep(1000);
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/sleep.mp3"));
        this.narratorAudio.play();
      }
      this.$store.commit("PlayerWoke", false);
      this.goToSleep();
      await this.sleep(4000);
      if (this.isHost) {
        // Turn Change: Deal cards => Werewolf
        this.nextTurn();
      }
    }, error => {
      alert("Failed to load game. Try again in a new lobby.");
      console.log(error);
    })
  },
  methods: {
    select: function(player) {
      if (player.isSelected) { 
        player.isSelected = false; 
      }
      else if (this.allowSelection && this.selectedPlayers.length < this.maxSelections) {
        switch(this.selectMode) {
          case "Any":
            player.isSelected = !player.isSelected;
          break;
          case "Player":
            if (player.name != "Extra 1" && player.name != "Extra 2" && player.name != "Extra 3") {
              player.isSelected = !player.isSelected;
            }
          break;
          case "Extra":
            if (player.name == "Extra 1" || player.name == "Extra 2" || player.name == "Extra 3") {
              player.isSelected = !player.isSelected;
            }
          break;
        }
      }

      // Seer logic
      if (this.selfRole === "Seer" && this.currentTurn === "Seer") {
        // If there are no selections, set max to 1 and type to Any
        if (this.selectedPlayers.length == 0) {
          this.maxSelections = 1;
          this.selectMode = "Any";
        }
        // If the currently selected player is an Extra then
        // set max selections to 2 and mode to Extra
        if (this.selectedPlayers.length == 1 && this.selectedPlayers[0].name.includes("Extra")) {
          this.maxSelections = 2;
          this.selectMode = "Extra";
        }
      }
    },
    clearSelection: function() {
      Object.values(this.players).forEach(player => {
        player.isSelected = false;
      });
    },
    checkCurrentTurn: function() {
      this.axios.get("https://werewolf-functions.azurewebsites.net/api/CheckCurrentTurn?lobbyGuid=" + this.$store.state.Lobby.GUID)
      .then(response => {
        if (this.currentTurn === response.data.currentTurn) {
          // Do nothing until the turn changes
        }
        else {
          this.currentTurn = response.data.currentTurn;
          switch (this.currentTurn)
          {
            case "Werewolf":
              // Check if role is active
              var active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "werewolf1";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Werewolves wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 10000);
                }
                this.execWerewolf();
              }
              else {
                // If role is not active, skip
                console.log("Skipping werewolves");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Minion":
              // Check if role is active
              active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "minion";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Minion wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 5000);
                }
                this.execMinion();
              }
              else {
                // If role is not active, skip
                console.log("Skipping minion");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Mason":
              // Check if role is active
              active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "mason1";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Masons wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 5000);
                }
                this.execMason();
              }
              else {
                // If role is not active, skip
                console.log("Skipping masons");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Seer":
              // Check if role is active
              active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "seer";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Seer wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 10000);
                }
                this.execSeer();
              }
              else {
                // If role is not active, skip
                console.log("Skipping seer");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Robber":
              // Check if role is active
              active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "robber";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Robber wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 10000);
                }
                this.execRobber();
              }
              else {
                // If role is not active, skip
                console.log("Skipping robber");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Troublemaker":
              // Check if role is active
              active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "troublemaker";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Troublemaker wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 10000);
                }
                this.execTroublemaker();
              }
              else {
                // If role is not active, skip
                console.log("Skipping troublemaker");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Drunk":
              // Check if role is active
              active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "drunk";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Drunk wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 10000);
                }
                this.execDrunk();
              }
              else {
                // If role is not active, skip
                console.log("Skipping drunk");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Insomniac":
              // Check if role is active
              active = Object.values(this.$store.state.ActiveRoles).filter(role => { return role.id === "insomniac";})[0].selected;
              if (active) {
                // If role is active, execute turn script
                console.log("Insomniac wake up...");
                if (this.isHost) {
                  setTimeout(this.nextTurn, 5000);
                }
                this.execInsomniac();
              }
              else {
                // If role is not active, skip
                console.log("Skipping insomniac");
                if (this.isHost) {
                  this.nextTurn();
                  this.checkCurrentTurn();
                }
              }
            break;
            case "Awake":
              console.log("Everyone wake up...");
              if (this.isHost) {
                this.voteTurnTimeout = setTimeout(this.nextTurn, 180000);
              }
              this.execAwake();
              break;
            case "Voting":
              console.log("Vote!");
              if (this.isHost) {
                this.voteTurnTimeout = setTimeout(this.nextTurn, 30000);
              }
              this.execVoting();
              break;
            case "Results":
              console.log("Displaying results");
              this.execResults();
              break;
          }
        }
      });
    },
    goToSleep: async function() {
      document.getElementById("night").style.display = "block";
      await this.sleep(250);
      document.getElementById("night").style.opacity = 0.95;
    },
    wakeUp: async function() {
      console.log("Waking up...");
      this.$store.commit("PlayerWoke", true);
      document.getElementById("night").style.opacity = 0;
      await this.sleep(2250);
      document.getElementById("night").style.display = "none";
    },
    execWerewolf: async function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/werewolf.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Werewolf" && !this.hasAwoken) {
        this.wakeUp();
        await this.sleep(2000);
        this.startTurnTimer(10);
        // Check for other werewolves
        await this.axios.get("https://werewolf-functions.azurewebsites.net/api/Werewolves?playerGuid=" + this.$store.state.Player.GUID)
        .then(response => {
          this.players = response.data;
        });
        var count = 0;
        Object.values(this.players).forEach(player => {
          if (player.role === "Werewolf") { count++; }
        })

        // If there are none, pick a card from the extra pile
        if (count == 0) {
          this.message = "You are a lone wolf. You may view a card from the Extras pile.";
          this.allowSelection = true;
          this.maxSelections = 1;
          this.selectMode = "Extra";
          // submitAction
        }
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execMinion: async function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/minion.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Minion" && !this.hasAwoken) {
        this.wakeUp();
        await this.sleep(2000);
        this.startTurnTimer(3);
        // Check for werewolves
        this.axios.get("https://werewolf-functions.azurewebsites.net/api/Werewolves?playerGuid=" + this.$store.state.Player.GUID)
        .then(response => {
          this.players = response.data;
        });
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execMason: async function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/mason.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Mason" && !this.hasAwoken) {
        this.wakeUp();
        await this.sleep(2000);
        this.startTurnTimer(3);
        this.axios.get("https://werewolf-functions.azurewebsites.net/api/Masons?playerGuid=" + this.$store.state.Player.GUID)
        .then(response => {
          this.players = response.data;
        });
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execSeer: function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/seer.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Seer" && !this.hasAwoken) {
        this.message = "Select 1 player or 2 extras and view their card";
        this.wakeUp();
        // Give the seer 12 seconds since 2 seconds will be taken up by the wakeUp() animation
        this.startTurnTimer(12);
        // Pick a card
        // Additional logic in this.select() for allowing a Seer to view 2 Extra cards
        this.allowSelection = true;
        this.maxSelections = 1;
        this.selectMode = "Any";
        // submitAction
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execRobber: function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/robber.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Robber" && !this.hasAwoken) {
        this.message = "Select a player to swap cards with";
        this.wakeUp();
        // Give the robber 12 seconds since 2 seconds will be taken up by the wakeUp() animation
        this.startTurnTimer(12);
        // Select a player and swap your cards
        this.allowSelection = true;
        this.maxSelections = 1;
        this.selectMode = "Player";
        // submitAction
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execTroublemaker: function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/troublemaker.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Troublemaker" && !this.hasAwoken) {
        this.message = "Select 2 players and swap their cards";
        this.wakeUp();
        // Give the troublemaker 12 seconds since 2 seconds will be taken up by the wakeUp() animation
        this.startTurnTimer(12);
        // Select two cards and swap them
        this.allowSelection = true;
        this.maxSelections = 2;
        this.selectMode = "Player";
        // submitAction
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execDrunk: function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/drunk.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Drunk" && !this.hasAwoken) {
        this.message = "Swap your card with an extra, do not look at your new card";
        this.wakeUp();
        // Give the drunk 12 seconds since 2 seconds will be taken up by the wakeUp() animation
        this.startTurnTimer(12);
        // Swap with one of the extra cards
        this.allowSelection = true;
        this.maxSelections = 1;
        this.selectMode = "Extra";
        // submitAction
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execInsomniac: async function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/insomniac.mp3"));
        this.narratorAudio.play();
      }
      if (this.selfRole === "Insomniac" && !this.hasAwoken) {
        this.wakeUp();
        await this.sleep(2000);
        this.startTurnTimer(3);
        // Check role with server
        this.axios.get("https://werewolf-functions.azurewebsites.net/api/PlayerList?playerGuid=" + this.$store.state.Player.GUID)
        .then(response => {
          var self = response.data.filter(player => {
            return player.name === this.$store.state.Player.Name;
          });
          var selfRole = roles.filter(role => {
            return role.id === self[0].role;
          })[0].name;
          this.$store.commit("PlayerRole", selfRole);
        });
      }
      else {
        this.allowSelection = false;
        this.maxSelections = 0;
        this.selectMode = "Any";
        this.clearSelection();
        this.message = "";
        this.goToSleep();
      }
    },
    execAwake: function() {
      if (!this.narrMuted) {
        this.narratorAudio = new Audio(require("@/assets/Audio/wake.mp3"));
        this.narratorAudio.play();
      }
      this.startTurnTimer(180);
      this.allowSelection = false;
      this.maxSelections = 0;
      this.selectMode = "Any";
      this.clearSelection();
      this.message = "Discuss what happened last night";
      this.wakeUp();
      // Start a countdown to vote
      // TODO
    },
    execVoting: function() {
      // Select a player and confirm vote
      this.startTurnTimer(30);
      this.message = "Cast your vote!";
      this.allowSelection = true;
      this.maxSelections = 1;
      this.selectMode = "Player";
      // submitAction
    },
    execResults: function() {
      // Clear any selections and hide voting buttons
      this.allowSelection = false;
      this.maxSelections = 0;
      this.selectMode = "Any";
      this.clearSelection();
      // Reveal roles
      this.axios.get("https://werewolf-functions.azurewebsites.net/api/FullResults?lobbyGuid=" + this.$store.state.Lobby.GUID)
      .then(response => {
        // Display all roles
        this.players = Object.values(response.data.players).filter(player => {
          return player.name != this.$store.state.Player.Name;
        });
        // Update player's own role
        var self = Object.values(response.data.players).filter(player => {
          return player.name === this.$store.state.Player.Name;
        });
        var selfRole = self[0].role;
        this.$store.commit("PlayerRole", selfRole);
        // Bloodsplat if the player died
        var playerDied = self[0].isDead;
        if (playerDied) {
          this.showBloodsplat();
        }
        // Display victory message
        this.message = response.data.message;
      }, error => {
        alert("Error retrieving results");
        console.log(error);
       });
    },
    submitAction: function() {
      switch(this.currentTurn) {
        case "Werewolf":
        case "Seer":
          this.axios.post("https://werewolf-functions.azurewebsites.net/api/PeekRole", {
            players: this.selectedPlayers,
            lobbyGuid: this.$store.state.Lobby.GUID})
          .then(response => {
            // Update roles
            this.players = response.data.filter(player => {
              return player.name != this.$store.state.Player.Name;
            });
          }, error => {
            alert("Error submitting selections");
            console.log(error);
          });
        break;
        case "Robber":
          this.axios.post("https://werewolf-functions.azurewebsites.net/api/StealRole", {
            players: this.selectedPlayers,
            playerGuid: this.$store.state.Player.GUID})
          .then(async response => {
            // Set new role
            var self = response.data.filter(player => {
              return player.name === this.$store.state.Player.Name;
            });
            var selfRole = self[0].role;
            this.$store.commit("PlayerRole", selfRole);

            // Update other players roles
            this.players = response.data.filter(player => {
              return player.name != this.$store.state.Player.Name;
            });
          }, error => {
            alert("Error submitting selections");
            console.log(error);
          });
        break;
        case "Troublemaker":
          this.axios.post("https://werewolf-functions.azurewebsites.net/api/SwapRole", {
            players: this.selectedPlayers,
            lobbyGuid: this.$store.state.Lobby.GUID})
          .then(() => {
            // Do nothing on success
          }, error => {
            alert("Error submitting selections");
            console.log(error);
          });
        break;
        case "Drunk":
          this.axios.post("https://werewolf-functions.azurewebsites.net/api/ForgetRole", {
            players: this.selectedPlayers,
            playerGuid: this.$store.state.Player.GUID})
          .then(() => {
            // Set role to "Unkown"
            this.$store.commit("PlayerRole", "Unknown");
          }, error => {
            alert("Error submitting selections");
            console.log(error);
          });
        break;
        case "Voting":
          this.axios.post("https://werewolf-functions.azurewebsites.net/api/SubmitVote", {
            players: this.selectedPlayers,
            playerGuid: this.$store.state.Player.GUID})
          .then(() => {
            // Do nothing on success, wait for all votes to be submitted
          }, error => {
            alert("Error submitting vote. Please try again!");
            console.log(error);
          });
        break;
      }
      this.allowSelection = false;
      this.maxSelections = 0;
      this.selectMode = "Any";
      this.clearSelection();
    },
    nextTurn: function() {
      this.axios.post("https://werewolf-functions.azurewebsites.net/api/NextTurn", {
        lobbyGuid: this.$store.state.Lobby.GUID
      });
    },
    skipToVote: function() {
      clearTimeout(this.voteTurnTimeout);
      this.nextTurn();
    },
    abstainFromVoting: function() {
      this.axios.post("https://werewolf-functions.azurewebsites.net/api/SubmitVote", {
        players: [],
        playerGuid: this.$store.state.Player.GUID})
      .then(() => {
        // Do nothing on success, wait for all votes to be submitted
      }, error => {
        alert("Error submitting vote. Please try again!");
        console.log(error);
      });
      this.allowSelection = false;
      this.maxSelections = 0;
      this.selectMode = "Any";
      this.clearSelection();
    },
    goHome: function() {
      this.$store.commit("PlayerWoke", false);
      clearInterval(this.checkTurnInterval);
      this.$router.push("/");
    },
    showBloodsplat: async function() {
      console.log("You died!");
      document.getElementById("night").style.display = "block";
      document.getElementById("night").style.background = "#ff0000";
      document.getElementById("night").style.transition = "opacity 0.05s";
      await this.sleep(250);
      document.getElementById("night").style.opacity = 0.95;
      await this.sleep(100);
      document.getElementById("night").style.transition = "opacity 0.3s ease-out";
      await this.sleep(50);
      document.getElementById("night").style.opacity = 0;
      await this.sleep(400);
      document.getElementById("night").style.display = "none"
    },
    startTurnTimer: function(seconds) {
      var ms = seconds * 1000;
      ms = ms - 2000; // Subtract 2 seconds from the total time since the checkTurnInterval takes 2 seconds itself
      // Clear any previous countdown timers
      clearInterval(this.turnCountdownInterval);
      // Stop checking for next turn, wait X seconds then start checking turn every 2 seconds again
      // This will make the player's turn last a total of X seconds client-side, regardless of what the server says
      if (this.currentTurn != "Awake" && this.currentTurn != "Voting") {
        clearInterval(this.checkTurnInterval);
        setTimeout(() => {this.checkTurnInterval = setInterval(this.checkCurrentTurn, 2000)}, ms);
      }
      this.remainingTime = seconds;
      this.turnCountdownInterval = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime < 0) {
          clearInterval(this.turnCountdownInterval);
        }
      }, 1000);
    }
  }
}
</script>

<style scoped>
.game {
  user-select: none;
}

.player-container {
  position: relative;
  display: inline-block;
  height: 275px;
  margin: auto;
  pointer-events: none;
}

.extras-container {
  position: relative;
  display: inline-block;
  height: 275px;
  width: 525px;
  margin: auto;
  pointer-events: none;
}

h1 {
  margin-top: 10%;
  font-size: 72px;
}

.night {
  top: 0;
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  background: #000000;
  opacity: 0;
  z-index: 1;
  transition: opacity 2s ease;
}

.msg {
  color: #884242;
  font-size: 20px;
}

.timer {
  color: #ffffff;
  font-size: 32px;
}

.selected {
  outline: 3px solid #ffff88;
  outline-offset: -3px;
}

.dead {
  outline: 3px solid #884242 !important;
  outline-offset: -3px;
}

button {
  border-radius: 5px;
  margin-top: 20px;
  font-size: 20px;
  border: none;
  background: #646464;
}
</style>
