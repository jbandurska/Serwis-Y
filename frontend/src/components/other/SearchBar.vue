<template>
  <div class="wrapper">
    <input v-model="searchKey" type="text" placeholder="Search" @keyup.enter="searchUsers" />
    <button @click="searchUsers">
      <img src="/src/assets/search.svg" alt="" />
    </button>
    <div v-if="searchResults.length" class="results">
      <ul>
        <li v-for="user in searchResults" :key="user._id">
          <router-link :to="`/home/user/${user._id}`">
            {{ user.login }}
          </router-link>
        </li>
        <button class="close" type="button" @click="close">Close</button>
      </ul>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const searchKey = ref('');
const searchResults = ref([]);

const route = useRoute();

const close = () => {
  searchResults.value = [];
};

watch(route, close);

const searchUsers = async () => {
  if (searchKey.value) {
    try {
      const response = await axios.get(`/api/users/search?key=${searchKey.value}`, {
        withCredentials: true
      });
      searchResults.value = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 70%;
  max-width: 800px;
  display: flex;
  align-items: stretch;
  gap: 5px;
  margin: 0 auto;

  .results {
    position: absolute;
    background-color: #333;
    width: 100%;
    border-radius: 8px;
    top: calc(100% + 5px);

    ul {
      list-style-type: none;
      border-radius: 8px;
      padding: 0;
      margin: 0;
      overflow: hidden;
      border: 1px solid var(--main);

      .close {
        background-color: transparent;
        margin: 0;
        display: block;
        width: 100%;
        border-radius: 0;

        &:hover {
          background-color: var(--main);
        }
      }

      li {
        transition: 0.25s;

        a {
          padding: 10px 25px;
          display: block;
        }
      }

      li:hover {
        cursor: pointer;
        background-color: var(--bg);
      }
    }
  }

  input {
    width: 100%;
  }

  button {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 1em;
    }
  }

  @media (max-width: 1000px) {
    width: 100%;
  }
}
</style>
