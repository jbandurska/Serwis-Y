<template>
  <div class="threads">
    <h2 v-if="threads.length">
      People you follow posted {{ message }} that you haven't seen yet!
    </h2>
    <h2 v-else>Follow more users to see more new content!</h2>
    <ThreadListVue v-if="threads.length" :threads="threads" />
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import ThreadListVue from "../other/ThreadList.vue";

const threads = ref([]);
const message = ref("");

const getThreads = async () => {
  try {
    const response = await axios.get(`/api/threads/feed`, {
      withCredentials: true,
    });

    threads.value = response.data.threads;

    const count = threads.value.length;
    if (count == 1) {
      message.value = `1 thread this week`;
    } else {
      message.value = `${count} threads this week`;
    }
  } catch (error) {
    alert("Something went wrong :(");
  }
};

onMounted(() => {
  getThreads();
});
</script>

<style scoped>
h2 {
  text-align: center;
  color: var(--main);
}

.threads {
  padding: 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (max-width: 800px) {
    padding: 0;
    gap: 0;
  }
}
</style>
