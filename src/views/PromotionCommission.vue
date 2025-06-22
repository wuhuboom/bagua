<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="我的团队">
      <template v-slot:right>
        <div class="right-box" @click="selectType" v-if="tab === 3">
          {{ curTime.name }}
          <van-icon name="arrow-down" class="arrow" />
        </div>
      </template>
    </AppTopBar>
    <van-tabs v-model="tab" @change="change">
      <van-tab
        v-for="(v, index) in navs"
        :name="v.id"
        :title="v.name"
        :key="index"
      >
      </van-tab>
    </van-tabs>
    <div class="p-t-24 p-b-24 m-t-16" v-if="tab !== 4">
      <van-form @submit="onSubmit" class="align-center serach-form">
        <van-field
          class="m-l-24 m-r-24"
          v-model.trim="playerName"
          name="playerName"
          placeholder="用户名"
        />
        <van-button
          class="no-grow no-shrink m-r-24"
          type="info"
          native-type="submit"
          >提交</van-button
        >
      </van-form>
    </div>
    <div>
      <component
        ref="$cont"
        :playerName="playerName"
        :begin="begin"
        :is="currentComponent"
      ></component>
    </div>
    <BtmActionSheet
      @select="onSelect"
      :actions="selectActions"
      ref="$BtmActionSheet"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";
import Promotion0 from "./Promotion0.vue";
import Promotion1 from "./Promotion1.vue";
import Promotion2 from "./Promotion2.vue";
import Promotion3 from "./Promotion3.vue";
import Promotion4 from "./Promotion4.vue";
export default {
  name: "PromotionCommission",
  data() {
    return {
      playerName: "",
      navs: [
        {
          name: "成员充值",
          id: 0,
        },
        {
          name: "成员提款",
          id: 1,
        },
        {
          name: "成员购彩",
          id: 2,
        },
        {
          name: "成员列表",
          id: 3,
        },
        {
          name: "账单明细",
          id: 4,
        },
      ],
      tab: 0,
      selectActions: [
        {
          name: "近一周",
          id: "",
        },
        {
          name: "近一月",
          id: "",
        },
        {
          name: "近三月",
          id: "",
        },
      ],
      begin: "",
    };
  },
  computed: {
    curTime() {
      return this.selectActions.find((item) => item.id === this.begin) || {};
    },
    // 根据当前 tab id 返回对应的组件
    currentComponent() {
      //navs 调用组件
      const components = {
        0: Promotion0,
        1: Promotion1,
        2: Promotion2,
        3: Promotion3,
        4: Promotion4,
      };
      return components[this.tab] || null;
    },
  },
  methods: {
    change() {
      this.playerName = "";
      this.begin = this.selectActions[0].id;
      this.onSubmit({
        playerName: "",
        begin: this.selectActions[0].id,
      });
    },
    onSubmit(obj = {}) {
      const query = {
        ...obj,
        pageNo: 1,
      };
      if (+this.tab != 3) {
        delete query.begin;
      }
      if (+this.tab == 4) {
        delete query.playerName;
      }
      console.log(query);
      this.$refs.$cont.lotteryBetsOrder(query);
    },
    onSelect(item) {
      this.begin = item.id;
      this.onSubmit({
        begin: item.id,
      });
    },
    selectType() {
      this.$refs.$BtmActionSheet.open();
    },
    calculateDates() {
      const today = dayjs();
      const lastWeek = today.subtract(7, "day").format("YYYY-MM-DD");
      const lastMonth = today.subtract(1, "month").format("YYYY-MM-DD");
      const lastThreeMonths = today.subtract(3, "month").format("YYYY-MM-DD");
      this.selectActions = [
        {
          name: "近一周",
          id: lastWeek,
        },
        {
          name: "近一月",
          id: lastMonth,
        },
        {
          name: "近三月",
          id: lastThreeMonths,
        },
      ];
      this.begin = lastWeek;
    },
  },
  created() {
    this.calculateDates();
  },
};
</script>
<style scoped lang="less">
.app-top-bar {
  .right-box {
    color: #fff;
    margin-right: 40px;
    font-size: 26px;
  }
}
.table-lists {
  .hearder {
    background: #f0f0f0;
    color: #333 !important;
    margin: 0 !important;
    padding: 0 30px;
  }
  .row {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    color: #777777;
    border-bottom: 1px solid #eaeaea;
    margin: 0 30px;
    align-items: center;
  }
  .col {
    padding: 24px 0;
    text-align: center;
  }
}
.bottom-btn {
  .height {
    height: 126px;
  }
  .btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 126px;
    line-height: 126px;
    background: #ffe7e9;
    padding: 0 34px;
    font-size: 30px;
  }
}
.serach-form {
  ::v-deep {
    .van-field {
      background: #f7f7f7;
      border-radius: 12px 12px 12px 12px;
      border: 2px solid #c9c9c9;
      height: 58px;
      padding: 0 24px;
      [type="text"] {
        height: 54px;
      }
    }
  }
  [type="submit"] {
    width: 120px;
    height: 58px;
    background: #bf2834;
    border-radius: 12px 12px 12px 12px;
    border: none;
  }
}
</style>
