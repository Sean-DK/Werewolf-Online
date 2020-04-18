<template>
  <div class="player">
    <h2>{{ name }}</h2>
    <img :src="image" />
    <div class="highlight"></div>
  </div>
</template>

<script>
import { roleLookup } from '@/data/roles.js'

export default {
  name: 'Player',
  props: {
    name: String,
    role: String
  },
  computed: {
    image: function() {
      return roleLookup[this.role].image;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.player {
  border: 1px solid #212121;
  width: 10em;
  background: #424242;
  display: inline-block;
  margin: 5px;
  pointer-events: auto;
}

.player:hover {
  background: #545454;
  cursor: pointer;
}

img {
  height: 10em;
  margin-bottom: 10px;
  border: 2px solid #000000;
  border-radius: 10px;
}
</style>
