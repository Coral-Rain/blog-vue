<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
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
            <li class="active">
              <router-link to="/">博客</router-link>
            <li><a href="#">翻译</a></li>
            <li><a href="#">问答</a></li>
          </ul>
          <form class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
          </form>
          <ul v-if="isLogin" style="vertical-align: center" class="nav navbar-nav navbar-right">
            <li class="navbar-bell dropdown">
              <a aria-expanded="false" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">
                <i class="fa fa-bell fa-lg"></i>
              </a>
              <div class="dropdown-menu message" :style="{fontSize: hasUnReadMsg ? '14px' : '12px'}" role="menu">
                <div class="header message-header">
                  {{hasUnReadMsg ? '站内消息通知' : '暂没有未读消息'}}
                </div>

                <div class="message-list" style="max-height: 200px">
<!--                  循环未读消息列表-->
                  <div class="list-group">
                    <router-link :to="{name: 'InboxMessages', params: {userId: user.id}, query: {user: m.sender, detail: m.id}}" v-for="(m, index) in messages" :key="index" class="list-group-item" >
                      <div class="title">{{m.title}}</div>
                      <div class="date">{{m.createTime | datetime}}</div>
                    </router-link>
                  </div>
                </div>
                <div class="separator"></div>
                <div class="header action clearfix">
                  <span class="go-inbox"><router-link :to="{name: 'AdminInboxDefault', params: {userId: user.id}}">消息中心</router-link></span>
                  <span class="mark-read-all pull-right" :style="{display: hasUnReadMsg ? 'inline' : 'none'}"><a href="javascript:">全部标记为已读</a></span>
                </div>
              </div>
            </li>
            <li style="line-height: 50px">
              <img :src="avatar(user.avatar)" title="修改头像" @click="" class="navbar-avatar" :alt="user.username">
            </li>
            <li class="dropdown">
              <a aria-expanded="false" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                 aria-haspopup="true">
                {{user.username}}
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link :to="{name: 'PersonDefault', params: {userId: user.id}}">个人中心</router-link>
                </li>
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
    <!--<LoginWindow :show-login="showLogin" :show-login-window="showLoginWindow"/>-->
    <LoginModal :show-login="showLogin"/>
    <Avatar v-if="isLogin" :src="avatar(user.avatar)" :is-show="uploadAvatar"/>
  </div>
</template>

<script>
  import Avatar from '@/components/Avatar'
  import EventBus from '@/EventBus'
  import {GET, POST} from './api'
  import LoginModal from '@/components/tools/LoginModal'

  export default {
    name: 'App',
    components: {LoginModal, Avatar},
    data() {
      let isLogin = false;
      let userSession = localStorage.getItem("user");
      let messages = [];
      const that = this;
      if (userSession) {
        isLogin = true;
        userSession = JSON.parse(userSession);
        // 获取未读消息列表
        const formdata = new FormData();
        formdata.append("receiver", userSession.id);
        formdata.append("status", "0");
        formdata.append("pageNo", "1");
        POST({
          url: '/api/message/list',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              that.messages = res.data.messages;
            } else {
              layerError(res.message)
            }
          }
        })
      }

      return {
        showLoginWindow: false,
        showLogin: true,
        isLogin: isLogin,
        user: userSession,
        uploadAvatar: false,
        messages: messages
      }
    },
    methods: {
      toLogin: function () {
        // this.showLoginWindow = true
        EventBus.$emit("showLoginModal", true)
      },
      toRegiste: function () {
        // layerError("dadasdas")
        // this.showLoginWindow = true
        // this.showLogin = false
        EventBus.$emit("showLoginModal", false)
      },
      logout: function () {
        this.isLogin = false;
        const that = this;
        GET({
          url: '/api/user/logout',
          callback: res => {
            if (res.code === 200) {
              localStorage.clear();
              // layerMsg("Logout Success!")
              if (!that.$route.meta.skipAuth) {
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
    computed: {
      hasUnReadMsg: function () {
        return this.messages.length > 0;
      }
    },
    mounted: function () {
      const that = this;
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
        // that.showLoginWindow = false
        that.isLogin = true;
        that.user = user;
        // 获取未读消息列表
        const formdata = new FormData();
        formdata.append("receiver", user.id);
        formdata.append("status", "0");
        formdata.append("pageNo", "1");
        POST({
          url: '/api/message/list',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              that.messages = res.data.messages;
            } else {
              layerError(res.message)
            }
          }
        })
      });
      // EventBus.$on("goRegiste", function () {
      //   that.toRegiste()
      // })
      // EventBus.$on("goLogin", function () {
      //   that.toLogin()
      // })
      // EventBus.$on("hideLoginWindow", function () {
      //   that.showLoginWindow = false
      // })
      EventBus.$on("closeAvatar", function () {
        that.uploadAvatar = false;
        $('body').css('overflow-y', 'auto')
      });
      EventBus.$on("changeAvatar", function () {
        that.uploadAvatar = false;
        that.user = JSON.parse(localStorage.getItem("user"));
        $('body').css('overflow-y', 'auto')
      });
      EventBus.$on("showAvatar", function () {
        $('html,body').animate({scrollTop: '0px'}, 200);
        setTimeout(function () {
          that.uploadAvatar = true;
          $('body').css('overflow-y', 'hidden')
        }, 200)
      })
    }
  }
</script>

<style>
  @import "../static/css/main.css";

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
    font-weight: normal !important;
  }

  #footer {
    background-color: #fff;
    border-top: 1px solid rgba(0, 0, 0, .1);
    padding-top: 25px;
    padding-bottom: 25px;
  }

  .dropdown-menu li a {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .dropdown-menu li[role=separator] {
    margin: 3px 0;
  }
  .dropdown:hover .dropdown-menu.message {
    display: block;
    margin-top: 0;
  }
  .navbar-fixed-top {
    z-index: 999;
  }
  .dropdown-menu.message {
    /*display: block!important;*/
    /*margin-top: 0!important;*/
    width: 250px;
    font-size: 12px;
    padding: 5px 0;
  }
  .dropdown-menu.message .message-header{
    font-weight: 700;
    padding-left: 15px;
    padding-bottom: 5px;
    color: rgba(0,0,0,.85);
    text-transform: uppercase;
  }
  .dropdown-menu.message .action {
    font-weight: 700;
    padding-left: 15px;
    padding-right: 15px;
  }
  .dropdown-menu.message .separator{
    border-top: 1px solid rgba(0,0,0,.3);
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .message-list .list-group {
    margin-bottom: 0;
  }
  .message-list .list-group .list-group-item {
    border-left: none;
    border-right: none;
    border-radius: 0;
    border-bottom: none;
    padding: 5px 15px;
  }
  .message-list .list-group .list-group-item .title{
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
</style>
