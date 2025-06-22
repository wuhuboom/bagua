<template>
  <div class="bg-grey c-page">
    <AppTopBar topBarTitle="我的合买"></AppTopBar>
    <div class="search-box center-center">
      <div class="select-box center-center" @click="selectShow = true">
        全部游戏
        <van-icon name="arrow-down" class="icon" />
      </div>
      <div class="cx-box center-center">查询</div>
    </div>
    <div class="lists-box">
      <div class="lists">
        <div class="top">
          <div class="left">
            <div class="name">排列三</div>
            <div class="des">2元起购</div>
          </div>
          <div class="right t-1">未中奖</div>
        </div>
        <div class="content">
          <div class="l-b">排列三直选方案</div>
          <div class="r-b">查看详情</div>
        </div>
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
              <div class="num">20</div>
              <div>人</div>
            </div>
          </div>
        </div>
      </div>
      <div class="lists">
        <div class="top">
          <div class="left">
            <div class="name">排列三</div>
            <div class="des">2元起购</div>
          </div>
          <div class="right t-2">中奖102元</div>
        </div>
        <div class="content">
          <div class="l-b">排列三直选方案</div>
          <div class="r-b">查看详情</div>
        </div>
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
              <div class="num">20</div>
              <div>人</div>
            </div>
          </div>
        </div>
      </div>
      <div class="lists" v-for="i in 10" :key="i">
        <div class="top">
          <div class="left">
            <div class="name">排列三</div>
            <div class="des">2元起购</div>
          </div>
          <div class="right">待开奖</div>
        </div>
        <div class="content">
          <div class="l-b">排列三直选方案</div>
          <div class="r-b">查看详情</div>
        </div>
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
              <div class="num">20</div>
              <div>人</div>
            </div>
          </div>
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
  name: "MyBuy",
  data() {
    return {
      selectShow: false,
      selectActions: [
        { name: "全部游戏" },
        { name: "排列三" },
        { name: "大乐透" },
      ],
    };
  },
};
</script>
<style scoped lang="less">
.search-box {
  background: #fff;
  height: 100px;
  position: relative;
  .select-box {
    .icon {
      color: #cccccc;
      margin-left: 20px;
    }
  }
  .cx-box {
    position: absolute;
    right: 56px;
    top: 22px;
    height: 56px;
    width: 114px;
    background: #bf2834;
    border-radius: 12px 12px 12px 12px;
    color: #ffffff;
  }
}
.lists-box {
  padding: 38px 30px;
  .lists {
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #e0e1e0;
    margin-bottom: 40px;
    background: #fff;
    .top {
      display: flex;
      height: 88px;
      align-items: center;
      padding: 0 28px;
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
        &.t-1 {
          color: #000000;
        }
        &.t-2 {
          color: #bf2935;
        }
      }
    }
    .content {
      color: #777777;
      font-size: 24px;
      padding: 26px 20px;
      display: flex;
      .l-b {
        flex: 1;
      }
      .r-b {
        font-size: 24px;
        color: #505050;
        text-decoration-line: underline;
      }
    }
    .bottom {
      display: flex;
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
