<template>
  <header>
    <div class="logo">Y</div>
    <div class="user">
      <span>{{ user.login }}</span>
      <img
        v-if="user.profilePicture"
        :src="user.profilePicture"
        alt="profile picture"
      />
    </div>
  </header>
</template>

<script setup>
import { userStore } from "../../stores/user.store";

const user = userStore.userInfo.user;
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 10px 50px;
  width: 100%;
  position: fixed;
  top: 0;
}

.logo {
  font-weight: bold;
  font-size: 36px;
  transition: 0.25s;

  &:hover {
    text-shadow: 3px 0px 7px var(--text), -3px 0px 7px var(--text),
      0px 4px 7px var(--text);
    color: #1a1a1a;
  }
}
</style>
