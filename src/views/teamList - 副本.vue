<template>
  <div class="item-shop-page font12">
    <ul class="d-flex align-center p-x-16 topBack" >
      <li class="bacLi"><van-icon name="arrow-left" color="#fff" size="20px"/></li>
      <li class="centerT center-center">团队数据</li>
    </ul>
    <ul
      class="justify-around font14 blod align-center navs m-t-16 m-b-16 m-l-8 m-r-8"
    >
      <li
        @click="chose(item)"
        :class="{ cur: current === item.key }"
        v-for="(item, i) in navs"
        :key="i"
        class="ellipsis"
      >
        {{ item.name }}
      </li>
    </ul>
    <itemTeam v-if="current == 0" />
<!--    <live :showTab="false" v-if="current == 1" />-->
<!--    <itemTrade v-if="current == 2" />-->
  </div>
</template>

<script>
// import auth from "@/plugins/auth";
import itemTeam from "@/views/itemTeam";
import i18n from "@/locale";
import userApi from "@/api/user";
export default {
  name: "teamList",
  components: {
    itemTeam,
  },
  data() {
    return {
      current: +this.$route.query.tab || 0,
      navs: [
        {
          name:'1级',
          key: 0,
        },
        {
          name: '2级',
          key: 1,
        },
        {
          name: '3级',
          key: 2,
        },
      ],
    };
  },
  methods: {
    chose(item) {
      //this.current = item.key;
      this.$router.replace({
        query: {
          tab: item.key,
        },
      });
    },
    async informationVideo(obj = {}) {
      const params = {
        ...this.query,
        ...obj,
      };
      const [err, res] = await userApi.informationVideo(params);
      if (err) {
        this.finished = true;
        return;
      }
      this.finished = res.data.results.length < this.query.pageSize;

      this.video =
        params.pageNo == 1
          ? res.data.results
          : this.video.concat(res.data.results);
      this.query.pageNo++;
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.$store.commit("setPdTop", false);
    console.log(this.$store.state.setPdTop);
  },
  mounted() {
    document.querySelector("body").classList.add("gray-bg-img");
  },
  destroyed() {
    document.querySelector("body").classList.remove("gray-bg-img");
  },
};
</script>
<style scoped lang="less">
.item-shop-page {
  ::v-deep .my-swipe {
    height: 168px;
  }

  .topBack{
    height: 128px;
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
</style>
