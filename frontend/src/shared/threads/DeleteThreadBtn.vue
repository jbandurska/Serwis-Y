<template>
  <button v-if="isLoggedUser" type="button" @click="deleteThread">
    <img src="/src/assets/bin.svg" alt="delete" />
  </button>
</template>

<script setup>
import { computed } from "vue";
import { userStore } from "../../stores/user.store";
import axios from "axios";

const emit = defineEmits(["delete"]);

const props = defineProps({
  thread: Object,
});

const isLoggedUser = computed(() => {
  return props.thread?.user?._id === userStore.userInfo.user._id;
});

const deleteThread = async () => {
  try {
    await axios.delete(`/api/threads/${props.thread._id}`, {
      withCredentials: true,
    });

    emit("delete");
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
img {
  height: 1.3em;
  margin-top: 7px;
}
</style>
