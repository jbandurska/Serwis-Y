<template>
  <div class="box first">
    <GoBackBtn></GoBackBtn>
    <div class="user">
      <UserHeader
        v-for="user in following"
        :key="user._id"
        :user="user"
      ></UserHeader>
      <p v-if="!following.length">You're not following anyone!</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import GoBackBtn from "../buttons/GoBackBtn.vue";
import axios from "axios";
import UserHeader from "../other/UserHeader.vue";

const following = ref([]);

const getFollowing = async () => {
  try {
    const response = await axios.get(`/api/users/following`, {
      withCredentials: true,
    });

    following.value = response.data.following;
  } catch (error) {
    console.error(error);
  }
};

onMounted(getFollowing);
</script>

<style scoped>
.box {
  width: 100%;
  max-width: 500px;
}

.user {
  padding: 10px 0;

  p {
    text-align: center;
    padding: 0 5px;
  }
}
</style>
