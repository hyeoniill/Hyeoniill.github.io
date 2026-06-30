import { ViteSSG } from "vite-ssg";
import "@/assets/style/main.css";
import "highlight.js/styles/github-dark.css";
import App from "./App.vue";
import { routes } from "./router/router.js";

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
);
