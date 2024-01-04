<template>
  <div class="wrapper">
    <GoBackBtn v-if="isThreadView" class="go-back"></GoBackBtn>
    <div v-if="thread" class="thread box" :class="{ first: isThreadView }">
      <router-link
        v-if="thread.parentId"
        :to="`/home/threads/${thread.parentId}`"
        >parent thread</router-link
      >
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
          <QuoteThreadBtn :threadId="thread._id"></QuoteThreadBtn>
          {{ date }}
          <DeleteThreadBtn
            :thread="thread"
            @delete="deleteThread"
          ></DeleteThreadBtn>
        </p>
      </div>

      <Quote v-if="thread.quote" :quote-id="thread.quote"></Quote>

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
        >see thread</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import CommentList from "./comments/CommentList.vue";
import Quote from "../../components/quotes/Quote.vue";
import DeleteThreadBtn from "./DeleteThreadBtn.vue";
import QuoteThreadBtn from "./QuoteThreadBtn.vue";
import GoBackBtn from "../GoBackBtn.vue";

const route = useRoute();
const router = useRouter();
const threadId = computed(() => {
  return route.params.threadId;
});

const props = defineProps({
  thread: Object,
  deleteThread: Function,
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

const deleteThread = () => {
  if (route.path.includes("thread")) {
    router.back();
  } else {
    props.deleteThread(props.thread._id);
  }
};
</script>

<style scoped>
.wrapper {
  position: relative;

  .go-back {
    position: absolute;
    left: -70px;
    background-color: var(--main);
  }

  .border {
    border-left: 1px solid var(--main);
  }
}
.small {
  color: #777;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 5px;
}
.thread {
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;

  button {
    margin: 0 auto;
    display: block;
    padding: 0;
    background-color: transparent;
    color: var(--main);
    margin-bottom: 5px;
    font-size: 0.9em;
  }

  .content {
    padding: 20px;
    background-color: var(--bg);
    border-radius: 8px;
    white-space: pre-wrap;
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

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;

    .user {
      order: 1;
    }
  }
}
</style>
