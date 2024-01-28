import { ref } from 'vue';

const notificationCounter = ref(0);

const onNewThreads = (newer, nbOfNewThreads) => {
  if (newer) {
    notificationCounter.value -= nbOfNewThreads || notificationCounter.value;
  }

  if (notificationCounter.value < 0) notificationCounter.value = 0;
};

export const feedService = {
  notificationCounter,
  onNewThreads
};
