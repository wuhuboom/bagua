<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="提现记录"></AppTopBar>
    <div class="item-box">
      <div class="item">
        <div class="left">银行卡号</div>
        <div class="right">平安银行 **** **** **** 3316</div>
      </div>
      <div class="item">
        <div class="left">提现金额</div>
        <div class="right">1000.00元</div>
      </div>
      <div class="item">
        <div class="left">提现状态</div>
        <div class="right">
          <div>2017-8-13 12:12:12 已到账</div>
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item">
        <div class="left">银行卡号</div>
        <div class="right">平安银行 **** **** **** 3316</div>
      </div>
      <div class="item">
        <div class="left">提现金额</div>
        <div class="right">1000.00元</div>
      </div>
      <div class="item">
        <div class="left">提现状态</div>
        <div class="right">
          <div class="blue">审核处理中</div>
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item">
        <div class="left">银行卡号</div>
        <div class="right">平安银行 **** **** **** 3316</div>
      </div>
      <div class="item">
        <div class="left">提现金额</div>
        <div class="right">1000.00元</div>
      </div>
      <div class="item">
        <div class="left">提现状态</div>
        <div class="right">
          <div class="red">提现失败</div>
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WithdrawalRecord",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
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
      .arrow-icon {
        font-size: 36px;
        color: #ccc;
        margin-left: 10px;
      }
      .blue {
        color: #006f0f;
      }
      .red {
        color: #ff0000;
      }
    }
  }
}
</style>
