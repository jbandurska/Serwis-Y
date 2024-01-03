<template>
  <button type="button" @click="goToQuoteForm">Quote thread</button>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  threadId: String,
});

const goToQuoteForm = () => {
  router.push(`/home/quote/${props.threadId}`);
};
</script>

<style scoped>
button {
  font-size: 1.1em !important;
  margin: 0 !important;
}
</style>
