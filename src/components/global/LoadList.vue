<template>
  <van-list v-model="loading" :finished="finished" @load="loadData">
    <slot></slot>
  </van-list>
</template>

<script>
export default {
  name: "LoadList",
  props: {
    onload: {
      type: Function,
      required: true,
    },
    finished: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      refreshing: false,
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      await this.onload();
      this.loading = false;
    },
    async onRefresh() {
      await this.onload({ pageNum: 1 });
      this.refreshing = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
