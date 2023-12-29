<template>
  <header>
    <router-link to="/home">
      <div class="logo">Y</div>
    </router-link>
    <div v-if="user" class="user">
      <router-link :to="`/home/user/${user._id}`">
        <div class="flex">
          <span>{{ user.login }}</span>
          <img
            v-if="user.profilePicture"
            :src="user.profilePicture"
            alt="profile picture"
          />
        </div>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { userStore } from "../../stores/user.store";

const user = computed(() => {
  return userStore.userInfo.user;
});
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

.user {
  img {
    width: 50px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }

  .flex {
    display: flex;
    align-items: center;
    gap: 15px;
  }
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
