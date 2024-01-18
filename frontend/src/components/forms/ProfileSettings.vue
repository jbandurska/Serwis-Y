<template>
  <div class="box wrapper first">
    <h2>User Settings</h2>
    <form @submit.prevent="updateUser">
      <label for="login">Login:</label>
      <input id="login" v-model="userData.login" type="text" />

      <label for="email">Email:</label>
      <input id="email" v-model="userData.email" type="text" />

      <label for="password">Password:</label>
      <input id="password" v-model="userData.password" type="password" />

      <label for="confirmPassword">Confirm Password:</label>
      <input id="confirmPassword" v-model="confirmPassword" type="password" />

      <label for="profilePicture">Profile Picture:</label>
      <input type="file" accept="image/*" @change="handleFileUpload" />

      <button type="submit">Update</button>
      <button type="button" @click="deleteUser">Delete User</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { userStore } from '../../stores/user.store';
import imageCompression from 'browser-image-compression';

const router = useRouter();

const userData = ref({
  login: userStore.userInfo.user.login,
  email: userStore.userInfo.user.email,
  password: ''
});

const confirmPassword = ref('');
let profilePictureFile = null;

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    profilePictureFile = file;
  }
};

const updateUser = async () => {
  const { login, email, password } = userData.value;

  if (password && password !== confirmPassword.value) {
    alert('Passwords do not match');
    return;
  }

  const formData = new FormData();
  if (login) formData.append('login', login);
  if (email) formData.append('email', email);
  if (password) formData.append('password', password);
  if (profilePictureFile) {
    const compressedImg = await imageCompression(profilePictureFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true
    });

    formData.append('profilePicture', compressedImg);
  }

  try {
    const response = await axios.put('/api/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    userStore.setUserInfo(response.data.user);
    router.go(-1);
  } catch (error) {
    alert(error.response.data.message);
  }
};

const deleteUser = async () => {
  if (confirm('Are you sure you want to delete your account?')) {
    try {
      await axios.delete('/api/users/delete', {
        withCredentials: true
      });

      userStore.setUserInfo();
    } catch (error) {
      alert('Something went wrong, try again later!');
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 20px 50px;
  margin: 30px;
  width: 100%;
  max-width: 700px;
}

form {
  width: 100%;
}
</style>
