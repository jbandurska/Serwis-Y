<script setup>
import Header from "../components/header/Header.vue";
import LogoutBtn from "../components/logout-btn/LogoutBtn.vue";
</script>

<template>
  <Header></Header>
  <div class="center-container">
    <router-view></router-view>
  </div>
  <LogoutBtn></LogoutBtn>
</template>
