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

const roleLookup = {
  "None" : {
    "image": require("@/assets/Roles/CardBack.png")
  },
  "Drunk": {
    "image": require("@/assets/Roles/Drunk.png"),
    "token": require("@/assets/Tokens/token_Drunk.png"),
    "header": "Team: Villagers",
    "description": "At night, you must exchange your card for any one of the Extra cards. If you do not exchange your card, it will be exchanged automatically. You do not know your new role."
  },
  "Hunter": {
    "image": require("@/assets/Roles/Hunter.png"),
    "token": require("@/assets/Tokens/token_Hunter.png"),
    "header": "Team: Villagers",
    "description": "If you are killed, the player that you vote for will be killed as well."
  },
  "Insomniac": {
    "image": require("@/assets/Roles/Insomniac.png"),
    "token": require("@/assets/Tokens/token_Insomniac.png"),
    "header": "Team: Villagers",
    "description": "At night, you wake up and look at your role. Your role may have changed while you were asleep."
  },
  "Mason": {
    "image": require("@/assets/Roles/Mason.png"),
    "token": require("@/assets/Tokens/token_Mason.png"),
    "header": "Team: Villagers",
    "description": "At night, you wake up and look for other Masons. If you do not see another Mason, then you can be sure that one of the Extra cards is a Mason."
  },
  "Minion": {
    "image": require("@/assets/Roles/Minion.png"),
    "token": require("@/assets/Tokens/token_Minion.png"),
    "header": "Team: Werewolves",
    "description": "At night, you wake up and look for Werewolves. If you die and no Werewolves die, then the Werewolves (and you) win. If there are no Werewolves, then at least one other player must die in order for you to win."
  },
  "Robber": {
    "image": require("@/assets/Roles/Robber.png"),
    "token": require("@/assets/Tokens/token_Robber.png"),
    "header": "Team: Villagers",
    "description": "At night, you may steal a card from another player. You will be on the team of the role you stole, but you do not perform the night action for that role."
  },
  "Seer": {
    "image": require("@/assets/Roles/Seer.png"),
    "token": require("@/assets/Tokens/token_Seer.png"),
    "header": "Team: Villagers",
    "description": "At night, you may look at one player's card or two of the Extra cards."
  },
  "Tanner": {
    "image": require("@/assets/Roles/Tanner.png"),
    "token": require("@/assets/Tokens/token_Tanner.png"),
    "header": "Team: Tanner",
    "description": "You hate your life so much that you want to die. If you die then you win the game."
  },
  "Troublemaker": {
    "image": require("@/assets/Roles/Troublemaker.png"),
    "token": require("@/assets/Tokens/token_Troublemaker.png"),
    "header": "Team: Villagers",
    "description": "At night, you may switch the cards of two other players without looking at those cards."
  },
  "Unknown": {
    "token": require("@/assets/Tokens/token_Drunk.png"),
    "header": "Team: ???",
    "description": "You drank too much last night and do not remember your role."
  },
  "Villager": {
    "image": require("@/assets/Roles/Villager.png"),
    "token": require("@/assets/Tokens/token_Villager.png"),
    "header": "Team: Villagers",
    "description": "You do not have any special abilities."
  },
  "Werewolf": {
    "image": require("@/assets/Roles/Werewolf.png"),
    "token": require("@/assets/Tokens/token_Werewolf.png"),
    "header": "Team: Werewolves",
    "description": "At night, you wake up and look for other Werewolves. If there are no other Werewolves, you may look at one of the Extra cards."
  },
}

export { roles, roleLookup }