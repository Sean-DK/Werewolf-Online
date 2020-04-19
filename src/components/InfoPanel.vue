<template>
  <div class="info">
    <h3>{{ header }}</h3>
    <h3>{{ description }}</h3>
  </div>
</template>

<script>
import { roleLookup } from '@/data/roles.js'

export default {
  name: 'Info',
  props: {
    role: String
  },
  computed: {
    image: function() {
      return roleLookup[this.role].token;
    },
    header: function() {
      return roleLookup[this.role].header;
    },
    description: function() {
      return roleLookup[this.role].description;
    }
  },
  methods: {
    displayInfo: function() {
      console.log("Mouse enter");
    },
    hideInfo: function() {
      console.log("Mouse leave");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media only screen and (max-device-width : 719px) {
.info {
  border: 2px solid #101010;
  background: #212121;
  border-radius: 10px;
  z-index: 2;
  position: absolute;
  width: 100%;
  margin-top: 5px;
}

h3 {
  text-align: left;
  margin-left: 20px;
  margin-right: 20px;
}
}

@media only screen and (min-device-width : 720px) {
.info {
  border: 2px solid #101010;
  background: #212121;
  border-radius: 10px;
  z-index: 2;
  position: absolute;
  width: 500px;
}

h3 {
  text-align: left;
  margin-left: 20px;
  margin-right: 20px;
}
}
</style>
