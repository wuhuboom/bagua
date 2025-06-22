<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="关于我们"></AppTopBar>
    <div class="logo-box center-center">
      <div
        class="logo"
        :style="{ backgroundImage: `url(${$store.state.logoIcon})` }"
      ></div>
      <div class="name">{{ $store.state.logoTxt }}</div>
    </div>
    <div class="des-box">
      <div class="text-1">我们只做最诚信 最放心 最专业的购彩平台</div>
      <div class="text-2">
        We only do the most honest and most assured the most professional
        platform
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.logo-box {
  flex-direction: column;
  padding: 150px 0;
  .logo {
    width: 160px;
    height: 160px;
    background: no-repeat;
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
</style>
