<template>
  <div class="page c-page bg-grey">
    <AppTopBar topBarTitle="绑定支付宝"></AppTopBar>

    <!-- 绑定银行卡 -->
    <template v-if="0">
      <div class="card-box">
        <div class="item">
          <div class="left">开户名：张三</div>
        </div>
        <div class="item border">
          <div class="left">请选择银行</div>
          <div class="right">
            请选择
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div class="item border">
          <div class="left">请选择开户省份</div>
          <div class="right">
            请选择
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div class="item border">
          <div class="left">请选择开户城市</div>
          <div class="right">
            请选择
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div class="item">
          <input type="text" class="input" placeholder="请输入银行卡号" />
        </div>
      </div>
      <div class="btn-box center-center">确定</div>
    </template>

    <!-- 绑定微信码 -->
    <template v-if="0">
      <div class="card-box">
        <div class="item">
          <div class="left">真实姓名：张三</div>
        </div>
        <div class="item border">
          <div class="left">请上传微信收款二维码</div>
        </div>
        <div class="item">
          <div class="uploader-box center-center">
            <van-uploader />
            <div class="uploader-text">点击上传</div>
          </div>
        </div>
      </div>
      <div class="btn-box center-center">确定</div>
    </template>

    <!-- 绑定支付宝 -->
    <template v-if="1">
      <div class="card-box">
        <div class="item border">
          <div class="left">真实姓名：张三</div>
        </div>
        <div class="item">
          <div class="left">支付宝账号：</div>
          <div class="right">
            <input
              type="text"
              class="input i-input"
              placeholder="请输入支付宝账号"
            />
          </div>
        </div>
      </div>
      <div class="btn-box center-center">确定</div>
    </template>
  </div>
</template>

<script>
export default {
  name: "AppBinding",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.page {
  padding-bottom: 50px;
}
.card-box {
  background: #fff;
  .item {
    display: flex;
    align-items: center;
    padding: 28px;
    &.border {
      border-bottom: 1px solid #e5e5e5;
    }
    .left {
      flex: 1;
    }
    .right {
      display: flex;
      align-items: center;
      color: #999999;
      .arrow-icon {
        font-size: 36px;
        color: #ccc;
        margin-left: 20px;
      }
    }
    .input {
      border: none;
      outline: none;
      &.i-input {
        width: 500px;
      }
    }
    .uploader-box {
      height: 300px;
      width: 100%;
      flex-direction: column;
      .uploader-text {
        color: #ddd;
        margin-top: 10px;
      }
    }
  }
}
.btn-box {
  width: 694px;
  height: 88px;
  background: #bf2935;
  border-radius: 126px 126px 126px 126px;
  font-size: 32px;
  color: #ffffff;
  margin: 0 auto;
  margin-top: 80px;
}
</style>
