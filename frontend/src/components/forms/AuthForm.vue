<template>
  <div class="box auth first">
    <div class="form-container">
      <h1>Log in</h1>
      <form @submit.prevent="login">
        <input v-model="loginData.login" required placeholder="Username" />
        <input v-model="loginData.password" type="password" required placeholder="Password" />
        <button type="submit">Log in</button>

        <p v-show="loginMsg">{{ loginMsg }}</p>
      </form>
    </div>

    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="registerData.login" required placeholder="Username" />
        <input v-model="registerData.email" type="email" required placeholder="Email" />
        <input v-model="registerData.password" type="password" required placeholder="Password" />
        <input
          v-model="registerData.confirmPassword"
          type="password"
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
import { ref } from 'vue';
import axios from 'axios';
import { userStore } from '../../stores/user.store';

const loginData = ref({
  login: '',
  password: ''
});

const registerData = ref({
  login: '',
  password: '',
  confirmPassword: '',
  email: ''
});

const loginMsg = ref('');
const registerMsg = ref('');

const login = async () => {
  try {
    const response = await axios.post('/api/login', loginData.value, {
      withCredentials: true
    });
    userStore.setUserInfo(response.data.user);
  } catch (error) {
    loginMsg.value = error.response.data.message;
    registerMsg.value = '';
  }
};

const register = async () => {
  if (registerData.value.password !== registerData.value.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await axios.post('/api/register', registerData.value, {
      withCredentials: true
    });
    userStore.setUserInfo(response.data.user);
  } catch (error) {
    registerMsg.value = error.response.data.message;
    loginMsg.value = '';
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
</style>
