<template>
  <van-action-sheet
    class="btm-action-sheet color-fff"
    v-model="show"
    :actions="list"
    cancel-text="取消"
    close-on-click-action
    @select="onSelect"
    @cancel="close"
  />
</template>

<script>
export default {
  name: "BtmActionSheet",
  data() {
    return {
      show: false,
    };
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    actions: {
      type: Array,
      default: () => [],
    },
    fix: {
      type: String,
      default: "",
    },
  },
  computed: {
    list() {
      return this.actions.map((item) => {
        return {
          ...item,
          name: `${this.fix}${item.name}`,
        };
      });
    },
  },
  methods: {
    open() {
      this.show = true;
    },
    onSelect(item) {
      this.$emit("select", {
        ...item,
        name: item.name.replace(this.fix, ""),
      });
      this.close();
    },
    close() {
      this.show = false;
    },
  },
};
</script>
<style scoped lang="less">
.btm-action-sheet {
  background-color: #ffffff;
  ::v-deep {
    .van-action-sheet__item {
      background-color: #ffffff;
      text-align: center;
      border-bottom: 1px solid #e5e5e5;
    }
    .van-action-sheet__item:last-child {
      border-bottom: none;
    }
    .van-action-sheet__description {
      font-size: 24px;
      color: #333333;
      &::after {
        border-color: #e5e5e5;
      }
    }
    .van-action-sheet__name {
      color: #333333;
    }
    .van-action-sheet__content {
      padding: 0 32px;
    }
    .van-action-sheet__content {
      max-height: 516px;
    }
  }
}
</style>
