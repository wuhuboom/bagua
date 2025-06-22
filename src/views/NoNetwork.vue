<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="查看更多"></AppTopBar>
    <div class="empty-box center-center">
      <div class="icon"></div>
      <div class="text-1">网络出错了</div>
      <div class="text-2">请检查网络设置后重试</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoNetwork",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.empty-box {
  height: 60vh;
  flex-direction: column;

  .icon {
    width: 300px;
    height: 300px;
    background: url("@/assets/img/NoNetwork/tips.png") no-repeat;
    background-size: 100% auto;
  }

  .text-1 {
    font-size: 34px;
    margin-top: 20px;
  }

  .text-2 {
    color: #999999;
    margin-top: 8px;
  }
}
</style>
