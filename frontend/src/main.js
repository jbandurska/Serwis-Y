import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import axios from "axios";
import { environment } from "./env";

axios.defaults.baseURL = environment.backendUrl;

createApp(App).mount("#app");
