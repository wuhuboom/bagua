<template>
  <div class="opens-list">
    <div class="content font9">
      <div class="item font9" v-for="(item, index) in data">
        <div class="nav nav1 font9">{{ item.qq }}</div>
        <div class="nav font9">上</div>
        <div class="nav nav2 font9">{{ item.currUp }}</div>
        <div class="nav font9">下</div>
        <div class="nav nav3 font9">{{ item.currDown }}</div>
        <div class="nav font9">回</div>
        <div class="nav nav4 font9">{{ item.water }}</div>
        <div class="nav font9">{{ item.nickname }}</div>
        <div class="nav font9">:</div>
        <div class="nav font9">{{ item.balance }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "imgMsg",
  props: {
    doc: {
      type: Object,
      default: () => {},
    },
    userPic: {
      type: String,
      default: "",
    },
  },
  computed: {
    data() {
      let str = this.doc.data;
      return this.doc.data;
    },
  },
  methods: {},
  mounted() {
    // console.log(this.doc);
  },
};
</script>
<style scoped lang="scss">
.opens-list {
  background-color: #fff;
  border-radius: 6px;
  width: 80vw;
  .num {
    padding: 10px 18px;
    line-height: 50px;
    font-weight: bold;
    // background-color: #bf2834;
    border-bottom: 2px solid #e0e0e0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .content {
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    .item {
      margin: 0 4px;
      width: 100%;
      color: #bf2834;
      // width: calc(33.33% - 8px);
      // flex: 1 1 33.333%;
      // box-sizing: border-box;
      .nav {
        text-align: left;
        float: left;
      }
      .nav1 {
        width: 60px;
      }
      .nav2 {
        width: 80px;
      }
      .nav3 {
        width: 80px;
      }
      .nav4 {
        width: 50px;
      }
    }
  }
}

.doc-line {
  //虚线
  border-top: 1px dashed #bf2834;
}
@media (min-width: 500px) {
  .opens-list {
    width: 21rem;
  }
  .content {
    padding: 40px;
    .item {
      margin: 0 16px;
      color: #bf2834;
      // width: calc(33.33% - 8px);
      // flex: 1 1 33.333%;
      // box-sizing: border-box;
      .nav {
        text-align: left;
        float: left;
      }
      .nav1 {
        width: 180px !important;
      }
      .nav2 {
        width: 240px !important;
      }
      .nav3 {
        width: 240px !important;
      }
      .nav4 {
        width: 160px !important;
      }
    }
  }
}
</style>
