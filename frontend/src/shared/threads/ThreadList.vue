<script setup>
import { onMounted, watch } from "vue";
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
  }
};

watch(route, () => {
  getThreads();
});

onMounted(() => {
  getThreads();
});
</script>

<template>
  <Thread v-for="thread in threads.value" :thread="thread"></Thread>
</template>
