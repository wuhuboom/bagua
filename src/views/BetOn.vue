<template>
  <div class="c-page">
    <AppTopBar topBarTitle="排列三" class="app-top-bar">
      <template v-slot:right>
        <div class="right-box">发起合买</div>
      </template>
    </AppTopBar>
    <div class="time-box">
      距2024304期截止:
      <van-count-down
        class="time"
        :time="900000000"
        format="DD天HH小时mm分ss秒"
      />
    </div>
    <div class="cz-box">
      <div class="left">+ 自选号码</div>
      <div class="right center-center">
        <div class="del-icon"></div>
        <div>清空列表</div>
      </div>
    </div>
    <div v-for="i in 2" :key="i" class="item-box">
      <div class="lists one">
        <div class="item">第一位</div>
        <div class="item">第二位</div>
        <div class="item">第三位</div>
      </div>
      <div class="lists two">
        <div class="item">6</div>
        <div class="item">1,6</div>
        <div class="item">7</div>
      </div>
      <div class="lists three">
        <div class="left">后三直选 2注 4元</div>
        <div class="right">删除</div>
      </div>
    </div>

    <div class="bottom-box">
      <div class="height"></div>
      <div class="bottom">
        <div class="left">
          <div class="zhui-btn center-center">追期</div>
          <div class="num-box">
            <div>2注</div>
            <div class="input-box">
              <input type="text" class="input" value="1" />
            </div>
            <div>倍</div>
          </div>
          <div class="price">4元</div>
        </div>
        <div class="right center-center">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BetOn",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.app-top-bar {
  .right-box {
    color: #fff;
    margin-right: 40px;
    font-size: 26px;
  }
}
.time-box {
  padding: 14px 0;
  text-align: center;
  font-size: 24px;
  color: #777777;
  display: flex;
  justify-content: center;
  align-items: center;
  .time {
    color: #fc4546;
    font-size: 24px;
    margin-left: 10px;
  }
}
.cz-box {
  display: flex;
  background: #e8e8e8;
  padding: 22px 48px;
  justify-content: space-between;
  .left {
    background: #fff;
    height: 54px;
    line-height: 54px;
    padding: 0 18px;
  }
  .right {
    color: #797979;
    font-size: 22px;
    .del-icon {
      background: url("@/assets/img/BetOn/del.png") no-repeat;
      background-size: 100% auto;
      width: 44px;
      height: 44px;
      margin-right: 8px;
    }
  }
}
.item-box {
  margin: 32px 30px;
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #e0e1e0;
  overflow: hidden;
  .lists {
    display: flex;
    border-bottom: 1px solid #e0e1e0;
    justify-content: center;
    align-items: center;
    position: relative;
    &:last-child {
      border-bottom: none;
    }
    &.one {
      background: #fafbfb;
      height: 88px;
      font-weight: 600;
    }
    &.two {
      height: 94px;
      color: #be2933;
      .item {
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        &:last-child {
          border-right: none;
        }
      }
    }
    &.three {
      height: 108px;
      justify-content: space-between;
      padding: 0 28px;
      .right {
        background: #be2933;
        border-radius: 14px 14px 14px 14px;
        font-size: 22px;
        color: #ffffff;
        height: 52px;
        line-height: 52px;
        padding: 0 26px;
      }
    }
    .item {
      flex: 1;
      text-align: center;
      position: relative;
    }
  }
}
.bottom-box {
  .height {
    height: 126px;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 126px;
    width: 100%;
    background: #000000;
    display: flex;
    align-items: center;
    color: #fff;
    .left {
      margin-left: 18px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 50px;
      .zhui-btn {
        width: 136px;
        height: 80px;
        color: #ffffff;
        border-radius: 14px 14px 14px 14px;
        background: #545454;
      }
      .num-box {
        display: flex;
        align-items: center;
        .input-box {
          margin: 0 20px;
        }
        .input {
          width: 115px;
          height: 78px;
          text-align: center;
          border-radius: 14px 14px 14px 14px;
          background: #fff;
          color: #333;
        }
      }
      .price {
        color: #ff1726;
      }
    }
    .right {
      width: 180px;
      color: #fff;
      font-size: 32px;
      height: 126px;
      background: #bf2935;
    }
  }
}
</style>
