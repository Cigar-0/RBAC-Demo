import Vue from "vue";
import VueRouter from "vue-router";
import BookManage from "../views/BookManage";
import BookManage2 from "../views/BookManage2";
import AddBook from "../views/AddBook";
import Index from "../views/Index";
import BookUpdate from "../views/BookUpdate";
import Login from "../components/Login";
import Welcome from "../components/Welcome";

import RoleList from "../views/sys/RoleList";
import UserList from "../views/sys/UserList";
import ResourceList from "../views/sys/ResourceList";

import {initMenu2} from "../utils/menu";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  //base: process.env.BASE_URL,
  base: "/book/",
  routes: [
    { path: "/", redirect: "/Login" },
    { path: "/Login", component: Login },
    {
      path: "/Index",
      component: Index,
      redirect: "/Welcome",
      children: [
        { path: "/Welcome", name: "欢迎", component: Welcome },
        { path: "/BookManage", name: "常规CRUD列表1_1", component: BookManage },
        {
          path: "/BookManage2",
          name: "基于组件CRUD列表1_2",
          component: BookManage2,
        },
        { path: "/sys/UserList", name: "用户管理", component: UserList },
        { path: "/sys/RoleList", name: "角色管理", component: RoleList },
        { path: "/sys/ResourceList", name: "资源管理", component: ResourceList },
        { path: "/AddBook", component: AddBook },
        { path: "/UpdateBook", component: BookUpdate },
      ],
    },
  ],
});

//路由导航守卫函数
router.beforeEach((to, from, next) => {
  // if (to.path == '/Login') {
  //   return next();
  // }
  // const tokenStr = window.sessionStorage.getItem("token");
  // if (!tokenStr) {
  //   return next('/Login');
  // }
  // return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (tokenStr) {
    initMenu2();
    next();
  } else {
    if (to.path == "/Login") {
      return next();
    } else {
      next("/?redirect=" + to.path);
    }
  }
});

export default router;
