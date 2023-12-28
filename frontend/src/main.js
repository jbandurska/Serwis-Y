import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import axios from "axios";
import { environment } from "./env";

import Auth from "./components/auth-forms/Auth.vue";
import HomePage from "./pages/HomePage.vue";

const routes = [
  {
    path: "/",
    component: Auth,
  },
  {
    path: "/home",
    component: HomePage,
    children: [],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

axios.defaults.baseURL = environment.backendUrl;

const app = createApp(App);
app.use(router);
app.mount("#app");
