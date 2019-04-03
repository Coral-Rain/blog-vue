<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Blog</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="active"><router-link to="/">博客</router-link>
            <li><a href="#">翻译</a></li>
            <li><a href="#">问答</a></li>
          </ul>
          <form class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
          </form>
          <ul v-if="isLogin" style="vertical-align: center" class="nav navbar-nav navbar-right">
            <!--Img, Name-->
            <li style="line-height: 50px">
              <img :src="avatar(user.avatar)" title="修改头像" @click="" class="navbar-avatar" :alt="user.username">
            </li>
            <li class="dropdown">
              <a aria-expanded="false" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true">
                {{user.username}}
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><router-link :to="{name: 'PersonDefault', params: {userId: user.id}}">个人中心</router-link></li>
                <li class="divider" role="separator"></li>
                <li>
                  <router-link :to="{name: 'WriteBlog', params: {userId: user.id}}">写博客</router-link>
                </li>
                <li class="divider" role="separator"></li>
                <li>
                  <router-link :to="{name: 'Favorites', params: {userId: user.id}}">我的收藏夹</router-link>
                </li>
                <li class="divider" role="separator"></li>
                <li>
                  <router-link :to="{name: 'AdminProfile', params: {userId: user.id}}">修改个人资料</router-link>
                </li>
                <li class="divider" role="separator"></li>
                <li><a href="javascript:" @click="logout">注销</a></li>
              </ul>
            </li>
          </ul>
          <ul v-else class="nav navbar-nav navbar-right">
            <li><a href="#" @click="toLogin">登录</a></li>
            <li><a href="#" @click="toRegiste">注册</a></li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
    <router-view/>
    <div id="footer" class="ui vertical footer segment">
      <div class="ui container">
        <div class="ui grid">
          <div class="eight wide mobile four wide tablet four wide computer column">
            <h4 class="ui header">开源中国社区</h4>
            <div class="ui link list">
              <a class="item" href="https://www.oschina.net/home/aboutosc" target="_blank">关于我们</a>
              <a class="item" href="https://www.oschina.net/home/aboutosc" target="_blank">联系我们</a>
              <a class="item" href="https://www.oschina.net/home/aboutosc#partners#" target="_blank">合作伙伴</a>
              <a class="item" href="https://www.oschina.net/openapi" target="_blank">Open API</a>
            </div>
          </div>
          <div class="eight wide mobile four wide tablet four wide computer column">
            <h4 class="ui header">在线工具</h4>
            <div class="ui link list">
              <a class="item" href="https://gitee.com/?from=osc-bottom" target="_blank">码云 Gitee.com</a>
              <a class="item" href="https://gitee.com/enterprises?from=osc-bottom" target="_blank">企业研发管理</a>
              <a class="item" href="https://copycat.gitee.com/?from=osc-bottom" target="_blank">CopyCat-代码克隆检测</a>
              <a class="item" href="https://tool.oschina.net" target="_blank">实用在线工具</a>
            </div>
          </div>
          <div class="center aligned eight wide mobile two wide tablet two wide computer column">
            <h4 class="ui header">微信公众号</h4>
            <img src="https://static.oschina.net/new-osc/img/wechat_qrcode.jpg?t=1484694603000" alt="微信公众号">
          </div>
          <div class="center aligned eight wide mobile six wide tablet six wide computer column">
            <h3 class="ui header">开源中国 APP</h3>
            <p>聚合全网技术文章，根据你的阅读喜好进行个性推荐</p>
            <a href="https://www.oschina.net/app" target="_blank" class="ui large primary button">下载 APP</a>
          </div>
        </div>
      </div>
    </div>
    <LoginWindow :show-login="showLogin" :show-login-window="showLoginWindow"/>
    <Avatar v-if="isLogin" :src="avatar(user.avatar)" :is-show="uploadAvatar" />
  </div>
</template>

<script>
  import LoginWindow from '@/components/LoginWindow'
  import Avatar from '@/components/Avatar'
  import EventBus from '@/EventBus'
  import {GET} from './api'

  export default {
  name: 'App',
  components: {LoginWindow,Avatar},
  data() {
    let isLogin = false
    let userSession = localStorage.getItem("user")
    if(userSession){
      isLogin = true
      userSession = JSON.parse(userSession)
    }
    console.log(userSession)

    return {
      showLoginWindow: false,
      showLogin: true,
      isLogin: isLogin,
      user: userSession,
      uploadAvatar: false
    }
  },
  methods: {
    toLogin: function () {
      this.showLoginWindow = true
      this.showLogin = true
    },
    toRegiste: function () {
      // layerError("dadasdas")
      this.showLoginWindow = true
      this.showLogin = false
    },
    logout: function () {
      this.isLogin = false
      const that = this
      GET({
        url: '/api/user/logout',
        callback: res => {
          if(res.code === 200){
            localStorage.clear()
            // layerMsg("Logout Success!")
            if(!that.$route.meta.skipAuth){
              // setTimeout(function () {
                that.$router.replace("/blog")
              // }, 2000)
            } else {
              location.reload()
            }
          } else {
            layerMsg("Logout Error: " + res.message + "!")
          }
        }
      })
    }
  },
  mounted: function () {
    const that = this
    // var data = new FormData()
    // data.append("captcha", "0000000")
    // POST({
    //   url: '/api/user/sendRegCode',
    //   data: data,
    //   callback: res => {
    //     layerMsg(res.message)
    //   }
    // })
    EventBus.$on("loginSuccess", function (user) {
      that.showLoginWindow = false
      that.isLogin = true
      that.user = user
    })
    EventBus.$on("goRegiste", function () {
      that.toRegiste()
    })
    EventBus.$on("goLogin", function () {
      that.toLogin()
    })
    EventBus.$on("hideLoginWindow", function () {
      that.showLoginWindow = false
    })
    EventBus.$on("closeAvatar", function () {
      that.uploadAvatar = false
      $('body').css('overflow-y', 'auto')
    })
    EventBus.$on("changeAvatar", function () {
      that.uploadAvatar = false
      that.user = JSON.parse(localStorage.getItem("user"))
      $('body').css('overflow-y', 'auto')
    })
    EventBus.$on("showAvatar", function () {
      $('html,body').animate({scrollTop: '0px'}, 200)
      setTimeout(function () {
        that.uploadAvatar = true
        $('body').css('overflow-y', 'hidden')
      }, 200)
    })
  }
}
</script>

<style>
  @import "../static/main.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*height: 100%;*/
  min-height: 100%;
  background-color: #eeeeee;
}

  .navbar-avatar {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    cursor: pointer;
  }

  .label.ui.prompt.visible {
    font-weight: normal!important;
  }

  #footer {
    background-color: #fff;
    border-top: 1px solid rgba(0,0,0,.1);
    padding-top: 25px;
    padding-bottom: 25px;
  }

.dropdown-menu li a{
  padding-top: 8px;
  padding-bottom: 8px;
}

  .dropdown-menu li[role=separator]{
    margin: 3px 0;
  }
  .navbar-fixed-top {
    z-index: 999;
  }
</style>
