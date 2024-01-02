<template>
  <div v-if="user" class="wrapper">
    <div class="card box">
      <div class="info">
        <img
          v-show="user.profilePicture"
          :src="user.profilePicture"
          alt="profile picture"
        />
        <h2>{{ user.login }}</h2>
      </div>
      <button v-if="!isLoggedUser" @click="toggleFollow">
        {{ isFollowing ? "Unfollow" : "Follow" }}
      </button>
      <button v-else type="button" @click="goToSettings">Settings</button>
    </div>
    <div class="threads">
      <NewThreadForm v-if="isLoggedUser" :threads="threads"></NewThreadForm>
      <ThreadList :threads="threads"></ThreadList>
    </div>
  </div>
</template>

<script setup>
import NewThreadForm from "./new-thread-form/NewThreadForm.vue";
import ThreadList from "../../shared/threads/ThreadList.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "../../stores/user.store";
import axios from "axios";

const user = ref(null);
const threads = ref([]);

const isFollowing = ref(false);

const setIsFollowing = () => {
  if (user.value && userStore.userInfo.user.following) {
    isFollowing.value = userStore.userInfo.user.following.includes(
      user.value._id
    );
  }
};

// depending on what loads first
watch(user, setIsFollowing);
watch(userStore.userInfo, setIsFollowing);

const isLoggedUser = computed(() => {
  return user.value?._id === userStore.userInfo.user._id;
});

const route = useRoute();
const router = useRouter();

const goToSettings = () => {
  router.push("/home/user/settings");
};

const fetchUserData = async () => {
  const userId = route.params.id;
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      withCredentials: true,
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
        withCredentials: true,
      });
    } else {
      await axios.post(`/api/users/${userId}/follow`, null, {
        withCredentials: true,
      });
    }

    isFollowing.value = !isFollowing.value;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  fetchUserData();
});

watch(route, () => {
  fetchUserData();
});
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
  padding: 20px 70px;
  gap: 100px;

  .threads {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
.card {
  align-self: flex-start;
  margin-top: 100px;
  width: 20%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  aspect-ratio: 2/1;

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
</style>
