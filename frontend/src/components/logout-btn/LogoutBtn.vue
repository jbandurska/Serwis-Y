<script setup>
import axios from "axios";
import { userStore } from "../../stores/user.store";

const logout = async () => {
  try {
    await axios.post(
      "/logout",
      {},
      {
        withCredentials: true,
      }
    );
    userStore.setUserInfo();
  } catch (error) {
    console.error(error.response.data);
  }
};
</script>

<template>
  <button type="button" @click="logout">
    <img src="/src/assets/logout.svg" alt="logout" />
  </button>
</template>

<style scoped>
button {
  position: fixed;
  left: 30px;
  bottom: 30px;
  aspect-ratio: 1/1;
  width: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 30px;
  }
}
</style>
