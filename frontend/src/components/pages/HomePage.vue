<script setup>
import AppHeader from '../layout/AppHeader.vue';
import LogoutBtn from '../buttons/LogoutBtn.vue';
</script>

<template>
  <AppHeader />
  <div class="center-container">
    <router-view></router-view>
  </div>
  <LogoutBtn />
</template>
