<template>
  <div>
    <div v-if="doc.status == 1">
      <p class="center-center m-t-12 m-b-12 font14 color999">
        {{ isMe ? "你撤回了一条消息" : `${doc.user}撤回了一条消息` }}
      </p>
    </div>
    <div
      v-else
      class="d-flex"
      style="overflow: hidden"
      :class="{ 'my-msg': isMe }"
    >
      <div class="room-msg p-l-24 p-l-24 d-flex m-b-8">
        <img
          @click="previewImage"
          v-long-press="() => pressAite(`@${doc.user}`)"
          class="d-img user-pic iconImg"
          :class="[isMe ? 'm-l-12 m-r-24' : ' m-r-12']"
          :src="
            doc.img
              ? doc.img.includes('http')
                ? doc.img
                : `${$baseURL}/${doc.img}`
              : doc.user == '系统'
              ? sysPic
              : userPic
          "
        />

        <ul
          class="flex-column"
          v-if="[2, 4, 8, 13, 14, 6, 3, 9, 16, 17, 10].includes(+doc.type)"
          :class="{ mainContent: !isMe, 'txtPad mainIsTrueMeContent': isMe }"
        >
          <li class="name align-center nameAndTime">
            <span class="m-r-8">{{ doc.user }}</span>
            <div class="center-center time-box">
              <p class="time">{{ $dayjsSingleTime(doc.time) }}</p>
            </div>
          </li>
          <li
            class="msg-txt-box d-flex"
            v-long-press="() => recallMessage(doc)"
          >
            <component
              v-if="[2, 4, 8, 13, 14, 6, 3, 9, 16, 17, 10].includes(+doc.type)"
              :is="currentComponent(+doc.type)"
              :userPic="doc.user == '系统' ? sysPic : userPic"
              :doc="doc"
              @openBetPop="openBetPop"
              ref="$component"
            ></component>
            <template v-else>
              <p
                class="msg-txt p-x-16 m-t-4"
                v-if="[10, 13].includes(+doc.type)"
                v-html="highlightedText(doc.data?.msg)"
              ></p>
              <!-- <div class="chatBoxShow  p-x-8 m-t-4"
                v-else-if="[0].includes(+doc.type) && doc.data.toString().indexOf(']') !== -1"
                v-html="wxEmojisHand(doc.data)">

              </div> -->
              <template
                v-else-if="
                  [0].includes(+doc.type) &&
                  doc.data.toString().indexOf(']') !== -1
                "
              >
                <img :src="doc.data | chatImg" class="bigIconImg" />
              </template>

              <p class="msg-txt p-x-16 m-t-4" v-else>
                {{ doc.data }}
              </p>
            </template>
          </li>
        </ul>

        <ul
          class="flex-column"
          v-if="![2, 4, 8, 13, 14, 6, 3, 9, 16, 17, 10].includes(+doc.type)"
          :class="{ txtPad: isMe, mainIsNotMeContent: !isMe }"
        >
          <li class="name align-center nameAndTime" v-if="!isMe">
            <span class="m-r-8">{{ doc.user }}</span>
            <div class="center-center time-box">
              <p class="time" style="margin-left: 10px">
                {{ $dayjsSingleTime(doc.time) }}
              </p>
            </div>
          </li>
          <li class="name align-center nameAndTime-me" v-if="isMe">
            <div class="center-center time-box">
              <p class="time" style="margin-right: 5px">
                {{ $dayjsSingleTime(doc.time) }}
              </p>
            </div>
            <span class="m-l-8">{{ doc.user }}</span>
          </li>
          <li
            class="msg-txt-box d-flex"
            v-long-press="() => recallMessage(doc)"
            :data-type="doc.type"
            :data-str="doc.data"
            :class="{
              imgBConi: !isMe && +doc.type != 0,
              jusCenter:
                !isMe &&
                [0].includes(+doc.type) &&
                doc.data?.toString().indexOf(']') !== -1,
              'msg-txt-box-me': isMe,
            }"
          >
            <!-- <component v-if="![2, 4, 8, 13, 14].includes(+doc.type)" :is="currentComponent(+doc.type)" :userPic="userPic"
              :doc="doc" @openBetPop="openBetPop" ref="$component"></component> -->
            <p
              class="msg-txt p-x-16 m-t-4"
              v-if="[10, 13].includes(+doc.type)"
              v-html="highlightedText(doc.data?.msg)"
            ></p>

            <img
              :src="doc.data | chatImg"
              class="bigIconImg"
              :class="{
                NotMeImg:
                  !isMe &&
                  [0].includes(+doc.type) &&
                  doc.data?.toString().indexOf(']') === -1,
                notMeImgPad:
                  !isMe &&
                  [0].includes(+doc.type) &&
                  doc.data?.toString().indexOf(']') !== -1,
              }"
              v-else-if="
                +doc.type == 0 && doc.data?.toString().indexOf(']') !== -1
              "
            />

            <div
              class="msg-txt p-x-16 align-center msgBoxTxt"
              :class="{
                'msg-txt-blue': doc.user == '系统',
                'msg-txt-isme': isMe,
                colorRed: doc.adminId == 1,
              }"
              style="white-space: pre-wrap"
              data-tip="txt"
              v-else-if="
                +doc.type == 0 && doc?.data.toString().indexOf('[') === -1
              "
            >
              <!-- 系统或管理员 -->
              <span
                v-if="doc.adminId == 1"
                class="contentTxt"
                :class="{
                  padText: !isMe,
                  'contentTxt-me': isMe,
                  colorWhite: isMe,
                }"
                v-html="formattedText(doc.data)"
              ></span>

              <!--  <span
			  	v-if="doc.adminId==1"
			    class="contentTxt"
			    :class="{ padText: !isMe, 'contentTxt-me': isMe }"
			  >{{doc.data}}</span> -->
              <!-- 普通用户 -->
              <span
                v-else
                class="contentTxt"
                :class="{ padText: !isMe, 'contentTxt-me': isMe }"
                >{{ doc.data }}</span
              >

              <div class="center-center time-box" v-if="isMe">
                <p class="time" v-if="!isMe">
                  {{ $dayjsSingleTime(doc.time) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Toast } from "vant";
import userPic from "@/assets/img/user-room.png";
import sysPic from "@/assets/img/systemUser.png";
import bindBuy from "@/views/chat/components/bindBuy.vue";
import imgMsg from "@/views/chat/components/imgMsg.vue";
import opensMsg from "@/views/chat/components/opensMsg.vue";
import fileMsg from "@/views/chat/components/fileMsg.vue";
import balanceMsg from "@/views/chat/components/balanceMsg.vue";
import winMsg from "@/views/chat/components/winMsg.vue";
import callMsg from "@/views/chat/components/callMsg.vue";
import statistics from "@/views/chat/components/statistics.vue";
import redImg from "@/views/chat/components/redImg.vue";
import bets from "@/views/chat/components/bets.vue";

import repalyMsg from "@/views/chat/components/repalyMsg.vue";
import { wxEmojis } from "@/utils/wxEmojis";
import { mapActions } from "vuex";
import bigListArr from "@/plugins/bigList.js";
export default {
  filters: {
    showIcon: function (str) {},
    chatImg: (itemName) => {
      const item = bigListArr.bigListArr.find(
        (item) => `[${item.name}]` === itemName
      );
      if (item) {
        let urlStr = "../" + item.url;
        return require(`@/assets/img/${item.urlStr}`);
      }

      return ""; // 避免 undefined 影响 img 加载
    },
  },
  data() {
    return {
      userPic,
      sysPic,
      actions: [
        { text: "撤回", value: 1, disabled: false },
        { text: "回复", value: 2, disabled: false },
      ],
      imagesAva: [],
    };
  },
  components: {
    bindBuy,
    redImg,
    bets,
    imgMsg,
    repalyMsg,
    opensMsg,
    fileMsg,
    balanceMsg,
    winMsg,
    callMsg,
    statistics,
  },
  computed: {
    popoverDisabled() {
      if (![0, 8, 10, 13, 6, 2, 3, 9, 16, 17].includes(+this.doc.type)) {
        return true;
      }
      return this.disabled;
    },
    countActions() {
      return this.actions.filter((v) => !v.disabled);
    },
    isMe() {
      return this.doc.playerId === this.user.id;
    },
    user() {
      return this.$store.state.user;
    },
    doc() {
      let data;
      try {
        data = JSON.parse(this.item.data);
        if (!isNaN(data) && !isNaN(parseFloat(data))) {
          data = this.item.data;
        }
      } catch (error) {
        data = this.item.data;
      }
      return {
        ...this.item,
        data,
      };
    },
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    ...mapActions("chat", [
      "initWebSocket",
      "closeWebSocket",
      "sendMessage",
      "fetchHistory",
    ]),
    previewImage() {
      // let imgSort = this.doc.img
      // if (!imgSort) {
      //   Toast({
      //     message: '没有设置头像,无法预览',
      //     // position: 'top',
      //   });
      //   return false
      // }
      // let imgAll = imgSort.includes("http")
      //   ? imgSort
      //   : `${this.$baseURL}/${imgSort}`;
      // this.imagesAva.push(imgAll)
      // // console.log("this.imagesAva", this.imagesAva);
      // ImagePreview({
      //   images: this.imagesAva, // 图片数组
      //   // startPosition: index, // 默认预览第几张图片
      //   closeable: false, // 允许关闭
      //   closeIcon: "close", // 关闭按钮样式
      //   loop: true, // 是否循环预览
      // });
    },
    openBetPop(v) {
      this.$emit("openBetPop", v);
    },
    pressAite(v) {
      if (this.isMe) return;
      console.log("pressAite", this.isMe);
      this.$emit("pressAite", v);
    },
    wxEmojisHand(html) {
      // console.log("message12323", html, typeof html);
      // let wxEmojis_message = wxEmojis(html);
      // console.log("wxEmojis_message", wxEmojis_message);
      // return wxEmojis_message
      // console.log("html", html);
      // if (['['].includes(html)) {
      //   return wxEmojis(html);
      // } else {
      //   return html;
      // }
      // console.log("1112323", html);
      // return wxEmojis(html);
    },

    highlightedText(v) {
      return v.replace(
        /@(\w+)/g,
        '<span style="color:#488fca;margin:0 2px;">@$1</span>'
      );
    },
    comfire(v) {
      return new Promise((resolve) => {
        this.$dialog
          .confirm({
            message: v,
            confirmButtonColor: "#3291FF",
            className: "confirm-no-tile-dialog",
          })
          .then(() => {
            resolve(1);
          })
          .catch(() => {
            resolve(0);
          });
      });
    },
    async recallMessage(doc) {
      //time 1739257809520 两分钟内才能撤回
      if (new Date().getTime() - doc.time > 120000) return;
      if (!this.isMe) return;
      const status = await this.comfire("是否撤回消息");
      if (!status) return;
      console.log("recallMessage", doc);
      this.sendMessage({
        type: 9,
        data: JSON.stringify({ id: doc.id }),
      });
    },
    visib() {
      if (this.$refs.$component?.visib) {
        this.$refs.$component?.visib();
      }
    },
    currentComponent(type) {
      // console.log(type)
      switch (type) {
        case 2:
          //订单列表
          return "bindBuy";
        case 3:
          //开奖数据
          return "bets";
        case 17:
          //图片
          return "imgMsg";
        case 13:
          //回复
          return "repalyMsg";
        case 10:
          //回复
          return "callMsg";
        case 6:
          //用户余额列表
          return "balanceMsg";
        case 7:
          // 结算列表
          return "winMsg";
        case 9:
          // 统计
          return "statistics";
        case 8:
          //开奖信息
          return "opensMsg";
        case 16:
          //开奖信息
          return "fileMsg";
        default:
          return "redImg";
      }
    },

    formattedText(data) {
      // 正则表达式匹配URL
      var str = data.toString();
      const urlPattern = /https?:\/\/[^\s$.?#].[^\s]*/g;
      return str.replace(urlPattern, (url) => {
        // 将匹配的URL替换为<a>标签
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    },
  },
};
</script>
<style lang="scss">
.my-msg {
  .video {
    float: right;
  }
  justify-content: flex-end;
  //翻转
  //flex-direction: row-reverse;
  .room-msg {
    flex-direction: row-reverse;
    padding: 8px 0;
  }

  .txtPad {
    // margin-right: 40px;
    // margin-right: 110px;
  }

  .name {
    justify-content: flex-end !important;
  }

  .msg-txt {
    text-align: right;
    border-radius: 10px;
    justify-content: space-between;
  }

  .msg-txt-box {
    justify-content: flex-end;
    user-select: none;
    /* 禁止选中文本 */
    -webkit-user-select: none;
    /* 兼容 iOS & Safari */
    -webkit-touch-callout: none;
    /* 禁止长按弹出菜单 */
  }
  .msg-txt-box-me {
    // padding-top: 12px;
  }

  .msgBoxTxt {
    // width: 80%;

    .contentTxt {
      text-align: left;
      display: inline-block;
      /* 让内容可自适应宽度 */
      // max-width: 80%;
      /* 设定最大宽度，例如 80% 的父容器 */
      word-wrap: break-word;
      font-size: 24px;
      /* 允许长单词或 URL 换行 */
      word-break: break-word;
      /* 适用于各种浏览器，保证长文本不会溢出 */
      white-space: normal;
      /* 让文本自动换行 */
      margin-right: 40px;
    }

    .contentTxt-me {
      text-align: right;
      margin-right: 0;
    }
  }
  @media (min-width: 500px) {
    .contentTxt {
      font-size: 76px !important;
    }
  }
}

.padText {
  // margin-left: 10px;
}

.room-msg {
  color: #000;

  .user-pic {
    width: 60px;
    height: 60px;
    // border-radius: 50%;
  }

  .name {
    color: #000;
    font-weight: 400;
    font-size: 20px;

    &,
    span {
      line-height: 1;
    }
  }

  .msg-txt {
    // margin-top: 12px;
    background: #ffffff;
    color: #242424;
    font-size: 24px;
    // border-radius: 10px 10px 10px 10px;
    // border: 2px solid #f0f0f0;
    padding: 16px;
    border-radius: 0px 16px 16px 16px;
    display: inline-flex;
  }

  @media (min-width: 500px) {
    .user-pic {
      width: 180px;
      height: 180px;
      margin-left: 24px !important;
      margin-right: 24px !important;
    }
    .name {
      font-size: 76px;
    }
    .msg-txt {
      font-size: 76px;
    }
  }
  .msg-txt-blue {
    color: #1989fa;
  }
  .msg-txt-isme {
    color: #fff;
    background: #bf2834;
    border-radius: 16px 0px 16px 16px;
    margin-top: 8px;
  }
}

.time-box {
  .time {
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 18px;
    color: #b6babe;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  @media (min-width: 500px) {
    .time {
      font-size: 64px;
    }
  }
}

.chatBoxShow {
  background: #ffffff;
  border-radius: 10px 10px 10px 10px;
  border: 2px solid #f0f0f0;
  width: 80%;

  //微信默认表情
  .wxEmojis {
    display: inline-block;

    width: 62px;
    height: 62px;
    background: url("~@/assets/img/wxEmojis.png") top left no-repeat;
    // background-position: -3px -3px;
    vertical-align: bottom;
    margin: 0 1px;
  }

  i {
    font-style: normal;
  }
}

.bigIconImg {
  width: 200px;
  height: 200px;
}

.NotMeImg {
  padding-top: 20px;
  padding-left: 20px;
}

.notMeImgPad {
  // padding: 20px;
  // padding-top: 18px;
}

.iconImg {
  border-radius: 50%;
}

.mainContent {
  // background: #FFFFFF;
  border-radius: 32px;
  position: relative;
  // margin-left: 20px;
  padding: 10px 0 8px 0;

  // &::before {
  //   content: "";
  //   position: absolute;
  //   top: 15px;
  //   left: -24px;
  //   width: 24px;
  //   height: 40px;
  //   background: #FFFFFF;
  //   background: url('~@/assets/img/chattip.png');
  //   background-size: cover;
  // }
}

.mainIsNotMeContent {
  // background: #FFFFFF;
  position: relative;
  // margin-left: 20px;
  padding: 8px 0 10px 0;
  border-radius: 16px;

  // &::before {
  //   content: "";
  //   position: absolute;
  //   top: 15px;
  //   left: -24px;
  //   width: 24px;
  //   height: 40px;
  //   background: #FFFFFF;
  //   background: url('~@/assets/img/chattip.png');
  //   background-size: cover;
  // }
}

@media (min-width: 500px) {
  .mainIsNotMeContent {
    padding: 24px 0 30px 0;
  }
}
.mainIsTrueMeContent {
  // background: #FFFFFF;
  position: relative;
  // margin-left: 20px;
  // padding: 10px 0 10px 0;
  border-radius: 16px;
  // padding-bottom: 20px;
}

.nameAndTime {
  // padding: 0 20px;
  color: #000;
  font-weight: 400;
  font-size: 20px;
  padding-bottom: 16px;
}
.nameAndTime-me {
  margin-top: 10px;
}

.imgBConi {
  margin-left: 20px;
}

.jusCenter {
  justify-content: center;
}
.colorRed {
  color: #bf2834 !important;
}
.colorWhite {
  color: #fff !important;
}
</style>
