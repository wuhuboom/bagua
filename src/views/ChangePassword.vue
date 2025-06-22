<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="修改密码"></AppTopBar>
    <div class="tab-box">
      <div
        class="tab"
        :class="{
          on: tab === 0,
        }"
        @click="tab = 0"
      >
        设置登录密码
      </div>
      <div
        class="tab"
        :class="{
          on: tab === 1,
        }"
        @click="tab = 1"
      >
        设置支付密码
      </div>
    </div>
    <template v-if="tab === 0">
      <div class="input-wrap">
        <div class="input-box flex-wrap">
          <input class="input" type="text" placeholder="请输入旧登录密码" />
        </div>
        <div class="input-box flex-wrap">
          <input class="input" type="text" placeholder="请输入新登录密码" />
        </div>
        <div class="input-box flex-wrap">
          <input class="input" type="text" placeholder="请再次输入新登录密码" />
        </div>
      </div>
      <div class="submit-btn center-center">确认更改</div>
    </template>
    <template v-if="tab === 1">
      <div class="input-wrap">
        <div class="input-box flex-wrap">
          <input class="input" type="text" placeholder="输入新的支付密码" />
        </div>
        <div class="input-box flex-wrap">
          <input class="input" type="text" placeholder="请再次输入新密码" />
        </div>
        <div class="input-box flex-wrap">
          <input class="input" type="text" placeholder="输入手机验证码" />
          <div class="code-btn">获取验证码</div>
        </div>
      </div>
      <div class="submit-btn center-center">确认更改</div>
    </template>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",
  data() {
    return {
      tab: 0,
    };
  },
};
</script>
<style scoped lang="less">
.tab-box {
  display: flex;
  background-color: #fff;
  .tab {
    flex: 1;
    text-align: center;
    height: 98px;
    line-height: 98px;
    &.on {
      color: #bf2935;
      font-weight: 500;
      border-bottom: 4px solid #bf2935;
    }
  }
}
.input-wrap {
  background: #fff;
  margin-top: 24px;

  .input-box {
    padding: 0 28px;
    border-bottom: 1px solid #e5e5e5;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }
  }

  .input {
    flex: 1;
    height: 96px;
    border: none;
  }

  .code-btn {
    color: #bf2834;
  }
}

.submit-btn {
  width: 694px;
  height: 88px;
  background: #bf2935;
  border-radius: 126px 126px 126px 126px;
  color: #fff;
  font-size: 32px;
  margin: 0 auto;
  margin-top: 132px;
}
</style>
