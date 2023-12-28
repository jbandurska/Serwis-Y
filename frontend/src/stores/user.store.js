import { reactive } from "vue";
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
  if (user) userInfo.user = user;
};

const setUserInfo = ({ user }) => {
  if (user) {
    userInfo.isLogged = true;
    userInfo.user = user;
  }
};

export const userStore = {
  userInfo,
  checkIfAuthenticated,
  setUserInfo,
};
