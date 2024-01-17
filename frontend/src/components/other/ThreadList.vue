<template>
  <Thread
    v-for="thread in threads.value"
    :key="thread._id"
    :thread="thread"
    :delete-thread="deleteThread"
  />
  <p v-if="!threads.value?.length">No threads here yet!</p>
</template>

<script setup>
import { watchEffect } from "vue";
import { useRoute } from "vue-router";
import Thread from "./Thread.vue";
import axios from "axios";

const props = defineProps({
  threads: Array,
});

const route = useRoute();

const threads = props.threads;

const getThreads = async () => {
  const id = route.params.id;

  if (id) {
    try {
      const response = await axios.get(`/api/threads/user/${id}`, {
        withCredentials: true,
      });

      threads.value = response.data.threads;
    } catch (error) {
      alert("Something went wrong :(");
    }
  } else {
    threads.value = props.threads;
  }
};

const deleteThread = (id) => {
  threads.value = threads.value.filter((t) => t._id !== id);
};

watchEffect(getThreads);
</script>

<style scoped>
p {
  text-align: center;
  font-size: 1.1em;
}
</style>
