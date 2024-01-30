<template>
  <button type="button" @click="goBack">
    <img src="/src/assets/left-arrow.svg" alt="left arrow" />
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  url: String
});

const router = useRouter();

const goBack = () => {
  console.log(props.url);
  if (props.url) {
    router.push(props.url);
  } else {
    router.back();
  }
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
