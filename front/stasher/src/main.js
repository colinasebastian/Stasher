import { createApp } from "vue";
import "./fonts.css";
import "./index.css";
import App from "./App.vue";
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueApexCharts from 'vue3-apexcharts'

import Home from "./views/Home.vue";
import AdminUserReg from "./views/AdminUserReg.vue";
import UserLogin from "./views/UserLogin.vue";
import About from "./views/About.vue";
import Technologies from "./views/Technologies.vue";
import UserMenu from "./views/UserMenu.vue";
import MemberUserReg from "./views/MemberUserReg.vue";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: Home },
    { path: "/adminUserReg/", name: "AdminUserReg", component: AdminUserReg },
    { path: "/userLogin/", name: "userLogin", component: UserLogin },
    { path: "/about", name: "About", component: About },
    { path: "/technologies", name: "Technologies", component: Technologies },
    { path: "/userMenu", name: "UserMenu", component: UserMenu },
    { path: "/memberUserReg", name: "MemberUserReg", component: MemberUserReg },

    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/', '/userLogin', '/adminUserReg', "/about", "/technologies", "/memberUserReg"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/userLogin');
  }

  next();
})

const app = createApp(App);
app.use(router);
app.use(VueAxios, axios)

app.use(VueApexCharts);


app.mount("#app");
