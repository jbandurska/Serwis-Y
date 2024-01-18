<template>
  <div class="box first">
    <h2>Quote thread</h2>
    <Quote></Quote>
    <ThreadForm
      placeholder="What would you add?"
      :path="`/api/threads/quote/${route.params.quoteId}`"
      :cb="
        () => {
          router.push(`/home/user/${loggedUserId}`);
        }
      "
    ></ThreadForm>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { userStore } from "../../stores/user.store";
import Quote from "../other/Quote.vue";
import ThreadForm from "./ThreadForm.vue";

const route = useRoute();
const router = useRouter();

const loggedUserId = userStore.userInfo.user._id;
</script>

<style scoped>
.box {
  width: 100%;
  max-width: 1000px;
  padding-bottom: 20px;

  h2 {
    text-align: center;
  }
}
</style>
