<script setup>
import Header from "./components/header/Header.vue";
import Auth from "./components/auth-forms/Auth.vue";
import { userStore } from "./stores/user.store";

userStore.checkIfAuthenticated();
</script>

<template>
  <!-- <Header></Header> -->
  <Auth></Auth>
  <p>{{ userStore }}</p>
</template>

<style scoped></style>
