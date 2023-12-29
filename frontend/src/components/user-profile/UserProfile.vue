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
      <button v-if="!isLoggedUser" type="button">Follow</button>
      <button v-else type="button" @click="goToSettings">Settings</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "../../stores/user.store";
import axios from "axios";

const user = ref(null);

const isLoggedUser = computed(() => {
  return user.value?._id === userStore.userInfo.user._id;
});

const route = useRoute();
const router = useRouter();

const goToSettings = () => {
  router.push("/home/user/settings");
};

onMounted(async () => {
  const userId = route.params.id;
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      withCredentials: true,
    });

    user.value = response.data.user;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
h2,
p {
  margin: 0;
}
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 50px;
}
.card {
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
