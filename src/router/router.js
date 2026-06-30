import BlogPage from "@/pages/BlogPage.vue";
import Portfolio from "@/pages/Portfolio.vue";
import Post from "@/components/post/Post.vue";

export const routes = [
  { path: "/", name: "home", component: BlogPage },
  { path: "/portfolio", name: "portfolio", component: Portfolio },
  { path: "/posts/:slug", name: "post", component: Post, props: true },
];
