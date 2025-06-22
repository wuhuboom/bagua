<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="下载"></AppTopBar>
    <div class="logo-box center-center">
      <div
        class="logo"
        :style="{ backgroundImage: `url(${$store.state.logoIcon})` }"
      ></div>
    </div>
    <div class="des-box">
      <div class="text-1">我们只做最诚信 最放心 最专业的购彩平台</div>
      <div class="text-2">
        We only do the most honest and most assured the most professional
        platform
      </div>
    </div>
    <ul class="center-center download-box flex-column">
      <li @click="goApp(1)">
        <img class="d-img" src="@/assets/img/down1.png" alt="" />
      </li>
      <li @click="goApp(0)">
        <img class="d-img" src="@/assets/img/down2.png" alt="" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
  data() {
    return {};
  },
  computed: {
    dev() {
      return this.$store.state.devApp;
    },
  },
  methods: {
    goApp(appType) {
      if (!this.dev[appType]) {
        return;
      }
      window.open(this.dev[appType].appUrl);
    },
  },
  created() {
    this.$store.dispatch("appDownload", false);
  },
};
</script>
<style scoped lang="less">
.logo-box {
  flex-direction: column;
  padding: 100px 0 50px;
  .logo {
    width: 160px;
    height: 160px;
    background: url("@/assets/img/logo.png") no-repeat;
    background-size: 100% auto;
  }
  .name {
    font-size: 24px;
    margin-top: 20px;
  }
}
.des-box {
  text-align: center;
  padding: 0 114px;
  .text-2 {
    margin-top: 5px;
    font-size: 24px;
    color: #a2a2a2;
  }
}
.download-box {
  li {
    margin-top: 56px;
  }
  img {
    width: 300px;
    height: 88px;
  }
}
</style>
