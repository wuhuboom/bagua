<template>
  <div class="invoice-page font12 p-l-12 p-r-12">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t(`user.trade.title4.text`)"
    ></AppTopBar>
    <ul class="m-t-16">
      <li
        class="justify-between nav-item align-center m-b-8 p-l-16 p-r-16"
        v-for="(item, idx) in navs"
        :key="idx"
        @click="$router.push(item.path)"
      >
        <p class="">{{ item.title }}</p>
        <van-icon size="16" name="arrow" />
      </li>
    </ul>
  </div>
</template>

<script>
import i18n from "@/locale";
export default {
  name: "balanceRecordView",
  data() {
    return {
      navs: [
        {
          title: i18n.t("invoice.menu1.text"),
          path: "/pages/function/rechargeHistory",
        },
        {
          title: i18n.t("invoice.menu2.text"),
          path: "/pages/user/withdrawRecord",
        },
        {
          title: i18n.t("invoice.menu3.text"),
          path: "/pages/user/balanceRecord",
        },
        {
          title: i18n.t("invoice.menu4.text"),
          path: "/pages/invest/record",
        },
      ],
    };
  },
};
</script>
<style scoped lang="less">
.invoice-page {
  .nav-item {
    height: 38px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
