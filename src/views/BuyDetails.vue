<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="合买">
      <template v-slot:right>
        <div class="right-box">发起合买</div>
      </template>
    </AppTopBar>
    <div class="lists-box">
      <div class="lists">
        <div class="top">
          <div class="left">
            <div class="info">
              <img src="" class="img" />
              <div class="t-box">
                <div class="name">张三</div>
                <div class="tag-box">
                  <div class="tag">6连胜</div>
                </div>
              </div>
            </div>
            <div class="x-1">选号: <span class="num">1,3,4,5,6,7</span></div>
            <div class="x-2">组三复式 30注 60元</div>
          </div>
          <div class="right center-center">
            <div class="jd-box">
              <MyCircle
                v-model="currentRate"
                :rate="30"
                :speed="100"
                :text="`70%`"
                layer-color="#f9f9f9"
                color="#FF8848"
                :stroke-width="80"
              />
            </div>
            <div class="time-box">
              距截止:
              <van-count-down class="on" :time="9999999" format="HH时mm分" />
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="b-1">
            <div class="item center-center">
              <div class="num-box"><span class="num">80</span>元</div>
              <div class="text">总金额</div>
            </div>
            <div class="item center-center">
              <div class="num-box"><span class="num">1</span>元</div>
              <div class="text">每份</div>
            </div>
            <div class="item center-center">
              <div class="num-box"><span class="num">59</span>元</div>
              <div class="text">剩余份额</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="qk-box">
      <div class="title">执行情况</div>
      <div class="lists">
        <div class="top">
          <div class="left">
            <div class="name">期号</div>
          </div>
          <div class="right">第21121112期</div>
        </div>
        <div class="bottom">
          <div class="item center-center">20元</div>
          <div class="item center-center">5倍</div>
          <div class="item center-center">进行中</div>
        </div>
      </div>
    </div>
    <div class="gd-box">
      <div class="title">跟单用户(3)</div>
      <div class="table-lists">
        <div class="row hearder">
          <div class="col">昵称</div>
          <div class="col">份数</div>
          <div class="col">金额</div>
          <div class="col">所占股份</div>
        </div>
        <div class="row" v-for="i in 10" :key="i">
          <div class="col">乘⻛破浪</div>
          <div class="col">0.00</div>
          <div class="col">0.00</div>
          <div class="col">5%</div>
        </div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="height"></div>
      <div class="bottom">
        <div class="left">
          <div class="num-box">
            <div class="input-box">
              <input type="text" class="input" value="1" />
            </div>
            <div>份</div>
          </div>
          <div class="price">合计：199元</div>
        </div>
        <div class="right center-center">购买</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Circle as MyCircle } from "vant";
export default {
  name: "BuyDetails",
  components: {
    MyCircle,
  },
  data() {
    return {
      currentRate: 0,
    };
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
.lists-box {
  background: #f5f5f5;
  .lists {
    background: #fff;
    padding: 0 30px;
    padding-bottom: 30px;
    padding-top: 40px;
    margin-bottom: 16px;
    .top {
      display: flex;
      .left {
        flex: 1;
        .info {
          display: flex;
          align-items: center;
          margin-bottom: 38px;
          .img {
            width: 90px;
            height: 90px;
            border-radius: 100%;
            margin-right: 32px;
          }
          .t-box {
            .tag-box {
              display: flex;
              flex-wrap: wrap;
            }
            .tag {
              margin-right: 4px;
              margin-top: 6px;
              border: 1px solid #bf2935;
              border-radius: 4px 4px 4px 4px;
              height: 32px;
              line-height: 30px;
              padding: 0 14px;
              font-size: 20px;
              color: #bf2935;
            }
          }
        }
        .x-1 {
          font-size: 24px;
          color: #000000;
          .num {
            color: #bf2834;
          }
        }
        .x-2 {
          margin-top: 16px;
          font-size: 24px;
          color: #000000;
        }
      }
      .right {
        flex-direction: column;
        .jd-box {
          /deep/ .van-circle {
            width: 150px;
            height: 150px;
          }
          /deep/ .van-circle__text {
            font-size: 28px;
            color: #333333;
          }
        }
        .time-box {
          color: #777777;
          font-size: 24px;
          margin-top: 10px;
          display: flex;
          .on {
            color: #bf2834;
          }
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      padding: 30px 60px;
      background: #f6fafb;
      margin-top: 30px;

      .b-1 {
        flex: 1;
        display: flex;
        justify-content: space-between;
        .item {
          flex-direction: column;
          .text {
            color: #777777;
            font-size: 22px;
            margin-top: 10px;
          }
          .num-box {
            color: #777777;
            font-size: 22px;
            .num {
              color: #333333;
              font-size: 28px;
            }
          }
        }
      }
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
      margin-right: 50px;
      .num-box {
        display: flex;
        align-items: center;
        .input-box {
          margin-right: 20px;
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
        color: #ff505e;
        margin-left: 56px;
      }
    }
    .right {
      width: 180px;
      color: #fff;
      font-size: 32px;
      height: 126px;
      background: #ff505e;
    }
  }
}
.qk-box {
  padding: 34px 30px;
  background: #fff;
  .title {
    margin-bottom: 34px;
    font-size: 32px;
    font-weight: bold;
  }
  .lists {
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #e0e1e0;
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
      }
      .right {
        font-size: 24px;
        color: #000;
      }
    }
    .bottom {
      display: flex;
      font-size: 28px;
      color: #333;
      .item {
        position: relative;
        flex: 1;
        flex-direction: column;
        padding: 32px;
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
      }
    }
  }
}
.gd-box {
  padding: 34px 0;
  background: #fff;
  margin-top: 16px;
  .title {
    padding: 0 30px;
    margin-bottom: 34px;
    font-size: 32px;
    font-weight: bold;
  }
  .table-lists {
    .hearder {
      background: #f0f0f0;
      color: #333 !important;
      margin: 0 !important;
      padding: 0 30px;
    }
    .row {
      display: grid;
      grid-template-columns: 25% 25% 25% 25%;
      color: #777777;
      border-bottom: 1px solid #eaeaea;
      margin: 0 30px;
      align-items: center;
    }
    .col {
      padding: 24px 0;
      text-align: center;
    }
  }
}
</style>
