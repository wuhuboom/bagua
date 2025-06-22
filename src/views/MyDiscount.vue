<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="我的优惠"></AppTopBar>
    <!-- 暂无数据 -->
    <div class="empty-box center-center" v-if="0">
      <div class="img"></div>
      <div class="text">您暂无可用优惠券</div>
    </div>
    <div class="lists-box">
      <div class="lists">
        <div class="left center-center text-ellipsis">
          <div class="price text-ellipsis">￥10</div>
          <div class="text">即将过期</div>
        </div>
        <div class="right text-ellipsis">
          <div class="name text-ellipsis">充100赠送10元</div>
          <div class="text text-ellipsis">优惠</div>
          <div class="time">有效期: 2017.08.06-2017.09.04</div>
        </div>
      </div>
      <div class="lists off">
        <div class="left center-center text-ellipsis">
          <div class="price text-ellipsis">￥10</div>
          <div class="text">已过期</div>
        </div>
        <div class="right text-ellipsis">
          <div class="name text-ellipsis">充100赠送10元</div>
          <div class="text text-ellipsis">优惠</div>
          <div class="time">有效期: 2017.08.06-2017.09.04</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyDiscount",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.empty-box {
  flex-direction: column;
  padding: 300px 50px;
  .img {
    background: url("@/assets/img/MyDiscount/status_empty_cupon@2x.png")
      no-repeat;
    background-size: 100% auto;
    width: 200px;
    height: 200px;
  }
  .text {
    color: #999999;
    margin-top: 40px;
  }
}
.lists-box {
  padding-bottom: 20px;
  .lists {
    width: 694px;
    min-height: 200px;
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
    display: flex;
    margin: 0 auto;
    margin-top: 20px;
    position: relative;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 24px;
      height: 24px;
      background: #f9f9f9;
      margin-top: -12px;
      border-radius: 50px;
      z-index: 10;
    }
    &::before {
      left: -12px;
    }
    &::after {
      right: -12px;
    }
    .left {
      width: 200px;
      background: #bf2935;
      color: #fff;
      flex-direction: column;
      border-radius: 6px 0px 0px 6px;
      .price {
        font-size: 48px;
        font-weight: bold;
        max-width: 200px;
      }
      .text {
        font-size: 24px;
        margin-top: 10px;
      }
    }
    .right {
      position: relative;
      padding: 28px 20px;
      flex: 1;
      .name {
        font-size: 32px;
        font-weight: bold;
      }
      .text {
        font-size: 24px;
        color: #666666;
        margin-top: 8px;
      }
      .time {
        font-size: 20px;
        color: #999999;
        margin-top: 30px;
      }
    }
    &.off {
      .left {
        background: #ffadb3;
      }
      .right {
        color: #999999;
        .text {
          color: #999999;
        }
        &::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          background: url("@/assets/img/MyDiscount/yishiyong.png") no-repeat;
          background-size: 100% auto;
          width: 119px;
          height: 119px;
        }
      }
    }
  }
}
</style>
