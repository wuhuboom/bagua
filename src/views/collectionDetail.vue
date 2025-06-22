<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="红包领取详情"> </AppTopBar>
    <div class="red-envelope-header">
      <p class="name">{{doc.user}}的红包</p>
      <p>恭喜发财 , 大吉大利</p>
    </div>
    <div class="record-section">
      <div class="record-summary">{{ recordList.quantity }}个红包，共 ￥{{divide(recordList.money)}} 元</div>
      <div class="record-list">
        <div class="record-item" v-for="(row, index) in [...recordList.list]"
        :key="index">
          <span class="time">{{ $dayjsTime(row.createdAt, "hh:mm") }}</span>
          <span class="name">{{ row.nickname }}</span>
          <span class="amount">￥{{ divide(row.money) }}</span>
        </div>
      </div>
	  <div class="more" v-if="isMore">
		  <span class="submit-btn" @click="confirm">更多</span>
	  </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/plugins/bus";
import { mapActions, mapState } from "vuex";
export default {
  name: "CollectionDetail",
  data() {
    return {
      doc: null,
      recordList: [],
	  isMore: false
    };
  },
  computed: {},
  methods: {
    ...mapActions("chat", ["sendMessage"]),
    getMoneyRecord() {
      this.sendMessage({
        type: 7,
        msgId: this.doc.id,
        data: JSON.stringify({ id: this.doc.data?.id }),
      });
    },
	confirm(){
		this.$toast.fail("获取失败");
	}
  },
  created() {
    this.doc = this.$route.params.doc;
    this.getMoneyRecord();
    //getMoneyRecord
    console.log(this.doc)
    EventBus.$on("getMoneyRecord", ({ msgId, data }) => {
      if (+msgId === +this.doc.id) {
        this.recordList = data;
		// for(var i=0;i<300;i++){
		// 	data.list.push(data.list[0])
		// }
		if(data.list.length > 200){
			this.recordList.list = data.list.slice(0, 200)
			this.isMore = true
		}
        this.$toast.clear();
      }
    });
  },
};
</script>
<style scoped lang="less">
.red-envelope-header {
  background-image: url(@/assets/img/collectionbg.png);
  background-size: 100% 100%;
  width: 100%;
  height: 222px;
  margin-top: -1px;
  font-size: 24px;
  font-weight: normal;
  color: #feedaf;
  text-align: center;
  .name {
    font-size: 28px;
    padding-top: 48px;
    padding-bottom: 36px;
  }
}

.record-section {
  padding: 16px;
  border-radius: 8px;
  color: #333;
  .more{
	  width: 100%;
	  text-align: center;
	  font-size: 24px;
	  margin: 40px 0;
	  .submit-btn {
	    width: 694px;
	    height: 88px;
	    background: #bf2935;
	    border-radius: 126px 126px 126px 126px;
		padding: 8px 30px;
	    color: #fff;
	    margin: 0 auto;
	    margin-top: 80px;
	  }
  }
}

.record-summary {
  text-align: center;
  font-size: 24px;
  color: #999999;
  padding-bottom: 24px;
  padding-top: 36px;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 130px;
  // max-height: 400px;
  overflow-y: auto;
}

.record-item {
  display: flex;
  align-items: center;
  font-size: 15px;
  padding: 4px 0;
  position: relative;
}

.record-item .time {
  font-size: 24px;
  color: #999999;
  padding-right: 20px;
}

.record-item .name {
  flex: 1;
  font-size: 24px;
  color: #242424;
}

.record-item .amount {
  width: 60px;
  text-align: right;
  font-size: 24px;
  color: #242424;
}
</style>
