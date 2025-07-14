<template>
  <div class="">
	<video class="video" :src="`${$baseURL}/${data}`" controls>
	</video>
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

.video{
	width: 40%;
		// float: right;
}
@media (min-width: 750px) {
	.opens-list {
	  width: inherit !important; 
	}
	
	.video{
		width: 36% !important;
		// float: right;
	}
}
</style>
