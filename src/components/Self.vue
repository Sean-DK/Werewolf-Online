<template>
  <div class="self">
    <h1 
      v-on:mouseenter="showInfo = true"
      v-on:mouseleave="showInfo = false"
      v-on:touchstart="showInfo = true"
      v-on:touchend="showInfo = false"
    >Your Role: {{ role }}<img :src="image" /></h1>
    <InfoPanel v-if="showInfo" :role=role />
  </div>
</template>

<script>
import { roleLookup } from '@/data/roles.js'
import InfoPanel from '@/components/InfoPanel.vue'

export default {
  name: 'Self',
  data() {
    return {
      showInfo: false
    }
  },
  components: {
    InfoPanel
  },
  props: {
    role: String
  },
  computed: {
    image: function() {
      return roleLookup[this.role].token;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media only screen and (max-device-width : 719px) {
.self {
  width: 90%;
  margin: auto;
  z-index: 2;
  position: relative;
}

h1 {
  margin-top: 0px;
  font-size: 22px;
}

img {
  border-radius: 100%;
  border: 2px solid #000000;
  position: relative;
  height: 64px;
  margin-left: 10px;
  margin-top: 0px;
  top: 22px;
}
}

@media only screen and (min-device-width : 720px) {
.self {
  width: 500px;
  margin: auto;
  z-index: 2;
  position: relative;
}

h1 {
  margin-top: 0px;
}

img {
  border-radius: 100%;
  border: 2px solid #000000;
  position: relative;
  height: 64px;
  margin-left: 10px;
  margin-top: 0px;
  top: 22px;
}
}
</style>
