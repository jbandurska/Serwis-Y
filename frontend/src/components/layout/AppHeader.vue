<template>
  <header>
    <router-link to="/home" class="small logo-link" @click="onLogoClick">
      <div class="logo">Y</div>
      <NotificationComponent class="notification" :count="count" />
    </router-link>
    <SearchBar class="search-bar"></SearchBar>
    <div v-if="user" class="user small">
      <router-link :to="`/home/user/${user._id}`">
        <div class="flex">
          <span>{{ user.login }}</span>
          <img v-if="user.profilePicture" :src="user.profilePicture" alt="profile picture" />
        </div>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { userStore } from '../../stores/user.store';
import SearchBar from '../other/SearchBar.vue';
import NotificationComponent from '../other/NotificationComponent.vue';
import { socket } from '../../socket';
import { feedStore } from '../../stores/feed.store';
import { useRoute } from 'vue-router';

const route = useRoute();

const user = computed(() => {
  return userStore.userInfo.user;
});

const count = ref(0);

socket.on('new-thread', () => {
  count.value++;
});

const onLogoClick = () => {
  // we're checking if we stay on the same page not to make
  // two requests on page change (onMounted in FeedPage)
  if (route.fullPath === '/home' && count.value > 0) {
    feedStore.getFeed();
  }
  count.value = 0;
};
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

.logo-link {
  position: relative;

  .notification {
    position: absolute;
    top: 0;
    left: 75%;
  }
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
    text-shadow:
      3px 0px 7px var(--main),
      -3px 0px 7px var(--main),
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
