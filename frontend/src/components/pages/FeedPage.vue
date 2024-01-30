<template>
  <div class="threads">
    <h2 v-if="threads.length < 1">Follow more users to see more content!</h2>
    <h2 v-else>Welcome to your feed!</h2>
    <ThreadList v-if="threads.length" :threads="threads" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import ThreadList from '../other/ThreadList.vue';
import { paginationService } from '../../services/PaginationService';
import { feedService } from '../../services/FeedService';
import { pathService } from '../../services/PathService';
import { useRoute } from 'vue-router';

const threads = ref([]);

const route = useRoute();

onMounted(() => {
  paginationService.init(threads, '/api/threads/feed', feedService.onNewThreads);
  pathService.lastSignificantPage.value = route.fullPath;
});

onUnmounted(() => {
  paginationService.destroy();
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
