<template>
  <div class="row-ball-26">
    <Rowball
      ref="$Rowball1"
      :activeIndex="activeIndex"
      :index="0"
      :title="titleText[0]"
      :left="left"
      :showRight="showRight"
      @filterLeft="nums.shiWei = $event"
      @updateActiveIndex="setActiveIndex(0)"
    />
    <Rowball
      ref="$Rowball2"
      :activeIndex="activeIndex"
      :index="1"
      :title="titleText[1]"
      :left="left"
      :showRight="showRight"
      @filterLeft="nums.geWei = $event"
      @updateActiveIndex="setActiveIndex(1)"
    />
    <tipsDialog ref="$tipsDialog" />
  </div>
</template>

<script>
import tipsDialog from "@/components/tipsDialog";
import bets from "@/plugins/bets";
import Rowball from "./Rowball.vue";

const initDatas = () => {
  return {
    shiWei: [],
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
      left: [{ up: "大" }, { up: "小" }, { up: "单" }, { up: "双" }],
      activeIndex: null,
      showRight: false,
    };
  },
  watch: {
    nums: {
      handler() {
        const status = bets.chose21(this.shiWei, this.geWei);
        if (typeof status !== "number") {
          this.$emit("total", 0);
          return;
        }
        this.$emit("total", status);
      },
      deep: true,
    },
  },
  computed: {
    // left() {
    //   return this.betListDocs.map((item) => {
    //     return { up: item.txt };
    //   });
    // },
    shiWei() {
      return this.nums.shiWei;
    },
    geWei() {
      return this.nums.geWei;
    },
    text() {
      return `${this.shiWei}|${this.geWei}`;
    },
  },
  props: {
    betListDocs: {
      type: Array,
      default: () => [],
    },
    titleText: {
      type: Array,
      default: () => {
        return ["十位", "个位"];
      },
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
    randem() {
      this.$refs.$Rowball1.randem();
      this.$refs.$Rowball2.randem();
    },
    clear() {
      this.nums = initDatas();
      this.$refs.$Rowball1.clear();
      this.$refs.$Rowball2.clear();
    },
    add() {
      const status = bets.chose21(this.shiWei, this.geWei);
      if (typeof status !== "number") {
        this.$refs.$tipsDialog.open(status.err);
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.row-ball-26 {
  ::v-deep {
    .xuan-box .xuan-list .item .num-ball {
      font-size: 24px;
      // font-weight: normal;
    }
  }
}
</style>
