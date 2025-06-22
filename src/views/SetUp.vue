<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="设置"></AppTopBar>
    <div class="item-box">
      <div class="item" @click="$tool.goPage('/invite-friends')">
        <div class="left">分享给好友</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <!-- <div class="item" @click="$tool.goPage('/feed-back')">
        <div class="left">意见反馈</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div> -->
      <div class="item" @click="$tool.goPage('/about-us')">
        <div class="left">关于我们</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div>
    <div class="btn-box center-center" @click="$store.commit('loginOut')">
      退出登录
    </div>
  </div>
</template>

<script>
export default {
  name: "SetUp",
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
      }
    }
  }
}

.btn-box {
  width: 694px;
  height: 88px;
  background: #bf2935;
  border-radius: 126px 126px 126px 126px;
  color: #fff;
  font-size: 32px;
  margin: 0 auto;
  margin-top: 100px;
}
</style>
