import app from "@/main";
import to from "await-to-js";
import axios from "axios";
import auth from "./auth";
const baseURL =
  process.env.NODE_ENV === "production"
    ? window.BASEPATH
    : process.env.VUE_APP_API;
const instance = axios.create({
  baseURL: `${baseURL}/player`,
  timeout: 20 * 1000,
  responseType: "json", // Add this line to set the default responseType
});
instance.interceptors.request.use(
  (config) => {
    const token = app.$store.state.token;
    const pwd = auth.getToken('pwd');
    if (token) config.headers.Token = token;
    if (pwd) config.headers['X-account-pwd'] = pwd;
    if (config.data && typeof config.data === "object") {
      // 创建一个 FormData 实例
      const formData = new FormData();

      // 遍历请求参数对象，将每个参数添加到 FormData 中
      for (let key in config.data) {
        formData.append(key, config.data[key]);
      }

      // 将 FormData 设置为请求的参数
      config.data = formData;
    }
    config.params = Object.assign({}, config.params || {}, {
      // reqConfig: process.env.VUE_APP_FIX,
    });

    return config;
  },
  (err) => Promise.reject(err)
);
const specialCode = [];
instance.interceptors.response.use(
  (res) => {
    let result = res.data || {};
    let { code, msg, data } = result;
    if ([886, 188].includes(code)) {
      if (code === 188) {
        msg = msg || "系统维护中，请稍后再试";
        auth.setToken(msg, "repair-msg");
      }
      app.$store.commit("setRepair", {
        code: 886,
        msg: auth.getToken("repair-msg") || msg,
      });
      return Promise.reject(result);
    }
    if (app.$store.state.repair.code !== 200) {
      app.$store.commit("setRepair", {
        code: 200,
        msg: "",
      });
    }
    if ([500].includes(code)) {
      msg = app.$t("system.fail");
    }
    if ([411].includes(code)) {
      app.$store.commit("setPasswordCode", 1);
      return Promise.reject({ code });
    }
    if ([412].includes(code)) {
      app.$store.commit("setPasswordCode", 2);
      return Promise.reject({ code });
    }
    //401-无权访问 402-未登录或者登录失效 403-账号已被禁用
    if ([401, 402, 403].includes(code)) {
      const isLogin = res.config.url.includes("/auth/login");
      app.$toast.clear();
	  let token = window.location.search.split('token=')[1]
	  console.log(token)
      if (!token || token=='undefined' ) {
        // app.$store.commit("loginOut");
        app.$router.push({
          name: "token",
          backUrl: app.$router.currentRoute.fullPath,
        });
      }
      // if (code == 403 && isLogin) {
      //   app.$toast(app.$t("login.fail"));
      // }
      return Promise.reject({ code });
    }

    if (
      code === 103 &&
      data &&
      data.length > 0 &&
      data[0].msgKey === "outWiTime"
    ) {
      return result;
    }

    if (code !== 200 ) {
      //&& msg
      if (!specialCode.includes(code)) {
        if (code === 188) {
          //188 系统维护中
          app.$store.commit("setMainShow", {
            show: true,
            msg,
          });
          //app.$toast(app.$t("UserProfile.Notification"));
        } else if (code === 409) {
          app.$toast(app.$t("backapi.self.alert.fast.access.tip.text"));
        } else {
          let title = "";
          if (data && data.length > 0) {
            // title =
            //   data[0].msg || data[0].msgKey == "outWiTime"
            //     ? app.$t("backapi." + data[0].msgKey, { timeMsg: data[0].time })
            //     : app.$t("backapi." + data[0].msgKey);
            if (data[0].msgKey == "outWiTime" || data[0].msgKey == "withdrawalLimit") {
              return result;
            } else {
              title = data[0].msg || app.$t("backapi." + data[0].msgKey);
            }
          }
          title = title || msg;
          if (title) {
            app.$toast(title);
          } else {
            app.$toast.clear();
          }
        }
      }
      return Promise.reject(result);
    }
	
    return result;
  },
  async (err) => {
    // app.$toast(txtFail);
    //app.$message.error("网络错误，请稍后重试");
    app.$toast.clear();
    return Promise.reject(err);
  }
);

// 2. 导出一个通过新axios实例调用接口的函数
export default ({
  url,
  method = "get",
  params,
  data,
  headers,
  responseType,
  noAutoFormData = true,
  onUploadProgress,            
}) => {
  const promise = instance({
    url,
    method,
    params,
    data,
    responseType,
    headers,
    noAutoFormData,
	onUploadProgress,       
  });
  return to(promise);
};
