<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import CommentList from "./comments/CommentList.vue";

const route = useRoute();
const threadId = computed(() => {
  return route.params.threadId;
});

const props = defineProps({
  thread: Object,
});

const user = computed(() => {
  return props.thread.user;
});
const date = computed(() => {
  if (props.thread?.createdAt)
    return new Date(props.thread.createdAt).toLocaleString();
});
const isThreadView = computed(() => {
  return !!route.params.threadId;
});
</script>

<template>
  <div v-if="thread" class="thread box">
    <div class="head flex">
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
      <p class="small">
        {{ date }}
      </p>
    </div>

    <p class="content">
      {{ thread.content }}
    </p>

    <p class="comments small">{{ thread.children?.length }} comments</p>

    <CommentList
      v-if="isThreadView"
      :parent-thread-id="threadId"
      :nesting-level="0"
    ></CommentList>
    <router-link v-else :to="`/home/threads/${thread._id}`"
      >See thread</router-link
    >
  </div>
</template>

<style scoped>
.small {
  color: #777;
  font-size: 0.9em;
}
.thread {
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-width: 1000px;
  max-width: 1200px;

  .content {
    padding: 20px;
    background-color: var(--bg);
    border-radius: 8px;
  }

  a {
    align-self: center;
  }
}
.comments {
  padding: 0 15px;
}
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
.head {
  padding: 0 10px;
  justify-content: space-between;
  flex-wrap: nowrap;
}
</style>
