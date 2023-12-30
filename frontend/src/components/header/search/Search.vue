<template>
  <div class="wrapper">
    <input v-model="searchKey" type="text" placeholder="Search" />
    <button @click="searchUsers">Search</button>
    <div class="results" v-if="searchResults.length">
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
import axios from "axios";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const searchKey = ref("");
const searchResults = ref([]);

const route = useRoute();

const close = () => {
  searchResults.value = [];
};

watch(route, close);

const searchUsers = async () => {
  if (searchKey.value) {
    try {
      const response = await axios.get(
        `/api/users/search?key=${searchKey.value}`,
        {
          withCredentials: true,
        }
      );
      searchResults.value = response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 40%;

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
    width: 83%;
  }

  button {
    width: 15%;
    margin-left: 2%;
  }
}
</style>
