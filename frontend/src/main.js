import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import axios from "axios";
import { environment } from "./env";

import Auth from "./components/auth-forms/Auth.vue";
import HomePage from "./pages/HomePage.vue";
import ThreadPage from "./pages/ThreadPage.vue";
import FeedPage from "./pages/FeedPage.vue";
import UserProfile from "./components/user-profile/UserProfile.vue";
import Settings from "./components/settings/Settings.vue";
import QuoteForm from "./components/quotes/QuoteForm.vue";

const routes = [
  {
    path: "/",
    component: Auth,
  },
  {
    path: "/home",
    component: HomePage,
    children: [
      {
        path: "",
        component: FeedPage,
      },
      {
        path: "quote/:quoteId",
        component: QuoteForm,
      },
      {
        path: "threads/:threadId",
        component: ThreadPage,
      },
      {
        path: "user/settings",
        component: Settings,
      },
      {
        path: "user/:id",
        component: UserProfile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

axios.defaults.baseURL = environment.backendUrl;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      router.push("/");
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);
app.use(router);
app.mount("#app");
