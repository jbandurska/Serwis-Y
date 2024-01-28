<template>
  <ThreadComponent
    v-for="thread in threads"
    :key="thread._id"
    :id="`thread:${thread._id}`"
    :thread="thread"
    :delete-thread="deleteThread"
  />
  <p v-if="!threads?.length">No threads here yet!</p>
</template>

<script setup>
import ThreadComponent from './ThreadComponent.vue';

defineProps({
  threads: Array
});

const emit = defineEmits(['delete']);

const deleteThread = (id) => {
  emit('delete', id);
};
</script>

<style scoped>
p {
  text-align: center;
  font-size: 1.1em;
}
</style>
