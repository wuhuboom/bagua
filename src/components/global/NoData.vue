<template>
  <div class="no-data center-center flex-column" :class="className">
    <img class="d-img" src="@/assets/img/Gone.png" alt="" />
    <div class="center-center font14 m-t-4">没有数据</div>
  </div>
</template>

<script>
export default {
  name: "NoData",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped lang="less">
.no-data {
  color: #95989d;
  margin-top: 152px;
  img {
    width: 79px;
    height: 79px;
    object-fit: contain;
  }
}
</style>
