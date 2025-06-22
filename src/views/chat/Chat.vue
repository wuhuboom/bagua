<template>
  <!-- <div class="chat-con flex-column" :style="{ height: `${chatHeight}px` }"> -->
  <div class="chat-con flex-column chatHeight">
    <AppTopBar ref="topBar" topBarTitle="聊天室">
     <!-- <template #left>
        <p class="center-center colorfff moneyLeft" @click="checkMoney">
          余额{{ showBlance ? divide(user.balance) : " *****" }}
          <img
            class="d-img"
            src="@/assets/img/uneye.png"
            alt=""
            v-if="showBlance"
          />
          <img
            class="d-img"
            src="@/assets/img/ableeye.png"
            alt=""
            v-if="!showBlance"
          />
        </p>
      </template>
      <template #right>
        <p class="center-center colorfff serve m-r-24" @click="serve">
          <img class="d-img m-r-4" src="@/assets/img/card.png" alt="" />
          人工充值
        </p>
      </template> -->
    </AppTopBar>
    <topBets @update-head="updateMinlossBox" @expect="expect" />
    <div
      ref="chatBox"
      class="flex-1 chat-box js-cont-room"
      @scroll="handleScroll"
    >
      <infinite-loading
        direction="top"
        @infinite="infiniteHandler"
      ></infinite-loading>
      <roomMsg
        @pressAite="pressAite"
        @openBetPop="openBetPop"
        :data-msg-id="v.id"
        :disabled="disabled"
        v-observe-visibility="visibilityChanged(v, i)"
        :item="v"
        v-for="(v, i) in messages"
        :key="i"
        ref="$roomMsg"
      />
    </div>
  


    
    <div class="unread-mention center-center flex-column">
      <div @click="goBtm" v-if="aites.length">
        <van-badge :data-badge="aites.length" :content="aites.length" max="99">
          <span class="at-symbol center-center">@</span>
        </van-badge>
      </div>
      <div
        class="align-center m-t-32 at-symbol"
        v-if="showButton"
        @click="scrollToBottom"
      >
        <div class="imgB">
          <img src="@/assets/img/gobottom.png" />
        </div>
        <div class="txt">回到底部</div>
      </div>
    </div>
    <van-action-sheet
      :overlay="false"
      v-model="showUserList"
      class="aite-box-sheet"
    >
      <ul class="user-list">
        <li
          class="align-center"
          v-for="(user, index) in filteredUsers"
          :key="index"
          :class="{ active: index === selectedIndex }"
          @click="selectUser(user)"
        >
          <img
            class="d-img user-pic m-r-8"
            :src="
              user.img
                ? user.img.includes('http')
                  ? user.img
                  : `${$baseURL}/${user.img}`
                : userPic
            "
          />
          @{{ user.username }}
        </li>
      </ul>
    </van-action-sheet>
    <div ref="bottomBox" class="bottom-box">
      <!-- <div class="height"></div> -->
	  <div class="quick">
		  <div class="item-box">
			  <div class="btn center-center font13" style="background-color: #5dcf05;" @click="openScores" >上分</div>
		  </div>
		  <div class="item-box">
			  <div class="btn center-center font13" style="background-color: #d50019;" @click="openDownScores" >下分</div>
		  </div>
		  <div class="item-box">
			  <div class="btn center-center font13" style="background-color: #0d79ff;" @click="sendQuick('走势')" >走势</div>
		  </div>
		  <div class="item-box">
			  <div class="btn center-center font13" style="background-color: #4e09ff;" @click="openPopup" >复投</div>
		  </div>
		  <div class="item-box">
			  <div class="btn center-center font13" style="background-color: #5a5f64;" @click="sendQuick('取消')" >取消</div>
		  </div>
	  </div>
      <div class="wrap-box" :class="{ 'btm-disabled': disabled }">
    
        <div class="input-box" @keydown.enter.prevent="send">
          <!-- <div contentEditable="true" contenteditable="plaintext-only" ref="inputRef" id="chatTextarea"
            class="chatTextarea" @keyup="handkeKeyUp" @keydown="handleKeyDown" @blur="chatTextareaClick"></div>
 -->
          <!-- <quill-editor
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @change="onEditorChange($event)">
    </quill-editor> -->

          <!-- <van-field label="">

          </van-field> -->

          <!-- <quill-editor v-model="text" :options="editorOptions" class="editor" ref="quillEditor"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" /> -->

          <!-- <vue-quill-editor v-model="text" ref="quillEditor" :options="editorOptions" @change="onInput" /> -->
          <!-- :class="{ 'inputClearBg': !ableChat }" -->
          <input
            type="text"
            class="input font13"
            ref="inputRef"
            :placeholder="placeholder"
            v-model="text"
            @input="onInput"
            :disabled="!ableChat "
          />
        </div>

        <div class="btn center-center font13" @click="send" >发送</div>
      </div>
    </div>
    <van-popup class="popupMoney" v-model="repurchaseShow">
		<div class="repurchase-panel">
			<div class="item" v-for="(item, index) in orderList" :key="index">
				<span class="val">{{item.betCode2}}</span>
				<div class="btn center-center font13" @click="sendQuick(item.betCode2)" >复购</div>
			</div>
		</div>
    </van-popup>
    <van-popup class="upScores" v-model="upScoresShow">
		<div class="scores-title">
			快捷金额
		</div>
		<div class="scores-panel">
			<div class="item" v-for="(item, index) in scoresList" :key="index">
				<div class="val" @click="upScores(item)">{{item}}</div>
			</div>
		</div>
    </van-popup>
	<van-popup class="upScores" v-model="downScoresShow">
		<div class="scores-title">
			快捷金额
		</div>
		<div class="scores-panel">
			<div class="item" v-for="(item, index) in downScoresList" :key="index">
				<div class="val" @click="downScores(item)">{{item}}</div>
			</div>
		</div>
	</van-popup>
    <bindBetPop ref="$bindBetPop" />
    <RedPacketTips/>
  </div>
</template>

<script>
import userApi from "@/api/user";
import userPic from "@/assets/img/user-room.png";
import dataFace from "@/plugins/dataFace.json";
import bindBetPop from "@/views/chat/components/bindBetPop.vue";
import roomMsg from "@/views/chat/components/roomMsg.vue";
import topBets from "@/views/chat/components/topBets.vue";
import RedPacketTips from "@/views/chat/components/RedPacketTips.vue";
import InfiniteLoading from "vue-infinite-loading";
import { ObserveVisibility } from "vue-observe-visibility";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import wxEmojisDialog from "./components/wxEmojisDialog";
import { wxEmojis } from "@/utils/wxEmojis";
import sendChatMsg from "@/utils/sendChatMsg";
import bigListArr from "@/plugins/bigList.js";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

// import maniImage from '@/assets/img/mani.png';
// import baifoImage from '@/assets/img/baifo.png';
// import sx1Image from '@/assets/img/sx1.png';
// import sx2Image from '@/assets/img/sx2.png';

// const bigListArr = [
//   {
//     name: "玛尼",
//     id: 1,
//     url: "../../assets/img/玛尼.png",
//     urlStr: "玛尼.png",
//     urlImg: maniImage,
//   },
//   {
//     name: "拜佛",
//     id: 2,
//     url: "../../assets/img/拜佛.png",
//     urlStr: "拜佛.png",
//     urlImg: baifoImage,
//   },
//   {
//     name: "烧香1",
//     id: 3,
//     url: "../../assets/img/烧香1.png",
//     urlStr: "烧香1.png",
//     urlImg: sx1Image,
//   },
//   {
//     name: "烧香2",
//     id: 4,
//     url: "../../assets/img/烧香2.png",
//     urlStr: "烧香2.png",
//     urlImg: sx2Image,
//   },
// ];

export default {
  name: "chatRoom",
  data() {
    return {
      // maniImage,
      // baifoImage,
      // sx1Image,
      // sx2Image,
	  upScoresShow: false,
	  downScoresShow: false,
	  repurchaseShow: false,
	  orderList: [],
	  scoresList:[100, 200, 500, 1000, 5000, 10000],
	  downScoresList:[100, 200, 500, 1000, 5000, 10000, '全部'],
      showButton: false,
      filteredUsers: [],
      showUserList: false,
      selectedIndex: 0,
      mentionPosition: -1, // 记录 `@` 位置
      dataFace: dataFace.filter((v, i) => i < 350),
      faceImages: [
        "https://symbl.cc/i/webp/f0/11059da74945c22c881d6ab54a15dd.webp",
      ],
      showPopover: false,
      actions: [{ text: "选项一" }, { text: "选项二" }, { text: "选项三" }],
      chatHeight: window.innerHeight,
      userPic,
      text: "",
      shareData: {
        chatAble: 1, // 是否可聊天
        // recharge 3000
        //chatStatusSys 加了这个， 0关闭 1开启
      },
      loadingShare: false,
      doc: {},
      // unChat: true,
      chatTextarea: "",
      selectionN: null,
      plainText: "",
      editorOptions: {
        theme: "snow",
        placeholder: "请输入内容...",
        modules: {
          toolbar: false,
        },
      },
      lastSendTime: null, // 记录上一次发送表情的时间
      sendInterval: 30000, // 发送时间间隔（毫秒）,
      showBlance: false,
      isHeadClosed: false,
      showLossMinBool: false,
      timerConData: [],
      activeBiaoqing: 0,
      bigLARR: [],
      timerMap: {},
	  nextExpect:{},
	  unGame: false
    };
  },
  directives: {
    ObserveVisibility,
  },
  filters: {
    pcText: (con) => {
      console.log("con", con);
      if (!con) return "";
      let str = "";

      if (con.type == 2) {
        //与别人合买
        str =
          "你与 " +
          con.users +
          " 合买" +
          "   " +
          con.loName +
          " 已中奖  " +
          "+" +
          con.win;
      } else {
        str = con.textTip + "   " + con.loName + " 已中奖  " + "+" + con.win;
      }

      return con ? str : "";
    },
  },
  components: {
    roomMsg,
    InfiniteLoading,
    topBets,
    RedPacketTips,
    bindBetPop,
    wxEmojisDialog,
    quillEditor,
  },
  computed: {
    contentData() {
      return this.$store.state.chat.contentData; // 从 Vuex 获取 state
    },
    user() {
      // console.log('news', this.news);
      return this.$store.state.user;
    },
    // bigLARR() {
    //   return bigListArr.bigListArr
    // },
    placeholder() {
      // return this.unGame
      //   ? "封盘状态下禁止下注！"
      //   : "请输入内容";
	  return "请输入内容";
    },
    disabled() {
      return (
        +this.shareData.chatStatusSys === 0 || this.shareData.chatAble === 0
      );
    },
    serveData() {
      return this.$store.state.serveData?.serviceAddr;
    },
    user() {
      return this.$store.state.user;
    },
    ...mapState("chat", [
      "messages",
      "playerId",
      "query",
      "ws",
      "wsStatus",
      "onlineUser",
      "ableChat",
      // "contentData"
    ]), // 绑定聊天消息记录
    ...mapGetters("chat", ["news", "aites"]),
    ...mapGetters("wxEmojisData", ["wxEmojisDataGet"]),
  },
  watch: {
    wsStatus() {
      this.alertReload();
    },
    contentData(newVal) {
      if (newVal && newVal.length) {
        newVal.forEach((item) => {
          this.listerPcData(item.id);
        });
      }
    },
  },
  methods: {
    updateMinlossBox(head) {
      this.isHeadClosed = !head; // 当 head 为 false 时，隐藏 minlossBox
    },
	expect(item){
	  this.unGame = false;
	  if(item.countdown==-1&&item.stopTime==-1){
		  this.unGame = true
	  }
	  if(item.countdown<0&&item.stopTime>0){
		  this.unGame = true
	  }
	},
    getImageUrl(imageName) {
      const images = require.context(
        "@/assets/img",
        false,
        /\.(png|jpe?g|gif|svg)$/
      );

      console.log("images", images, `./${imageName}`);

      return images(`./${imageName}`);
    },
    back() {
      this.$router.push("/");
    },
    openBetPop(v) {
      this.$refs.$bindBetPop.open(v);
    },
    handleScroll() {
      const scrollContainer = this.$refs.chatBox;
      if (!scrollContainer) return;
      console.log("scrollContainer", scrollHeight);
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // 正确计算：用户滚动到接近底部（50px 以内）隐藏按钮
      this.showButton = scrollTop + clientHeight < scrollHeight - 50;
    },
    scrollToBottom() {
      const scrollContainer = this.$refs.chatBox;
      if (!scrollContainer) return;

      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      this.showButton = false; // 滚动到底部后隐藏按钮
    },
    /** 选择用户 */
    selectUser(user = null) {
      if (!user) {
        user = this.filteredUsers[this.selectedIndex];
      }
      if (user) {
        const beforeMention = this.text.slice(0, this.mentionPosition);
        const afterMention = this.text.slice(this.getCursorPosition());
        this.text = `${beforeMention}@${user.username} ${afterMention}`;
        this.showUserList = false;
      }
    },
    /** 获取光标位置 */
    getCursorPosition() {
      const textarea = this.$refs.inputRef;
      return textarea ? textarea.selectionStart : -1;
    },
    pressAite(v) {
      //this.text 空就直接替换，不空就判断是否有，在后面加空格 拼接
      if (this.text.trim() === "") {
        this.text = `${v} `;
      } else {
        this.text = `${this.text}@${v} `;
      }
      //输入框处于焦点
      this.$refs.inputRef.focus();
    },
    onInput() {
      const value = this.text;
      const cursorPos = this.$refs.inputRef.selectionStart;
      const atIndex = value.lastIndexOf("@", cursorPos - 1);
      //以@结尾
      if (value[value.length - 1] == "@") {
        this.filteredUsers = this.onlineUser.map((v) => v);
        // this.showUserList = true;
        this.mentionPosition = atIndex;
        return;
      }
      const matches = [...value.matchAll(/@(\S*)/g)]
        .map((m) => m[1])
        .filter((name) => name.length > 0);
      //取最后一个数组元素
      const lastMatch = matches[matches.length - 1];
      if (lastMatch) {
        if (!value.endsWith(`@${lastMatch}`)) {
          this.showUserList = false;
          return;
        }
        this.selectedIndex = 0;
        this.filteredUsers = this.onlineUser.filter((user) =>
          user.username.toLowerCase().includes(lastMatch.toLowerCase())
        );
        this.showUserList = true;
        this.mentionPosition = atIndex;
      } else {
        this.showUserList = false;
      }
    },
    highlightedText(v) {
      console.log(v);
      return v.replace(
        /@(\w+)/g,
        '<span style="color:#488fca;margin:0 2px;">@$1</span>'
      );
    },
    replay(v) {
      this.doc = v;
      this.$refs.inputRef.focus();
    },
    goBtm() {
      //aites  :data-msg-id="v.id" 滑动到可视区域
      const lastId = this.aites[this.aites.length - 1].id;
      document.querySelector(`[data-msg-id="${lastId}"]`)?.scrollIntoView();
    },
    ...mapMutations("chat", [
      "setUnAllowChat",
      "clearContentData",
      "remove_contentdata_item",
    ]),
    ...mapActions("chat", [
      "initWebSocket",
      "closeWebSocket",
      "sendMessage",
      "fetchHistory",
    ]),
    listerPcData(itemId) {
      console.log("定时器启动...");
      if (this.contentData) {
        console.log("有数据", this.contentData);
        const timerId = setTimeout(() => {
          console.log(`删除对应的中奖 id: ${itemId}`);
          this.remove_contentdata_item(itemId);
          // 删除已执行的定时器 ID
          this.timerConData = this.timerConData.filter((id) => id !== timerId);
        }, 30000);

        this.timerConData.push(timerId);
      } else {
        console.log("无数据", this.contentData);
      }
    },
    startAllTimers() {
      if (!this.contentData || !this.contentData.length) return;

      this.contentData.forEach((item) => {
        this.startTimerForItem(item.id);
      });
    },

    startTimerForItem(itemId) {
      if (this.timerMap[itemId]) return; // 已经启动过定时器

      const timerId = setTimeout(() => {
        console.log(`定时删除: ${itemId}`);
        this.remove_contentdata_item(itemId);
        delete this.timerMap[itemId];
      }, 30000);

      this.timerMap[itemId] = timerId;
    },

    clearAllTimers() {
      Object.values(this.timerMap).forEach((timerId) => clearTimeout(timerId));
      this.timerMap = {};
    },
    goToWinLottDetail(item) {
      console.log("item.path", item.path, item);
      this.$router.push(`${item.path}?id=${item.id}`);
    },
    goToMoneyList() {
      this.$router.push("/financial-details");
    },
    async afterRead({ file }) {
      //type "image/jpeg"
      if (file.type.indexOf("image/") === -1) {
        this.$toast("请上传图片");
        return;
      }
      //限制图片大小10M
      if (file.size > 1024 * 1024 * 10) {
        this.$toast("图片大小不能超过10M");
        return;
      }
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      const [err, res] = await userApi.uploadImg({ file });
      if (err) return;
      this.$toast.clear();
      console.log(res);
      // this.sendMessage({
      //   data: res.data,
      //   type: 3,
      // });
    },
    onSelect(action) {
      console.log(action);
    },
    openPopup() {
	  this.getOrder()
	  // this.orderList = [{str:"100"},{str:"100"},{str:"100"},{str:"100"}]
    },
	async getOrder() {
		let params = {
			status: 3,
			pageNo: 1,
			pageSize: 5
		}
	    const [err, res] = await userApi.lotteryMyOrder(params);
	    if (err) {
		  this.orderList = []
		  
	      return;
	    }
		console.log(res)
		this.orderList = res.data.results
		if(this.orderList.length > 0){
			this.repurchaseShow = true;
		}else{
			this.$toast("暂未投注，请先投注！");
		}
	},
	openScores(){
		this.upScoresShow = true;
	},
	openDownScores(){
		this.downScoresShow = true;
	},
	upScores(v){
		let str = "上分" + v
		this.sendQuick(str);
		this.upScoresShow = false;
	},
	downScores(v){
		let str = '';
		if(v=='全部'){
			str = '全下分' 
		}else{
			str = "下分" + v
		}
		this.sendQuick(str);
		this.downScoresShow = false;
	},
    //微信默认表情包回显
    wxEmojis(html) {
      return wxEmojis(html);
    },
    //点击表情包
    wxEmojisClick(item) {
      let wxEmojis = this.wxEmojis(item);
      // console.log("wxEmojis", wxEmojis);
      this.$refs.inputRef.focus();
      this.insertHtmlAtCaret(wxEmojis);
      // console.log("this.insertHtmlAtCaret(wxEmojis);", this.insertHtmlAtCaret(wxEmojis));
    },
    //选择表情包后在聊天框内插入html
    insertHtmlAtCaret(html) {
      return sendChatMsg.insertHtmlAtCaret(html, this.chatBlurIndex);
    },

    // 键盘抬起事件
    handkeKeyUp() {
      // if (this.showAt()) {
      //   const node = this.getRangeNode();
      //   const endIndex = this.getCursorIndex();
      //   this.node = node;
      //   this.endIndex = endIndex;
      //   this.position = this.getRangeRect();
      //   this.queryString = this.getAtUser() || "";
      //   this.atDialogShow = true;
      // } else {
      //   this.atDialogShow = false;
      // }
    },

    // 键盘按下事件
    handleKeyDown(e) {
      // if (this.atDialogShow) {
      //   if (
      //     e.code === "ArrowUp" ||
      //     e.code === "ArrowDown" ||
      //     e.code === "Enter"
      //   ) {
      //     e.preventDefault();
      //   }
      // }

      if (
        e.code === "ArrowUp" ||
        e.code === "ArrowDown" ||
        e.code === "Enter"
      ) {
        e.preventDefault();
      }
    },

    //点击聊天框
    chatTextareaClick() {
      //this.$refs.chatTextarea.focus();
      // 获取选定对象
      var selection = getSelection();
      // 设置最后光标对象
      this.chatBlurIndex = selection.getRangeAt(0);
    },
    //从html代码中获取纯文本
    trimHtml(str) {
      return sendChatMsg.trimHtml(str);
    },

    notAllow() {
      this.$dialog.alert({
        message: "你已经被禁言",
        confirmButtonColor: "#3291FF",
      });

      this.setUnAllowChat(false);
      // this.unChat = false
    },
    notView() {
      this.$dialog
        .alert({
          message: "你已经被踢出聊天室",
          confirmButtonColor: "#3291FF",
        })
        .then(() => {
          this.$router.push("/");
        });
    },
    async chat() {
      this.loadingShare = true;
      const [err, res] = await userApi.chat();
      this.loadingShare = false;
      if (err) return;
      this.shareData = res.data;
      if (+res.data.chatStatus === 1) {
        //禁言
        this.notAllow();
      } else if (+res.data.chatStatus === 2) {
        //踢出
        this.notView();
      } else if (+res.data.chatStatus === 0) {
        // this.unChat = true
        this.setUnAllowChat(true);
      }
    },
    checkMoney() {
      this.showBlance = !this.showBlance;
    },
    async serve() {
      await this.$store.dispatch("getServeData");
      location.href = this.serveData;
    },
    alertReload() {
      if (this.wsStatus === false) {
        this.$dialog
          .alert({
            message: "已经离线，是否重连？",
            confirmButtonColor: "#3291FF",
          })
          .then(() => {
            location.reload();
          });
      }
    },
    visibilityChanged(v, i) {
      return (isVisible) => {
        if (isVisible) {
          this.$refs.$roomMsg[i].visib && this.$refs.$roomMsg[i].visib();
          if (v.new === true) {
            this.$store.commit("chat/setToOld", v);
          }
        }
      };
    },
    sendImgIcon(str) {
      if (
        this.shareData.chatStatusSys === 0 ||
        this.shareData.chatAble === 0 ||
        !this.ableChat
      ) {
        this.showPopover = false;
        return false;
      }
      // 节流处理
      if (
        this.lastSendTime &&
        Date.now() - this.lastSendTime < this.sendInterval
      ) {
        this.$toast("发送频率过快，请稍后再试");
        console.log("频率快");
        this.showPopover = false;
        return false;
      }

      this.lastSendTime = Date.now();

      this.sendMessage({
        data: "[" + str.name + "]",
      });
      this.showPopover = false;

      localStorage.setItem("selectedImgBqItem", JSON.stringify(str));
      this.updateBigLARR(str);
    },
    updateBigLARR(selectedItem) {
      if (!selectedItem) return;
      this.bigLARR = [
        selectedItem,
        ...this.bigLARR.filter((i) => i.urlStr !== selectedItem.urlStr),
      ];
    },
    async sendQuick(str) {
      if (str) {
        const matches = [...str.matchAll(/@(\S*)/g)]
          .map((m) => m[1])
          .filter((name) => name.length > 0);
        if (matches.length > 0) {
          const users = this.onlineUser.filter((user) =>
            matches.includes(user.username)
          );
          let playerId = users.map((v) => v.playerId);
          //去重复 playerId
          playerId = [...new Set(playerId)];
          this.sendMessage({
            type: 10,
            data: JSON.stringify({
              playerId: playerId,
              msg: str,
            }),
          });
        } else {
          this.sendMessage({
            data: str.trim(),
          });
        }
        await this.sleep(800);
      }
    },
    async send() {
      if (this.text) {
        const matches = [...this.text.matchAll(/@(\S*)/g)]
          .map((m) => m[1])
          .filter((name) => name.length > 0);
        if (matches.length > 0) {
          const users = this.onlineUser.filter((user) =>
            matches.includes(user.username)
          );
          let playerId = users.map((v) => v.playerId);
          //去重复 playerId
          playerId = [...new Set(playerId)];
          this.sendMessage({
            type: 10,
            data: JSON.stringify({
              playerId: playerId,
              msg: this.text,
            }),
          });
        } else {
          this.sendMessage({
            data: this.text.trim(),
          });
        }

        this.text = "";
        await this.sleep(800);
      }
    },
    onEditorBlur() {
      const quill = this.$refs.quillEditor.quill; // 获取 Quill 实例
      const selection = quill.getSelection(); // 获取当前光标位置
      console.log("selection", selection);
      this.selectionN = selection;
    }, // 失去焦点触发事件
    onEditorFocus() {
      const quill = this.$refs.quillEditor.quill; // 获取 Quill 实例
      const selection = quill.getSelection(); // 获取当前光标位置
      console.log("selection222", selection);
      this.selectionN = selection;
      console.log("this.selectionN222222222", this.selectionN);
    }, // 获得焦点触发事件
    insert(emoji) {
      this.text += emoji;
      // const quill = this.$refs.quillEditor.quill; // 获取 Quill 实例
      // quill.focus();
      // const selection = quill.getSelection(); // 获取当前光标位置
      // if (selection) {
      //   quill.insertText(selection.index, emoji, 'bold', true); // 插入文本
      // } else {
      //   quill.insertText(quill.getLength(), emoji, 'bold', true); // 如果未找到光标，则在末尾插入
      //   // console.log("selectionN", this.selectionN);
      //   // if (this.selectionN) {
      //   //   quill.insertText(selection.index, emoji, 'bold', true); // 插入文本
      //   // } else {
      //   //   quill.insertText(quill.getLength(), emoji, 'bold', true); // 如果未找到光标，则在末尾插入
      //   // }

      // }
      this.showPopover = false;
    },
    sleep(v) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(v);
        }, v);
      });
    },
    async infiniteHandler($state) {
      // $state.loaded(); $state.complete();
      const pageNo = this.query.pageNo + 1;
      if (this.query.totalPage !== null && pageNo > this.query.totalPage) {
        $state.complete();
        return;
      }
      this.fetchHistory({
        ...this.query,
        pageNo: this.query.pageNo + 1,
      });
      await this.sleep(1000);
      $state.loaded();
    },
    srcollBtm() {
      this.$nextTick(() => {
        const chatContainer = document.querySelector(".js-cont-room");
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    },
    srcollNow() {
      this.$nextTick(() => {
        const chatContainer = document.querySelector(".js-cont-room");
        const savedTop = sessionStorage.getItem('listScrollTop');
        if (chatContainer && savedTop) {
          chatContainer.scrollTop = parseInt(savedTop);
          console.log('回到原点')
        }
      });
      
    }
  },
  created() {
    const storedItem = localStorage.getItem("selectedImgBqItem");
    let tempArr = bigListArr.bigListArr;
    if (storedItem) {
      const parsedItem = JSON.parse(storedItem);
      this.bigLARR = [
        parsedItem,
        ...tempArr.filter((i) => i.urlStr !== parsedItem.urlStr),
      ];
    } else {
      this.bigLARR = [...tempArr]; // 没有存储数据时，使用原始列表
    }

    // this.clearContentData([]);

    this.$store.dispatch("getSharaData");
    this.scrollToBottom();
  },
  mounted() {
    this.chat();
    // if (this.wsStatus === true) {
    //   this.srcollBtm();
    //   return;
    // }
    // this.initWebSocket();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if(from.name != 'FinancialDetails' && from.name != 'CollectionDetails') {
        if (vm.wsStatus === true) {
          vm.srcollBtm();
          return;
        }
        vm.initWebSocket();
      } else {
        vm.srcollNow()
      }
      vm.startAllTimers();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.clearAllTimers();
    const scrollContainer = this.$refs.chatBox;
    if (scrollContainer) {
      sessionStorage.setItem('listScrollTop', scrollContainer.scrollTop);
    }
    next();
  },
  beforeDestroy() {
    this.clearAllTimers();
  }
};
</script>
<style scoped lang="less">
@height: 104px;
.chat-con {
  // background-image: url("../../assets/img/chatBg.png");
  // background-size: 100% 100%;
  background: #f3f3f6;
}
.chat-box {
  overflow-y: auto;
  margin-top: 140px;

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
  z-index: 13;
  position: relative;

  .height {
    height: @height;
  }

  .wrap-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: @height;
    background: #fff;
    padding: 0 16px;
    display: flex;
    align-items: center;

    .icon-box {
      .icon {
        color: #666;
        font-size: 50px;
      }

      img {
        width: 52px;
        height: 52px;
        vertical-align: middle;
      }
    }

    .input-box {
      margin: 0 20px 0 0px;
      flex: 1;
      // width: 100%;
      width: 50%;

      .input {
        width: 100%;
        border: none;
        border-radius: 10px;
        padding: 20px;
        padding-left: 30px;
        background: #eaeaea;
      }

      .inputClearBg {
        background: transparent;
      }
    }

    .btn {
      // width: 128px;
      // height: 72px;
      // border-radius: 14px 14px 14px 14px;
      // background: #bf2834;
      width: 80px;
      height: 80px;
      // padding: 30px;
      // background: linear-gradient(180deg, #ff6267 0%, #e7474c 100%);
	  background-color: #1989fa;
	  // border: .02667rem solid #1989fa;
      border-radius: 10px;
      color: #fff;
      // font-size: 26px;
    }
  }
  .quick{
	  width: 100%;
	  background-color: transparent;
	  display: flex;
	  flex-wrap: wrap;
	  .item-box{
		flex: 1 0 20%; 
		box-sizing: border-box; 
		padding: 0 16px;
		.btn{
			color: #fff;
			padding: 2px 0;
			border-radius: 8px;
		}
	  }
  }
}
.chatHeight{
	height: calc(100vh - @height);
}
@media (min-width: 750px) {
  .chatHeight{
	height: 90vh;
  }
  .chat-box {
	margin-top: 40px;
  }
  .wrap-box{
	  height: 300px !important;
	  position: inherit !important;
      padding: 0 48px !important;
	  .input-box {
		  height: 240px;
		  .input {
			  height: 240px;
			  line-height: 240px;
		  }
	  }
	  .btn{
		width: 340px !important;
		height: 240px !important;
	  }
  }
  .quick{
  	  .item-box{
  		padding: 0 40px !important;
  		.btn{
  			color: #fff;
  			padding: 6px 0 !important;
  			border-radius: 20px !important;
  		}
  	  }
  }
}
.face-box {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;

  li {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    // font-size: 24px;
    cursor: pointer;
    font-size: 36px;

    .emojiToImg {
      width: 48px;
      height: 48px;
    }
  }
}

.bigImgIcon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 20px 40px 0;
  flex-wrap: wrap;
  height: 50vh;
  overflow-y: scroll;

  img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}

.redMony {
  height: 52px;
  width: 52px;
  vertical-align: middle;
}

.btm-disabled {
  .input::placeholder {
    color: #f56c6c;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
}

.moneyLeft {
  margin-left: -20px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 24px;
  color: #ffffff;
  text-align: center;
  font-style: normal;
  text-transform: none;

  img {
    width: 28px;
    height: 28px;
    margin-left: 6px;
  }
}

.serve {
  img {
    width: 40px;
    height: 40px;
  }
}

.minlossBox {
  top: 240px;
  // right: 16px;
  right: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 32px;
  font-weight: bold;

  color: #666;

  .centerCon {
    display: flex !important;
    justify-content: center !important;

    align-items: flex-end;

    .content {
      // width: 128px;
      height: 48px;
      background: #fcfaff;
      box-shadow: 0px 6px 12px 2px rgba(110, 110, 110, 0.09);
      border-radius: 24px 0px 0px 24px;
      opacity: 0.75;

      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 20px;
      color: #4e81f3;
      line-height: 20px;
      // letter-spacing: 30px;
      text-align: center;
      font-style: normal;
      text-transform: none;
      margin-bottom: 20px;
    }

    .lotBox {
      margin-bottom: 20px;
    }

    .moneyCenter {
      // margin-top: 20px;
      padding: 0 8px;
      img {
        width: 36px;
        height: 36px;
        margin-right: 6px;
      }
    }

    .bigoCon {
      width: 488px;
      height: 48px;
      background: #02b500;
      border-radius: 22px 0px 0px 22px;
      opacity: 0.78;

      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 22px;
      color: #ffffff;
      line-height: 24px;
      // letter-spacing: 30px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }
}

.minlossBoxAc {
  top: 130px;
}

.recordBox {
  top: 308px;
  // right: 16px;
  right: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 32px;
  font-weight: bold;

  color: #666;

  .content {
    width: 128px;
    height: 48px;
    background: #1d1d1d;
    border-radius: 24px 0px 0px 24px;
    opacity: 0.75;

    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 22px;
    color: #ffffff;
    line-height: 20px;
    // letter-spacing: 30px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.recordBoxAc {
  top: 198px;
}

.unread-mention {
  // bottom: 330px;
  bottom: 226px;
  // right: 16px;
  right: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 32px;
  font-weight: bold;

  color: #666;
}

/* 让 @ 符号稍微变小 */
.at-symbol {
  // font-size: 28px;
  // width: 62px;
  // /* 控制徽章大小 */
  // border-radius: 50%;
  // /* 圆形 */
  // height: 64px;
  // background-color: #ffffff;
  // /* 近似 Telegram 的蓝色 */
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  // /* 轻微阴影 */

  min-width: 172px;
  height: 58px;
  background: #ffffff;
  box-shadow: 0px 6px 12px 2px rgba(0, 0, 0, 0.16);
  border-radius: 30px 0px 0px 30px;
  // margin-left: 20px;

  padding: 0 20px;

  .imgB {
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-top: -4px;
      margin-right: 8px;
    }
  }

  .txt {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 22px;
    color: #4c4c4c;
    line-height: 22px;
    // letter-spacing: 30px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.reply-txt {
  background: #ffffff;
  border-radius: 5px 5px 5px 5px;
  border: 1px solid #f0f0f0;
}

.aite-box-sheet {
  padding-bottom: @height;
  z-index: 9 !important;
}

.user-list {
  color: #333;
}

.user-list li {
  padding: 0 10px;
  height: 86px;
  cursor: pointer;

  .user-pic {
    width: 76px;
    height: 76px;
  }
}

.user-list li.active {
  background: #f1f1f1;
}

::v-deep .el-textarea__inner,
.chatTextarea {
  height: 70px;
  padding: 5px 0;
  border: none;
  color: #333;
  resize: none;
  background: none;
  // line-height: 22px;
  position: relative;
  overflow-y: auto;
  word-wrap: break-word;
  // width: 651px;
  // display: flex;
  // align-items: center;
  width: 100%;
}

.chatTextarea::-webkit-scrollbar {
  width: 6px;
}

.chatTextarea::-webkit-scrollbar-track {
  background-color: #fff;
  border-radius: 10px;
}

.chatTextarea::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 20px;
}

::v-deep .el-textarea__inner::-webkit-scrollbar {
  width: 6px;
}

::v-deep .el-textarea__inner::-webkit-scrollbar-track {
  background-color: #fff;
  border-radius: 10px;
}

::v-deep .el-textarea__inner::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 20px;
}

.chatSubmitBtn {
  position: absolute;
  bottom: 5px;
  right: 0;

  ::v-deep .el-button--small {
    padding: 7px 30px;
  }
}

/deep/ .chatTextarea {
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

::v-deep([contenteditable="true"]) {
  outline: none;
}

/deep/ .ql-container.ql-snow {
  font-size: 26px;
  border: none;
  max-height: 80px;
  overflow-y: auto;
}

/deep/ .ql-editor {
  display: flex;
}

.fjBox {
  width: 52px;
  height: 52px;
  vertical-align: middle;
}

::v-deep(.custom-tabs .van-tabs__content) {
  height: 50vh;
  overflow: auto;
}

::v-deep(.tab-content) {
  height: 100%;
  overflow-y: auto;
  /* 只允许垂直滚动 */
  padding: 10px;
  /* 适当留白，避免内容贴边 */
}

// /deep/.custom-tabs .van-tabs__content {
//   height: 50vh;
//   /* 限制内容区域高度 */
//   overflow: auto;
//   /* 让超出部分滚动 */
// }

// /* 让每个 tab 内部的内容也支持滚动 */
// /deep/.tab-content {
//   height: 100%;
//   overflow-y: auto;
//   /* 只允许垂直滚动 */
//   padding: 10px;
//   /* 适当留白，避免内容贴边 */
// }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s;
}

/* 进入时从下往上 */
.slide-fade-enter {
  transform: translateY(100%);
  opacity: 0;
}

/* 离开时从上往下 */
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.popupMoney {
  width: 480px;
  border-radius: 16px;
  .repurchase-panel{
	  padding: 20px;
	  .item{
		  display: flow-root;
		  border-bottom: 2px solid #e0e0e0;
		  margin: 10px 0;
		  padding: 10px 0;
	  }
	  .val{
		  float: left;
		  width: calc(100% - 100px);
		  white-space: nowrap;      /* 确保文本不换行 */
		  overflow: hidden;         /* 隐藏溢出的内容 */
		  text-overflow: ellipsis;
	  }
	  .btn{
		  float: right;
		  background-image: linear-gradient(to bottom, #e74855, #d72034);
		  color: #fff;
		  padding: 4px 16px;
		  border-radius: 8px;
	  }
  }
}
 
.upScores{
  width: 480px;
  border-radius: 16px;
  .scores-title{
	border-bottom: 2px solid #e0e0e0;
	padding: 16px;
  }
  .scores-panel{
	  padding: 20px;
	  .item{
		  text-align: center;
		  display: inline-block;
		  width: 25%; /* 每个项目占20%的宽度 */
		  box-sizing: border-box; /* 确保padding和border不会影响宽度计算 */
		  font-size: 16px; /* 重置字体大小 */
		  vertical-align: top; /* 可选，确保元素顶部对齐 */
		  padding: 10px;
		  .val{
			  width: 100%;
			  height: 45px;
			  line-height: 45px;
			  border-radius: 8px;
			  background-color: #d3d2d5;
		  }
		  .up{
			background-image: linear-gradient(to bottom, #e74855, #d72034);
			color: #fff;
		  }
		}
  }
}
@media (min-width: 750px) {
	.popupMoney {
	  width: 1460px;
	  border-radius: 32px;
	  .repurchase-panel{
		  padding: 40px 80px;
		  .item{
			  display: flow-root;
			  border-bottom: 4px solid #e0e0e0;
			  margin: 20px 0;
			  padding: 20px 0;
		  }
		  .val{
			width: calc(100% - 240px);
			  float: left;
		  }
		  .btn{
			  padding: 8px 32px;
			  border-radius: 16px;
		  }
	  }
	}
	
	.upScores{
	  width: 1460px;
	  border-radius: 32px;
	  .scores-title{
		border-bottom: 2px solid #e0e0e0;
		padding: 40px;
	  }
	  .scores-panel{
		  padding: 40px;
		  .item{
			  text-align: center;
			  display: inline-block;
			  width: 25%; /* 每个项目占20%的宽度 */
			  box-sizing: border-box; /* 确保padding和border不会影响宽度计算 */
			  vertical-align: top; /* 可选，确保元素顶部对齐 */
			  padding: 20px;
			  .val{
				  width: 100%;
				  height: 140px;
				  line-height: 140px;
				  border-radius: 16px;
				  background-color: #d3d2d5;
			  }
			}
	  }
	}
	// ::v-deep .van-overlay{
		
	// 	width: 1920px !important;
	// 	min-width: 1920px  !important;
	// 	max-width: 1920px  !important;
	// 	margin-top: 5vh !important;
	// 	height: 80vh !important;
	// 	min-height: inherit !important;
	// 	margin: auto auto;
	// }
}
</style>
