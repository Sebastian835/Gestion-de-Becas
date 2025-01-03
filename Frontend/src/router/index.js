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
        component: () => import("../views/admin/home.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "periodos",  
        component: () => import("../views/admin/periodos.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "solicitudesBeca",  
        component: () => import("../views/admin/solicitudes.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "documentosBeca",  
        component: () => import("../views/admin/documentos.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "becas",  
        component: () => import("../views/admin/becas.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "reportes",  
        component: () => import("../views/admin/reportes.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "requisitos",  
        component: () => import("../views/students/requisitos.vue"),
        meta: { requiresAuth: true, roles: ["estudiante"] },
      },
      {
        path: "solicitud",  
        component: () => import("../views/students/solicitarBeca.vue"),
        meta: { requiresAuth: true, roles: ["estudiante"] },
      },
      {
        path: "documentos",  
        component: () => import("../views/students/documentosBeca.vue"),
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
  history: createWebHistory('/gestionBecas/'),
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
    return next("/login");
  }
});


export default router;
