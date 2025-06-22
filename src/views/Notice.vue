<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="公告"></AppTopBar>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getNoticeList"
    >
      <div class="lists-box">
        <div v-for="(item, i) in results" :key="i">
          <div class="lists">
            <div class="left text-ellipsis" @click="item.open = !item.open">
              <div class="name text-ellipsis">{{ item.title }}</div>
              <div class="time">{{ $dayjsTime(item.createdAt) }}</div>
            </div>
            <div class="right">
              <van-icon
                :name="!item.open ? 'arrow-down' : 'arrow-up'"
                color="#E5E5E5"
              />
            </div>
          </div>
          <div
            class="content"
            v-if="item.open"
            style="white-space: pre-line"
            v-html="item.content"
          ></div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "AppNotice",
  data() {
    return {
      loading: false,
      finished: false,
      query: {
        pageNo: 1,
        pageSize: 12,
      },
      tableData: {
        totalPage: null,
        totalCount: 0,
        results: [],
      },
    };
  },
  computed: {
    results() {
      return this.tableData.results;
    },
  },
  methods: {
    async getNoticeList() {
      this.loading = true;
      const [err, res] = await userApi.notice(this.query);
      this.loading = false;
      if (err) {
        this.finished = true;
        return;
      }
      this.query.pageNo++;
      if (this.query.pageNo > res.data.totalPage) {
        this.finished = true;
      }
      res.data.results = res.data.results.map((item) => {
        return {
          ...item,
          open: false,
        };
      });
      this.tableData.results = this.tableData.results.concat(res.data.results);
    },
  },
};
</script>
<style scoped lang="less">
.lists-box {
  .lists {
    padding: 24px 28px;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    .left {
      flex: 1;
      margin-right: 40px;

      .name {
        font-size: 32px;
      }

      .time {
        color: #999999;
        font-size: 24px;
        margin-top: 5px;
      }
    }

    .right {
      font-size: 32px;
    }
  }
  .content {
    padding: 28px;
    color: #666666;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>
