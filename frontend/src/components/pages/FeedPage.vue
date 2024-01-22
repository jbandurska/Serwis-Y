<template>
  <div class="threads">
    <h2 v-if="threads.length">People you follow posted {{ message }} that you haven't seen yet!</h2>
    <h2 v-else>Follow more users to see more new content!</h2>
    <ThreadListVue v-if="threads.length" :threads="threads" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import ThreadListVue from '../other/ThreadList.vue';
import { feedStore } from '../../stores/feed.store';

const threads = feedStore.feed;
const message = feedStore.feedMessage;

onMounted(() => {
  feedStore.getFeed();
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
