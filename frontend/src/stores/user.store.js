import { reactive, watch } from "vue";
import axios from "axios";

const userInfo = reactive({
  user: {},
  isLogged: false,
});

const checkIfAuthenticated = async () => {
  const response = await axios.get("/check-session", {
    withCredentials: true,
  });

  const { isAuthenticated, user } = response.data;

  userInfo.isLogged = isAuthenticated;
  userInfo.user = user;
};

const setUserInfo = (user) => {
  userInfo.isLogged = !!user;
  userInfo.user = user || {};
};

export const userStore = {
  userInfo,
  checkIfAuthenticated,
  setUserInfo,
};
