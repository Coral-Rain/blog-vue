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
            <li class="active"><a href="#">博客</a></li>
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
              <img src="../static/avatar.png" title="修改头像" @click="" class="navbar-avatar" :alt="user.username">
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
    <LoginWindow :show-login="showLogin" :show-login-window="showLoginWindow"/>
  </div>
</template>

<script>
import LoginWindow from '@/components/LoginWindow'
import EventBus from '@/EventBus'
import {GET, POST} from './api'
export default {
  name: 'App',
  components: {LoginWindow},
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
      user: userSession
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
            layerMsg("Logout Success!")
            // if(!that.$route.meta.skipAuth){
              setTimeout(function () {
              location.reload()
                // that.$router.replace("/blog")
              }, 2000)
            // }
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
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: auto;
  min-height: 100%;
  background-color: #eeeeee;
}

  .navbar-avatar {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    cursor: pointer;
  }
</style>
