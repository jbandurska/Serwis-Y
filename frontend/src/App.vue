<script setup>
import { userStore } from './stores/user.store';
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
watch(userStore.userInfo, (newInfo) => {
  if (newInfo.isLogged && route.path == '/') {
    router.push('/home');
  } else if (!newInfo.isLogged) {
    router.push('/');
  }
});

userStore.checkIfAuthenticated();
</script>

<template>
  <router-view />
</template>

<style scoped></style>
