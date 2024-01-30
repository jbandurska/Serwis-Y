<template>
  <div class="list">
    <ThreadForm
      placeholder="Comment"
      :path="`/api/threads/${parentThreadId}`"
      :cb="
        (newThread) => {
          socket.emit('new-subthread', parentThreadId);
          subthreads.unshift(newThread);
        }
      "
    ></ThreadForm>
    <CommentComponent
      v-for="subthread in subthreads"
      :key="subthread._id"
      :id="`thread:${subthread._id}`"
      :thread="subthread"
      @delete="deleteThread(subthread._id)"
    ></CommentComponent>
  </div>
</template>

<script setup>
import { socket } from '../../socket';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import CommentComponent from './CommentComponent.vue';
import ThreadForm from '../forms/ThreadForm.vue';
import { paginationService } from '../../services/PaginationService';
import { useRoute } from 'vue-router';

const props = defineProps({
  parentThreadId: String,
  refresh: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();

const subthreads = ref([]);

const deleteThread = (id) => {
  subthreads.value = subthreads.value.filter((t) => t._id !== id);
};

onMounted(() => {
  paginationService.init(subthreads, `/api/threads/${props.parentThreadId}/subthreads`);
});

onUnmounted(() => {
  paginationService.destroy();
});

watch(
  () => props.parentThreadId,
  () => {
    subthreads.value = [];
    paginationService.setPath(`/api/threads/${props.parentThreadId}/subthreads`, false);

    const around = route.query.around;
    if (around) {
      paginationService.getThreadsAround(around);
    } else {
      paginationService.getNewestThreads();
    }
  }
);

watchEffect(() => {
  if (props.refresh) paginationService.getNewestThreads();
});
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 3px solid #aaa;
  padding: 5px;
  border-radius: 8px;
  background-color: #1a1a1a;
  margin: 0 10px;

  @media (max-width: 800px) {
    margin: 0 -10px;
  }
}
</style>
