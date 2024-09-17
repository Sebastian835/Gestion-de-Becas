import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/mainLayout.vue";
import LoginView from "../views/login.vue";
import NotFound from "../views/notFound.vue";
import { getUser } from "../services/user";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/main",
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "main/home",
      },
      {
        path: "home",  
        component: () => import("../components/home.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "requisitos",  
        component: () => import("../components/students/requisitos.vue"),
        meta: { requiresAuth: true, roles: ["estudiante"] },
      },
      {
        path: "solicitud",  
        component: () => import("../components/students/solicitarBeca.vue"),
        meta: { requiresAuth: true, roles: ["estudiante"] },
      },
      {
        path: "documentos",  
        component: () => import("../components/students/documentosBeca.vue"),
        meta: { requiresAuth: true, roles: ["estudiante"] },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (!requiresAuth) {
    return next();
  }

  try {
    const user = await getUser();

    if (!user) {
      return next("/login");
    }

    const allowedRoles = to.meta.roles || [];
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return next("/not-found");
    }

    next();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return next("/login");
  }
});





export default router;
