import app from "@/main";
import auth from "@/plugins/auth";
import { EventBus } from "@/plugins/bus";
// eslint-disable-next-line no-unused-vars
let trimrWs = null;
export default {
  namespaced: true,
  state: {
    ws: null, // WebSocket 实例
    wsStatus: null, // WebSocket 连接状态
    messages: [], // 聊天消息记录
    newMessages: {}, // 最新聊天消息
    isGain: false, // 最新聊天消息
    playerId: null, // 当前用户的 playerId
    query: {
      pageNo: 1,
      pageSize: 20,
      totalPage: null,
    },
    onlineUser: [],
    ableChat: true,
    contentData: [],
    showBigoArr: [
      {
        name: "你的单买",
        val: 1,
        path: "/purchase-my-details",
        pathName: "PurchaseMyDetails",
      },
      {
        name: "你与别人合买",
        val: 2,
        path: "/purchase-record-details",
        pathName: "PurchaseRecordDetails",
      },
      {
        name: "你的追号",
        val: 3,
        path: "/purchase-pre-details",
        pathName: "PurchasePreDetails",
      },
      {
        name: "你与别人合买追号",
        val: 4,
        path: "/purchase-pre-details",
        pathName: "PurchasePreDetails",
      },
      {
        name: "你的合买",
        val: 5,
        path: "/purchase-record-details",
        pathName: "PurchaseRecordDetails",
      },
      {
        name: "你的合买追号",
        val: 6,
        path: "/purchase-pre-details",
        pathName: "PurchasePreDetails",
      },
    ],
  },
  getters: {
    news: (state) => {
      const arr = state.messages.filter((v) => v.new === true);
      return arr;
    },
    aites(state, getters) {
      if (!getters.news) return [];
      return getters.news?.filter((v) => {
        if ([10, 13].includes(+v.type)) {
          const data = JSON.parse(v.data);
          if (!data.playerId) return false;
          return data.playerId.includes(app.$store.state.user.id);
        }
        return false;
      });
    },
  },
  mutations: {
    setGain(state, v) {
      state.isGain = v;
    },
    setOnlineUser(state, v) {
      state.onlineUser = v;
    },
    addMsgPacket(state, v) {
      const index = state.messages.findIndex((item) => +item.id === +v.msgId);
      if (index === -1) return;
      try {
        app.$set(state.messages[index], "packet", JSON.parse(v.data));
      } catch (e) {
        console.log(e);
      }
    },
    setToBack(state, v) {
      let userInfor = JSON.parse(v.data)
      const index = state.messages.findIndex((item) => +item.id === +userInfor.id);
      if (index === -1) return;
      app.$set(state.messages[index], "status", 1);
      app.$set(state.messages[index], "user", v.user);
    },
    setUnAllowChat(state, query) {
      state.ableChat = query;
    },
    setContentData(state, query) {
      let postRes = { ...query };
      state.showBigoArr.forEach((item, index) => {
        if (item.val == query.type) {
          postRes.textTip = item.name;
          postRes.path = item.path;
          postRes.pathName = item.pathName;
        }
      });
      // console.log("postRes", postRes);
      state.contentData.push(postRes);
      console.log(" state.contentData", state.contentData);
      // const { results, pageNo } = resResults;
    },
    remove_contentdata_item(state, itemId) {
      state.contentData = state.contentData.filter(
        (item) => item.id !== itemId
      );
    },
    clearContentData(state, data) {
      console.log("清数据");
      state.contentData = data;
    },
    setToOld(state, v) {
      const index = state.messages.findIndex((item) => +item.id === +v.id);
      if (index === -1) return;
      state.messages = state.messages.map((v, k) => {
        if (index >= k) {
          v.new = false;
        }
        return v;
      });
    },
    setQuery(state, query) {
      state.query = query;
    },
    SET_WS(state, ws) {
      state.ws = ws;
      state.wsStatus = ws ? true : false;
    },
    ADD_MESSAGE(state, message) {
      if (message.message) {
        state.messages.push({
          ...message.message,
          new: message.message.playerId != app.$store.state.user.id,
        });
      } else {
        //过滤id相同的消息
        const messagefilter = message.filter((v) => {
          return !state.messages.some((item) => item.id === v.id);
        });
        // console.log("messagefilter", messagefilter);
        state.messages.unshift(...messagefilter.reverse());
        //state.messages.unshift(...message.reverse());
      }
    },
    CLEAR_MESSAGES(state) {
      state.messages = []; // 清空消息记录
    },
    SET_PLAYER_ID(state, playerId) {
      state.playerId = playerId; // 设置当前用户的 playerId
    },
  },
  actions: {
    // 初始化 WebSocket
    initWebSocket({ commit, dispatch }) {
      //wss://api.orz-orz.cc
      const site =
        process.env.NODE_ENV === "production"
          ? window.WSPATH
          : process.env.VUE_APP_WS;
      const url = `${site}/player/ws/${auth.getToken()}`;
      const playerId = app.$store.state.user.id;

      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("WebSocket 已连接");
        commit("SET_PLAYER_ID", playerId); // 存储当前用户 ID
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        dispatch("handleMessage", message); // 处理接收到的消息
      };

      ws.onerror = (error) => {
        console.error("WebSocket 错误:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket 已关闭");
        commit("SET_WS", null);
      };
      window.ws = ws;
      trimrWs && clearInterval(trimrWs);
      trimrWs = setInterval(() => {
        try {
          ws.send(1);
        } catch (e) {
          console.log("ping error", e);
        }
      }, 20 * 1000);
      commit("SET_WS", ws);
    },

    // 关闭 WebSocket 连接
    closeWebSocket({ state, commit }) {
      if (state.ws) {
        state.ws.close();
        commit("SET_WS", null);
      }
    },

    // 发送消息
    sendMessage({ state }, { type = 0, data, msgId }) {
      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        const query = { type, data };
        if (msgId) {
          query.msgId = msgId;
        }
        const message = JSON.stringify(query);
        state.ws.send(message);
      } else {
        if (state.query.totalPage !== null) {
          app.$dialog
            .confirm({
              message: "连接已断开，是否刷新页面？",
              confirmButtonColor: "#3291FF",
              className: "confirm-no-tile-dialog",
            })
            .then(() => {
              location.reload();
            })
            .catch(() => {
              location.reload();
            });
        }
        console.error("WebSocket 未连接或已关闭");
      }
    },
    // 处理接收到的消息
    handleMessage({ commit }, message) {
      //0 文本消息 2 分享合买 4 红包消息 8图片 10 @消息 13 回复消息
	
      if ([0, 2, 8, 10, 13, 6,  3, 7].includes(+message.type)) {
        // 文本消息
        commit("ADD_MESSAGE", { message });
        if (+message.type === 4) {
			EventBus.$emit("newRedPacketNotice",{
			  ...message,
			  data: JSON.parse(message.data),
			});
        }
        app.$nextTick(() => {
          const chatContainer = document.querySelector(".js-cont-room");
          if (!chatContainer) return;
          const scrollDistanceToBottom =
            chatContainer.scrollHeight -
            chatContainer.scrollTop -
            chatContainer.clientHeight;
          if (
            message.playerId == app.$store.state.user.id ||
            scrollDistanceToBottom < 300
          ) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        });
      } else if (message.type === 1) {
        //pageNo

        const resResults = JSON.parse(message.data);
        const { results, pageNo } = resResults;
        if (!results) return;
        commit("ADD_MESSAGE", results);
        //setQuery
        commit("setQuery", resResults);
        if (+pageNo === 1) {
          app.$nextTick(() => {
            const chatContainer = document.querySelector(".js-cont-room");
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }
          });
        }
      } else if (message.type === 15) {
        //接收消息:{"type":15,"data":0} (0正常 1禁言 2踢出)
        const resResults = JSON.parse(message.data);
        // console.log("resResults", resResults);
        if (resResults == 0) {
          commit("setUnAllowChat", true);
        } else if (resResults == 1 || resResults == 2) {
          commit("setUnAllowChat", false);
        }
      }else if ([4].includes(+message.type)) {
        let data = JSON.parse(message.data);
        app.$toast("消息发送频繁");
      }else if ([5].includes(+message.type)) {
		  console.log(message)
        let data = JSON.parse(message.data)[0];
		if(data.msgKey == 'currUnopen'){
			app.$toast("未开盘");
		}else if(data.msgKey == 'currClosed'){
			app.$toast("已封盘");
		}else if(data.msgKey == 'buyCodeError'){
			app.$toast("下注指令错误");
		}else if(data.msgKey == 'balanceNotEnough'){
			app.$toast("余额不足");
		}else if(data.msgKey == 'hasBan'){
			app.$toast("余额不为0,不能回水");
		}else if(data.msgKey == 'noWater'){
			app.$toast("当前无回水");
		}else if(data.msgKey == 'betTooMin'){
			app.$toast("下注金额不得低于100");
		}
      }  else if ([9].includes(+message.type)) {
        //撤回消息修改status
        console.log('撤回消息')
        commit("setToBack", message);
      } else if ([12].includes(+message.type)) {
        // headImg
        // :
        // null
        // playerId
        // :
        // 42
        // username
        // :
        // "arman706"
        commit(
          "setOnlineUser",
          JSON.parse(message.data).filter(
            (v) => v.playerId != app.$store.state.user.id
          )
        );
        console.log(
          "12--",
          JSON.parse(message.data).filter(
            (v) => v.playerId != app.$store.state.user.id
          )
        );
      } else if ([16].includes(+message.type)) {
        const resResults = JSON.parse(message.data);
        console.log("resResults", resResults);

        //中奖飘窗信息
        commit("setContentData", resResults);
      }
    },

    // 请求历史消息
    fetchHistory({ dispatch }, { pageNo, pageSize }) {
      const data = JSON.stringify({ pageNo, pageSize });
      dispatch("sendMessage", { type: 1, data });
    },
  },
};
