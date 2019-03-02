<template>
  <div class="container">
    <div class="left">
      <div class="action">
        <div class="list-group">
          <a href="#" class="list-group-item" title="打赏">打赏<i class="fa fa-jpy"></i></a>
          <a href="#" class="list-group-item" title="评论">评论<i class="fa fa-comment-o"></i></a>
          <a href="#" class="list-group-item" title="收藏">收藏<i class="fa fa-star-o"></i></a>
          <a href="#" class="list-group-item" title="点赞">点赞<i class="fa fa-thumbs-o-up"></i></a>
          <span class="list-group-item">分享文章</span>
          <a href="#" class="list-group-item" title="分享到微博">微博<i class="fa fa-weibo"></i></a>
          <a href="#" class="list-group-item" title="分享到QQ">QQ<i class="fa fa-wechat"></i></a>
          <a href="#" class="list-group-item" title="分享到微信">微信<i class="fa fa-qq"></i></a>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="text-left">
        <ol class="breadcrumb breadcrumb-path">
          <li><router-link :to="{name: 'PersonHome'}">{{blog.user.username}}的个人空间</router-link></li>
          <li><router-link :to="{name: 'Newest', params: {userId: blog.user.id}}">工作日志</router-link></li>
          <li class="active">正文</li>
        </ol>
      </div>
      <div>
        <h2 class="text-left title">{{blog.title}}</h2>
        <div class="meta text-left">
          <div class="item">
            <router-link :to="{name: 'PersonHome'}" class="user">
              <img src="/static/avatar.png" style="width: 35px">{{blog.user.username}}
            </router-link>
            发布于 {{blog.createTime | datetime}}
          </div>
          <div class="item">字数 {{blog.length}}</div>
          <div class="item">阅读 {{ blog.readCount }}</div>
          <div class="item action">收藏 {{blog.favorites.length}}</div>
          <div class="item action">点赞 {{blog.likes.length}}</div>
          <div class="item action">
            <a href="#comments" class="comment">
              <i class="fa fa-comment-o"></i> 评论 {{blog.comments.length}}
            </a>
          </div>
        </div>
        <div id="blog-data" class="data">
          <div v-html="compiledMD"></div>
        </div>
        <div id="comments"></div>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
  import {POST} from '../../api'
  import marked from 'marked'

  const rendererMD = new marked.Renderer()
  marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  })
  export default {
    name: 'BlogDetail',
    data() {
      let userSession = localStorage.getItem("user")
      if(userSession) {
        userSession = JSON.parse(userSession)
      }

      const blogId = this.$route.params.blogId

      const formdata = new FormData()
      formdata.append("blogId", blogId)

      const that = this
      //请求获取
      POST({
        url: '/api/blog/detail',
        data: formdata,
        callback: res => {
          if(res.code === 200){
            that.blog = res.data.blog
          } else {

          }
        }
      })

      return {
        blogId: blogId,
        blog: {},
        user: userSession
      }
    },
    computed: {
      isCollect: function () {
        if(!this.user) {
          return false;
        }
        const count = this.blog.favorites.filter(x => x.userId === this.user.id).length
        return count > 0
      },
      isLike: function () {
        if(!this.user) {
          return false
        }
        const count = this.blog.likes.filter(x => x.userId === this.user.id).length
        return count > 0
      },
      compiledMD: function () {
        return marked(this.blog.content, {sanitize: true})
      }
    }
  }
</script>

<style scoped>
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
  .container {
    height: auto;
    min-height: 100%;
    padding: 50px 0 30px;
    margin-left: auto;
    margin-right: auto;
    display: flex;

  }

  .breadcrumb-path{
    background-color: transparent;
    padding-left: 0;
    margin-bottom: 5px;
    font-size: 16px;
  }
  .breadcrumb-path li.active{
    font-weight: 700;
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
    color: rgba(0,0,0,.87);
  }
  a:focus,a:hover{
    text-decoration: none;
  }

  .container .left,.container .right {
    width: 12.5%!important;
    padding: 20px 20px;
  }
  .container .content {
    background-color: #fff;
    width: 75%!important;
    padding: 20px 50px;
  }

  .left .action {
    width: 90px;
    margin-top: 200px;
    font-size: 15px;
  }

  .left .action i {
    float: right;
    height: 20px;
    line-height: 20px;
  }

  .left .action a {
    text-align: left;
  }

  .left .action span {
    cursor: default;
    font-size: 14px;
    font-weight: 600;
    color: #d67c1c!important;
  }

  .content .title {
    font-weight: 700;
    font-size: 24px;
    color: rgba(0,0,0,.87);
    margin-bottom: 20px;
  }

  .content .meta .item {
    font-size: 15px;
    display: inline-block;
    padding: 0 5px;
    color: rgba(0,0,0,.87);
  }
  .content .meta .item.action{
    cursor: pointer;
  }

  .content .meta .user img{
    width: 35px;
    height: 35px;
    margin-right: 10px;
    border-radius: 50%;
  }
  .content .meta .user,.content .meta .comment {
    color: rgba(0,0,0,.87);
  }
  .content .meta .user:hover{
    color: #4183c4;
  }

  #blog-data {
    text-align: left;
  }


</style>
