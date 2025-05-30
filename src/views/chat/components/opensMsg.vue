<template>
  <div class="opens-list">
	<div class="num">
		<p class="tops font10 color-fff">
		  第{{ data.expect }}期开奖结果
		</p>
	</div>
	<div class="hisBets hisBets_p font13">
		<div class="betVal center-center">
		  <p
		    v-for="(v, i) in data.num.split(',')"
		    class="openbets center-center"
		    :class="[
		      'openbets' + i,
		      { 'm-r-4': i != 0 },
		    ]"
		    :key="i"
		  >
		    <span class="ball-inner">{{ $betName(v) }}</span>
		  </p>
		</div>
	</div>
    
    <!-- <ul class="mid font14">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="one-doc m-b-8"
        :class="{ 'p-t-8 doc-line': index == data.opens.length - 1 }"
      >
        <span> {{ item.cycleNum }}期 </span>
        <span>
          {{ item.openNum ? item.openNum.replace(/,/g, " ") : "进行中" }}
        </span>
      </li>
    </ul> -->
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
  width: 60vw;
  .num{
	padding: 4px 18px;
	line-height: 40px;
	background-color: #62b6f8;
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
  }
}

.doc-line {
  //虚线
  border-top: 1px dashed #62b6f8;
}
.hisBets{
	// width: 100%;
	
	border-radius: 10px;
	display: flow-root;
	margin: 0px 0.4rem;
	padding: 20px 0;
	.name{
		width: 50%;
		float: left;
		text-align: center;
	}
	.betVal{
		float: left;
		text-align: left;
		color:#fff;
		justify-content: left !important;
		// margin-top: 10px;
	}
	.openbets {
	  width: 36px;
	  height: 36px;
	  border-radius: 50%;
	  padding: 4px; /* 彩色边框厚度 */
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}

	.openbets0 {
	  background: linear-gradient(180deg, #ff6267 0%, #e7474c 100%);
	}
	.openbets1 {
	  background: linear-gradient(180deg, #32c5ff 0%, #6236ff 100%);
	}

	.openbets2 {
	  background: linear-gradient(180deg, #de9fe7 0%, #c145d3 100%);
	}

	.openbets3 {
	  background: linear-gradient(180deg, #62edff 0%, #00ad8c 100%);
	}

	.openbets4 {
	  background: linear-gradient(180deg, #f7b500 0%, #fa6400 100%);
	}
}
</style>
