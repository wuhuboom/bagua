<template>
  <div class="app-btm-bar">
    <div class="height"></div>
    <div class="app-btm-fix">
      <ul class="app-btm-list">
        <li
          :class="{
            active: $router.currentRoute.name == item.name || item.active,
          }"
          class="btm-item center-center"
          v-for="(item, idx) in list"
          @click="goPage(item)"
          :key="idx"
        >
          <div class="icon-box">
            <van-icon
              class="icon"
              :name="item.icon"
              size="20px"
              :class="{
                active: $router.currentRoute.name == item.name || item.active,
              }"
            />
          </div>
          <div
            class="name"
            :class="{
              active: $router.currentRoute.name == item.name || item.active,
            }"
          >
            {{ item.text }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppBtmBar",
  props: {},
  data() {
    return {
      list: [
        {
          text: "首页",
          name: "Home",
          active: false,
          icon: "wap-home-o",
        },
        {
          text: "开奖",
          name: "DrawWinnerResult",
          active: false,
          icon: "medal-o",
        },
        {
          text: "合买",
          active: false,
          name: "AppDocumentation",
          icon: "orders-o",
        },
        {
          text: "聊天室",
          active: false,
          name: "AppChat",
          icon: "chats-o",
        },
        {
          text: "我的",
          active: false,
          name: "AppMy",
          icon: "contact-o",
        },
      ],
    };
  },

  watch: {
    $route(to) {
      this.list.forEach((v) => {
        if (v.name == to.name) {
          v.active = true;
        } else {
          v.active = false;
        }
      });
    },
  },
  methods: {
    goPage(v) {
      if (!v.name) return;
      this.$router.push({
        name: v.name,
      });
    },
  },
};
</script>
<style scoped lang="less">
.height {
  height: 98px;
}
.app-btm-list {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  width: 100%;
  height: 98px;
  background: #fff;
  border-radius: 0px 0px 0px 0px;
  box-shadow: 0px 0 16px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  .btm-item {
    flex: 1;
    flex-direction: column;
  }
  .icon-box {
    .icon {
      color: #999;
      font-size: 30px;
    }
  }
  .name {
    color: #999999;
    font-size: 20px;
    margin-top: 2px;
  }
  ::v-deep {
    .van-icon-chats-o {
      height: 40px;
      width: 40px;
      background: url("@/assets/img/chats.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>
