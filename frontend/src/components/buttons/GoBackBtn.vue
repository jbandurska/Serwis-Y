<template>
  <button type="button" @click="goBack">
    <img src="/src/assets/left-arrow.svg" alt="left arrow" />
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
button {
  border-radius: 50%;
  padding: 10px;
  aspect-ratio: 1/1;
  background-color: var(--main);

  img {
    width: 30px;
  }
}
</style>
