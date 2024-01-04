<script setup>
import axios from "axios";
import { userStore } from "../../stores/user.store";

const logout = async () => {
  try {
    await axios.post(
      "/api/logout",
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
  <div>
    <button type="button" @click="logout">
      <img src="/src/assets/logout.svg" alt="logout" />
    </button>
  </div>
</template>

<style scoped>
div {
  position: fixed;
  left: 30px;
  bottom: 30px;

  button {
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

  @media (max-width: 1300px) {
    background-color: var(--main);
    padding: 5px;
    left: 0;
    bottom: 10px;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
  }
}
</style>
