<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="意见反馈"></AppTopBar>
    <div class="content-box">
      <div class="textarea-box">
        <textarea
          maxlength="200"
          placeholder="请输⼊你宝贵的建议和所遇到的问题…"
          class="textarea"
          v-model="textarea"
        ></textarea>
        <div class="num">{{ textarea.length }}/200</div>
      </div>
      <div class="uploader-box">
        <van-uploader />
      </div>
    </div>
    <div class="phone-box">
      <div>联系电话:</div>
      <input type="text" placeholder="选填 , 便于我们联系你" class="input" />
    </div>
    <div class="btn center-center">提交</div>
  </div>
</template>

<script>
export default {
  name: "FeedBack",
  data() {
    return {
      textarea: "",
    };
  },
};
</script>
<style scoped lang="less">
.content-box {
  padding: 0 28px;
  background: #fff;
  .textarea-box {
    position: relative;
    border-bottom: 1px solid #eee;
    padding: 28px 0;
    .textarea {
      height: 200px;
      padding: 20px 0;
      width: 100%;
      border: none;
    }
    .num {
      position: absolute;
      right: 0;
      bottom: 28px;
      font-size: 24px;
      color: #888888;
    }
  }
  .uploader-box {
    margin-top: 28px;
    padding-bottom: 10px;
  }
}

.phone-box {
  margin-top: 28px;
  background: #fff;
  display: flex;
  padding: 28px;
  .input {
    flex: 1;
    border: none;
    margin-left: 16px;
  }
}

.btn {
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
