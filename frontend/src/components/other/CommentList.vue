<template>
  <div class="list" :class="{ 'odd-list': nestingLevel % 2 }">
    <Comment
      v-for="subthread in subthreads"
      :key="subthread._id"
      :thread="subthread"
      :nesting-level="nestingLevel"
      @delete="getSubthreads"
    ></Comment>
    <ThreadForm
      placeholder="Comment"
      :path="`/api/threads/${parentThreadId}`"
      :cb="
        (newThread) => {
          socket.emit('new-thread', parentThreadId);
          subthreads.push(newThread);
        }
      "
    ></ThreadForm>
  </div>
</template>

<script setup>
import axios from "axios";
import { socket } from "../../socket";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Comment from "./Comment.vue";
import ThreadForm from "../forms/ThreadForm.vue";

const props = defineProps({
  parentThreadId: String,
  nestingLevel: Number,
  refresh: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();

const subthreads = ref([]);

const getSubthreads = async () => {
  try {
    const response = await axios.get(
      `/api/threads/${props.parentThreadId}/subthreads`,
      {
        withCredentials: true,
      }
    );

    subthreads.value = response.data.subthreads;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getSubthreads();
});

watch(route, () => {
  getSubthreads();
});

watchEffect(() => {
  if (props.refresh) getSubthreads();
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

.odd-list {
  background-color: #333;
}
</style>
