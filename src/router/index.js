import auth from "@/plugins/auth";
import store from "@/store";
import Nprogress from "nprogress";
import Vue from "vue";
import VueRouter from "vue-router";
//import app from "@/main";
Vue.use(VueRouter);
//import AppTopBar from "@/components/global/AppTopBar";
// import AppBtmBar from "@/components/global/AppBtmBar";
import app from "@/main";
const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: () => import("@/views/chat/Chat.vue"),
    },
  },
  {
    path: "/chat",
    name: "AppChat",
    components: {
      default: () => import("@/views/chat/Chat.vue"),
    },
  },
  
  // {
  //   path: "/login/SignIn",
  //   name: "Login",
  //   components: {
  //     default: () => import("@/views/Login.vue"),
  //   },
  // },
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});
router.beforeEach(async (to, from, next) => {
  Nprogress.start();
  let token = window.location.pathname.split('/')[1]
  
  store.commit("setToken", token);  
  
  if (auth.getToken()) {
    const [error] = await store.dispatch("getInfo");
    if (error && auth.getToken("userInfo")) {
      store.commit("setUser", JSON.parse(auth.getToken("userInfo")));
    }
  }
  // const ajaxs = [];
  // if (!store.state.serveData.serviceAddr) {
  //   ajaxs.push(store.dispatch("getServeData"));
  // }
  // if (!store.getters.catList.length) {
  //   ajaxs.push(store.dispatch("playerLotteryList"));
  // }
  // await Promise.all(ajaxs);
  // if (to.path == "/downloadApp") {
  //   next();
  //   return;
  // }
  
  if (auth.getToken()) {
    if (!store.getters.catList.length) {
      await store.dispatch("playerLotteryList");
    }
    if (to.path.includes("/login")) {
      Nprogress.done();
      next("/");
    } else {
      next();
    }
  } else {
    // if (to.path.includes("/login")) {
    //   next();
    // } else {
    //   Nprogress.done();
    //   // next("/login/SignIn");
    // }
	// next("/login/SignIn");
  }
  next();
});
router.afterEach((to, from) => {
  store.commit("setPdTop", true);
  Nprogress.done();
  app.$store.commit("setFromRoute", from);
});

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
export default router;
