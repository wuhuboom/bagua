<template>
  <div class="team-page">

    <ul class="d-flex align-center p-x-16 topBack" >
      <li class="bacLi" @click="goBackClick()"><van-icon name="arrow-left" color="#fff" size="20px"/></li>
      <li class="centerT center-center">团队数据</li>
    </ul>

    <van-tabs
        v-model="current"
        type="line"
        sticky
        animated
        swipeable
        class="team-tabs"
        color="#6093F6"
        title-active-color="#6093F6"
        title-inactive-color="#4B5563"
        background="#ffffff"
        @change="onTabChange"
    >
      <van-tab title="1级" name="0" />
      <van-tab title="2级" name="1" />
      <van-tab title="3级" name="2" />
    </van-tabs>
    <itemTeam  :currentLevel="Number(current)+1" ref="team"/>

  </div>
</template>

<script>
import itemTeam from "@/views/itemTeam.vue";

export default {
  name: "TeamList",
  components: {itemTeam},
  data() {
    return {
      current: (this.$route.query.tab || "0") + "", // van-tabs 用字符串 name
      list: [
      ]
    };
  },
  mounted() {
    document.body.classList.add("gray-bg-img");
  },
  destroyed() {
    document.body.classList.remove("gray-bg-img");
  },
  methods: {
    goBackClick(){
      this.$router.replace("/");
    },
    onTabChange(name) {
      // this.$router.replace({ query: { tab: name } });
      // this.$refs.team && this.$refs.team.resetAndLoad();
      console.log("cu",this.current)
    },
    fmt(n) {
      // 千分位，负数带红色样式由 class 控制
      if (typeof n !== "number") return n;
      return n.toLocaleString();
    }
  }
};
</script>

<style lang="less" scoped>

.team-page {
  ::v-deep .my-swipe {
    height: 168px;
  }

  .topBack{
    height: 100px;
    background: #6093F6;
    border-radius: 0px 0px 0px 0px;

    .bacLi{
      //width: 60px;
    }

    .centerT{
      width: calc(100% - 60px);
      font-family: PingFangSC-Regular, PingFangSC-Regular;
      font-weight: normal;
      font-size:34px;
      color: #FFFFFF;
      line-height: 44px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }


  .navs {
    //border-bottom: 1px solid var(--main);
    & > li {
      width: 95px;
      text-align: center;
      height: 34px;
      line-height: 34px;
    }
    & > li.cur {
      border-bottom: 1px solid var(--main);
      //background: var(--main);
      color: #000000;
    }
  }
  .notice {
    width: 47px;
    height: 47px;
    border-radius: 23.5px;
    border: solid 1px rgba(255, 255, 255, 0.05);
    ::v-deep {
      .van-icon-volume-o {
        transform: rotate(90deg);
      }
    }
  }
  .username {
    font-weight: bold;
    & > p:first-child {
      font-size: 30px;
    }
    & > p:last-child {
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.team-page {
  background: #f5f6fa;
  //min-height: 100vh;
}
.topbar {
  background: #6093F6;
  ::v-deep .van-nav-bar__title {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }
  ::v-deep .van-icon {
    color: #fff;
  }
}


.team-tabs {
  background: #fff;
  ::v-deep .van-tabs__wrap {
    box-shadow: inset 0 -1px 0 #eef0f3;
  }
  ::v-deep .van-tab {
    font-size: 30px;
    //font-weight: 600;
    color: #7a7a7a;
  }
  ::v-deep .van-tab--active {
    color: #1a1a1a;
  }
  ::v-deep .van-tabs__line {
    height: 4px;
    border-radius: 4px;
    background: #6093F6;
    width: 56px; /* 线条长度更接近设计稿 */
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
  height: 76px;
  padding: 0 14px;
  background: #f7f8fa;
  color: #8a8f98;
  font-size: 24px;
  border-bottom: 2px solid #eef0f3;
  text-align: center;
}


.list-wrap {
  padding: 8px 12px 16px;

  background: #fff;
  .row-card:nth-child(even) {
    background: #FAFAFA;
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
  //box-shadow: 0 2px 8px rgba(18, 25, 38, 0.06);
}


.c1.user .name {
  font-size: 28px;
  line-height: 18px;
  color: #1a1a1a;
  word-break: break-all;
}

.num {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
}
.blue { color: #3b7cff; }
.red  { color: #e14c4c; }

.time {
  font-size: 28px;
  color: #9aa1ac;
  text-align: right;
}


@media (min-width: 500px) {
  .team-page {
    height:60rem !important;

  }
  .topBack{
    height: 200px !important;
    background: #6093F6;
    border-radius: 0px 0px 0px 0px;

    .bacLi{
    }

    .centerT{
      width: calc(100% - 60px);
      font-family: PingFangSC-Regular, PingFangSC-Regular;
      font-weight: normal;
      font-size:64px!important;
      color: #FFFFFF;
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
      font-size: 60px!important;
      //font-weight: 600;
      color: #7a7a7a;
    }
    ::v-deep .van-tab--active {
      color: #1a1a1a;
    }
    ::v-deep .van-tabs__line {
      height: 4px;
      border-radius: 4px;
      background: #6093F6;
      width: 112px;
    }


    ::v-deep .van-tab__text{
      font-size: 80px!important;
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
    font-size: 76px!important;
    border-bottom: 2px solid #eef0f3;
    text-align: center;
  }

  .list-wrap {
    padding: 16px 24px 32px;

    background: #fff;
    .row-card:nth-child(even) {
      background: #FAFAFA;
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


  .c1.user .name {
    font-size: 56px!important;
    line-height: 18px!important;;
    color: #1a1a1a!important;;
    word-break: break-all!important;;
  }

  .num {
    font-size: 56px!important;;
    font-weight: 600!important;;
    text-align: center!important;;
  }
  .blue { color: #3b7cff; }
  .red  { color: #e14c4c; }

  .time {
    font-size: 56px!important;;
    color: #9aa1ac;
    text-align: right;
  }
}
</style>
