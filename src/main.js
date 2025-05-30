import Vue from "vue";
import dayjs from "dayjs";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./locale";
import util from "@/plugins/util";
import VueClipboard from "vue-clipboard2";
import global from "./components/global";
import "amfe-flexible";
import element from "./plugins/element";
// 公共样式
import "@/assets/style/base.less";
import "@/assets/font/iconfont.css";
import "@/assets/style/resVant.scss";
// 引入英文语言包

import directives from "./directives";

import VueLuckyCanvas from "@lucky-canvas/vue";
import Tool from "@/utils/tool";
import { Notify } from "vant";
Vue.use(VueLuckyCanvas);
Vue.use(directives);
Vue.config.productionTip = false;
Vue.use(global);
Vue.use(VueClipboard);
Vue.use(element);

Vue.prototype.$tool = Tool;
const num =
  process.env.NODE_ENV === "production"
    ? window.UNIFIED_NUMBER
    : process.env.VUE_APP_UNIFIED_NUMBER;
Vue.prototype.divide = (v, fix = true) => {
  if (!fix) {
    return (Math.trunc(v * 100) / 100).toFixed(2); // 始终保留两位小数
  }
  return (Math.trunc((v * 100) / num) / 100).toFixed(2); // 始终保留两位小数
};
Vue.prototype.$betPrice = 2;
Vue.prototype.$dayjsTime = (time = new Date(), f = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(time).format(f);
};
Vue.prototype.$dayjsSingleTime = (time = new Date()) => {
  return dayjs(time).format("MM-DD HH:mm");
};

Vue.prototype.$betName = (v) => {
  let names = ['乾','巽','坎','艮','坤','震','离','兑']
  return names[parseInt(v)-1];
};
Vue.prototype.$util = util;
Vue.prototype.$notify = Notify;
Vue.prototype.$baseURL =
  process.env.NODE_ENV === "production"
    ? window.BASEPATH
    : process.env.VUE_APP_API;
Vue.prototype.sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
Vue.directive("long-press", {
  bind(el, binding) {
    let timer = null;

    // 开始长按
    const startPress = () => {
      timer = setTimeout(() => {
        binding.value(); // 触发回调
      }, 1000); // 长按 1 秒
    };

    // 取消长按
    const cancelPress = () => {
      clearTimeout(timer);
    };

    el.addEventListener("touchstart", startPress); // 手指按下
    el.addEventListener("touchend", cancelPress); // 手指抬起
    el.addEventListener("touchmove", cancelPress); // 手指滑动取消长按
    el.addEventListener("touchcancel", cancelPress); // 其他情况（如多指触摸）取消

    // 解绑事件（防止内存泄漏）
    el.__longPressCleanup = () => {
      el.removeEventListener("touchstart", startPress);
      el.removeEventListener("touchend", cancelPress);
      el.removeEventListener("touchmove", cancelPress);
      el.removeEventListener("touchcancel", cancelPress);
    };
  },
  unbind(el) {
    el.__longPressCleanup && el.__longPressCleanup();
  },
});

const app = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
export default app;
