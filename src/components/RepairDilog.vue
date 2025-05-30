<template>
  <van-dialog
    v-model="dialogTableVisible"
    :show-close="false"
    :close-on-click-overlay="false"
    :showConfirmButton="false"
    class="g-msg-repair-dialog"
  >
    <ul class="p-b-48">
      <li class="center-center">
        <img class="d-img sysicon" src="@/assets/img/sysicon.png" alt="" />
      </li>
      <li class="center-center font16 m-b-24 m-t-32">系统维护通知</li>
      <li class="text-center font14">{{ repair.msg }}</li>
    </ul>
  </van-dialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "RepairDilog",
  data() {
    return {
      dialogTableVisible: false,
    };
  },
  computed: {
    ...mapState({
      repair: (state) => state.repair, // 监听整个 repair 对象
    }),
  },
  watch: {
    repair: {
      handler(newVal) {
        if ([886, 188].includes(newVal?.code)) {
          if (!this.dialogTableVisible) {
            this.dialogTableVisible = true;
          }
        } else {
          if (this.dialogTableVisible) {
            this.dialogTableVisible = false;
            location.reload();
          }
        }
      },
      deep: true, // 监听 repair 内部属性变化
      immediate: true, // 组件初始化时立即触发一次
    },
  },
  methods: {},
};
</script>
<style lang="scss">
.g-msg-repair-dialog {
  overflow: visible !important;
  border-radius: 24px 24px 24px 24px;

  .sysicon {
    width: 426px;
    height: 350px;
    margin-top: -98px;
  }
}
</style>
