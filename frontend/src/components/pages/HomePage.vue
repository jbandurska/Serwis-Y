<script setup>
import Header from "../layout/Header.vue";
import LogoutBtn from "../buttons/LogoutBtn.vue";
</script>

<template>
  <Header></Header>
  <div class="center-container">
    <router-view></router-view>
  </div>
  <LogoutBtn></LogoutBtn>
</template>
