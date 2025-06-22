<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="实名认证"></AppTopBar>
    <div class="input-wrap">
      <div class="input-box flex-wrap">
        <input class="input" type="text" placeholder="输入真实姓名" />
      </div>
      <div class="input-box flex-wrap">
        <input class="input" type="text" placeholder="输入真实身份证号" />
      </div>
    </div>
    <div class="submit-btn center-center" @click="submit">确定</div>
    <div class="wx-tips">
      <div class="top-box">
        <van-icon name="warning" class="icon" />
        <div>温馨提示</div>
      </div>
      <div class="bottom-box">
        真实姓名和身份证号码将是您的提款时的重要依据，填写后不可更改！您的个人信息将严格保密，不会用于任何第三方.
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";

export default {
  name: "NameAuthentication",
  data() {
    return {};
  },
  methods: {
    submit() {
      Dialog.confirm({
        title: "重要提示",
        message: "真实姓名和身份证号码绑定后不可更改。虚假身份证信息将无法提款",
        confirmButtonText: "绑定",
        cancelButtonText: "取消",
        className: "confirm-no-tile-dialog",
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>
<style scoped lang="less">
.input-wrap {
  background: #fff;

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
  margin-top: 80px;
}

.wx-tips {
  background: #e5e5e5;
  border-radius: 10px 10px 10px 10px;
  width: 694px;
  margin: 0 auto;
  padding: 20px 28px;
  margin-top: 60px;
  .top-box {
    display: flex;
    color: #bf2935;
    align-items: center;
    font-size: 22px;
    .icon {
      color: #bf2935;
      margin-right: 12px;
      font-size: 36px;
    }
  }
  .bottom-box {
    color: #999999;
    font-size: 22px;
    margin-top: 12px;
  }
}
</style>
