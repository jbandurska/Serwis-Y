import { reactive, watchEffect } from 'vue';
import axios from 'axios';
import { socket } from '../socket';

const userInfo = reactive({
  user: {},
  isLogged: false
});

const initiateNotificationsSocket = (user) => {
  if (user) {
    socket.emit('notifications-init', user.following || []);
  }
};

const checkIfAuthenticated = async () => {
  const response = await axios.get('/api/check-session', {
    withCredentials: true
  });

  const { isAuthenticated, user } = response.data;

  initiateNotificationsSocket(user);

  userInfo.isLogged = isAuthenticated;
  userInfo.user = user;
};

const setUserInfo = (user) => {
  userInfo.isLogged = !!user;
  userInfo.user = user || {};

  initiateNotificationsSocket(user);
};

watchEffect(() => {
  if (userInfo.isLogged) {
    socket.connect();
  } else {
    socket.disconnect();
  }
});

export const userStore = {
  userInfo,
  checkIfAuthenticated,
  setUserInfo
};
