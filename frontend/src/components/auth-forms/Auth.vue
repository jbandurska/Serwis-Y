<template>
  <div class="box auth">
    <div class="form-container">
      <h1>Log in</h1>
      <form @submit.prevent="login">
        <input v-model="loginData.login" required placeholder="Username" />
        <input
          type="password"
          v-model="loginData.password"
          required
          placeholder="Password"
        />
        <button type="submit">Log in</button>

        <p v-show="loginMsg">{{ loginMsg }}</p>
      </form>
    </div>

    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="registerData.login" required placeholder="Username" />
        <input
          type="email"
          v-model="registerData.email"
          required
          placeholder="Email"
        />
        <input
          type="password"
          v-model="registerData.password"
          required
          placeholder="Password"
        />
        <input
          type="password"
          v-model="registerData.confirmPassword"
          required
          placeholder="Confirm password"
        />
        <button type="submit">Register</button>

        <p v-show="registerMsg">{{ registerMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { userStore } from "../../stores/user.store";

const loginData = ref({
  login: "",
  password: "",
});

const registerData = ref({
  login: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const loginMsg = ref("");
const registerMsg = ref("");

const login = async () => {
  try {
    const response = await axios.post("/login", loginData.value, {
      withCredentials: true,
    });
    userStore.setUserInfo(response.data.user);
  } catch (error) {
    loginMsg.value = error.response.data.message;
    registerMsg.value = "";
  }
};

const register = async () => {
  if (registerData.value.password !== registerData.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post("/register", registerData.value, {
      withCredentials: true,
    });
    userStore.setUserInfo(response.data.user);
  } catch (error) {
    registerMsg.value = error.response.data.message;
    loginMsg.value = "";
  }
};
</script>

<style scoped>
.auth {
  width: 500px;
  padding: 20px 50px;

  .form-container {
    margin-bottom: 50px;
  }
}

h1 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;

  input {
    background-color: #242424;
    border: 1px solid var(--main);
    color: inherit;
  }

  p {
    text-align: center;
  }
}
</style>
