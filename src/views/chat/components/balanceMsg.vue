<template>
  <div class="opens-list">
    <div class="num">
      <p class="tops font12">本期投注用户账户余额</p>
    </div>
    <div class="content font9">
      <div class="item" v-for="(item, index) in data" :key="index">
        {{ item.name }}:{{ divide(item.balance) }}
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
      // let str = this.doc.data;
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
    // background-color: #62b6f8;
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
      width: calc(50% - 8px);
      // flex: 1 1 33.333%;
      // box-sizing: border-box;
    }
  }
}

.doc-line {
  //虚线
  border-top: 1px dashed #62b6f8;
}
</style>
