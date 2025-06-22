<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="余额宝"></AppTopBar>
    <div class="can-out-box bg-white">
      <ul class="justify-between p-l-24 p-r-24 row b-m-1">
        <li class="align-center">
          <p class="m-r-24">待转出总金额</p>
          <div class="active can-out font12">
            ￥{{ data.canOut }}
            <p class="tips colorfff els">日利率{{ config.rate }}%</p>
          </div>
        </li>
        <li class="align-center colorfff">
          <p class="btn-in center-center" @click="show = true">转入</p>
          <p class="btn-out center-center m-l-16" @click="withdraw">转出</p>
        </li>
      </ul>
    </div>

    <ul class="justify-between p-l-24 p-r-24 row b-m-1">
      <li class="align-center">
        <p class="m-r-24">待领取总返利</p>
        <p class="active">￥{{ data.interestCurr }}</p>
      </li>
    </ul>
    <ul class="justify-between p-l-24 p-r-24 row b-m-1 m-b-24">
      <li class="align-center">
        <p class="m-r-24">已领取总返利</p>
        <p class="active">￥{{ data.interestOut }}</p>
      </li>
    </ul>
    <ul
      class="justify-between font14 p-l-24 p-r-24 row b-m-1 m-b-24 filter-flex"
    >
      <li class="align-center">
        <p
          class="m-r-24 center-center"
          style="height: 100%"
          :class="{ active: descId === item.id }"
          v-for="(item, index) in descNav"
          @click="descId = item.id"
          :key="index"
        >
          {{ item.name }}
        </p>
      </li>
    </ul>
    <div v-if="descId === 0">
      <ul class="m-b-24 p-l-24 p-r-24 align-center">
        <li class="m-r-32">
          <div class="select justify-around align-center" @click="selectType">
            {{ curTime.name }}
            <van-icon name="arrow-down" color="#d5d5d5" class="arrow" />
          </div>
        </li>
        <li class="align-center">
          状态
          <div
            class="select justify-around align-center m-l-16"
            @click="selectStatus"
          >
            {{ curStatus.name }}
            <van-icon name="arrow-down" color="#d5d5d5" class="arrow" />
          </div>
        </li>
      </ul>
      <BalanceDetail @withdrawOne="withdrawOne" ref="$BalanceDetail" />
    </div>
    <div class="p-x-24" v-else>
      <ul>
        <li class="m-b-24">
          1.用户可将当前账户余额转入余额宝产生收益，收益为转入金额的
          <span class="active">{{ config.rate }}%</span>
        </li>
        <li class="m-b-24">2.需完成百分百待消费才能转入余额宝</li>
        <li class="m-b-24">
          3.转入余额宝金额次日才会有收益，转出金额不能直接提款需消费转出金额100%流水才能提款
        </li>
      </ul>
    </div>

    <van-popup class="in-money-dialog p-x-24" v-model="show">
      <p class="center-center p-b-36 font16">转入</p>
      <!-- <ul class="justify-between align-center font12">
        <li>
          <span class="m-r-16">账号余额</span>
          <span class="active">￥{{ divide(user.balance) }}</span>
        </li>
        <li>
          <span class="m-r-16">最大</span>
          <span class="active">￥{{ data.canTrans }}</span>
        </li>
      </ul> -->
      <ul class="justify-between align-center font12 m-b-32">
        <li>
          <span class="m-r-16">转入金额</span>
        </li>
        <li class="color999">
          <span class="m-r-16">当前时间</span>
          <span>{{ now() }}</span>
        </li>
      </ul>
      <div class="m-t-24">
        <van-field
          class="field"
          :placeholder="`金额范围${config.min}元-${data.canTrans}元`"
          v-model="money"
          center
          @blur="vaidNum"
          label="￥"
        >
          <template #button>
            <p class="active all" @click="allMoney">全部</p>
          </template>
        </van-field>
      </div>
      <p class="suer-btn m-t-64 center-center colorfff" @click="recharge">
        确认转入
      </p>
    </van-popup>
    <BtmActionSheet
      @select="onSelect"
      :actions="selectActions"
      ref="$BtmActionSheet"
    />
    <BtmActionSheet
      @select="onStatus"
      :actions="statusList"
      ref="$statusList"
    />
  </div>
</template>

<script>
import BalanceDetail from "@/views/BalanceDetail.vue";
import dayjs from "dayjs";
import userApi from "@/api/user";

export default {
  name: "AccountCenter",
  data() {
    return {
      begin: "",
      statusId: -1,
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
      descId: 0,
      descNav: [
        {
          name: "记录明细",
          id: 0,
        },
        {
          name: "计息规则",
          id: 1,
        },
      ],
      show: false,
      statusList: [
        {
          id: -1,
          name: "全部",
        },
        {
          id: 0,
          name: "生息中",
        },
        {
          id: 1,
          name: "已转出",
        },
        {
          id: 2,
          name: "待转出",
        },
      ],
      tableData: {
        totalCount: 0,
        results: [],
      },
      date: "",
      loading: false,
      params: {
        lotteryId: -1,
        status: -1,
        pageNo: 1,
        pageSize: 10,
      },
      navs: [
        {
          name: "余额宝",
          id: 0,
        },
        {
          name: "明细记录",
          id: 1,
        },
      ],
      tab: 0,
      config: {
        rate: 0,
        min: 0,
      },
      data: {},
      money: "",
    };
  },
  components: {
    BalanceDetail,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    curTime() {
      return this.selectActions.find((item) => item.id === this.begin) || {};
    },
    curStatus() {
      return this.statusList.find((item) => item.id === this.statusId) || {};
    },
  },
  methods: {
    selectType() {
      this.$refs.$BtmActionSheet.open();
    },
    selectStatus() {
      this.$refs.$statusList.open();
    },
    now() {
      return dayjs().format("YYYY/MM/DD HH:mm:ss");
    },
    changeTab(id) {
      this.tab = id;
      if (id === 1) {
        this.lotteryBetsOrder();
      }
    },
    handleCurrentChange(val) {
      this.params.pageNo = val;
      this.lotteryBetsOrder();
    },
    async lotteryBetsOrder() {
      if (this.loading) return;
      this.loading = true;
      const sendData = {
        ...this.params,
      };
      if (Array.isArray(this.date) && this.date.length) {
        sendData.begin = this.date[0];
        sendData.end = this.date[1];
      }
      if (Array.isArray(sendData.lotteryId)) {
        sendData.lotteryId = +sendData.lotteryId[sendData.lotteryId.length - 1];
      }
      if (Array.isArray(sendData.status)) {
        sendData.status = +sendData.status[sendData.status.length - 1];
      }
      //删除-1
      for (let key in sendData) {
        if (sendData[key] === -1) {
          delete sendData[key];
        }
      }
      console.log(sendData, userApi.safeList);
      const [err, res] = await userApi.safeList(sendData);
      this.loading = false;
      if (err) return;
      this.tableData = res.data;
    },
    async recharge() {
      if (!this.money) {
        this.$toast("请输入金额");
        return;
      }
      if (this.money < this.config.min) {
        this.$toast("最低转入金额为" + this.config.min + "元");
        return;
      }
      if (this.money > this.data.canTrans) {
        this.$toast("当前最多转入金额为" + this.data.canTrans + "元");
        return;
      }
      const status = await this.comfire(
        `确定要转入${this.money}元到余额宝吗？`
      );
      if (!status) return;
      this.sureRecharge();
    },
    async withdraw() {
      if (!this.data.canOut) {
        this.$toast(`待转出总金额为${this.data.canOut}元`);
        return;
      }
      const [err] = await userApi.safeToBalanceAll();
      if (err) return;
      this.money = "";
      this.$toast("转出成功");
      this.initPage();
    },
    //确定转出吗
    comfire(v) {
      return new Promise((resolve) => {
        this.$dialog
          .confirm({
            message: v,
            confirmButtonColor: "#3291FF",
            className: "confirm-no-tile-dialog",
          })
          .then(() => {
            resolve(1);
          })
          .catch(() => {
            resolve(0);
          });
      });
    },
    async withdrawOne(row) {
      const status = await this.comfire("确认转出吗？");
      if (!status) return;
      const [err] = await userApi.safeToBalance({ id: row.id });
      if (err) return;
      this.$toast("转出成功");
      this.$refs.$BalanceDetail.lotteryBetsOrder({
        pageNo: 1,
      });
      this.safeData();
    },
    onStatus(item) {
      this.statusId = item.id;
      const query = {
        pageNo: 1,
        status: item.id,
      };
      this.$refs.$BalanceDetail.lotteryBetsOrder(query);
    },
    onSelect(item) {
      this.begin = item.id;
      this.$refs.$BalanceDetail.lotteryBetsOrder({
        pageNo: 1,
        begin: item.id,
      });
    },
    async sureRecharge() {
      const [err] = await userApi.safeTransfer({
        money: this.money,
      });
      if (err) return;
      this.show = false;
      this.money = "";
      this.$toast("转入成功");
      this.initPage();
      this.$refs.$BalanceDetail.lotteryBetsOrder({
        pageNo: 1,
      });
    },
    vaidNum() {
      if (this.money === "") return;
      let num = this.money.replace(/[^\d.]/g, "");
      num = parseInt(num);
      this.money = num;
    },
    async getConfig() {
      const [err, res] = await userApi.fbConf();
      if (err) return;
      this.config = res.data;
    },
    async safeData() {
      const [err, res] = await userApi.safeData();
      if (err) return;
      for (let key in res.data) {
        res.data[key] = +this.divide(res.data[key]);
      }
      this.data = res.data;
    },
    initPage() {
      this.getConfig();
      this.safeData();
    },
    allMoney() {
      this.money = this.data.canTrans;
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
    this.initPage();
    this.calculateDates();
  },
};
</script>
<style scoped lang="less">
.btn-in {
  width: 120px;
  height: 50px;
  background: #bf2834;
  border-radius: 14px 14px 14px 14px;
}
.btn-out {
  width: 120px;
  height: 50px;
  background: #999999;
  border-radius: 14px 14px 14px 14px;
}
.row {
  min-height: 96px;
  background-color: #ffff;
}
.b-m-1 {
  border-bottom: 1px solid #e5e5e5;
}
.in-money-dialog {
  width: 606px;

  background: #ffffff;
  border-radius: 16px 16px 16px 16px;
}
.field {
  width: 536px;
  height: 72px;
  background: rgba(208, 208, 208, 0.33);
  border-radius: 10px 10px 10px 10px;
  ::v-deep {
    .van-field__label {
      color: #333;
      width: 16px;
    }
  }
}
.suer-btn {
  height: 72px;
  background: #bf2935;
  border-radius: 10px 10px 10px 10px;
}
.close {
  position: absolute;
  width: 64px;
  height: 64px;
  left: 50%;
  bottom: -120px;
}
.can-out-box {
  padding-top: 32px;
}
.can-out {
  position: relative;
  .tips {
    padding: 2px 0 0 8px;
    font-size: 20px;
    width: 119px;
    height: 48px;
    position: absolute;
    top: -50px;
    left: 100%;
    background: url("@/assets/img/My/tips.png") no-repeat center center;
    background-size: 100% 100%;
  }
}
.select {
  width: 166px;
  height: 54px;
  background: #ffffff;
  border-radius: 28px 28px 28px 28px;
  border: 2px solid #d5d5d5;
}
.filter-flex {
  p {
    position: relative;
  }
  .active {
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #bf2834;
    }
  }
}
</style>
