<template>
  <div id="container-main" class="container">
    <div class="content col-md-2 visible-lg visible-md"><!--Left-->
      <TagList :list="list"></TagList>
    </div>
    <div class="content col-md-7 col-sm-9 col-xs-12"><!--Center-->
      <div class="text-left">
        <ol class="breadcrumb breadcrumb-path">
          <li><a href="/blog">博客</a></li>
          <li class="active">{{tagName}}</li>
        </ol>
      </div>
      <div>
        <!--推荐列表-->
        <div>
          <a class="pull-right" href="#">更多</a>
          <h3 class="content-title">推荐博客</h3>
        </div>
        <!--引入组件, 传入data-->
        <RecommendPanel :blogs="blogs"></RecommendPanel>
      </div>
      <div>
        <!--所有-->
      </div>
    </div>
    <div class="content col-md-3 col-sm-3 hidden-xs"> <!--Right-->
      <div>
        <img width="100%" src="../../static/www_blog_sidebar_bottom_ISxBA.jpg" />
      </div>
      <div>

      </div>
    </div>
  </div>
</template>

<script>
  import "../../static/lib/bootstrap/css/bootstrap.css"
  import "../../static/lib/bootstrap/js/bootstrap.min"
  import TagList from './TagList'
  import EventBus from '../EventBus'
  import RecommendPanel from '@/components/RecommendPanel'
  export default {
    name: 'Home',
    components: {RecommendPanel, TagList},
    data () {
      return {
        screenWidth: document.body.clientWidth,   // 这里是给到了一个默认值 （这个很重要）
        list: [
          {
            id: "1",
            name: "前沿技术",
            tags: [
              {
                id: "10001",
                name: "人工智能"
              },
              {
                id: "10002",
                name: "大数据"
              }
            ]
          },
          {
            id: "2",
            name: "开发领域",
            tags: [
              {
                id: "10004",
                name: "前端开发"
              },
              {
                id: "10005",
                name: "后端开发"
              }
            ]
          }
        ],
        blogs: [
          {
            name: "JavaScript 九种跨域方式实现原理",
            author: "作者001",
            comments: "5"
          },
          {
            name: "浅谈Vue数据响应",
            author: "前端小攻略",
            comments: "10"
          },
          {
            name: "简单了解 node npm cnpm",
            author: "忘年博客",
            comments: "2"
          }
        ],
        tagName : '全部'
      }
    },
    mounted() {
      const element = document.getElementsByClassName('tag-checked')[0].firstElementChild
      // console.log(element)
      if(element !== null){
        this.tagName = element.innerText
      }
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
      EventBus.$on("changeTagName", function (name) {
        that.tagName = name
        // console.log(that.tagName)
      })
    },
    watch: {
      screenWidth(val){
        if (!this.timer) {
            this.timer = true
          this.screenWidth = val
          let that = this
          if (that.screenWidth <= 1300 && that.screenWidth > 992) {
            console.log("set--------")
            setTimeout(function () {
              document.getElementById("container-main").style.width = 992 + 'px'
              that.timer = false
            }, 200)
          } else if(that.screenWidth > 1300) {
            setTimeout(function () {
              document.getElementById("container-main").style.width = 1300 + 'px'
              that.timer = false
            }, 200)
          } else if(that.screenWidth <= 992 && that.screenWidth > 768) {
            setTimeout(function () {
              document.getElementById("container-main").style.width = 768 + 'px'
              that.timer = false
            }, 200)
          } else {
            setTimeout(function () {
              document.getElementById("container-main").style.width = that.screenWidth + 'px'
              that.timer = false
            }, 200)
          }
        }
      }
    }
  }
</script>

<style scoped>
  h3{
    margin-top: 5px;
  }
  .container{
    padding-top: 50px;
    background-color: #eeeeee;
    height: 100%;
    width: 1300px;
    margin-left: auto;
    margin-right: auto;
  }
  .container .content {
    display: inline-block;
    height: 100%;
    background-color: white;
    padding-top: 20px;
  }

  .content-title {
    text-align: left;
    font-size: 20px;
    color: rgba(0,0,0,.9);
    font-weight: 700;
  }

  .breadcrumb-path{
    background-color: transparent;
    padding-left: 0;
    margin-bottom: 5px;
    font-size: 16px;
  }
  .breadcrumb-path li.active{
    font-weight: 700;
    color: rgba(0,0,0,.87);
  }
  a:focus,a:hover{
    text-decoration: none;
  }
</style>
