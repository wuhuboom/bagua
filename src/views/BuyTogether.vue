<template>
  <div class="c-page">
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
        <span class="mr-44 title">方案标题</span>
        <span>排列3 第2024304期(追4期)</span>
      </div>
      <div class="lists">
        <span class="title">方案金额:</span>
        <span class="mr-44">10元</span>
        <span class="title">份数:</span>
        <span class="mr-44">10份</span>
        <span class="title">每份金额:</span>
        <span>1元</span>
      </div>
      <div class="lists">
        <span class="title">购买份数</span>
        <input type="text" class="input" value="5" />
        <span class="title">最低认购(5%)</span>
      </div>
      <div class="lists">
        <span class="title">保底份数</span>
        <input type="text" class="input" value="5" />
        <span class="title">元停⽌认购</span>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="height"></div>
      <div class="btn center-center">提交</div>
    </div>
    <!-- 发布成功弹窗 -->
    <div class="publish-pop center-center" v-if="0">
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
          <div class="btn">确认</div>
          <div class="btn on">分享好友</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuyTogether",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.bottom-btn {
  .height {
    height: 156px;
  }
  .btn {
    position: fixed;
    left: 34px;
    bottom: 32px;
    color: #fff;
    height: 96px;
    width: 688px;
    background: #be2834;
    font-size: 32px;
    font-weight: 500;
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
  background: #e8e8e8;
  .time {
    color: #fc4546;
    font-size: 24px;
    margin-left: 10px;
  }
}
.lists-box {
  padding: 10px 32px;
  .lists {
    padding: 40px 0;
    border-bottom: 1px solid #efefef;
  }
  .mr-44 {
    margin-right: 44px;
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
