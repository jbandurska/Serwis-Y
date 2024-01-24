<template>
  <div v-if="user" class="wrapper">
    <div class="card box first">
      <div class="info">
        <img v-show="user.profilePicture" :src="user.profilePicture" alt="profile picture" />
        <h2>{{ user.login }}</h2>
      </div>
      <button v-if="!isLoggedUser" @click="toggleFollow">
        {{ isFollowing ? 'Unfollow' : 'Follow' }}
      </button>
      <template v-else>
        <button type="button" @click="goToSettings">Settings</button>
        <router-link to="/home/user/following">Following</router-link>
      </template>
    </div>
    <div class="threads">
      <ThreadForm
        v-if="isLoggedUser"
        class="box"
        placeholder="What's on your mind?"
        path="/api/threads"
        :cb="
          (newThread) => {
            threads.value.unshift({
              ...newThread,
              commentsCount: 0,
              user: userStore.userInfo.user || {}
            });

            socket.emit('new-thread');
          }
        "
      />
      <ThreadList :threads="threads" />
    </div>
  </div>
</template>

<script setup>
import ThreadForm from '../forms/ThreadForm.vue';
import ThreadList from '../other/ThreadList.vue';
import { ref, watchEffect, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userStore } from '../../stores/user.store';
import axios from 'axios';
import { socket } from '../../socket';

const user = ref(null);
const threads = ref([]);
const isFollowing = ref(false);

const setIsFollowing = () => {
  if (user.value && userStore.userInfo.user.following) {
    isFollowing.value = userStore.userInfo.user.following.includes(user.value._id);
  }
};

const isLoggedUser = computed(() => {
  return user.value?._id === userStore.userInfo.user._id;
});

const route = useRoute();
const router = useRouter();

const goToSettings = () => {
  router.push('/home/user/settings');
};

const fetchUserData = async () => {
  const userId = route.params.id;
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      withCredentials: true
    });

    user.value = response.data.user;
  } catch (error) {
    console.error(error);
  }
};

const toggleFollow = async () => {
  const userId = route.params.id;
  try {
    if (isFollowing.value) {
      await axios.post(`/api/users/${userId}/unfollow`, null, {
        withCredentials: true
      });
    } else {
      await axios.post(`/api/users/${userId}/follow`, null, {
        withCredentials: true
      });
    }

    isFollowing.value = !isFollowing.value;

    // to refresh user info after toggling follow
    userStore.checkIfAuthenticated();
  } catch (error) {
    console.error(error);
  }
};

watchEffect(setIsFollowing);
watchEffect(fetchUserData);
</script>

<style scoped>
h2 {
  margin: 0;
  text-align: center;
}
.wrapper {
  width: 100vw;
  min-height: calc(100vh - 40px - 75px);
  display: flex;
  padding: 20px;
  gap: 50px;

  .threads {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
.card {
  align-self: flex-start;
  margin-top: 101px;
  width: 20%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  img {
    width: 80%;
    border-radius: 50%;
    aspect-ratio: 1/1;
    margin-bottom: 10px;
  }
}

@media (max-width: 800px) {
  .wrapper {
    flex-direction: column;
    padding: 0;
    gap: 0;

    .threads {
      gap: 0;
    }

    .card {
      margin: 0;
      width: 100%;
      aspect-ratio: auto;

      img {
        width: 100px;
      }
    }
  }
}
</style>
