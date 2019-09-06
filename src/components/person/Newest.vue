<template>
  <div class="ui tab attached main">
    <!--全部博文-->
    <!--引入子组件-->
    <BlogList :blogTypes="blogTypes" :user="userSession" :blogs="blogs"/>
    <!--<div v-if="loading" class="loading"></div>-->
    <Pagination :total="pager.total" :display="pager.pageSize" :currentPage="pager.pageNo"
                @pagechange="pagechange"></Pagination>
  </div>
</template>

<script>
  import {POST} from '@/api'
  import BlogList from '@/components/BlogList'
  import EventBus from '@/EventBus'
  import Pagination from "../tools/Pagination";

  export default {
    name: 'Newest',
    components: {Pagination, BlogList},
    data() {
      let userSession = localStorage.getItem("user");
      if (userSession) {
        userSession = JSON.parse(userSession)
      }
      let blogs = [];
      let categoryId = "0";
      if (this.$route.query.categoryId) {
        categoryId = this.$route.query.categoryId
      }
      this.queryBlogs(categoryId, 1);
      // const that = this
      // EventBus.$on("refreshBlogTypes", function (blogTypes) {
      //   that.blogTypes = blogTypes
      // })
      let keyword = '';
      if (this.$route.query.q) {
        keyword = this.$route.query.q
      }
      return {
        userSession: userSession,
        categoryId: categoryId,
        blogs,
        pager: {pageNo: 1, pageSize: 6, total: 0},
        blogTypes: [
          {id: '1', name: '工作日志', count: 0},
          {id: '2', name: '日常作品', count: 0},
          {id: '3', name: '转载文章', count: 0}
        ],
        keyword
      }
    },
    mounted: function () {
      const that = this;
      EventBus.$on("refreshBlogTypes", function (blogTypes) {
        that.blogTypes = blogTypes
      });
      EventBus.$emit("requestBlogTypes")
      EventBus.$on("loginSuccess", function () {
        let userSession = localStorage.getItem("user");
        if (userSession) {
          userSession = JSON.parse(userSession)
        }
        that.userSession = userSession
      });
    },
    methods: {
      queryBlogs: function (categoryId, pageNo) {
        // $(".ui.attached.tab").addClass("loading").removeClass("display-block")
        EventBus.$emit("startLoad");
        const that = this;
        //根据categoryId查询对应分类的数据
        const formdata = new FormData();
        formdata.append('userId', this.$route.params.userId);
        formdata.append('categoryId', categoryId);
        formdata.append("pageNo", pageNo);
        POST({
          url: '/api/blog/listByUserTag',
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              that.blogs = res.data.blogs;
              that.pager = res.data.pager;
              $('html,body').animate({scrollTop: '0px'}, 200)
            } else {
              layerError(res.message)
            }
            // $(".ui.attached.tab").removeClass("loading").addClass("display-block")
            EventBus.$emit("endLoad")
          }
        })
      },
      searchBlogs: function (pageNo) {
        if(!this.keyword){
          return;
        }
        EventBus.$emit("startLoad");
        const that = this;
        //根据categoryId查询对应分类的数据
        const formdata = new FormData();
        formdata.append('userId', this.$route.params.userId);
        formdata.append('keyword', this.keyword);
        formdata.append("pageNo", pageNo);
        POST({
          url: '/api/blog/search',
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              that.blogs = res.data.blogs;
              that.pager = res.data.pager;
              $('html,body').animate({scrollTop: '0px'}, 200)
            } else {
              layerError(res.message)
            }
            // $(".ui.attached.tab").removeClass("loading").addClass("display-block")
            EventBus.$emit("endLoad")
          }
        })
      },
      pagechange: function (currentPage) {
        this.pager.pageNo = currentPage;
        if(this.$route.query.q) {
          this.searchBlogs(currentPage)
        } else {
          this.queryBlogs(this.categoryId, currentPage)
        }
      }
    },
    watch: {
      $route() {
        this.categoryId = this.$route.query.categoryId;
        this.keyword = this.$route.query.q
      },
      categoryId() {
        this.pager.pageNo = 1;
        this.queryBlogs(this.categoryId, this.pager.pageNo)
      },
      keyword() {
        this.pager.pageNo = 1;
        this.searchBlogs(this.pager.pageNo)
      }
    }
  }
</script>

<style scoped>
  .main {
    position: relative;
  }
</style>
