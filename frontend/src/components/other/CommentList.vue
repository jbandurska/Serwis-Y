<template>
  <div class="list" :class="{ 'odd-list': nestingLevel % 2 }">
    <Comment
      v-for="subthread in subthreads"
      :key="subthread._id"
      :thread="subthread"
      :nesting-level="nestingLevel"
      @delete="getSubthreads"
    ></Comment>
    <CommentForm
      :parentThreadId="parentThreadId"
      :subthreads="subthreads"
    ></CommentForm>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Comment from "./Comment.vue";
import CommentForm from "../forms/CommentForm.vue";

const props = defineProps({
  parentThreadId: String,
  nestingLevel: Number,
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
