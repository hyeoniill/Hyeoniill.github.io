import { createApp } from "vue";
import "@/assets/style/main.css";
import "highlight.js/styles/github-dark.css";
import App from "./App.vue";
import router from "./router/router.js";

createApp(App).use(router).mount("#app");
