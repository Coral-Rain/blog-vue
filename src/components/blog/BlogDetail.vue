<template>
  <div class="container">
    <div class="left">
      <div class="action">
        <div class="list-group">
          <a href="#" class="list-group-item" title="打赏">打赏<i class="fa fa-jpy"></i></a>
          <a href="#comments" class="list-group-item" title="评论">评论<i class="fa fa-comment-o"></i></a>
          <a href="#" @click.prevent="collectBlog" class="list-group-item" :class="isCollect ? 'favo-active' : ''" title="收藏">
            收藏<i class="fa" :class="isCollect ? 'fa-star' : 'fa-star-o'"></i></a>
          <a href="#" @click.prevent="likeBlog" class="list-group-item" :class="isLike ? 'like-active' : ''" title="点赞">
            点赞<i class="fa" :class="isLike ? 'fa-thumbs-up' : 'fa-thumbs-o-up'"></i></a>
          <span class="list-group-item">分享文章</span>
          <a href="#" class="list-group-item" title="分享到微博">微博<i class="fa fa-weibo"></i></a>
          <a href="#" class="list-group-item" title="分享到QQ">QQ<i class="fa fa-wechat"></i></a>
          <a href="#" class="list-group-item" title="分享到微信">微信<i class="fa fa-qq"></i></a>
        </div>
      </div>
    </div>
    <div class="ui tab attached content">
      <div v-if="blog.user">
        <div class="text-left">
          <ol class="breadcrumb breadcrumb-path">
            <li><router-link target="_blank" :to="{name: 'PersonDefault'}">{{blog.user.username}}的个人空间</router-link></li>
            <li><router-link target="_blank" :to="{name: 'Newest', params: {userId: blog.user.id}, query: {categoryId: blog.userTag.id}}">{{blog.userTag.name}}</router-link></li>
            <li class="active">正文</li>
          </ol>
        </div>
        <div>
          <h2 class="text-left title">{{blog.title}}</h2>
          <div class="meta text-left">
            <div class="item">
              <router-link :to="{name: 'PersonDefault'}" target="_blank" class="user">
                <img :src="avatar(blog.user.avatar)" style="width: 35px">{{blog.user.username}}
              </router-link>
              发布于 {{blog.createTime | datetime}}
            </div>
            <div class="item">字数 {{blog.length}}</div>
            <div class="item">阅读 {{ blog.readCount }}</div>
            <div @click="collectBlog" class="item action">收藏 {{blog.favorites.length}}</div>
            <div @click="likeBlog" class="item action">点赞 {{blog.likes.length}}</div>
            <div class="item action">
              <a href="#comments" class="comment">
                <i class="fa fa-comment-o"></i> 评论 {{blog.comments.length}}
              </a>
            </div>
          </div>
          <div id="blog-data" class="data">
            <div v-html="compiledMD"></div>
            <div style="width: 100%; text-align: center">© 著作权归作者所有</div>
          </div>
          <div class="segment">
            <div class="btn-group">
              <button class="btn btn-success"><i class="fa fa-jpy"></i> 打赏</button>
              <button @click="likeBlog()" class="btn btn-default" :class="isLike ? 'like-active' : ''">
                <i class="fa" :class="isLike ? 'fa-thumbs-up' : 'fa-thumbs-o-up'"></i>
                 点赞 ({{blog.likes.length}})
              </button>
              <button @click="collectBlog()" class="btn btn-default" :class="isCollect ? 'favo-active' : ''">
                <i class="fa" :class="isCollect ? ' fa-star' : ' fa-star-o'"></i>
                 收藏 ({{blog.favorites.length}})
              </button>
              <button class="btn btn-default"><i class="fa fa-share"></i> 分享</button>
            </div>
            <div class="jubao"><i class="fa fa-flag"></i> 举报</div>
          </div>
          <!--<div class="around-articles-wrap">-->
            <!--<div class="around-left"></div>-->
            <!--<div class="around-right"></div>-->
          <!--</div>-->
          <div class="author-card comment">
            <div class="avatar">
              <router-link target="_blank" :to="{name: 'PersonDefault', params: {userId: blog.user.id}}">
                <img :src="avatar(blog.user.avatar)">
              </router-link>
            </div>
            <div class="message text-left">
              <router-link class="username" target="_blank" :to="{name: 'PersonDefault'}">{{blog.user.username}}</router-link>
              <div class="meta">
                <div class="meta-item">粉丝 0</div>
                <div class="meta-item">博文 {{author.blogCount}}</div>
                <div class="meta-item">码字总数 {{author.wordcount}}</div>
                <div class="meta-item">作品 0</div>
              </div>
              <div class="address"><i class="fa fa-map-marker"></i> {{author.provinceName}} {{author.cityName}}</div>
              <div>
                <button class="btn btn-success"><i class="fa fa-heart-o"></i> 关注</button>
                <button class="btn btn-default"><i class="fa fa-envelope-o"></i> 私信</button>
                <button class="btn btn-default"><i class="fa fa-comment-o"></i> 提问</button>
              </div>
            </div>
          </div>
          <div id="comments" class="comments">
            <div class="title">评论 ({{blog.comments.length}})</div>
            <!--引入组件-->
            <Comment :user="user" :comments="blog.comments" />

            <div v-if="user" class="form">
              <textarea v-model.trim="commentContent" placeholder="请在这里发表你对此文的观点"></textarea>
              <div class="control">
                <div class="tools">
                  <div class="tool"><i class="fa fa-smile-o"></i> 插入表情</div>
                  <div class="tool"># 插入软件</div>
                </div>
                <div class="count">{{commentContent.length}}/1000</div>
                <div class="submit" @click="submitComment()">
                  <a role="button" class="btn btn-success" :class="commentContent.length > 0 ? '' : 'disabled'"><i class="fa fa-pencil-square-o"></i>发表评论</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      <!--<div>-->
        <!--<TabPage :data="{}" :tabs="[{id: 1,name: '标签1'},{id: 2,name: '标签2'}]" />-->
      <!--</div>-->
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
  import {POST} from '../../api'
  import marked from 'marked'
  import Comment from './Comment'
  import EventBus from '../../EventBus'
  import TabPage from '../TabPage'

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
    components: {TabPage, Comment},
    data() {
      let userSession = localStorage.getItem("user")
      if(userSession) {
        userSession = JSON.parse(userSession)
      }
      const blogId = this.$route.params.blogId

      return {
        blogId: blogId,
        blog: {favorites:[],likes:[]},
        user: userSession,
        author: {},
        commentContent: ''
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
    },
    methods: {
      collectBlog: function () {
        if(!this.user){
          layerError("用户未登录, 请登录后操作!")
        } else {
          if(this.isCollect){
            layerError("您已经收藏过了!")
          } else {
            const formdata = new FormData()
            formdata.append("userId", this.user.id)
            formdata.append("blogId", this.blog.id)
            const that = this
            //请求
            POST({
              url: '/api/blog/collectBlog',
              data: formdata,
              callback: res => {
                if(res.code === 200){
                  that.blog.favorites.push({userId: that.user.id, blogId: that.blog.id})
                } else {
                  layerError(res.message)
                }
              }
            })
          }
        }
      },
      likeBlog: function () {
        if(!this.user){
          layerError("用户未登录, 请登录后操作!")
        } else {
          if(this.isLike){
            layerError("您已经点过赞了!")
          } else {
            const formdata = new FormData()
            formdata.append("userId", this.user.id)
            formdata.append("blogId", this.blog.id)
            const that = this
            //请求
            POST({
              url: '/api/blog/likeBlog',
              data: formdata,
              callback: res => {
                if(res.code === 200){
                  that.blog.likes.push({userId: that.user.id, blogId: that.blog.id})
                } else {
                  layerError(res.message)
                }
              }
            })
          }
        }
      },
      submitComment: function () {
        if(this.commentContent.length <= 0) {
          return
        }
        const that = this
        const formdata = new FormData()
        formdata.append("userId", this.user.id)
        formdata.append("blogId", this.blogId)
        formdata.append("replyTo", "0")
        formdata.append("comment", this.commentContent)
        POST({
          url: '/api/blog/addComment',
          data: formdata,
          callback: res => {
            if(res.code === 200) {
              that.commentContent = ''
              EventBus.$emit("addComment", res.data.comment)
            } else {
              layerError(res.message())
            }
          }
        })
      }
    },
    created: function(){
      EventBus.$off('loginSuccess')
    },
    mounted: function () {

      const formdata = new FormData()
      formdata.append("blogId", this.blogId)
      const that = this
      $('.ui.tab.attached').addClass("loading").removeClass("display-block")
      //请求获取
      POST({
        url: '/api/blog/detail',
        data: formdata,
        callback: res => {
          if(res.code === 200){
            that.blog = res.data.blog
            $('.ui.tab.attached').removeClass("loading").addClass("display-block")
            document.title = that.blog.title + ' - ' + that.blog.user.username + '的个人空间'
            const fd = new FormData()
            fd.append('userId', that.blog.author)
            POST({
              url: '/api/user/getDetailById',
              data: fd,
              callback: r => {
                if(r.code === 200){
                  that.author = r.data.userDetail
                }
              }
            })
          } else {
            //  跳转到404
          }
        }
      })
      EventBus.$on('loginSuccess', function (user) {
        that.user = user
      })
      EventBus.$on('addComment', function (comment) {
        that.blog.comments.unshift(comment)
      })
    }
  }
</script>
<style scoped>
  .display-block {
    display: block!important;
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
    position: fixed;
  }
  .container .content {
    background-color: #fff;
    width: 75%!important;
    padding: 20px 50px;
    margin-left: 12.5%;
    min-height: 1000px;
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

  .segment {
    margin-top: 20px;
  }
  .segment .btn {
    font-size: 20px;
    color: rgba(0,0,0,.6);
    font-weight: 400;
    padding: 15px 30px;
    line-height: 20px;
  }
  .segment .btn.btn-success {
    color: #fff;
  }
  .jubao{
    margin-top: 5px;
    padding-top: 15px;
    padding-bottom: 15px;
    color: #4183c4;
    cursor: pointer;
  }
  .jubao:hover{
    color: #304CC4;
  }
  .jubao .fa-flag {
    color: #db2828!important;
  }

  .author-card {
    border: 1px solid #4d9464;
    border-radius: 3px;
    background-color: #f8ffff;
    color: #276f86;
    display: flex;
    padding: 15px 20px;
  }
  .avatar img{
    width: 80px;
    height: 80px;
    margin: 0;
    border-radius: 50%;
  }

  .author-card .message {
    padding-left: 20px;
    padding-right: 20px;
  }

  .author-card .message a.username {
    color: rgba(0,0,0,.87);
    font-size: 18px;
    font-weight: 600;
  }
  .author-card .message a.username:hover {
    color: #4183c4;
  }

  .author-card .message .meta .meta-item {
    display: inline-block;
    padding-right: 10px;
  }

  .message .address {
    margin-top: 4px;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .comments {
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 3px;
    margin-top: 10px;
    padding: 10px 10px;
    background-color: rgb(249,249,249);
  }
  .comments .title {
    font-size: 18px;
    text-align: left;
  }
  .comments .form textarea {
    width: 100%;
    height: 100px;
    border: 1px solid rgba(0,0,0,.2);
    resize: none;
    font-size: 14px;
    padding: 10px 15px;
  }

  .comments .control {
    padding-top: 10px;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }

  .comments .tools {
    text-align: left;
    flex: 1;
  }
  .form .control .count{
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
    color: rgba(0,0,0,.4);
  }


  .form .control .tools .tool {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    color: rgba(0,0,0,.4);
  }
  .form .control .tools .tool:hover {
    color: rgba(0,0,0,.87);
  }

  button.like-active,button.favo-active {
    color: rgba(0,0,0,.87)!important;
  }

  .like-active i {
    color: #ef404a!important;
  }
  .favo-active i {
    color: #fbbd08!important;
  }
</style>
