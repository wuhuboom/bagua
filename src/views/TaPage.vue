<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="TA的主页"></AppTopBar>
    <div class="info-box">
      <div class="left">
        <img src="" class="img" />
        <div class="name-box">
          <div class="name">张三的三</div>
          <div class="tips">胜率90%</div>
        </div>
      </div>
      <div class="right">
        <div class="guanzhu">关注</div>
      </div>
    </div>
    <div class="xinxi-box">
      <div class="item">
        <div class="t-1">10投4中</div>
        <div class="t-2">胜率</div>
      </div>
      <div class="item">
        <div class="t-1">2323.3元</div>
        <div class="t-2">7日奖金</div>
      </div>
      <div class="item">
        <div class="t-1">4连红</div>
        <div class="t-2">连续红单</div>
      </div>
    </div>
    <div class="tab-box">
      <div class="tab on">
        <div class="name">七日发单</div>
      </div>
      <div class="tab">
        <div class="name">近期红单</div>
      </div>
    </div>
    <div class="lists-box">
      <div class="lists" v-for="i in 10" :key="i">
        <div class="mengbang on" v-if="i === 2">
          <div class="num">￥121232</div>
        </div>
        <div class="mengbang off" v-else></div>
        <div class="top">
          <div class="left">
            <div class="name">排列三</div>
            <div class="des">2元起购</div>
          </div>
          <div class="right">12-13 21：40 截止</div>
        </div>
        <div class="content">排列三直选方案</div>
        <div class="bottom">
          <div class="item center-center">
            <div class="t-1">发起自购</div>
            <div class="num-box">
              <div class="num">20</div>
              <div>元</div>
            </div>
          </div>
          <div class="item center-center">
            <div class="t-1">跟单人数</div>
            <div class="num-box">
              <div class="num on">20</div>
              <div>人</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaPage",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.info-box {
  background: #bf2935;
  padding: 42px 36px;
  display: flex;
  margin-top: -2px;
  .left {
    flex: 1;
    display: flex;
    align-items: center;
    .img {
      width: 92px;
      height: 92px;
      border: 4px solid #f7f7f7;
      border-radius: 100%;
      margin-right: 16px;
    }
    .name-box {
      display: flex;
      justify-content: center;
      color: #fff;
      flex-direction: column;
      .name {
        font-size: 34px;
      }
      .tips {
        font-size: 20px;
        margin-top: 10px;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .guanzhu {
      border-radius: 6px 6px 6px 6px;
      background: #ff9643;
      height: 60px;
      line-height: 60px;
      padding: 0 36px;
      font-size: 32px;
      color: #fff;
    }
  }
}
.xinxi-box {
  display: flex;
  background: rgba(201, 65, 76, 1);
  color: #fff;
  margin-top: -2px;
  .item {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 14px 0;
    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      width: 2px;
      height: 55px;
      background: rgba(255, 255, 255, 0.3);
      margin-top: -28px;
    }
    &:last-child::after {
      display: none;
    }
    .t-1 {
      font-size: 34px;
    }
    .t-2 {
      font-size: 24px;
    }
  }
}
.tab-box {
  border-bottom: 1px solid #e0e1e0;
  display: flex;
  .tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    &:last-child::after {
      display: none;
    }
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      height: 50px;
      width: 2px;
      background: #f2f2f2;
      margin-top: -25px;
    }
    &.on {
      .name {
        color: #f44230;
        border-bottom: 6px solid #f44230;
      }
    }
  }
  .name {
    height: 112px;
    line-height: 112px;
    color: #999999;
    font-size: 32px;
  }
}
.lists-box {
  padding: 38px 30px;
  .lists {
    position: relative;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #e0e1e0;
    margin-bottom: 40px;
    .mengbang {
      width: 180px;
      height: 180px;
      position: absolute;
      background-size: 100% auto;
      background-repeat: no-repeat;
      position: absolute;
      right: 0;
      top: 42px;
      &.off {
        background-image: url("@/assets/img/TaPage/m-2.png");
      }
      &.on {
        background-image: url("@/assets/img/TaPage/m-1.png");
      }
      .num {
        width: 180px;
        line-height: 172px;
        margin-left: 5px;
        color: #fff;
        transform: rotate(-20deg);
        text-align: center;
        font-size: 22px;
      }
    }
    .top {
      display: flex;
      height: 88px;
      align-items: center;
      padding: 0 28px;
      background: #fafbfb;
      border-bottom: 1px solid #e0e1e0;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .name {
          border-left: 4px solid #fe5908;
          padding-left: 16px;
          height: 26px;
          line-height: 26px;
          font-weight: bold;
        }
        .des {
          margin-left: 30px;
          font-size: 24px;
          color: #777777;
        }
      }
      .right {
        font-size: 24px;
        color: #999999;
      }
    }
    .content {
      color: #777777;
      font-size: 24px;
      padding: 26px 20px;
    }
    .bottom {
      display: flex;
      background: #fafbfb;
      border-top: 1px solid #e0e1e0;
      font-size: 24px;
      color: #999999;
      padding: 14px 0;
      .item {
        position: relative;
        flex: 1;
        flex-direction: column;
        &:last-child::after {
          display: none;
        }
        &::after {
          content: "";
          position: absolute;
          height: 49px;
          width: 2px;
          background: #f2f2f2;
          right: 0;
          top: 50%;
          margin-top: -25px;
        }
        .num-box {
          display: flex;
          color: #777777;
          font-size: 22px;
          align-items: center;
          margin-top: 6px;
          .num {
            color: #333333;
            font-size: 28px;
            font-weight: bold;
            &.on {
              color: #f44230;
            }
          }
        }
      }
    }
  }
}
</style>
