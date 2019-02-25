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
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#" @click="toLogin">{{isLogin ? user.username : '登录'}}</a></li>
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
export default {
  name: 'App',
  components: {LoginWindow},
  data() {
    // localStorage.getItem("user")

    return {
      showLoginWindow: false,
      showLogin: true,
      isLogin: false,
      user: {
        username: '测试'
      }
    }
  },
  methods: {
    toLogin: function () {
      this.showLoginWindow = true
      this.showLogin = true
    },
    toRegiste: function () {
      this.showLoginWindow = true
      this.showLogin = false
    }
  },
  mounted: function () {
    const that = this
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
  height: 100%;
  background-color: #eeeeee;
}
</style>
