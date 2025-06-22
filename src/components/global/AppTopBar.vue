<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <!-- <div class="height"></div> -->
    <div class="appp-top-bar align-center justify-between max-width750" :class="{ 'bg-black': fiexd }" :style="styleObj">
      <div class="appp-top-cont align-center justify-between">
      <!--  <div class="left leftBox" v-if="showLeft">
          <van-button @click="goback" class="icon-button" :icon="leftIcon" type="primary" />
          <slot name="left"></slot>
        </div> -->

        <div class="appp-top-bar-title js-appp-top-bar-title center-center" :class="titleClass" @click.stop.prevent>
          {{ titleSolt ? "" : topBarTitle }}
          <slot name="title"></slot>
        </div>
        <div class="right center-center" v-if="showRight">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppTopBar",
  data() {
    return { fiexd: false };
  },
  props: {
    titleClass: {
      type: Array,
      default: () => [],
    },
    titleSolt: {
      type: Boolean,
      default: false,
    },
    showLeft: {
      type: Boolean,
      default: true,
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    leftIcon: {
      type: String,
      default: "arrow-left",
    },
    styleObj: {
      type: Object,
      default: () => ({
        backgroundColor: "#fff",
      }),
    },
    showMsg: {
      type: Boolean,
      default: false,
    },
    topBarTitle: {
      type: String,
      default: "",
    },
    back: {
      type: Function,
      default: null,
    },
  },
  methods: {
    goback() {
      if (this.back) {
        this.back();
      } else {
        this.$router.go(-1);
      }
    },
    handleScroll() {
      if (window.scrollY > 0) {
        this.fiexd = true;
      } else {
        this.fiexd = false;
      }
    },
  },
  //监听滚动条加背景色
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
<style scoped lang="less">
.height {
  height: 90px;
}

.left {
}

.leftBox {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.right {
  position: absolute;
  right: 0;
  top: 0;
  height: 90px;
  min-width: 43px;
}
</style>
