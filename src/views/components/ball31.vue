<template>
  <div>
    <Rowball
      ref="$Rowball1"
      :curPre="curPre[0] || []"
      :title="titleText[0]"
      @filterLeft="nums.geWei = $event"
      :activeIndex="activeIndex"
      @updateActiveIndex="setActiveIndex(0)"
      :index="0"
    />
    <tipsDialog ref="$tipsDialog" />
  </div>
</template>

<script>
import Rowball from "./Rowball.vue";
import bets from "@/plugins/bets";
import tipsDialog from "@/components/dialog";
// import tipsDialog from "@/components/tipsDialog";
const initDatas = () => {
  return {
    geWei: [],
  };
};
export default {
  name: "InfoMain",
  data() {
    return {
      nums: {
        ...initDatas(),
      },
      activeIndex: null,
    };
  },
  props: {
    titleText: {
      type: Array,
      default: () => {
        return ["个位"];
      },
    },
    curPre: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    nums: {
      handler() {
        const status = bets.chose20(this.geWei);
        console.log("status", status);
        if (typeof status !== "number") {
          this.$emit("total", status.totalBets || 0);
          return;
        }
        this.$emit("total", status);
      },
      deep: true,
    },
  },
  computed: {
    geWei() {
      return this.nums.geWei;
    },
    text() {
      return `${this.geWei}`;
    },
  },
  components: {
    Rowball,
    tipsDialog,
  },
  methods: {
    // 更新 activeIndex，控制 Rowball 的显示
    setActiveIndex(index) {
      this.activeIndex = this.activeIndex === index ? null : index; // 切换显示状态
    },
    clear() {
      this.nums = initDatas();
      this.$refs.$Rowball1.clear();
    },
    randem() {
      this.$refs.$Rowball1.randem();
    },
    add() {
      const status = bets.chose20(this.geWei);
      if (typeof status !== "number") {
        this.$refs.$tipsDialog.open(status.err);
        return false;
      }

      return true;
    },
    close() {
      this.$refs.$tipsDialog?.close();
    },
  },
};
</script>
