const roles = [
  {
    id: "drunk",
    name: "Drunk",
    src: require("@/assets/Roles/Drunk.png"),
    selected: false
  },
  {
    id: "hunter",
    name: "Hunter",
    src: require("@/assets/Roles/Hunter.png"),
    selected: false
  },
  {
    id: "insomniac",
    name: "Insomniac",
    src: require("@/assets/Roles/Insomniac.png"),
    selected: false
  },
  {
    id: "mason1",
    name: "Mason",
    src: require("@/assets/Roles/Mason.png"),
    selected: false
  },
  {
    id: "mason2",
    name: "Mason",
    src: require("@/assets/Roles/Mason.png"),
    selected: false
  },
  {
    id: "minion",
    name: "Minion",
    src: require("@/assets/Roles/Minion.png"),
    selected: false
  },
  {
    id: "robber",
    name: "Robber",
    src: require("@/assets/Roles/Robber.png"),
    selected: true
  },
  {
    id: "seer",
    name: "Seer",
    src: require("@/assets/Roles/Seer.png"),
    selected: true
  },
  {
    id: "tanner",
    name: "Tanner",
    src: require("@/assets/Roles/Tanner.png"),
    selected: false
  },
  {
    id: "troublemaker",
    name: "Troublemaker",
    src: require("@/assets/Roles/Troublemaker.png"),
    selected: true
  },
  {
    id: "villager1",
    name: "Villager",
    src: require("@/assets/Roles/Villager.png"),
    selected: true
  },
  {
    id: "villager2",
    name: "Villager",
    src: require("@/assets/Roles/Villager.png"),
    selected: false
  },
  {
    id: "villager3",
    name: "Villager",
    src: require("@/assets/Roles/Villager.png"),
    selected: false
  },
  {
    id: "werewolf1",
    name: "Werewolf",
    src: require("@/assets/Roles/Werewolf.png"),
    selected: true
  },
  {
    id: "werewolf2",
    name: "Werewolf",
    src: require("@/assets/Roles/Werewolf.png"),
    selected: true
  },
]

const imageLookup = {
  "None" : require("@/assets/Roles/CardBack.png"),
  "Drunk": require("@/assets/Roles/Drunk.png"),
  "Hunter": require("@/assets/Roles/Hunter.png"),
  "Insomniac": require("@/assets/Roles/Insomniac.png"),
  "Mason": require("@/assets/Roles/Mason.png"),
  "Minion": require("@/assets/Roles/Minion.png"),
  "Robber": require("@/assets/Roles/Robber.png"),
  "Seer": require("@/assets/Roles/Seer.png"),
  "Tanner": require("@/assets/Roles/Tanner.png"),
  "Troublemaker": require("@/assets/Roles/Troublemaker.png"),
  "Villager": require("@/assets/Roles/Villager.png"),
  "Werewolf": require("@/assets/Roles/Werewolf.png")
}

export { roles, imageLookup }