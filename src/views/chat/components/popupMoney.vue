<template>
  <van-popup class="popupMoney" v-model="show">
    <!-- <p class="pop-title center-center m-t-24 m-b-32 active">发</p> -->
    <img class="userPic" :src="userPic" alt="" />
    <van-form class="ntf-yellow-form" @submit="onSubmit">
      <van-field
        v-model.trim="form.quantity"
        class="m-b-32"
        autocomplete="new-password"
        label="红包个数"
        placeholder="填写数量"
        :rules="[
          { required: true, message: '请填写红包个数' },
          {
            pattern: /^(?:[1-9]\d?|[1234]\d{2}|500)$/,
            message: '红包限制1-500个以内',
          },
        ]"
      >
      </van-field>
      <van-field
        class="m-b-32"
        v-model.trim="form.money"
        autocomplete="new-password"
        label="赏金(元)"
        placeholder="填写金额"
        :rules="[
          { required: true, message: '请填写金额' },
          {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
          },
        ]"
      >
      </van-field>
      <van-field
        v-model.trim="form.describes"
        autocomplete="new-password"
        :rules="[
          {
            validator: (value) => value.length <= 14, // 长度不超过 14
            message: '最多 14 个字符',
          },
        ]"
        label="红包标题"
      >
        <template #button> <span class="left-text p-r-8"></span> </template>
      </van-field>
      <ul class="flex-column m-t-48 m-b-48 btn-box" style="width: 100%">
        <li class="flex-1">
          <van-button class="on" round block type="info" native-type="submit"
            >发红包</van-button
          >
        </li>
        <li class="flex-1" @click="show = false">
          <van-button round block type="info" native-type="button"
            >取消</van-button
          >
        </li>
      </ul>
    </van-form>
  </van-popup>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import { mapState, mapActions } from "vuex";
import userPic from "@/assets/img/user-room.png";
export default {
  name: "PopupMoney",
  data() {
    return {
      show: false,
      userPic,
      form: {
        quantity: "",
        money: "",
        describes: "恭喜发财，大吉大利",
      },
    };
  },
  computed: {
    ...mapState("chat", ["messages", "playerId", "query", "ws", "wsStatus"]),
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    wsStatus() {
      this.alertReload();
    },
  },
  methods: {
    ...mapActions("chat", [
      "initWebSocket",
      "closeWebSocket",
      "sendMessage",
      "fetchHistory",
    ]),
    alertReload() {
      if (this.wsStatus === false) {
        this.show = false;
      }
    },
    onSubmit() {
      const params = {
        ...this.form,
      };
      if (!params.describes) {
        params.describes = "恭喜发财，大吉大利";
      }
      this.sendMessage({
        type: 3,
        data: JSON.stringify(params),
      });
      this.show = false;
    },
  },
};
</script>
<style scoped lang="scss">
.popupMoney {
  width: 480px;
  border-radius: 16px;
  background-image: url(../../../assets/img/redBg.png) !important;
  background-size: 100% 100% !important;
  .userPic {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    display: block;
    margin: 10px auto 0;
  }
  .ntf-yellow-form {
    width: 95%;
    margin: 0 auto;
  }
  .left-text {
    color: #000;
  }
  .pop-title {
    font-size: 32px;
  }
  .btn-box {
    display: flex;
    ::v-deep {
      .van-button {
        color: #999999;
        flex: 1;
        height: 88px;
        line-height: 88px;
        text-align: center;
        border: 1px solid #be2834;
        background-color: transparent;
        border: none;
        font-size: 24px;
        &.on {
          // color: #1989fa;
          width: 90%;
          margin: 0 auto;
          height: 62px;
          line-height: 62px;
          background: #ec5b49;
          border-radius: 32px;
          font-size: 24px;
          color: #fff;
          margin-bottom: 16px;
        }
      }
    }
  }
}
.van-popup {
  background: none;
}
::v-deep(.van-field__label) {
  width: 98px !important;
  font-size: 24px;
  color: #000;
}
::v-deep(.van-field__control) {
  font-size: 24px;
}
::v-deep(.van-cell::after) {
  border: none;
}
::v-deep(.van-field__body) {
  border-bottom: 1px solid #e4e4e4;
  padding-left: 10px;
}
</style>
