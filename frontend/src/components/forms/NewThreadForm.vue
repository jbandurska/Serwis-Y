<template>
  <div class="box thread-form">
    <textarea
      ref="textarea"
      v-model="content"
      placeholder="What's on your mind?"
      @keyup.enter.exact="addThread"
    ></textarea>
    <button @click="addThread">Post</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { userStore } from "../../stores/user.store";
import axios from "axios";

const props = defineProps({
  threads: Array,
});

const content = ref("");
const textarea = ref(null);

watch(content, () => {
  textarea.value.style.height = textarea.value.scrollHeight + "px";
});

const addThread = async () => {
  content.value = content.value.trim();
  if (content.value) {
    try {
      const response = await axios.post(
        "/api/threads",
        {
          content: content.value,
        },
        {
          withCredentials: true,
        }
      );

      content.value = "";
      props.threads.value.unshift({
        ...response.data.thread,
        commentsCount: 0,
        user: userStore.userInfo.user || {},
      });
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

  @media (max-width: 1000px) {
    flex-direction: column;

    button {
      width: auto;
    }
  }
}
</style>
