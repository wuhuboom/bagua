<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="购票记录"> </AppTopBar>
    <!-- <ul class="align-center justify-around header">
      <li
        v-for="(item, index) in navs"
        :key="index"
        @click="tab = item.id"
        :class="{ active: tab === item.id }"
      >
        {{ item.name }}
      </li>
    </ul> -->
    <van-tabs v-model="tab">
      <van-tab
        v-for="(v, index) in navs"
        :name="v.id"
        :title="v.name"
        :key="index"
      >
      </van-tab>
    </van-tabs>
    <div>
      <component
        :key="tab"
        :id="tab"
        ref="$cont"
        :is="currentComponent"
      ></component>
    </div>
  </div>
</template>

<script>
import PurchaseRecord from "@/views/PurchaseRecord.vue";
import PurchaseGroup from "@/views/PurchaseGroup.vue";
export default {
  name: "MyBallRecord",
  data() {
    return {
      tab: 0,
      navs: [
        {
          name: "自购记录",
          id: 1,
        },
        {
          name: "合买记录",
          id: 2,
        },
        {
          name: "追号记录",
          id: 3,
        },
      ],
    };
  },
  computed: {
    // 根据当前 tab id 返回对应的组件
    currentComponent() {
      //navs 调用组件
      const components = {
        1: PurchaseRecord,
        2: PurchaseGroup,
        3: PurchaseRecord,
      };
      return components[this.tab] || null;
    },
  },
};
</script>
<style scoped lang="less">
.header {
  height: 96px;
  color: #f0f0f0;
}
</style>
