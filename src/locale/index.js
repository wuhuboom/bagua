import Vue from "vue";
import VueI18n from "vue-i18n";
// 导入语言包信息
import zh from "./zh.json";
import store from "@/store";
// 注册i18n
Vue.use(VueI18n);
// 语言包根据语言环境分类 中文  英语 阿拉伯语  德语  俄语  法语  葡萄牙语  西班牙语  印地语  尼泊尔语
export const messages = {
  zh: { ...zh },
};
// 通过选项创建 VueI18n 实例并导出
export default new VueI18n({
  locale: store.state.lang, // 设置地区
  messages, // 设置语言环境对应信息
});
