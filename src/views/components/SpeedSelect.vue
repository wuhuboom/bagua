<template>
  <div class="speed-select" ref="selectContainer">
    <div class="select-btn" @click.stop="toggleDropdown">
      <span>快选</span>
      <van-icon
        :name="showDropdown ? 'arrow-up' : 'arrow-down'"
        color="#BF2935"
      />
    </div>

    <div class="dropdown-menu" v-show="showDropdown">
      <div
        class="dropdown-item"
        v-for="(item, index) in options"
        :key="index"
        @click="selectItem(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "vant";

export default {
  name: "SpeedSelect",
  components: {
    [Icon.name]: Icon,
  },
  props: {
    options: {
      type: Array,
      default: () => ["全", "大", "小", "奇", "偶", "清"],
    },
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectItem(item) {
      this.$emit("select", item);
      this.showDropdown = false;
    },
    handleClickOutside(event) {
      if (
        this.$refs.selectContainer &&
        !this.$refs.selectContainer.contains(event.target)
      ) {
        this.showDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.speed-select {
  position: relative;
  width: 84px;
  height: 46px;
  display: inline-block;
}

.select-btn {
  color: #bf2935;
  display: flex;
  align-items: center;
  justify-content: center;

  word-break: keep-all;
  font-size: 24px;
  height: 100%;
  /* padding: 8px 12px; */
  background-color: #edebdc;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #e2ded0;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  padding: 10px 16px 6px;
  /* max-height: 200px; */
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 2px solid #dfdfdf;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
