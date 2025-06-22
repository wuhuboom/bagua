<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="银行卡管理"></AppTopBar>
    <div class="zf-box">
      <div class="lists yinhang">
        <div class="top">
          <div class="yh-icon yinhang"></div>
          <div class="info">
            <div class="name">工商银行</div>
            <div class="card">**** **** **** 3316</div>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <van-icon name="checked" class="check-icon on" />
            <div class="name">默认首选</div>
          </div>
          <div class="right">
            <div class="del-icon"></div>
            <div class="name">删除</div>
          </div>
        </div>
      </div>
      <div class="lists zhifubao">
        <div class="top">
          <div class="yh-icon zhifubao"></div>
          <div class="info">
            <div class="name">支付宝</div>
            <div class="card">158888888@qq.com</div>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <van-icon name="circle" class="check-icon" />
            <div class="name">默认首选</div>
          </div>
          <div class="right">
            <div class="del-icon"></div>
            <div class="name">删除</div>
          </div>
        </div>
      </div>
      <div class="lists weixin">
        <div class="top">
          <div class="yh-icon weixin"></div>
          <div class="info">
            <div class="name">微信二维码</div>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <van-icon name="circle" class="check-icon" />
            <div class="name">默认首选</div>
          </div>
          <div class="right">
            <div class="del-icon"></div>
            <div class="name">删除</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bd-box">
      <div class="lists">
        <div class="left">
          <van-icon name="plus" class="plus-icon" />
          <div class="name">绑定银行卡</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="lists">
        <div class="left">
          <van-icon name="plus" class="plus-icon" />
          <div class="name">绑定微信</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="lists">
        <div class="left">
          <van-icon name="plus" class="plus-icon" />
          <div class="name">绑定支付宝</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BankCard",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.zf-box {
  .lists {
    margin-bottom: 20px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: top right;
    background-size: 100% auto;
    &.yinhang {
      background-image: url("@/assets/img/BankCard/yinhang-bg.png");
    }
    &.zhifubao {
      background-image: url("@/assets/img/BankCard/zhifubao-bg.png");
    }
    &.weixin {
      background-image: url("@/assets/img/BankCard/weixin-bg.png");
    }
    .top {
      display: flex;
      padding: 30px 28px;
      height: 200px;
      .yh-icon {
        width: 48px;
        height: 48px;
        background: #e50012;
        border-radius: 100%;
        background-repeat: no-repeat;
        background-position: top right;
        background-size: 100% auto;
        &.zhifubao {
          background-image: url("@/assets/img/BankCard/zhifubao.png");
          background-color: #fff;
        }
        &.weixin {
          background-image: url("@/assets/img/BankCard/weixin.png");
          background-color: #fff;
        }
      }
      .info {
        margin-left: 16px;
        .card {
          font-size: 40px;
          margin-top: 46px;
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      padding: 28px;
      border-top: 1px solid #f9f9f9;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .check-icon {
          margin-right: 20px;
          color: #333333;
          font-size: 36px;
          &.on {
            color: #bf2935;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        .del-icon {
          background-repeat: no-repeat;
          background-size: 100% auto;
          background-image: url("@/assets/img/BankCard/del.png");
          width: 44px;
          height: 44px;
          margin-right: 8px;
        }
        color: #999999;
      }
    }
  }
}
.bd-box {
  margin-top: 20px;
  background: #fff;
  .lists {
    border-bottom: 1px solid #f9f9f9;
    padding: 28px 22px;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      color: #666666;
      .plus-icon {
        margin-right: 8px;
        font-size: 40px;
        color: #666666;
      }
    }
    .right {
      .arrow-icon {
        font-size: 40px;
        color: #ccc;
      }
    }
  }
}
</style>
