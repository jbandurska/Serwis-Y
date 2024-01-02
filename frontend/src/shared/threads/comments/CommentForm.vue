<template>
  <div class="thread-form">
    <textarea ref="textarea" v-model="content" placeholder="Comment"></textarea>
    <button @click="addThread">Post</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const props = defineProps({
  parentThreadId: String,
  subthreads: Array,
});

const content = ref("");
const textarea = ref(null);

watch(content, () => {
  textarea.value.style.height = textarea.value.scrollHeight + "px";
});

const addThread = async () => {
  if (content.value) {
    try {
      const response = await axios.post(
        `/api/threads/${props.parentThreadId}`,
        {
          content: content.value,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data.thread);
      props.subthreads.push(response.data.thread);
      content.value = "";
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style scoped>
.thread-form {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  textarea {
    width: 100%;
    resize: vertical;
    background-color: var(--bg);
    padding: 10px;
    font-size: 1em;
    color: inherit;
    border-radius: 8px;
    outline: none;
    border: none;
    font-family: inherit;
  }

  button {
    width: 10%;
  }
}
</style>
