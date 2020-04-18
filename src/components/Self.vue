<template>
  <div class="self">
    <h1>Your Role: {{ role }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Self',
  props: {
    role: String,
    image: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Self {
  border: 2px solid #212121;
  border-radius: 10px;
}
</style>
