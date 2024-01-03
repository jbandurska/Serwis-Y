<template>
  <div class="thread" :class="{ odd: nestingLevel % 2 }">
    <div class="head">
      <router-link v-if="thread.user" :to="`/home/user/${thread.user._id}`">
        {{ thread.user.login }}
      </router-link>
      <p class="small">
        <router-link :to="`/home/threads/${thread._id}`"
          >thread page</router-link
        >
        {{ date }}
        <DeleteThreadBtn
          :thread="thread"
          @delete="$emit('delete')"
        ></DeleteThreadBtn>
      </p>
    </div>
    <p>
      {{ thread.content }}
    </p>
    <button type="button" @click="toggleThread">
      {{ isThreadVisible ? "hide thread" : "show thread" }}
    </button>
    <CommentList
      v-if="isThreadVisible"
      :parent-thread-id="thread._id"
      :nesting-level="nestingLevel + 1"
    ></CommentList>
  </div>
</template>

<script setup>
import CommentList from "./CommentList.vue";
import DeleteThreadBtn from "../DeleteThreadBtn.vue";
import { ref, computed } from "vue";

const props = defineProps({
  thread: Object,
  nestingLevel: Number,
});

const date = computed(() => {
  if (props.thread?.createdAt)
    return new Date(props.thread.createdAt).toLocaleString();
});

const isThreadVisible = ref(false);

const toggleThread = () => {
  isThreadVisible.value = !isThreadVisible.value;
};
</script>

<style scoped>
.small {
  color: #777;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

p {
  margin: 0;
}

.thread {
  padding: 10px;
  padding-top: 5px;
  border-radius: 8px;
  background-color: var(--bg);

  button {
    margin: 0 auto;
    display: block;
    padding: 0;
    background-color: transparent;
    color: var(--main);
    margin-bottom: 5px;
    font-size: 0.9em;
  }
}

div.odd {
  background-color: #444;
}
</style>
