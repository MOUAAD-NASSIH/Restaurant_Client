import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
    {
      path: "/promotions",
      name: "Promotions",
      component: () => import("../views/Promo.vue"),
    },
    {
      path: "/menu",
      name: "Menu",
      component: () => import("../views/Menu.vue"),
    },
    {
      path: "/table",
      name: "Table",
      component: () => import("../views/Table.vue"),
    },
    {
      path: "/cart",
      name: "Cart",
      component: () => import("../views/Cart.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/checkout",
      name: "Checkout",
      component: () => import("../views/Checkout.vue"),
    },
    {
      path: "/thank",
      name: "Thank",
      component: () => import("../views/Thank.vue"),
    },
    {
      path: "/myorder",
      name: "MyOrder",
      component: () => import("../views/MyOrder.vue"),
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("../admin/Admin.vue"),
    },
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      component: () => import("../admin/dashboard.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("../views/Home.vue"),
      // https://stackoverflow.com/questions/68504803/how-can-i-make-a-catch-all-other-route-in-vue-router-also-catch-the-url-when-p
    },
  ],
});

export default router;
