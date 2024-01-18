<template>
  <div class="thread-form">
    <textarea
      ref="textarea"
      v-model="content"
      :placeholder="placeholder"
      @keyup.enter.exact="addThread"
    ></textarea>
    <button @click="addThread">Post</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const props = defineProps({
  placeholder: String,
  path: String,
  cb: Function,
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
        props.path,
        {
          content: content.value,
        },
        {
          withCredentials: true,
        }
      );

      content.value = "";
      props.cb(response.data.thread);
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
