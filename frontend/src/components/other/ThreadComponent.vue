<template>
  <div class="wrapper">
    <button
      v-if="areNewThreads && isThreadView"
      type="button"
      class="new-comments-btn"
      @click="
        areNewThreads = false;
        refresh = true;
      "
    >
      Click to see new comments
    </button>
    <div v-if="thread" class="thread box" :class="{ first: isThreadView }">
      <GoBackBtn v-if="isThreadView" class="go-back" :url="goBackUrl" />
      <router-link
        v-if="thread.parentId"
        :to="`/home/threads/${thread.parentId}?around=${thread._id}`"
      >
        parent thread
      </router-link>
      <div class="head flex">
        <UserHeader :user="user"></UserHeader>
        <p class="small">
          <QuoteThreadBtn :thread-id="thread._id" />
          {{ date }}
          <DeleteThreadBtn :thread="thread" @delete="deleteThread" />
        </p>
      </div>

      <QuoteComponent v-if="thread.quote" :quote-id="thread.quote" />

      <p class="content">
        {{ thread.content }}
      </p>

      <p class="comments small">{{ thread.seenBy?.length }} views | {{ comments }} comments</p>

      <CommentList
        v-if="isThreadView"
        :parent-thread-id="threadId"
        :refresh="refresh"
        @new-comment="newComment"
      />
      <router-link v-else :to="`/home/threads/${thread._id}`"> see thread </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CommentList from './CommentList.vue';
import QuoteComponent from './QuoteComponent.vue';
import DeleteThreadBtn from '../buttons/DeleteThreadBtn.vue';
import QuoteThreadBtn from '../buttons/QuoteThreadBtn.vue';
import GoBackBtn from '../buttons/GoBackBtn.vue';
import { socket } from '../../socket';
import UserHeader from './UserHeader.vue';
import { pathService } from '../../services/PathService';

const route = useRoute();
const router = useRouter();
const threadId = computed(() => {
  return route.params.threadId;
});

const props = defineProps({
  thread: Object,
  deleteThread: Function
});

const comments = ref(props.thread.children?.length ?? 0);

const newComment = () => {
  comments.value++;
  console.log('newCOmment');
};

const areNewThreads = ref(false);
const refresh = ref(false);

const user = computed(() => {
  return props.thread.user;
});
const date = computed(() => {
  if (props.thread?.createdAt) return new Date(props.thread.createdAt).toLocaleString();

  return '';
});
const isThreadView = computed(() => {
  return !!route.params.threadId;
});

socket.on('new-subthread', () => {
  // we're setting refresh value to false again
  // to be able to trigger the refresh in the child component
  // after clicking the refresh button
  refresh.value = false;
  areNewThreads.value = true;
  comments.value += 1;
});

const goBackUrl = computed(() => {
  if (props.thread.parentId) {
    return `/home/threads/${props.thread.parentId}?around=${props.thread._id}`;
  } else {
    return pathService.lastSignificantPage.value;
  }
});

const deleteThread = () => {
  if (route.path.includes('thread') && goBackUrl.value) {
    router.push(goBackUrl.value);
  } else if (route.path.includes('thread')) {
    router.back();
  } else {
    props.deleteThread(props.thread._id);
  }
};

watchEffect(() => {
  if (threadId.value) {
    socket.emit('thread-change', threadId.value);
  }
});

watch(
  () => {
    props.thread;
  },
  () => {
    comments.value = props.thread.children?.length ?? 0;
  }
);
</script>

<style scoped>
.new-comments-btn {
  background-color: var(--main);
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;

  @media (max-width: 800px) {
    top: 20px;
    transform: translate(-50%, 0);
  }
}
.wrapper {
  position: relative;
  .go-back {
    padding: 5px;
    margin: 0 auto 10px 0;
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
