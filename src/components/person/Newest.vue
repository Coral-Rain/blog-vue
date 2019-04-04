<template>
    <div class="ui tab attached main">
      <!--全部博文-->
      <!--引入子组件-->
      <BlogList :blogTypes="blogTypes" :blogs="blogs" />
      <!--<div v-if="loading" class="loading"></div>-->
    </div>
</template>

<script>
  import {POST} from '@/api'
  import BlogList from '@/components/BlogList'
  import EventBus from '@/EventBus'

  export default {
    name: 'Newest',
    components: {BlogList},
    data() {
      let blogs = []
      let categoryId = "0"
      if(this.$route.query.categoryId){
        categoryId = this.$route.query.categoryId
      }
      this.queryBlogs(categoryId)
      // const that = this
      // EventBus.$on("refreshBlogTypes", function (blogTypes) {
      //   that.blogTypes = blogTypes
      // })
      let keyword = ''
      if(this.$route.query.q){
        keyword = this.$route.query.q
      }
      return{
        categoryId: categoryId,
        blogs,
        blogTypes: [
          {id: '1', name: '工作日志', count: 0},
          {id: '2', name: '日常作品', count: 0},
          {id: '3', name: '转载文章', count: 0}
        ],
        keyword
      }
    },
    mounted: function () {
      const that = this
      EventBus.$on("refreshBlogTypes", function (blogTypes) {
        that.blogTypes = blogTypes
      })
      EventBus.$emit("requestBlogTypes")
    },
    methods: {
      queryBlogs: function (categoryId) {
        // $(".ui.attached.tab").addClass("loading").removeClass("display-block")
        EventBus.$emit("startLoad")
        const that = this
        //根据categoryId查询对应分类的数据
        const formdata = new FormData()
        formdata.append('userId', this.$route.params.userId)
        formdata.append('categoryId', categoryId)
        POST({
          url: '/api/blog/listByUserTag',
          data: formdata,
          callback: res => {
            if(res.code === 200) {
              that.blogs = res.data.blogs
            } else {
              layerError(res.message)
            }
            // $(".ui.attached.tab").removeClass("loading").addClass("display-block")
            EventBus.$emit("endLoad")
          }
        })
      },
      searchBlogs: function () {
        EventBus.$emit("startLoad")
        const that = this
        //根据categoryId查询对应分类的数据
        const formdata = new FormData()
        formdata.append('userId', this.$route.params.userId)
        formdata.append('keyword', this.keyword)
        formdata.append("pageNo", "1")
        POST({
          url: '/api/blog/search',
          data: formdata,
          callback: res => {
            if(res.code === 200) {
              that.blogs = res.data.blogs
            } else {
              layerError(res.message)
            }
            // $(".ui.attached.tab").removeClass("loading").addClass("display-block")
            EventBus.$emit("endLoad")
          }
        })
      }
    },
    watch: {
      $route(){
        this.categoryId = this.$route.query.categoryId
        this.keyword = this.$route.query.q
      },
      categoryId(){
        this.queryBlogs(this.categoryId)
      },
      keyword(){
        this.searchBlogs()
      }
    }
  }
</script>

<style scoped>
  .main {
    position: relative;
  }
</style>
