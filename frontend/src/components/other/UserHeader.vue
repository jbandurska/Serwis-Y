<template>
  <div v-if="user" class="user">
    <router-link :to="`/home/user/${user._id}`">
      <div class="flex">
        <img
          v-if="user.profilePicture"
          :src="user.profilePicture"
          alt="profile picture"
        />
        <span>{{ user.login }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  user: Object,
});
</script>

<style scoped>
.user {
  img {
    width: 50px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
}

.flex {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
