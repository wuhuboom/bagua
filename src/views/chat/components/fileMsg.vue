<template>
  <div class="opens-list">
	<div class="hisBets">
		<video class="video" :src="`${$baseURL}/${data}`" controls>
		</video>
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
  width: 40vw;
}

.doc-line {
  //虚线
  border-top: 1px dashed #62b6f8;
}
.hisBets{
	// width: 100%;
	
	// border-radius: 10px;
	display: flow-root;
	// margin: 0px 0.4rem;
	// padding: 20px 0;
	.video{
		width: 100%;
		float: right;
	}
}
@media (min-width: 750px) {
	.opens-list {
	  width: inherit !important; 
	}
	
	.video{
		width: 40% !important;
		float: right;
	}
}
</style>
