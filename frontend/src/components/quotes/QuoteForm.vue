<template>
  <div class="box">
    <h2>Quote thread</h2>
    <Quote></Quote>
    <div class="thread-form">
      <textarea
        ref="textarea"
        v-model="content"
        placeholder="What would you add?"
      ></textarea>
      <button @click="addQuote">Quote</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "../../stores/user.store";
import axios from "axios";
import Quote from "./Quote.vue";

const route = useRoute();
const router = useRouter();

const loggedUserId = userStore.userInfo.user._id;

const content = ref("");
const textarea = ref(null);

watch(content, () => {
  textarea.value.style.height = textarea.value.scrollHeight + "px";
});

const addQuote = async () => {
  if (content.value) {
    try {
      await axios.post(
        `/api/threads/quote/${route.params.quoteId}`,
        {
          content: content.value,
        },
        {
          withCredentials: true,
        }
      );

      content.value = "";
      router.push(`/home/user/${loggedUserId}`);
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style scoped>
.box {
  width: 1000px;

  h2 {
    text-align: center;
  }
}
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
