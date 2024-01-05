<template>
  <header>
    <router-link to="/home" class="small">
      <div class="logo">Y</div>
    </router-link>
    <Search class="search-bar"></Search>
    <div v-if="user" class="user small">
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
import Search from "../other/Search.vue";

const user = computed(() => {
  return userStore.userInfo.user;
});
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333333b9;
  padding: 10px 50px;
  backdrop-filter: blur(10px);
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
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
    text-shadow: 3px 0px 7px var(--main), -3px 0px 7px var(--main),
      0px 4px 7px var(--main);
    color: var(--text);
  }
}

@media (max-width: 1000px) {
  header {
    flex-wrap: wrap;
    padding: 20px 50px;
    gap: 20px;

    .search-bar {
      order: 1;
    }

    .small {
      margin: 0 auto;
    }
  }
}
</style>
