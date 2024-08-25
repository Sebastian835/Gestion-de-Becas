import { createRouter, createWebHistory } from 'vue-router';
import HomeView from "../views/home.vue";
import LoginView from "../views/login.vue";

const routes = [
  {
    path: "/login",
    name: 'login',
    component: LoginView,
  },
  {
    path: "/home",
    name: 'home',
    component: HomeView,
  },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
