<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="Xxx聊天室"></AppTopBar>
    <div class="chat-box">
      <div class="time-box center-center">
        <div class="time">2024-11-15 00:52:11</div>
      </div>
      <div class="item-box left">
        <div class="img-box">
          <img src="" class="img" />
        </div>
        <div class="info-box">
          <div class="name text-ellipsis">阿萌</div>
          <div class="content-box">
            <div class="content">小双:245</div>
          </div>
        </div>
      </div>
      <div class="time-box center-center">
        <div class="time">2024-11-15 00:52:11</div>
      </div>
      <div class="item-box right">
        <div class="info-box">
          <div class="name text-ellipsis">阿萌</div>
          <div class="content-box">
            <div class="content">
              <div>@阿萌 下注成功</div>
              <div>小双:245 余分:4138.25</div>
            </div>
          </div>
        </div>
        <div class="img-box">
          <img src="" class="img" />
        </div>
      </div>
    </div>
    <div class="bottom-box">
      <!-- <div class="height"></div> -->
      <div class="wrap-box">
        <div class="icon-box">
          <van-icon name="smile-o" class="icon" />
        </div>
        <div class="input-box">
          <input type="text" class="input" placeholder="请输入消息" />
        </div>
        <div class="btn center-center">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppChat",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.chat-box {
  .time-box {
    margin-top: 40px;
    .time {
      border-radius: 8px 8px 8px 8px;
      background: #cfcfcf;
      color: #fff;
      font-size: 24px;
      height: 36px;
      line-height: 36px;
      padding: 0 8px;
    }
  }
  .item-box {
    margin: 20px 12px 0;
    display: flex;
    &.right {
      justify-content: flex-end;
      .img-box {
        margin-left: 12px;
        margin-right: 0;
      }
      .info-box {
        .name {
          text-align: right;
        }
        .content-box {
          justify-content: flex-end;
          .content {
            border-radius: 16px 0px 16px 16px;
          }
        }
      }
    }
    .img-box {
      margin-right: 12px;
      .img {
        width: 72px;
        height: 72px;
        border-radius: 10px 10px 10px 10px;
      }
    }
    .info-box {
      .name {
        font-size: 24px;
        width: 500px;
      }
      .content-box {
        margin-top: 12px;
        display: flex;
        .content {
          font-size: 26px;
          background: #fff;
          border-radius: 0px 16px 16px 16px;
          padding: 14px 20px;
          max-width: 500px;
        }
      }
    }
  }
}
.bottom-box {
  .height {
    height: 104px;
  }
  .wrap-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 104px;
    background: #fff;
    padding: 0 16px;
    display: flex;
    align-items: center;
    .icon-box {
      .icon {
        color: #666;
        font-size: 50px;
      }
    }
    .input-box {
      margin: 0 20px;
      flex: 1;
      .input {
        width: 100%;
        border: none;
      }
    }
    .btn {
      width: 128px;
      height: 72px;
      border-radius: 14px 14px 14px 14px;
      background: #bf2834;
      color: #fff;
      font-size: 26px;
    }
  }
}
</style>
