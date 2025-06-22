<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="发起合买"></AppTopBar>
    <div class="time-box">
      距2024304期截止:
      <van-count-down
        class="time"
        :time="900000000"
        format="DD天HH小时mm分ss秒"
      />
    </div>
    <div class="lists-box">
      <div class="lists">
        <span class="title">我要认购</span>
        <input type="text" class="input" value="5" />
        <span class="title">元</span>
        <span class="small">所占比例至少为总金额 10%</span>
      </div>
      <div class="lists">
        <div class="l-b1">
          <div class="title">是否保底</div>
          <div class="select-box" @click="selectShow = true">
            无保底
            <div class="jiao-icon"></div>
          </div>
        </div>
        <div class="l-b2">
          <div class="gou-icon"></div>
          <div>系统最多参与订单总金额的90%,最大满单18元</div>
        </div>
        <div class="l-b3">
          <div class="title">是否公开</div>
          <div>
            <van-radio-group class="radio-group" v-model="radio">
              <van-radio name="1" shape="square" class="radio">公开</van-radio>
              <van-radio name="2" shape="square" class="radio"
                >仅对跟单着公开</van-radio
              >
              <van-radio name="3" shape="square" class="radio">保密</van-radio>
              <van-radio name="4" shape="square" class="radio"
                >截止后公开</van-radio
              >
            </van-radio-group>
          </div>
        </div>
      </div>
      <div class="lists">
        <span class="title">已添加</span>
        <span class="mr-44"> <span class="bold">5</span>单</span>
        <span class="title">总注数:</span>
        <span> <span class="bold">9</span>注</span>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="height"></div>
      <div class="btn-box">
        <div class="info">
          <div>总计</div>
          <div class="price">200元</div>
        </div>
        <div class="btn" @click="publist = true">取消</div>
        <div class="btn on" @click="publist = true">确定</div>
      </div>
    </div>
    <!-- 发布成功弹窗 -->
    <div class="publish-pop center-center" v-if="publist">
      <div class="bg"></div>
      <div class="publish-main">
        <div class="top">发布成功</div>
        <div class="info-box">
          <div class="box-1">
            <div class="t-1">排列3 第2024304期(追4期)</div>
            <div class="t-2">购买份数:5 保底份数:5</div>
          </div>
          <div class="box-2">
            <div class="t-box">
              <div class="l-t">方案金额：</div>
              <div class="r-t">
                <span class="on">2.00</span>
                元
              </div>
            </div>
            <div class="t-box">
              <div class="l-t">份数：</div>
              <div class="r-t">
                <span class="on">2.00</span>
                元
              </div>
            </div>
            <div class="t-box">
              <div class="l-t">每份金额：</div>
              <div class="r-t">
                <span class="on">1.00</span>
                元
              </div>
            </div>
          </div>
        </div>
        <div class="btn-box">
          <div class="btn" @click="publist = false">确认</div>
          <div class="btn on">分享好友</div>
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model="selectShow"
      :actions="selectActions"
      cancel-text="取消"
      close-on-click-action
    />
  </div>
</template>

<script>
export default {
  name: "JointPurchase",
  data() {
    return {
      radio: "1",
      selectShow: false,
      selectActions: [
        { name: "全部游戏" },
        { name: "排列三" },
        { name: "大乐透" },
      ],
      publist: false,
    };
  },
};
</script>
<style scoped lang="less">
.bottom-btn {
  .height {
    height: 98px;
  }
  .btn-box {
    position: fixed;
    left: 0;
    bottom: 0;
    color: #fff;
    height: 98px;
    width: 100%;
    display: flex;
    background: #fff;
    .info {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 28px;
      color: #000000;
      .price {
        font-size: 36px;
        color: #bf2935;
        margin-left: 10px;
      }
    }
    .btn {
      width: 180px;
      height: 98px;
      line-height: 98px;
      text-align: center;
      background: #484848;
      color: #fff;
      font-size: 32px;
      &.on {
        background: #bf2935;
        margin-left: 2px;
      }
    }
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
  border-bottom: 1px solid #efefef;
  background: #fff;
  .time {
    color: #fc4546;
    font-size: 24px;
    margin-left: 10px;
  }
}
.lists-box {
  padding: 0 32px;
  background: #fff;
  .lists {
    padding: 40px 0;
    border-bottom: 1px solid #efefef;
    .l-b1 {
      display: flex;
      align-items: center;
      .select-box {
        display: flex;
        align-items: center;
        background: #ffc424;
        height: 54px;
        line-height: 54px;
        padding: 0 26px;
        font-size: 32px;
        font-weight: 500;
        margin-left: 22px;
        padding-right: 15px;
        border-radius: 6px;
        .jiao-icon {
          width: 36px;
          height: 36px;
          background: url("@/assets/img/JointPurchase/jiao.png") no-repeat;
          background-size: 100% auto;
          margin-left: 20px;
          margin-top: 5px;
        }
      }
    }
    .l-b2 {
      display: flex;
      background: #fff4d8;
      font-size: 24px;
      padding: 14px 18px;
      margin-top: 26px;
      align-items: center;
      flex-wrap: wrap;
      .gou-icon {
        width: 36px;
        height: 36px;
        background: url("@/assets/img/JointPurchase/gou.png") no-repeat;
        background-size: 100% auto;
        margin-right: 24px;
      }
    }
    .l-b3 {
      display: flex;
      white-space: nowrap;
      .title {
        margin-right: 28px;
        padding-top: 38px;
      }
      .radio-group {
        display: flex;
        flex-wrap: wrap;
        .radio {
          margin-right: 60px;
          margin-top: 42px;
        }
      }
    }
  }
  .mr-44 {
    margin-right: 44px;
  }
  .bold {
    font-weight: 500;
    margin: 10px;
  }
  .title {
    font-size: 32px;
    color: #777777;
    font-weight: 500;
  }
  .input {
    width: 146px;
    height: 54px;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin: 0 22px;
    text-align: center;
  }
  .small {
    font-size: 24px;
    margin-left: 20px;
  }
}
.publish-pop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }
  .publish-main {
    position: relative;
    width: 678px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #fff;
    .top {
      background: #be2834;
      font-size: 34px;
      font-weight: 500;
      text-align: center;
      padding: 16px;
      color: #fff;
    }
    .info-box {
      padding: 0 26px;
      .box-1 {
        border-bottom: 1px solid #cccccc;
        padding: 24px 0;
        text-align: center;
        .t-1 {
          font-size: 32px;
          font-weight: 500;
        }
        .t-2 {
          color: #777777;
          margin-top: 8px;
        }
      }
      .box-2 {
        padding: 26px 0;
        .t-box {
          display: flex;
          margin-top: 12px;
          font-weight: 500;
          &:first-child {
            margin-top: 0;
          }
          .l-t {
            width: 300px;
            text-align: right;
          }
          .r-t {
            .on {
              color: #be2834;
              right: 4px;
            }
          }
        }
      }
    }
    .btn-box {
      display: flex;
      .btn {
        flex: 1;
        height: 88px;
        line-height: 88px;
        text-align: center;
        border: 1px solid #be2834;
        &.on {
          background: #be2834;
          color: #fff;
        }
      }
    }
  }
}
</style>
