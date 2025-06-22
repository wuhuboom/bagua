<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="设置昵称"></AppTopBar>
    <div class="input-box">
      <input
        type="text"
        placeholder="请输入昵称"
        class="input"
        v-model="nickName"
      />
      <van-icon
        v-if="nickName"
        name="clear"
        class="icon"
        @click="nickName = ''"
      />
    </div>
    <div class="btn center-center">确定</div>
  </div>
</template>

<script>
export default {
  name: "NickName",
  data() {
    return {
      nickName: "",
    };
  },
};
</script>
<style scoped lang="less">
.input-box {
  background: #fff;
  display: flex;
  padding: 30px 26px;
  align-items: center;
  .input {
    height: 40px;
    flex: 1;
    line-height: 40px;
    border: none;
  }
  .icon {
    color: #cccccc;
    font-size: 30px;
  }
}
.btn {
  width: 694px;
  height: 88px;
  background: #bf2935;
  border-radius: 126px 126px 126px 126px;
  font-size: 32px;
  color: #ffffff;
  margin: 0 auto;
  margin-top: 60px;
}
</style>
