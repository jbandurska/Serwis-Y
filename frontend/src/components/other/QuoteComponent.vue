<template>
  <div class="quote">
    <div v-if="thread.user" class="user">
      <router-link :to="`/home/user/${thread.user._id}`">
        <div class="flex">
          <img
            v-if="thread.user.profilePicture"
            :src="thread.user.profilePicture"
            alt="profile picture"
          />
          <span>{{ thread.user.login }}</span>
        </div>
      </router-link>
    </div>

    <p class="content">
      {{ thread.content }}
    </p>

    <router-link v-if="thread._id && !isForm" :to="`/home/threads/${thread._id}`" class="original"
      >see original thread</router-link
    >
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const props = defineProps({
  quoteId: String
});

const route = useRoute();
const thread = ref({});

const isForm = computed(() => {
  return route.path.includes('quote');
});

const getQuotedThread = async () => {
  const quoteId = route.params.quoteId || props.quoteId;

  try {
    const response = await axios.get(`/api/threads/${quoteId}`, {
      withCredentials: true
    });

    thread.value = response.data.thread;
  } catch (error) {
    if (error.response.status === 404) {
      thread.value.content = 'Content not available';
      return;
    }

    console.error(error);
  }
};

watchEffect(getQuotedThread);
</script>

<style scoped>
.original {
  display: block;
  margin-left: auto;
  margin-right: 0;
  width: fit-content;
  font-size: 0.9em;
}
.quote {
  border-top: 1px solid #777;
  border-bottom: 1px solid #777;
  padding: 20px;
  margin: 20px;
}
.content {
  white-space: pre-wrap;
  font-style: italic;
  color: #aaa;
}
.user {
  img {
    width: 40px;
    aspect-ratio: 1/1;
  }
}

.flex {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
