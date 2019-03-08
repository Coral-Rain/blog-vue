<template>
    <div class="main">
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
      return{
        categoryId: categoryId,
        blogs,
        blogTypes: [
          {id: '1', name: '工作日志', count: 0},
          {id: '2', name: '日常作品', count: 0},
          {id: '3', name: '转载文章', count: 0}
        ],
        loading: true
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
        const that = this
        that.loading = true
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
            that.loading = false
          }
        })
      }
    },
    watch: {
      $route(){
        this.categoryId = this.$route.query.categoryId
      },
      categoryId(){
        this.queryBlogs(this.categoryId)
      }
    }
  }
</script>

<style scoped>
  .main {
    position: relative;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.2);
  }
  .loading .control {
    position: absolute;
    left: 50%;
    top: 20%;
    margin-left: -15px;
    background-color: #2e6da4;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
</style>
