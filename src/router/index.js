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
  {
    path: "/jump",
    name: "Jump",
    components: {
      default: () => import("@/views/Jump.vue"),
    },
  },
  {
    path: "/customer",
    name: "customer",
    components: {
      default: () => import("@/views/customer.vue"),
    },
  },
  {
    path: "/live",
    name: "live",
    components: {
      default: () => import("@/views/live.vue"),
    },
  },
  {
    path: "/hisVideo",
    name: "hisVideo",
    components: {
      default: () => import("@/views/hisVideo.vue"),
    },
  },

  {
    path: "/login/SignIn",
    name: "token",
    components: {
      default: () => import("@/views/Login.vue"),
    },
  },
  {
    path: "/teamList",
    name: "teamListName",
    components: {
      default: () => import("@/views/teamList.vue"),
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});

function safeToken(str) {
  if (!str) return "";
  const s = String(str).trim();
  return ["null", "undefined", ""].includes(s.toLowerCase()) ? "" : s;
}

function extractTokenWithSource() {
  // search（?token=...）
  const fromSearch = safeToken(
    new URLSearchParams(window.location.search).get("token")
  );
  if (fromSearch) return { token: fromSearch, source: "search" };

  // hash 的 query（/#/path?token=...）
  const hash = window.location.hash || ""; // "#/path?token=xxx"
  const i = hash.indexOf("?");
  if (i >= 0) {
    const fromHash = safeToken(
      new URLSearchParams(hash.slice(i + 1)).get("token")
    );
    if (fromHash) return { token: fromHash, source: "hash" };
  }

  // 3) 本地
  const fromLocal = safeToken(auth.getToken("token"));
  if (fromLocal) return { token: fromLocal, source: "local" };

  return { token: "", source: "none" };
}

router.beforeEach(async (to, from, next) => {
  Nprogress.start();

  const { token, source } = extractTokenWithSource();

  store.commit("setToken", token);
  if (token) auth.setToken(token, "token");

  // 仅当 token 来自 search（?token=...）时，搬到 hash 的 query
  if (source === "search") {
    const merged = { ...to.query, token };
    if (to.query.token !== token) {
      return next({ path: to.path || "/", query: merged, replace: true });
    }
  }

  if (token) {
    const [error] = await store.dispatch("getInfo");
    if (error && auth.getToken("userInfo")) {
      store.commit("setUser", JSON.parse(auth.getToken("userInfo")));
    }
    if (!store.getters.catList.length) {
      await store.dispatch("playerLotteryList");
    }
    if (to.path.includes("/login")) {
      return next("/"); // 交给 afterEach 收尾
    }
  } else {
    store.commit("setToken", "");
  }

  return next(); // 只调用一次
});

// router.beforeEach(async (to, from, next) => {
//   Nprogress.start();
//   let token = extractToken() || auth.getToken("token") || "";
//
//   // let token = window.location.search.split("token=")[1];
//   if (token) {
//     store.commit("setToken", token);
//     auth.setToken(token, "token");
//
//     // 统一把 token 放到 hash 模式的 query 上（/#/path?token=...）
//     if (to.query.token !== token) {
//       return next({ path: to.path || '/', query: { ...to.query, token }, replace: true });
//     }
//
//   } else {
//     // let str = auth.getToken("token");
//     // if (str) {
//     //   let url = window.location.origin + "?token=" + str;
//     //   store.commit("setToken", token);
//     //   window.location.replace(url);
//     // } else {
//     //   store.commit("setToken", "");
//     // }
//
//
//     store.commit("setToken", "");
//
//   }
//
//   if (auth.getToken()) {
//     const [error] = await store.dispatch("getInfo");
//     if (error && auth.getToken("userInfo")) {
//       store.commit("setUser", JSON.parse(auth.getToken("userInfo")));
//     }
//
//     if (!store.getters.catList.length) {
//       await store.dispatch("playerLotteryList");
//     }
//     if (to.path.includes("/login")) {
//       Nprogress.done();
//       return next("/");
//     }
//   }
//   // const ajaxs = [];
//   // if (!store.state.serveData.serviceAddr) {
//   //   ajaxs.push(store.dispatch("getServeData"));
//   // }
//   // if (!store.getters.catList.length) {
//   //   ajaxs.push(store.dispatch("playerLotteryList"));
//   // }
//   // await Promise.all(ajaxs);
//   // if (to.path == "/downloadApp") {
//   //   next();
//   //   return;
//   // }
//
//   // if (auth.getToken()) {
//   //   if (!store.getters.catList.length) {
//   //     await store.dispatch("playerLotteryList");
//   //   }
//   //   if (to.path.includes("/login")) {
//   //     Nprogress.done();
//   //     next("/");
//   //   } else {
//   //     next();
//   //   }
//   // } else {
//   //   // if (to.path.includes("/login")) {
//   //   //   next();
//   //   // } else {
//   //   //   Nprogress.done();
//   //   //   next("/login/SignIn");
//   //   // }
//   //   // next("/login/SignIn");
//   //   next();
//   // }
//   // next();
//
//   return next();
// });

// router.beforeEach(async (to, from, next) => {
//   Nprogress.start();
//   let token = window.location.search.split("token=")[1];
//   if (token) {
//     store.commit("setToken", token);
//     auth.setToken(token, "token");
//   } else {
//     let str = auth.getToken("token");
//     if (str) {
//       let url = window.location.origin + "?token=" + str;
//       store.commit("setToken", token);
//       window.location.replace(url);
//     } else {
//       store.commit("setToken", "");
//     }
//   }
//   if (auth.getToken()) {
//     const [error] = await store.dispatch("getInfo");
//     if (error && auth.getToken("userInfo")) {
//       store.commit("setUser", JSON.parse(auth.getToken("userInfo")));
//     }
//   }
//   // const ajaxs = [];
//   // if (!store.state.serveData.serviceAddr) {
//   // ajaxs.push(store.dispatch("getServeData"));
//   // }
//   // if (!store.getters.catList.length) {
//   // ajaxs.push(store.dispatch("playerLotteryList"));
//   // }
//   // await Promise.all(ajaxs);
//   // if (to.path == "/downloadApp") {
//   // next();
//   // return;
//   // }
//   if (auth.getToken()) {
//     if (!store.getters.catList.length) {
//       await store.dispatch("playerLotteryList");
//     }
//     if (to.path.includes("/login")) {
//       Nprogress.done();
//       next("/");
//     } else {
//       next();
//     }
//   } else {
//     // if (to.path.includes("/login")) {
//     // next();
//     // } else {
//     // Nprogress.done();
//     // next("/login/SignIn");
//     // }
//     // next("/login/SignIn");
//     next();
//   }
//   next();
// });

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
