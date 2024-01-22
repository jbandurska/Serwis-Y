import axios from 'axios';
import { ref } from 'vue';

const feed = ref([]);
const feedMessage = ref('');

const getFeed = async () => {
  try {
    const response = await axios.get(`/api/threads/feed`, {
      withCredentials: true
    });

    feed.value = response.data.threads;

    const count = feed.value.length;
    if (count == 1) {
      feedMessage.value = `1 thread this week`;
    } else {
      feedMessage.value = `${count} threads this week`;
    }
  } catch (error) {
    alert('Something went wrong :(');
  }
};

export const feedStore = {
  feed,
  feedMessage,
  getFeed
};
