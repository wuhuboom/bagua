import app from "@/main";
import auth from "@/plugins/auth";
import { EventBus } from "@/plugins/bus";
// eslint-disable-next-line no-unused-vars
let trimrWs = null;
let reconnectTimer = null;
const MAX_BACKOFF = 30000;
const BASE_BACKOFF = 1000;
// 调试总开关
const WS_DEBUG = true;
// 连接序号
let connectSeq = 0;
function calcBackoff(attempt) {
  const expo = Math.min(MAX_BACKOFF, BASE_BACKOFF * Math.pow(2, attempt));
  const jitter = Math.floor(Math.random() * 500);
  return expo + jitter;
}

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

    // 自动重连状态
    reconnectAttempts: 0,
    isReconnecting: false,
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
          // if(Array.isArray(data.playerId)){
          //  return data.playerId.includes(app.$store.state.user.id);
          // }else{
          //  return data.playerId == app.$store.state.user.id
          // }
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
      let userInfor = JSON.parse(v.data);
      const index = state.messages.findIndex(
        (item) => +item.id === +userInfor.id
      );
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

    // 自动重连相关
    SET_RECONNECTING(state, v) {
      state.isReconnecting = v;
    },
    INCR_RECONNECT_ATTEMPTS(state) {
      state.reconnectAttempts += 1;
    },
    RESET_RECONNECT(state) {
      state.reconnectAttempts = 0;
      state.isReconnecting = false;
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
    // 心跳管理
    startHeartbeat({ state }) {
      // if (trimrWs) clearInterval(trimrWs);
      // if (!state.ws) return;
      // trimrWs = setInterval(() => {
      //   try { state.ws?.send(1); } catch (e) { /* ignore */ }
      // }, 20 * 1000);

      if (trimrWs) clearInterval(trimrWs);
      if (!state.ws) return;

      const seq = state.ws?._seq ?? "?";
      if (WS_DEBUG) console.debug(`[WS#${seq}] startHeartbeat`);

      trimrWs = setInterval(() => {
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
          if (WS_DEBUG) console.debug(`[WS#${seq}] ping`);
          try {
            state.ws.send(1);
          } catch (e) {
            if (WS_DEBUG) console.warn(`[WS#${seq}] ping send error`, e);
          }
        } else {
          if (WS_DEBUG)
            console.debug(
              `[WS#${seq}] skip ping (state=${state.ws?.readyState})`
            );
        }
      }, 20 * 1000);
    },
    stopHeartbeat() {
      // NEW
      if (trimrWs) {
        clearInterval(trimrWs);
        trimrWs = null;
      }
    },
    // 安排重连
    scheduleReconnect({ state, commit, dispatch }) {
      if (reconnectTimer) return; // 已经在重连倒计时
      commit("SET_RECONNECTING", true);
      const delay = calcBackoff(state.reconnectAttempts);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        commit("INCR_RECONNECT_ATTEMPTS");
        dispatch("initWebSocket"); // 重新连
      }, delay);
    },

    //
    ensureConnected({ state, dispatch }) {
      if (!state.ws || state.ws.readyState > 1) {
        dispatch("initWebSocket");
      }
    },
    // 初始化连接
    initWebSocket({ state, commit, dispatch }) {
      const pwd = auth.getToken("pwd");
      const site =
        process.env.NODE_ENV === "production"
          ? window.WSPATH
          : process.env.VUE_APP_WS;
      const url = `${site}/player/ws/${auth.getToken()}/${pwd}`;
      if (WS_DEBUG)
        console.trace("[WS] initWebSocket called", {
          hasWs: !!state.ws,
          readyState: state.ws?.readyState,
          url,
        });
      if (state.reconnectAttempts > 0 && !state.isReconnecting) {
        commit("SET_RECONNECTING", true); // 进入“正在重连”状态
      }
      // 防止重复连接：如果已 OPEN(1) 或 CONNECTING(0) 就不再新建
      if (
        state.ws &&
        (state.ws.readyState === WebSocket.OPEN ||
          state.ws.readyState === WebSocket.CONNECTING)
      ) {
        if (WS_DEBUG)
          console.info(
            `[WS] skip connect: existing socket state=${state.ws.readyState}`
          );
        return;
      }

      // 清心跳，清旧 socket
      dispatch("stopHeartbeat");
      // try { state.ws?.close?.(); } catch(e) {}
      try {
        if (state.ws) {
          if (WS_DEBUG)
            console.info("[WS] closing previous socket before new connect");
          state.ws.close();
        }
      } catch (e) {}

      const seq = ++connectSeq;
      if (WS_DEBUG) console.info(`[WS#${seq}] connecting`, url);
      const ws = new WebSocket(url);
      ws._seq = seq; // 方便心跳/其它地方打出同一序号

      ws.onopen = () => {
        if (WS_DEBUG) console.info(`[WS#${seq}] open`);
        commit("SET_PLAYER_ID", app.$store.state.user.id);
        commit("SET_WS", ws);
        commit("RESET_RECONNECT"); // 重置重连状态
        dispatch("startHeartbeat"); // 开启心跳
      };

      ws.onmessage = (event) => {
        // const message = JSON.parse(event.data);
        // app.$store.dispatch('chat/handleMessage', message);

        if (WS_DEBUG) {
          let preview = event?.data;
          if (typeof preview === "string") preview = preview.slice(0, 120);
          console.debug(`[WS#${seq}] message`, preview);
        }

        try {
          const message = JSON.parse(event.data);
          app.$store.dispatch("chat/handleMessage", message);
        } catch (e) {
          if (WS_DEBUG) console.warn(`[WS#${seq}] non-JSON frame`, event?.data);
        }
      };

      ws.onerror = (err) => {
        if (WS_DEBUG) console.error(`[WS#${seq}] error`, err);
      };

      // ws.onclose = () => {
      //   if (WS_DEBUG) console.warn(`[WS#${seq}] close`, {
      //     code: e?.code, reason: e?.reason, wasClean: e?.wasClean
      //   });
      //   commit('SET_WS', null);
      //   dispatch('stopHeartbeat');
      //   // 触发自动重连
      //   dispatch('scheduleReconnect');
      // };

      ws.onclose = (event) => {
        const { code, reason, wasClean } = event || {};
        if (WS_DEBUG)
          console.warn(`[WS#${seq}] close`, {
            code,
            reason,
            wasClean,
            readyState: ws.readyState,
          });
        commit("SET_WS", null);
        dispatch("stopHeartbeat");
        dispatch("scheduleReconnect");
      };
      // 记录到 state 里（wsStatus = true 表示“有实例”，真正 open 后会再次覆盖）
      commit("SET_WS", ws);
    },

    // 关闭停心跳、清重连
    closeWebSocket({ state, commit, dispatch }) {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      dispatch("stopHeartbeat");
      try {
        state.ws?.close?.();
      } catch (e) {}
      commit("SET_WS", null);
      commit("RESET_RECONNECT");
    },

    // // 初始化 WebSocket
    // initWebSocket({ commit, dispatch }) {
    //   const pwd = auth.getToken("pwd");
    //   //wss://api.orz-orz.cc
    //   const site =
    //     process.env.NODE_ENV === "production"
    //       ? window.WSPATH
    //       : process.env.VUE_APP_WS;
    //   const url = `${site}/player/ws/${auth.getToken()}/${pwd}`;
    //   // console.log(url)
    //   const playerId = app.$store.state.user.id;
    //
    //   const ws = new WebSocket(url);
    //
    //   ws.onopen = () => {
    //     console.log("WebSocket 已连接");
    //     commit("SET_PLAYER_ID", playerId); // 存储当前用户 ID
    //   };
    //
    //   ws.onmessage = (event) => {
    //     const message = JSON.parse(event.data);
    //     dispatch("handleMessage", message); // 处理接收到的消息
    //   };
    //
    //   ws.onerror = (error) => {
    //     console.error("WebSocket 错误:", error);
    //   };
    //
    //   ws.onclose = () => {
    //     console.log("WebSocket 已关闭");
    //     commit("SET_WS", null);
    //   };
    //   window.ws = ws;
    //   trimrWs && clearInterval(trimrWs);
    //   trimrWs = setInterval(() => {
    //     try {
    //       ws.send(1);
    //     } catch (e) {
    //       console.log("ping error", e);
    //     }
    //   }, 20 * 1000);
    //   commit("SET_WS", ws);
    // },
    //
    // // 关闭 WebSocket 连接
    // closeWebSocket({ state, commit }) {
    //   if (state.ws) {
    //     state.ws.close();
    //     commit("SET_WS", null);
    //   }
    // },

    // 发送消息
    sendMessage({ state }, { type = 0, data, msgId }) {
      if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket 未连接或已关闭, state=", state.ws?.readyState);
        return;
      }

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
      // console.log(JSON.parse(message.data))
      // console.log(message.data)
      // message = {"type":18,"data":0}
      if ([0, 2, 8, 10, 13, 6, 3, 7, 9, 17, 16].includes(+message.type)) {
        // 文本消息
        commit("ADD_MESSAGE", { message });
        if (+message.type === 4) {
          EventBus.$emit("newRedPacketNotice", {
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
      } else if (message.type === 18) {
        //接收消息:{"type":18,"data":0} (0.禁言 1.解除禁言)
        const resResults = JSON.parse(message.data);
        // console.log("resResults", resResults);
        if (resResults == 0) {
          commit("setUnAllowChat", false);
        } else if (resResults == 1) {
          commit("setUnAllowChat", true);
        }
      } else if ([4].includes(+message.type)) {
        let data = JSON.parse(message.data);
        app.$toast("消息发送频繁");
      } else if ([5].includes(+message.type)) {
        console.log(message);
        let data = JSON.parse(message.data)[0];
        if (data.msgKey == "currUnopen") {
          app.$toast("未开盘");
        } else if (data.msgKey == "currClosed") {
          app.$toast("已封盘");
        } else if (data.msgKey == "buyCodeError") {
          app.$toast("下注指令错误");
        } else if (data.msgKey == "balanceNotEnough") {
          app.$toast("余额不足");
        } else if (data.msgKey == "hasBan") {
          app.$toast("余额不为0,不能回水");
        } else if (data.msgKey == "noWater") {
          app.$toast("当前无回水");
        } else if (data.msgKey == "betTooMin") {
          app.$toast("下注金额不得低于100");
        } else if (data.msgKey == "noOrder") {
          app.$toast("取消失败,没有订单");
        } else if (data.msgKey == "canClose") {
          app.$toast("取消失败,已经封盘");
        } else if (data.msgKey == "betTooMax") {
          app.$toast("下注超额");
        } else if (data.msgKey == "betNumMax") {
          app.$toast("下注已超最大下注 重新下注");
        }
      } else if ([9].includes(+message.type)) {
        //撤回消息修改status
        console.log("撤回消息");
        commit("setToBack", message);
      } else if ([19].includes(+message.type)) {
        //撤回消息修改status
        console.log("撤回消息");
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
