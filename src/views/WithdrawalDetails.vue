<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="提现详情"></AppTopBar>
    <div class="state-box center-center">
      <!-- 等待 -->
      <van-icon name="clock" class="icon" />
      <!-- 成功 -->
      <!-- <van-icon name="checked" class="icon" /> -->
      <!-- 失败 -->
      <!-- <van-icon name="clear" class="icon" /> -->
      <div class="text">提现申请已提交，请耐心等待！</div>
    </div>
    <div class="item-box">
      <div class="item">
        <div class="left">预计到账时间</div>
        <div class="right">2017-12-12 23:58:58</div>
      </div>
      <div class="item">
        <div class="left">储蓄卡</div>
        <div class="right">平安银行 **** **** **** 3316</div>
      </div>
      <div class="item">
        <div class="left">提现金额</div>
        <div class="right">1000.00元</div>
      </div>
      <div class="item">
        <div class="left">提现手续费</div>
        <div class="right">平安银行 **** **** **** 3316</div>
      </div>
      <div class="item">
        <div class="left">申请时间</div>
        <div class="right">2017-12-12 23:58:58</div>
      </div>
    </div>
    <div class="btn-box center-center">确定</div>
  </div>
</template>

<script>
export default {
  name: "WithdrawalDetails",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.state-box {
  padding: 60px 20px;
  flex-direction: column;
  .icon {
    font-size: 160px;
    color: #bf2935;
  }
  .text {
    margin-top: 28px;
    font-size: 32px;
  }
}
.item-box {
  background: #fff;
  margin-bottom: 20px;
  .item {
    margin-left: 28px;
    padding-top: 28px;
    padding-bottom: 28px;
    padding-right: 28px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    .left {
      flex: 1;
    }
    .right {
      display: flex;
      align-items: center;
    }
  }
}
.btn-box {
  width: 694px;
  height: 88px;
  background: #bf2935;
  border-radius: 126px 126px 126px 126px;
  color: #fff;
  font-size: 32px;
  margin: 0 auto;
  margin-top: 56px;
}
</style>
