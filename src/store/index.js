import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Player: {
      GUID: null,
      Role: "none",
      Name: null,
      isHost: false,
      wokeUp: false
    },
    Lobby: {
      GUID: null,
      Code: null,
      Members: []
    },
    NarratorMute: false,
    ActiveRoles: []
  },
  mutations: {
    PlayerGUID(state, value) {
      state.Player.GUID = value;
    },
    PlayerRole(state, value) {
      state.Player.Role = value;
    },
    PlayerName(state, value) {
      state.Player.Name = value;
    },
    PlayerHost(state, value) {
      state.Player.isHost = value;
    },
    PlayerWoke(state, value) {
      state.Player.wokeUp = value;
    },
    LobbyGUID(state, value) {
      state.Lobby.GUID = value;
    },
    LobbyCode(state, value) {
      state.Lobby.Code = value;
    },
    LobbyMembers(state, value) {
      state.Lobby.Members = value;
    },
    NarratorMute(state, value) {
      state.NarratorMute = value;
    },
    ActiveRoles(state, value) {
      state.ActiveRoles = value;
    }
  },
  actions: {
  },
  modules: {
  }
})
