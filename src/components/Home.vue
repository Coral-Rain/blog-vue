<template>
  <div class="container">
    <div class="content col-md-2 visible-lg visible-md"><!--Left-->
      <!--<div class="ui tab attached">-->
        <TagList :list="list"></TagList>

      <!--</div>-->
    </div>
    <div class="content col-md-7 col-sm-8 col-xs-12"><!--Center-->
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
        <RecommendPanel :blogs="recommendBlogs"></RecommendPanel>
      </div>
      <div class="scroll-tab hidden-scroll">
        <div class="ui green pointing secondary massive menu">
          <a class=" blog-tab item active" id="newest" @click="showBlogs($event, 1)">最新发表</a>
          <a class=" blog-tab item" @click="showBlogs($event, 2)">每日一博</a>
          <div v-if="user" class="right menu small">
            <router-link :to="{name: 'WriteBlog', params: {userId: '10000001'}}" class="item" target="_blank">
              <i class="edit icon"></i>写博客
            </router-link>
          </div>
        </div>
      </div>
      <div class="ui attached tab">
        <BlogList :blogs="blogs" />
      </div>
    </div>
    <div class="content col-md-3 col-sm-4 hidden-xs"> <!--Right-->
      <div>
        <img width="100%" src="/static/www_blog_sidebar_bottom_ISxBA.jpg" />
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
  import {GET, POST} from '@/api'
  import TabPage from '@/components/TabPage'
  import BlogList from '@/components/BlogList'
  export default {
    name: 'Home',
    components: {BlogList, TabPage, RecommendPanel, TagList},
    data () {
      let list = []
      let blogs = []
      const that = this
      GET({
        url: '/api/blog/listItemTagType',
        callback: res => {
          if(res.code === 200){
            that.list = res.data.list
          }
        }
      })

      let userSession = localStorage.getItem("user")
      if(userSession) {
        userSession = JSON.parse(userSession)
      }

      return {
        list,
        recommendBlogs: [
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
        tagName : '',
        tabs: [
          {id: 1, name: '最新发表'},
          {id: 2, name: '每日一博'}
        ],
        user: userSession,
        blogType: 1,
        blogs,
        tagId: this.$route.query.item_tag
      }
    },
    mounted() {
      // const element = document.getElementsByClassName('tag-checked')[0].firstElementChild
      // console.log(element)
      // if(element !== null){
      //   this.tagName = element.innerText
      // }
      const that = this
      EventBus.$on("changeTagName", function (name) {
        that.tagName = name
        // console.log(that.tagName)
      })
      EventBus.$on("loginSuccess", function (user) {
        // that.showLoginWindow = false
        that.user = user
      })

      const formdata = new FormData()
      formdata.append("type", "1")
      formdata.append("pageNo", "1")
      if(this.tagId){
        formdata.append("itemTag", this.tagId)
      }

      $('.ui.attached.tab').addClass("loading").removeClass("display-block")
      POST({
        url: '/api/blog/list',
        data: formdata,
        callback: res => {
          if(res.code === 200) {
            that.blogs = res.data.blogs
            $('.ui.attached.tab').removeClass("loading").addClass("display-block")
          }
        }
      })
    },
    methods: {
      showBlogs: function (event, type) {
        // console.log(event)
        const that = this
        $('.blog-tab.item').removeClass('active')
        if(event) {
          event.srcElement.classList.add("active")
        } else {
          $('#newest').addClass('active')
        }
        this.blogType = type
        this.blogs = []

        $('.ui.attached.tab').addClass("loading").removeClass("display-block")
        const formdata = new FormData()
        formdata.append("type", this.blogType)
        formdata.append("pageNo", "1")
        if(this.tagId){
          formdata.append("itemTag", this.tagId)
        }
        POST({
          url: '/api/blog/list',
          data: formdata,
          callback: res => {
            if(res.code === 200) {
              that.blogs = res.data.blogs
              $('.ui.attached.tab').removeClass("loading").addClass("display-block")
            }
          }
        })
      }
    },
    watch: {
      $route(){
        this.tagId = this.$route.query.item_tag
      },
      tagId(){
        this.showBlogs(null, 1)
      }
    }
  }
</script>

<style scoped>
  h3{
    margin-top: 5px;
  }
  @media only screen and (min-width: 768px) and (max-width: 992px) {
    .container {
      width: 768px;
    }
  }
  @media only screen and (min-width: 993px) and (max-width: 1300px) {
    .container {
      width: 992px;
    }
  }
  @media only screen and (max-width: 768px) {
    .container {
      width: 100%;
    }
  }
  @media only screen and (min-width: 1300px) {
    .container {
      width: 1300px;
    }
  }

  .container{
    padding: 50px 0 0px;
    background-color: #fff;
    height: 100%;
    /*width: 1300px;*/
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
  .display-block {
    display: block !important;
  }
</style>
