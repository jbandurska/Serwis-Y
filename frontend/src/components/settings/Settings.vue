<template>
  <div class="box wrapper first">
    <h2>User Settings</h2>
    <form @submit.prevent="updateUser">
      <label for="login">Login:</label>
      <input v-model="userData.login" type="text" id="login" />

      <label for="email">Email:</label>
      <input v-model="userData.email" type="text" id="email" />

      <label for="password">Password:</label>
      <input v-model="userData.password" type="password" id="password" />

      <label for="confirmPassword">Confirm Password:</label>
      <input v-model="confirmPassword" type="password" id="confirmPassword" />

      <label for="profilePicture">Profile Picture:</label>
      <input type="file" @change="handleFileUpload" accept="image/*" />

      <button type="submit">Update</button>
      <button type="button" @click="deleteUser">Delete User</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { userStore } from "../../stores/user.store";

const router = useRouter();

const userData = ref({
  login: userStore.userInfo.user.login,
  email: userStore.userInfo.user.email,
  password: "",
});

const confirmPassword = ref("");
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
    alert("Passwords do not match");
    return;
  }

  const formData = new FormData();
  if (login) formData.append("login", login);
  if (email) formData.append("email", email);
  if (password) formData.append("password", password);
  if (profilePictureFile) formData.append("profilePicture", profilePictureFile);

  try {
    const response = await axios.put("/api/users/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    userStore.setUserInfo(response.data.user);
    router.go(-1);
  } catch (error) {
    alert(error.response.data.message);
  }
};

const deleteUser = async () => {
  if (confirm("Are you sure you want to delete your account?")) {
    try {
      const response = await axios.delete("/api/users/delete", {
        withCredentials: true,
      });

      userStore.setUserInfo();
    } catch (error) {
      alert("Something went wrong, try again later!");
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 20px 50px;
  margin: 30px;
  width: 100%;
}

form {
  width: 100%;
  max-width: 600px;
}
</style>
