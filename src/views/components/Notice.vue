<template>
  <div>
    <!-- <van-button type="primary" @click="showPopup">显示通知列表</van-button> -->
    <van-popup v-model="show" position="center" round>
      <div class="notice-title">
        <p>平台公告</p>
        <van-icon name="cross" @click="show = false" size="20" />
      </div>
      <div class="notice-content" ref="listContent">
        <van-list @load="handleLoadMore" ref="list" :offset="496">
          <div v-for="(item, index) in notice" :key="index">
            <van-cell @click="toggleContent(item.id)">
              <template #title>
                <div>
                  <div class="align-center" style="padding: 12px 0 4px 8px">
                    <div class="red-dot"></div>
                    <div v-html="item.title"></div>
                  </div>
                  <p class="notice-time">{{ $dayjsTime(item.createdAt) }}</p>
                </div>
              </template>
            </van-cell>
            <van-cell
              @click="toggleContent(item.id)"
              v-if="item.id === visibleIndex"
            >
              <template #title>
                <div style="padding: 0 20px" v-html="item.content"></div>
              </template>
            </van-cell>
          </div>
        </van-list>
        <div class="tipMore" v-if="showArrowBottom">
          <img src="@/assets/img/arrow-down.png" alt="" style="width: 36px" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, List, Cell, Button } from "vant";
import auth from "@/plugins/auth";
import userApi from "@/api/user";
export default {
  name: "Notice",
  components: {
    [Popup.name]: Popup,
    [List.name]: List,
    [Cell.name]: Cell,
    [Button.name]: Button,
  },
  data() {
    return {
      show: false,
      visibleIndex: -1,
      showArrowBottom: false,
      finished: false,
      loading: false,
      query: {
        pageNo: 1,
        pageSize: 12,
      },
    };
  },
  watch: {
    // 监听notice变化
    notice() {
      this.showPopup(); // 当notice变化时自动显示通知列表
    },
  },
  computed: {
    // 计算未读消息数量
    notice() {
      return this.$store.state.notice;
    },
  },
  created() {
    this.getNotice("init");
  },
  methods: {
    setShowArrowBottom() {
      if (this.$refs.list) {
        const { scrollTop, clientHeight, scrollHeight } =
          this.$refs.list.scroller;
        this.showArrowBottom = clientHeight + scrollTop <= scrollHeight - 3;
      }
    },
    showPopup() {
      let dialogs = auth.getToken("dialogs");
      dialogs = dialogs ? JSON.parse(dialogs) : {};
      const hasUnread = this.notice.some((item) => {
        const itemTime = item.updatedAt || item.createdAt;
        const dialogTime = dialogs[item.id];
        return (
          !dialogTime || (itemTime && new Date(itemTime) > new Date(dialogTime))
        );
      });
      if (hasUnread) {
        this.visibleIndex = this.notice[0].id;
        this.show = true;
        this.$nextTick(() => {
          this.setShowArrowBottom();
        });
        // 将未读消息的id添加到dialogs中
        this.notice.forEach((item) => {
          const itemTime = item.updatedAt || item.createdAt;
          const dialogTime = dialogs[item.id];
          if (
            !dialogTime ||
            (itemTime && new Date(itemTime) > new Date(dialogTime))
          ) {
            dialogs[item.id] = itemTime;
          }
        });
        auth.setToken(JSON.stringify(dialogs), "dialogs");
      }
    },
    toggleContent(id) {
      if (this.visibleIndex === id) {
        this.visibleIndex = -1;
      } else {
        this.visibleIndex = id;
      }
      this.$nextTick(() => {
        this.setShowArrowBottom();
      });
    },
    handleLoadMore() {
      this.setShowArrowBottom();
      if (this.loading || this.finished) return;
      this.query.pageNo++;
      this.getNotice();
    },
    async getNotice(type) {
      this.loading = true;
      const [err, res] = await userApi.notice(this.query);
      if (err) return;
      if (type === "init") {
        this.$store.commit("setNotice", res.data?.results || []);
      } else {
        this.$store.commit("setNotice", [
          ...this.notice,
          ...(res.data?.results || []),
        ]);
      }
      this.loading = false;
      if (res.data?.totalPage == this.query.pageNo) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
  },
};
</script>

<style scoped>
.van-popup {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1), 0 0 256px hsla(0, 0%, 100%, 0.3);
  border: 8px solid hsla(0, 0%, 100%, 0.2);
  width: 90%;
  height: 85%;
  background-color: transparent;
  overflow: hidden;
}

.van-popup--center.van-popup--round {
  border-radius: 10px !important;
}

.notice-content {
  background-color: #fff;
  height: calc(100% - 100px);
  box-sizing: border-box;
  /* border-radius: 16px; */
  display: flex;
  flex-direction: column;
  padding: 0 13px 25px;
}

.notice-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #f13131;
  background-image: linear-gradient(180deg, #b31515, #f13131);
  text-align: center;
  color: #fff;
  height: 100px;
  flex-shrink: 0;
  /* 添加这一行防止标题栏被压缩 */
}

.van-list {
  flex: 1 1 0;
  overflow-y: auto;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
  padding: 0 16px;
  /* 添加内边距 */
}

/* Chrome/Safari/Webkit */
.van-list::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  background: transparent;
}

/* 列表项样式调整 */
.van-cell {
  padding: 0 0;
  border-bottom: 1px solid #ddd;
}

.no-border {
  border-bottom: none !important;
}

.notice-title p {
  margin: 0;
  flex: 1;
  font-size: 36px;
  text-align: center;
}

.notice-title .van-icon {
  font-size: 18px;
  color: #fff;
}

.content-cell {
  color: #666;
  font-size: 14px;
  padding-left: 30px;
}

.custom-content {
  padding: 16px;
  /*  background: #f8f8f8;
    border-radius: 8px;
    margin: 8px 16px; */
}

.content-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: bold;
}

.time {
  color: #999;
  font-size: 12px;
}

.content-body {
  line-height: 1.6;
  color: #333;
}

.red-dot {
  display: inline-block;
  width: 60px;
  height: 60px;
  background-color: #f13131;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
}

.notice-time {
  text-align: right;
  color: #989898;
  font-size: 24px;
  line-height: 1;
}

.scroll-to-top {
  position: fixed;
  top: 120px;
  /* 在标题栏下方 */
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  z-index: 999;
}

.tipMore {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
