<template>
  <div class="page">
    <Thread v-if="thread._id" :thread="thread"></Thread>
  </div>
</template>

<script setup>
import Thread from "../shared/threads/Thread.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const thread = ref({});
const route = useRoute();

const getThread = async () => {
  const threadId = route.params.threadId;

  try {
    const response = await axios.get(`/api/threads/${threadId}`, {
      withCredentials: true,
    });

    thread.value = response.data.thread;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getThread();
});

watch(route, () => {
  getThread();
});
</script>

<style scoped>
.page {
  padding: 20px;
}
</style>
