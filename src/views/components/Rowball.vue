<template>
  <div class="xuan-box" :class="className">
    <div class="xuan-list">
      <div class="left flex-column">
        <div class="item small" v-show="title">
          <div class="num-top operation-active center-center">{{ title }}</div>
        </div>
        <SpeedSelect @select="filterLeft" v-if="showRight"></SpeedSelect>
        <!-- <div class="item small" v-show="title">
          <div class="num-top operation-active center-center">快选</div>
          <div>
            <ul class="align-center operation" v-if="showRight">
              <li v-for="(item, idx) in right" :class="{ 'operation-active': item == type }" @click="filterLeft(item)"
                :key="idx">
                {{ item }}
              </li>
            </ul>
          </div>
        </div> -->
        <!-- <ul class="align-center operation" v-if="showRight">
          <li v-for="(item, idx) in right" :class="{ 'operation-active': item == type }" @click="filterLeft(item)"
            :key="idx">
            {{ item }}
          </li>
        </ul> -->
      </div>
      <div class="right flex-column">
        <div
          class="item"
          v-for="(item, index) in left"
          :key="index"
          @click="addNum(item)"
        >
          <div
            class="num-ball center-center"
            :class="{ on: nums.includes(item.up) }"
          >
            {{ item.up }}
          </div>
          <div
            class="num-bottom"
            :style="{ color: isMaxValue(curPre[index]) ? '#BF2935' : '' }"
          >
            {{ curPre[index] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const initDatas = () => {
  return {
    nums: [],
    type: "",
  };
};
import SpeedSelect from "./SpeedSelect.vue";
export default {
  name: "InfoMain",
  components: {
    SpeedSelect,
  },
  data() {
    return {
      ...initDatas(),
      showChooseCon: false,
      right: ["全", "大", "小", "奇", "偶", "清"],
      positionStyle: {
        top: "30px", // 默认在下方
        bottom: "auto",
      },
    };
  },
  props: {
    activeIndex: {
      type: Number,
      default: null,
    },
    index: {
      type: Number,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    count: {
      type: Number,
      default: 1,
    },
    curPre: {
      type: Array,
      default: () => [],
    },
    isOne: {
      type: Number,
      default: 0,
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "百位",
    },
    left: {
      type: Array,
      default: () => [
        {
          up: 0,
          down: "",
        },
        {
          up: 1,
          down: "",
        },
        {
          up: 2,
          down: "",
        },
        {
          up: 3,
          down: "",
        },
        {
          up: 4,
          down: "",
        },
        {
          up: 5,
          down: "",
        },
        {
          up: 6,
          down: "",
        },
        {
          up: 7,
          down: "",
        },
        {
          up: 8,
          down: "",
        },
        {
          up: 9,
          down: "",
        },
      ],
    },
    orther: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    upList() {
      return this.left.map((item) => item.up);
    },
  },
  watch: {
    activeIndex(newVal) {
      // 当 activeIndex 改变时，如果当前组件的 index == activeIndex, 显示 showChooseCon
      this.showChooseCon = newVal === this.index;
    },
    nums(val) {
      if (this.isOne == 1 && val.length > 1) {
        //取数组的最后一个作为 新数组
        this.nums = [val[val.length - 1]];
        return;
      }
      //取数组的最后两个个作为 新数组
      if (this.isOne == 2 && val.length > 2) {
        this.nums = [val[val.length - 2], val[val.length - 1]];
        return;
      }
      this.$emit("filterLeft", val);
      const intersection = this.calculateIntersection(this.nums, this.orther);
      if (intersection.length > 0) {
        this.$emit("del", intersection);
      }
    },
  },
  methods: {
    checkChooseModal() {
      this.$emit("updateActiveIndex", this.index);
      // this.showChooseCon = !this.showChooseCon; // 切换菜单显示状态

      this.$nextTick(() => {
        const operationEl = this.$el.querySelector(".operation");
        const chooseBtnsEl = this.$el.querySelector(".chooseBtnsLeft");

        if (!operationEl || !chooseBtnsEl) return;

        const operationRect = operationEl.getBoundingClientRect();
        const chooseBtnsHeight = chooseBtnsEl.offsetHeight;
        const windowHeight = window.innerHeight;

        // 判断是否超出底部
        if (operationRect.bottom + chooseBtnsHeight > windowHeight) {
          this.positionStyle = {
            bottom: "30px", // 菜单显示在上方
            top: "auto",
          };
        } else {
          this.positionStyle = {
            top: "30px", // 菜单显示在下方
            bottom: "auto",
          };
        }
      });
    },
    calculateIntersection(array1, array2) {
      // 将数组转换为 Set，并计算交集
      return array1.filter((value) => array2.includes(value));
    },
    clear() {
      Object.assign(this.$data, {
        ...initDatas(),
      });
    },
    addNum(num) {
      console.log("num.up", num.up);
      if (this.nums.includes(num.up)) {
        this.nums = this.nums.filter((item) => item !== num.up);
      } else {
        this.nums.push(num.up);
      }
      //升序
      //  this.nums.sort((a, b) => a - b);
    },
    randem(v = []) {
      // 检查参数是否有效，默认为 1
      const count = this.count;
      const excludeArray = v;

      // 过滤掉排除数组中的元素
      const availableList = this.upList.filter(
        (item) => !excludeArray.includes(item)
      );

      // 确保数量不超过过滤后的数组长度
      const maxCount = Math.min(count, availableList.length);

      // 使用 Set 来避免重复
      const selected = new Set();
      while (selected.size < maxCount) {
        const randomIndex = Math.floor(Math.random() * availableList.length);
        selected.add(availableList[randomIndex]);
      }

      // 更新 nums 为选中的元素数组
      this.nums = Array.from(selected);
      return this.nums;
    },
    getTwoRandomElements(arr) {
      if (arr.length < 2) throw new Error("数组长度不足2");

      const copy = [...arr]; // 复制数组，避免修改原数组
      const firstIndex = Math.floor(Math.random() * copy.length);
      const firstElement = copy.splice(firstIndex, 1)[0]; // 删除并获取该元素
      const secondIndex = Math.floor(Math.random() * copy.length);
      const secondElement = copy[secondIndex]; // 直接获取第二个元素

      return [firstElement, secondElement];
    },
    randemTow() {
      this.nums = this.getTwoRandomElements(this.upList);
      return this.nums;
    },
    filterLeft(option) {
      // 根据不同的 right 选项筛选 left

      this.showChooseCon = false;
      if (option === "全") {
        this.nums = this.upList;
        this.type = "全";
      } else if (option === "大") {
        this.nums = this.upList.filter(
          (item, k) => k >= this.upList.length / 2
        );
        this.type = "大";
      } else if (option === "小") {
        this.nums = this.upList.filter((item, k) => k < this.upList.length / 2); // 示例：小于 5
        this.type = "小";
      } else if (option === "奇") {
        this.nums = this.upList.filter((item) => item % 2 !== 0); // 奇数
        this.type = "奇";
      } else if (option === "偶") {
        this.nums = this.upList.filter((item) => item % 2 === 0); // 偶数
        this.type = "偶";
      } else if (option === "清") {
        this.nums = []; // 清空筛选结果
        this.type = "清";
      }
    },
    isMaxValue(value) {
      // const excludeList = ["万位", "千位", "个位"];
      // if (excludeList.includes(this.title)) {
      if (!this.curPre || this.curPre.length === 0) return false;
      const maxValue = Math.max(...this.curPre);
      return value === maxValue;
      // }
      // return false;
    },
  },
};
</script>
<style scoped lang="scss">
.xuan-box {
  .xuan-list {
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    padding: 40px 52px 22px 32px;

    .left {
    }

    .right {
      flex: 1 1 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 22px 56px;
    }

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;

      &.small {
        margin-right: 60px;
        margin-bottom: 22px;

        .num-top {
          // color: #fff;
          // font-weight: 400;
          // font-size: 28px;
          // min-width: 90px;
          // height: 50px;
          width: 82px;
          height: 46px;

          padding: 0 8px;
          // border-radius: 60px;

          font-family: PingFang SC, PingFang SC;
          font-weight: 800;
          font-size: 24px;
          color: #b78756;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }
      }

      .num-ball {
        height: 60px;
        // font-weight: bold;
        font-size: 32px;
        color: #bf2935;
        min-width: 60px;
        text-align: center;
        border-radius: 100%;
        width: 60px;
        background: #fff;
        border: 1px solid #dfdfdf;

        &.on {
          background: #bf2935;
          color: #fff;
        }
      }

      .num-bottom {
        font-size: 24px;
        color: #999999;
        text-align: center;
        margin-top: 4px;
        // margin-top: 24px;
      }
    }
  }
}

.operation {
  // width: 452px;
  // height: 48px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
  border-radius: 24px 24px 24px 24px;
  overflow: hidden;

  & > li {
    // width: 20%;
    text-align: center;
    // height: 100%;
  }

  .quickChoose {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-family: PingFang SC, PingFang SC;
    font-weight: 1000;
    font-size: 24px;
    color: #bf2935;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }

  // &>li {
  //   width: 20%;
  //   text-align: center;
  //   height: 100%;
  // }
}

.operation-active {
  background: #edebdc;
  border-radius: 8px;
  border: 1px solid #e2ded0;
  color: #fff;
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
</style>
