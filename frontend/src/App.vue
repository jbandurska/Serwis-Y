<script setup>
import Header from "./components/header/Header.vue";
import Auth from "./components/auth-forms/Auth.vue";
import { userStore } from "./stores/user.store";
import { watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
watch(userStore.userInfo, (newInfo) => {
  if (newInfo.isLogged) {
    router.push("/home");
  } else {
    router.push("/");
  }
});

userStore.checkIfAuthenticated();
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
