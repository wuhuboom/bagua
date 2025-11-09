<template>
  <div class="item-contest-page">
    <!-- 时间筛选条 -->
    <div class="filter-bar">
      <div class="filter-item" @click="showStartPicker = true">
        <span class="label">开始时间</span>
        <span class="value">
          {{ startDateText || "不限" }}
        </span>
      </div>
      <div class="filter-item" @click="showEndPicker = true">
        <span class="label">结束时间</span>
        <span class="value">
          {{ endDateText || "不限" }}
        </span>
      </div>
    </div>

    <!-- 开始时间选择 -->
    <van-popup v-model="showStartPicker" position="bottom">
      <van-datetime-picker
        v-model="startPickerValue"
        type="date"
        title="选择开始日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmStart"
        @cancel="showStartPicker = false"
      />
    </van-popup>

    <!-- 结束时间选择 -->
    <van-popup v-model="showEndPicker" position="bottom">
      <van-datetime-picker
        v-model="endPickerValue"
        type="date"
        title="选择结束日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmEnd"
        @cancel="showEndPicker = false"
      />
    </van-popup>

    <div class="table-head">
      <span class="c1">用户名</span>
      <span class="c2">总上分</span>
      <span class="c3">总下分</span>
      <span class="c4">总输赢</span>
      <span class="c5">最后活跃</span>
    </div>
    <LoadList
      :key="`lvl-${currentLevel}-${loadKey}`"
      ref="loader"
      :onload="informationGroup"
      :finished="finished"
      :immediate-check="false"
    >
      <div class="list-wrap">
        <div class="row-card" v-for="(u, i) in list" :key="i">
          <div class="c1 user">
            <!-- <div class="name">{{ u.qq }}</div> -->
            <div class="name">{{ u.playerName }}</div>
          </div>

          <div class="c2 num blue">{{ divide(u.currUp) }}</div>
          <div class="c3 num blue">{{ divide(u.currDown) }}</div>

          <div
            class="c4 num"
            :class="u.winLoss < 0 ? 'red' : u.winLoss > 0 ? 'blue' : ''"
          >
            {{ divide(u.winLoss) }}
          </div>

          <div class="c5 time">{{ u.dateforms }}</div>
        </div>

        <van-empty v-if="!list.length" description="暂无数据" />
      </div>

      <!-- <NoData class="m-t-40" v-if="query.pageNo > 1 && !list.length" /> -->
    </LoadList>
  </div>
</template>

<script>
import userApi from "@/api/user";
import i18n from "@/locale";
import dayjs from "dayjs";
// import NoData from "@/components/global/NoData.vue";
export default {
  name: "itemContest",
  // components: { NoData },
  props: {
    currentLevel: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    const today = new Date();
    return {
      finished: false,
      loading: false,
      loadKey: 0,
      autoFilledOnce: false,
      video: [],
      status: 0,
      list: [],
      navs: [
        {
          name: i18n.t("About.to.start"),
          key: 0,
        },
        {
          name: i18n.t(`user.in.progress`),
          key: 1,
        },
        {
          name: i18n.t("user.over"),
          key: 2,
        },
      ],
      query: { pageNo: 1, pageSize: 20, level: 1, begin: null, end: null },

      // 时间筛选相关
      showStartPicker: false,
      showEndPicker: false,
      startPickerValue: today,
      endPickerValue: today,
      startDateText: "",
      endDateText: "",
      minDate: new Date(2024, 0, 1),
      maxDate: new Date(2030, 11, 31),
    };
  },
  watch: {
    currentLevel: {
      immediate: true,
      handler() {
        this.resetAndLoad();
      },
    },
  },
  methods: {
    // 选择开始时间
    onConfirmStart(date) {
      this.showStartPicker = false;
      this.startPickerValue = date;
      // this.startDateText = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      // this.query.begin = Math.floor(date.getTime() / 1000);

      const formatted = dayjs(date).format("YYYY-MM-DD");
      this.startDateText = formatted;
      this.query.begin = formatted;

      this.resetAndLoad();
    },

    // 选择结束时间
    onConfirmEnd(date) {
      this.showEndPicker = false;
      this.endPickerValue = date;

      // this.endDateText = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      // this.query.end = Math.floor(date.getTime() / 1000);

      const formatted = dayjs(date).format("YYYY-MM-DD");
      this.endDateText = formatted;
      this.query.end = formatted;

      this.resetAndLoad();
    },
    resetOnly() {
      const { begin, end } = this.query; // 保留当前选的时间

      this.finished = false;
      this.list = [];
      this.query = {
        pageNo: 1,
        pageSize: 20,
        level: Number(this.currentLevel) || 1,
        begin,
        end,
      };
      this.loadKey++;
      this.loading = false;
      this.autoFilledOnce = false;
    },
    resetAndLoad() {
      this.resetOnly();
      this.$nextTick(() => {
        this.informationGroup({ pageNo: 1 });
      });
    },
    toNum(v) {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    },
    fmt(n) {
      if (typeof n !== "number") return n;
      return n.toLocaleString();
    },
    date(tiem) {
      return dayjs.unix(this.$ToSeconds(tiem)).format("YYYY-MM-DD HH:mm");
    },
    updateScrollState() {
      const el = document.documentElement;
      this.canScroll = el.scrollHeight > el.clientHeight + 2;
    },
    async informationGroup(obj = {}) {
      const myKey = this.loadKey;
      const nextPageNo = obj.pageNo != null ? obj.pageNo : this.query.pageNo;
      const isFirstPage = Number(nextPageNo) === 1;

      if (this.loading && !isFirstPage) return;

      this.loading = true;
      try {
        Object.assign(this.query, {
          level: Number(this.currentLevel) || 1,
          ...obj,
        });

        const cleanQuery = { ...this.query };
        Object.keys(cleanQuery).forEach((k) => {
          if (cleanQuery[k] === null || cleanQuery[k] === undefined) {
            delete cleanQuery[k];
          }
        });

        const [err, res] = await userApi.groupsDateData(cleanQuery);
        if (myKey !== this.loadKey) return;
        if (err) return;

        const rows = Array.isArray(res?.data?.results) ? res.data.results : [];

        this.finished = rows.length < this.query.pageSize;

        const normalized = rows.map((r) => {
          const betRaw = r.accumulativeBet ?? r.accumulativeBet ?? r.bet ?? 0;
          return {
            ...r,
            currUp: this.toNum(r.recharge),
            currDown: this.toNum(r.withdrawal),
            // winLoss: this.toNum(r.currUp) - this.toNum(r.currDown),
            winLoss: r.win,
            accumulativeBet: this.toNum(betRaw),
            cumulativeWinning: this.toNum(r.cumulativeWinning),
            dateforms: r.ymd ? this.date(r.ymd) : "-",
          };
        });

        this.list =
          this.query.pageNo === 1 ? normalized : this.list.concat(normalized);
        this.query.pageNo++;

        this.$nextTick(() => {
          this.updateScrollState();
          if (!this.canScroll && !this.finished && !this.autoFilledOnce) {
            this.autoFilledOnce = true;

            this.informationGroup();
          }
        });
      } finally {
        if (myKey === this.loadKey) this.loading = false;
      }
    },
  },
};
</script>
<style scoped lang="less">
.item-contest-page {
  .navs {
    & > li {
      height: 38px;
      line-height: 38px;
      border-radius: 19px;
      border: solid 1px rgba(255, 255, 255, 0.05);
      width: 33.33%;
      text-align: center;
      position: relative;
      margin: 0 4px;
    }
    .cur {
      border: 1px solid var(--main);
      background: #fff;
      color: #000;
    }
  }
  .contest-item {
    height: 64px;
    border-radius: 12px;
    background-color: #161616;
  }
  .teem-logo {
    & > li {
      overflow: hidden;
      height: 50px;
      width: 50px;
      border-radius: 25px;
      background-color: #211f21;
      border: solid 1px rgba(255, 255, 255, 0.05);
      img {
        height: 22px;
        width: 22px;
      }
    }
    & > li:first-child {
      position: relative;
      z-index: 2;
    }
    & > li:last-child {
      margin-left: -16px;
    }
  }
  .cont {
    overflow: hidden;
    & > li {
      overflow: hidden;
    }
  }
  .time {
    //width: 84px;
    text-align: center;
    & > li {
      margin: 3px 0;
    }
  }
}
.main-macth {
  position: relative;
}

.table-head {
  position: sticky;
  top: 92px;
  z-index: 5;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr 1.2fr;
  column-gap: 8px;
  align-items: center;
  height: 76px;
  padding: 0 14px;
  background: #f7f8fa;
  color: #8a8f98;
  font-size: 24px;
  border-bottom: 2px solid #eef0f3;
  text-align: center;

  .c1,
  .c2,
  .c3,
  .c4,
  .c5 {
    font-size: 28px;
  }
}

.list-wrap {
  padding: 8px 12px 16px;

  background: #fff;
  .row-card:nth-child(even) {
    background: #fafafa;
  }
}
.row-card {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr 1.2fr;
  column-gap: 8px;
  align-items: center;
  padding: 12px 14px;
  margin-top: 10px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}

.c1.user .name {
  font-size: 28px;
  //line-height: 18px;
  color: #666666;
  word-break: break-all;
}

.num {
  font-size: 28px;
  //font-weight: 600;
  text-align: center;
}
.blue {
  color: #3b7cff;
}
.red {
  color: #e14c4c;
}

.time {
  font-size: 28px;
  color: #9aa1ac;
  text-align: right;
}

.filter-bar {
  display: flex;
  padding: 8px 12px;
  background: #fff;
  /* border-bottom: 2px solid #eef0f3; */

  .filter-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 6px 8px;
    border-radius: 8px;
    background: #f7f8fa;
    margin-right: 8px;
  }

  .filter-item:last-child {
    margin-right: 0;
  }

  .label {
    font-size: 22px;
    color: #999;
    margin-bottom: 4px;
  }

  .value {
    font-size: 26px;
    color: #333;
  }
}

@media (min-width: 500px) {
  .team-page {
    height: 60rem !important;
  }
  .topBack {
    height: 200px !important;
    background: #6093f6;
    border-radius: 0px 0px 0px 0px;

    .bacLi {
    }

    .centerT {
      width: calc(100% - 60px);
      font-family: PingFangSC-Regular, PingFangSC-Regular;
      font-weight: normal;
      font-size: 64px !important;
      color: #ffffff;
      line-height: 44px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }

  .team-tabs {
    background: #fff;
    ::v-deep .van-tabs__wrap {
      box-shadow: inset 0 -1px 0 #eef0f3;
    }
    ::v-deep .van-tab {
      font-size: 60px !important;
      color: #7a7a7a;
    }
    ::v-deep .van-tab--active {
      color: #1a1a1a;
    }
    ::v-deep .van-tabs__line {
      height: 4px;
      border-radius: 4px;
      background: #6093f6;
      width: 112px;
    }

    ::v-deep .van-tab__text {
      font-size: 80px !important;
    }
  }

  .table-head {
    position: sticky;
    top: 92px;
    z-index: 5;
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr 1.2fr;
    column-gap: 8px;
    align-items: center;
    height: 152px;
    padding: 0 14px;
    background: #f7f8fa;
    color: #8a8f98;
    font-size: 76px !important;
    border-bottom: 2px solid #eef0f3;
    text-align: center;

    .c1,
    .c2,
    .c3,
    .c4,
    .c5 {
      font-size: 56px !important;
    }
  }

  .list-wrap {
    padding: 16px 24px 32px;

    background: #fff;
    .row-card:nth-child(even) {
      background: #fafafa;
    }
  }
  .row-card {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr 1.2fr;
    column-gap: 8px;
    align-items: center;
    padding: 24px 28px;
    margin-top: 10px;
    background: #fff;
    border-radius: 12px;
    text-align: center;
  }

  /* 各列样式 */
  .c1.user .name {
    font-size: 56px !important;
    line-height: 18px !important;
    color: #666666 !important;
    word-break: break-all !important;
  }

  .num {
    font-size: 56px !important;
    font-weight: 600 !important;
    text-align: center !important;
  }
  .blue {
    color: #3b7cff;
  }
  .red {
    color: #e14c4c;
  }

  .time {
    font-size: 56px !important;
    color: #9aa1ac;
    text-align: right;
  }

  .filter-bar {
    display: flex;
    padding: 8px 12px;
    background: #fff;
    /* border-bottom: 2px solid #eef0f3; */

    .filter-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 6px 8px;
      border-radius: 8px;
      background: #f7f8fa;
      margin-right: 8px;
    }

    .filter-item:last-child {
      margin-right: 0;
    }

    .label {
      font-size: 60px;
      color: #999;
      margin-bottom: 4px;
    }

    .value {
      font-size: 68px;
      color: #333;
    }
  }
}
</style>
