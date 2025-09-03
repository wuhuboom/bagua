<template>
  <div class="m-t-4 red-img">
    <van-popup class="popupOpenBox pointer" v-model="showPacketOpen">
      <div @click="getPacket1" class="popupOpen popupOpenPacket">
        <ul class="flex-column center-center getPacket font14">
          <li class="align-center font14">
            <img
              class="d-img user-red m-r-8"
              :src="
                packetItem.img
                  ? packetItem.img.includes('http')
                    ? packetItem.img
                    : `${$baseURL}/${packetItem.img}`
                  : userPic
              "
            />
            收到{{ packetItem.user }}的红包
          </li>
          <li class="d-desc m-t-12">恭喜发财, 大吉大利</li>
          <li class="receive" @click="receive($event)">
            查看领取详情
            <svg class="double-arrow" viewBox="0 0 24 24">
              <path
                d="M5 4l8 8-8 8M13 4l8 8-8 8"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </li>
        </ul>
      </div>
      <img
        class="close-btn"
        src="@/assets/img/off.png"
        @click="showPacketOpen = false"
      />
    </van-popup>
    <van-popup class="popupFinish" @close="closeFinish" v-model="showFinish">
      <ul class="flex-column center-center font14 m-b-8">
        <img class="RedMoneyImg" src="@/assets/img/RedMoneyImg.png" alt="" />
        <li class="d-meng d-flex m-b-8">
          {{ divide(myRedMoney.money) }}
        </li>
        <div class="modal-footer" @click="goDetail" v-if="unAcceptList.length > 0">继续抢红包</div>
        <div class="modal-footer" @click="goDetail" v-else>已全部领取</div>
      </ul>
    </van-popup>
    <!-- 领红包 -->
    <div
      class="redBox center-center"
      :class="showShake ? 'shake' : ''"
      v-if="unAcceptList.length > 0"
      @click="ledPacket"
    >
      <img class="redBoxImg" src="@/assets/img/redImg.gif" alt="" />
      <audio
        ref="audio"
        :src="require('@/assets/img/red-packet.mp3')"
        preload="auto"
      />
    </div>
    <!-- 弹框领取失败 -->
    <van-popup
      class="modal pointer"
      v-model="showOverlayOpen"
      @click="clickOverlay"
    >
      <div class="modal-header flex-column center-center">
        <div class="modal-title">领取失败</div>
        <div class="modal-subtitle">今日充值满300<br />才能参与抢红包</div>
      </div>
      <div class="modal-footer">确认</div>
    </van-popup>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import red1 from "@/assets/img/red1.png";
import red2 from "@/assets/img/red2.png";
import userPic from "@/assets/img/user-room.png";
import { EventBus } from "@/plugins/bus";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "RedImg",
  data() {
    return {
      red1,
      red2,
	  unAcceptList: [],
      userPic,
      showOpen: false,
      showFinish: false,
      showRecord: false,
      showOverlayOpen: false,
      showPacketOpen: false,
      packetItem: {},
      ajaxPack: {}, //红包状态
      showShake: false,
      lastNoticeKey: null,
      recordList: {
        list: [],
      },
    };
  },
  computed: {
    ...mapState("chat", ["messages", "playerId", "query", "ws", "wsStatus", "isGain"]),
    isMe() {
      return this.packetItem.playerId === this.user.id;
    },
    user() {
      return this.$store.state.user;
    },
    shareData() {
      return this.$store.state.shareData;
    },
    pack() {
      return this.ajaxPack;
    },
    packet() {;
      return this.packetItem.packet || {};
    },
    //是否可抢
    canGet() {
      return this.packet.status === 0 && this.packet.list?.length === 0;
    },
    myRedMoney() {
      return this.packetItem.list?.length > 0
        ? this.packetItem.list[0]
        : this.ajaxPack;
    },
    packetStatus() {
      if (this.myRedMoney.money !== undefined) {
        return "已领取";
      }
      if (this.packetItem.status === 0) {
        return "领取红包";
      }
      return this.packetItem.status === 1 ? "抢空" : "过期";
    },
    // 过滤后的消息
    filteredMessages() {
      return this.messages.filter((item) => {
        const hasReceived =
          Array.isArray(item.packet?.list) &&
          item.packet.list.length > 0 &&
          item.packet.list[0].money !== undefined;
        return item.type === 4 && item.packet?.status === 0 && !hasReceived;
      });
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
	...mapMutations("chat", [
	  "setGain"
	]),
    // 领红包
    ledPacket() {
	  // console.log( this.unAcceptList)
	  this.packetItem = this.unAcceptList[0];
	  this.showPacketOpen = true;
	  this.packetItem.data = JSON.parse(this.unAcceptList[0].data);
      // this.unAcceptList.forEach((item, index) => {
      //   this.packetItem = item;
      //   this.showPacketOpen = true;
      //   this.packetItem.data = JSON.parse(this.packetItem.data);
      // });
    },

    triggerEffect() {
      // 晃动动画
      this.showShake = true;

      // 播放提示音
      this.$refs.audio.play().catch(() => {
        // 某些浏览器需要用户交互才能播放
        console.warn("提示音播放失败");
      });

      // 触发震动（H5原生API）
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      // 停止晃动（比如3秒后）
      setTimeout(() => {
        this.showShake = false;
        console.log(this.showShake);
      }, 5000);
    },
    getMoneyRecord() {
      this.$toast.loading({
        duration: 3000, // 设置 3 秒后关闭
      });
      this.sendMessage({
        type: 7,
        msgId: this.doc.id,
        data: JSON.stringify({ id: this.doc.data?.id }),
      });
      this.showFinish = false;
    },
    //   visib() {
    //     if (this.packet.list === undefined) {
    //       this.redGetStatus();
    //     }
    //   },
    redGetStatus() {
      //{"type":5,"data":"{\"id\":6}"}
      this.sendMessage({
        type: 5,
        msgId: this.packetItem.id,
        data: JSON.stringify({ id: this.packetItem.data?.id }),
      });
    },
    alertReload() {
      if (this.wsStatus === false) {
        this.showOpen = false;
        this.showFinish = false;
      }
    },
    getRecord() {
      this.showRecord = false;
    },
    receive(event) {
      event.stopPropagation();
      this.$router.push({
        name: "CollectionDetails",
        params: { doc: this.packetItem },
      });
    },
    //发送消息:{"type":6,"data":"{\"id\":2}"}
    async getPacket() {
      this.showOpen = false;
      this.$toast.loading({
        message: "领取中...",
        forbidClick: true,
        duration: 3000, // 设置 3 秒后关闭
      });
      await this.sleep(1000);
      this.sendMessage({
        type: 6,
        msgId: this.doc.id,
        data: JSON.stringify({ id: this.doc.data?.id }),
      });
    },
    async getPacket1() {
      if (this.shareData.gainRed === 0 && !this.isMe) {
        this.$toast(`充值${this.shareData.gainRecharge}才能参与抢红包`);
        // this.$notify({ type: 'warning', message: `今日充值${this.shareData.gainRecharge}才能参与抢红包`, background: '#7419b9' });
        // this.getMoneyRecord();
        return;
      }
      this.showPacketOpen = false;
      this.$toast.loading({
        message: "领取中...",
        forbidClick: true,
        duration: 3000, // 设置 3 秒后关闭
      });
      await this.sleep(1000);
	  // 标识为抢红包功能触发
	  this.setGain(true);
      this.sendMessage({
        type: 6,
        msgId: this.packetItem.id,
        data: JSON.stringify({ id: this.packetItem.data?.id }),
      });
    },
    clickOverlay() {
      this.showOverlayOpen = false;
    },
    goRedDetail() {
      this.$router.push({
        name: "CollectionDetails",
        params: { doc: this.doc },
        // query: { doc: this.doc },
      });
    },
	closeFinish(){
	  this.setGain(false);
		// console.log("close")
	},
    goDetail() {
      this.showFinish = false;
	  if(this.unAcceptList.length > 0){
		this.ledPacket();
	  }
    },
    async goRed() {
   //    const [err, res] = await userApi.redGain();
	  // if (err) {
	  //   return;
	  // }
	  // this.unAcceptList = res.data
    },
  },
  created() {
    EventBus.$on("newRedPacketNotice", (data) => {
      console.log("收到一个新红包");
	  let newRed = data
	  newRed.data = JSON.stringify(newRed.data)
	  this.unAcceptList.push(newRed)
	  
	  this.triggerEffect();
    });

    EventBus.$on("redGetStatus", ({ msgId, data }) => {
	  if(!this.isGain) return;
	  if (+msgId === +this.packetItem.id) {
	    this.redGetStatus();
	    const { code } = data;
	    this.$toast.clear();
	    this.ajaxPack = data;
		this.unAcceptList.shift();
	    if (+code > 0) {
	      //1.已被抢空 2.已抢过红包
	      this.$toast.fail(+code === 1 ? "红包已被抢空" : "您已抢过该红包");
	      return;
	    }
	    this.showFinish = true;
	  }
    });
	this.goRed()
  },
  beforeDestroy() {
    // 清理监听
    // console.log("beforeDestroy  清理监听");
    // EventBus.$off("redGetStatus");
    // EventBus.$off("getMoneyRecord");
  },
};
</script>
<style scoped lang="scss">
.red-img {
  // width: 468px;
  // height: 172px;

  img {
    object-fit: contain;
  }
}

.redBox {
  bottom: 394px;
  // right: 16px;
  right: 18px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
  color: #666;
  .redBoxImg {
    width: 178px;
    height: 178px;
  }
}
.popupOpenBox {
  // height: 850px;
  background: transparent;
}
.close-btn {
  display: block;
  width: 64px;
  height: 64px;
  margin: 42px auto 0;
}
.popupOpenPacket {
  position: relative;
  .receive {
    width: 100%;
    position: absolute;
    bottom: 20px;
    text-align: center;
    font-size: 24px;
    .double-arrow {
      width: 20px;
      height: 30px;
      fill: none;
      stroke: white;
      opacity: 0.8;
      vertical-align: middle;
    }
  }
}

.popupOpen {
  padding-top: 146px;
  width: 510px;
  height: 794px;
  background: url("@/assets/img/openRed.png") no-repeat center;
  background-size: 100% 100%;
  color: #feedaf;

  .d-desc {
    font-size: 36px;
  }
}

.user-red {
  width: 32px;
  height: 32px;
}

.popupFinish {
  // padding-top: 408px;
  width: 668px;
  height: 574px;
  background: url("@/assets/img/modalImg1.png") no-repeat center;
  background-size: 100% 100%;

  .names {
    color: #191919;
  }

  .d-desc {
    color: #999999;
    font-size: 24px;
  }
  .RedMoneyImg {
    height: 34px;
    margin-top: 154px;
    margin-bottom: 34px;
  }

  .d-meng {
    font-size: 56px;
    color: #bf2935;
    align-items: baseline;

    span {
      font-size: 24px;
    }
  }

  .view {
    color: #b78756;
    font-size: 24px;
  }
}

.table-lists {
  .hearder {
    background: #f0f0f0;
    color: #333 !important;
    margin: 0 !important;
    padding: 0 30px;
  }

  .row {
    display: grid;
    grid-template-columns: 50% 50%;
    color: #777777;
    border-bottom: 1px solid #eaeaea;
    align-items: center;
  }

  .col {
    padding: 24px 0;
    text-align: center;
  }
}

.redRecord {
  //width: 994px;
  //height: 648px;

  background: #fff;

  .red-active {
    color: #feedaf;
  }

  .red-close {
    position: absolute;
    top: 0px;
    right: 0;
    width: 108px;
  }

  .one-doc {
    height: 50px;
    border-bottom: 2px solid rgba(254, 237, 175, 0.3);
  }
}

.reg-img-cont {
  width: 370px;
  height: 88px;
  background-size: 100% 100%;
  color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 44px;
    height: 54px;
    margin-left: 22px;
    margin-right: 12px;
  }

  .describes {
    padding-bottom: 4px;
    font-size: 24px;
  }

  .status {
    // margin-left: 28px;
    font-size: 20px;
  }
}

// 领取失败弹框
.modal {
  width: 542px;
  height: 466px;
  background: url("@/assets/img/modalImg.png") no-repeat center;
  background-size: 100% 100%;
}

/* 上半部分白底区域 */
.modal-header {
  text-align: center;
  // padding: 20px 10px 10px;
  // background: linear-gradient(to bottom, #fff, #fefefe);
}
.redImg {
  width: 84px;
  height: 84px;
  margin-top: 34px;
}

.modal-title {
  width: 208px;
  height: 42px;
  background: linear-gradient(
    270deg,
    rgba(255, 98, 103, 0) 0%,
    #f3555a 33%,
    #ed4e53 67%,
    rgba(231, 71, 76, 0) 100%
  );
  border-radius: 0px 0px 0px 0px;
  font-family: Roboto, Roboto;
  font-weight: 500;
  font-size: 24px;
  margin-top: 38px;
  text-align: center;
  color: #ffffff;
  font-style: normal;
  text-transform: none;
}

.modal-subtitle {
  margin-top: 10px;
  font-family: Roboto, Roboto;
  font-weight: 500;
  font-size: 24px;
  color: #bf2935;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 26px;
}

.modal-detail {
  font-family: Roboto, Roboto;
  font-weight: 400;
  font-size: 24px;
  padding-top: 126px;
  color: #feedaf;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
.double-arrow {
  width: 20px;
  height: 30px;
  fill: none;
  stroke: white;
  opacity: 0.8;
  vertical-align: text-bottom;
}

/* 下半部分 */
.modal-footer {
  width: 226px;
  height: 56px;
  background: url("@/assets/img/btn-bg.png") no-repeat center;
  background-size: 100% 100%;
  text-align: center;
  margin: 172px auto 0;
  font-family: Roboto, Roboto;
  font-weight: 500;
  font-size: 24px;
  line-height: 56px;
  color: #bf2935;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
.modal-footer-detail {
  margin: 28px auto 0;
}

/* 按钮 */
.confirm-btn {
  padding: 8px 30px;
  background: linear-gradient(to bottom, #fff3e0, #ffe0b2);
  color: #d43c33;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
}
.shake {
  animation: shake 0.5s infinite;
  .redBoxImg {
    width: 240px;
    height: 240px;
  }
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-20deg);
  }
  75% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
