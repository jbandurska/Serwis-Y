import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import './style.css';
import App from './App.vue';
import axios from 'axios';
import { environment } from './env';

import AuthForm from './components/forms/AuthForm.vue';
import HomePage from './components/pages/HomePage.vue';
import ThreadPage from './components/pages/ThreadPage.vue';
import FeedPage from './components/pages/FeedPage.vue';
import UserProfile from './components/pages/UserProfile.vue';
import ProfileSettings from './components/forms/ProfileSettings.vue';
import QuoteForm from './components/forms/QuoteForm.vue';
import FollowingPage from './components/pages/FollowingPage.vue';

const routes = [
  {
    path: '/',
    component: AuthForm
  },
  {
    path: '/home',
    component: HomePage,
    children: [
      {
        path: '',
        component: FeedPage
      },
      {
        path: 'quote/:quoteId',
        component: QuoteForm
      },
      {
        path: 'threads/:threadId',
        component: ThreadPage
      },
      {
        path: 'user/settings',
        component: ProfileSettings
      },
      {
        path: 'user/following',
        component: FollowingPage
      },
      {
        path: 'user/:id',
        component: UserProfile
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

axios.defaults.baseURL = environment.backendUrl;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      router.push('/');
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);
app.use(router);
app.mount('#app');
