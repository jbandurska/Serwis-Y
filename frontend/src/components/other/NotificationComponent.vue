<template>
  <div class="wrapper" v-show="count">{{ count }}</div>
</template>

<script setup>
defineProps({
  count: Number
});
</script>

<style scoped>
.wrapper {
  background-color: var(--text);
  border-radius: 50%;
  height: 20px;
  aspect-ratio: 1/1;
  font-weight: bold;
  color: var(--bg);
  padding: 0;
  display: grid;
  place-content: center;
}
</style>
