<template>
  <div>
    <div class="container">
      <div class="content left hidden-xs">
        <h3>个人空间管理</h3>
        <div class="menu">
          <h5>个人信息管理</h5>
          <div class="item" :class="path === 'inbox' ? 'active' : ''">
            <router-link :to="{name: 'AdminInbox'}">我的消息</router-link>
          </div>
          <div class="item" :class="path === 'profile' ? 'active' : ''">
            <router-link :to="{name: 'AdminProfile'}">修改个人资料</router-link>
          </div>
          <div class="item" :class="path === 'chpwd' ? 'active' : ''">
            <router-link :to="{name: 'AdminChpwd'}">修改登录密码</router-link>
          </div>
          <div class="item" :class="path === 'change-email' ? 'active' : ''">
            <router-link :to="{name: 'AdminChangeEmail'}">修改登录邮箱</router-link>
          </div>
          <div class="item" :class="path === 'user-settings' ? 'active' : ''">
            <router-link :to="{name: 'AdminUserSetting'}">个人主页设置</router-link>
          </div>
          <div class="item" :class="path === 'privacy' ? 'active' : ''">
            <router-link :to="{name: 'AdminPrivacy'}">个人隐私设置</router-link>
          </div>
          <div class="item" :class="path === 'mail-settings' ? 'active' : ''">
            <router-link :to="{name: 'AdminMailSetting'}">邮件提醒设置</router-link>
          </div>
          <div class="item" :class="path === 'openid' ? 'active' : ''">
            <router-link :to="{name: 'AdminOpenId'}">第三方账号绑定</router-link>
          </div>
          <div class="item" :class="path === 'mobile' ? 'active' : ''">
            <router-link :to="{name: 'AdminMobile'}">手机号码绑定</router-link>
          </div>
          <div class="item" :class="path === 'login-log' ? 'active' : ''">
            <router-link :to="{name: 'LoginLog'}">登录日志</router-link>
          </div>
        </div>
        <div class="menu">
          <h5>博客管理</h5>
          <div class="item">
            <router-link target="_blank" :to="{name: 'WriteBlog'}">发表博文</router-link>
          </div>
          <div class="item" :class="path === 'drafts' ? 'active' : ''">
            <router-link :to="{name: 'Drafts'}">草稿箱</router-link>
          </div>
          <div class="item" :class="path === 'blog-settings' ? 'active' : ''">
            <router-link :to="{name: 'BlogSetting'}">博客设置</router-link>
          </div>
          <div class="item" :class="path === 'blog-catalogs' ? 'active' : ''">
            <router-link :to="{name: 'BlogCatalog'}">分类管理</router-link>
          </div>
          <div class="item" :class="path === 'blog-comments' ? 'active' : ''">
            <router-link :to="{name: 'BlogComment'}">评论管理</router-link>
          </div>
          <div class="item" :class="path === 'blog-exports' ? 'active' : ''">
            <router-link :to="{name: 'BlogExport'}">导出备份</router-link>
          </div>
          <div class="item" :class="path === 'favorites' ? 'active' : ''">
            <router-link :to="{name: 'Favorites'}">收藏夹</router-link>
          </div>
        </div>
        <div class="menu">
          <h5>动作翻译管理</h5>
          <div class="item" :class="path === 'translation' ? 'active' : ''">
            <router-link :to="{name: 'Translation'}">我翻译的</router-link>
          </div>
          <div class="item" :class="path === 'translation-delivered' ? 'active' : ''">
            <router-link :to="{name: 'TranslationDelivered'}">我投递的</router-link>
          </div>
        </div>
        <div class="menu">
          <h5>其它</h5>
          <div class="item" :class="path === 'releases' ? 'active' : ''">
            <router-link :to="{name: 'Release'}">我投递的新闻</router-link>
          </div>
          <div class="item" :class="path === 'projects' ? 'active' : ''">
            <router-link :to="{name: 'Project'}">投递软件管理</router-link>
          </div>
        </div>
      </div>
      <div class="content right">
        <div class="text-left hidden-xs">
          <ol class="breadcrumb breadcrumb-path">
            <li>
              <router-link :to="{name: 'PersonDefault'}">
                {{user.username}}的个人空间
              </router-link>
            </li>
            <li>
              <router-link :to="{name: 'AdminDefault'}">
                个人空间管理
              </router-link>
            </li>
            <li class="active">{{pageName}}</li>
          </ol>
        </div>
        <div class="text-left visible-xs">
          <ol class="breadcrumb breadcrumb-path">
            <li>
              <router-link :to="{name: 'AdminDefault'}">
                <i class="icon left angle"></i>返回空间管理
              </router-link>
            </li>
          </ol>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Admin',
    computed: {
      pageName: function () {
        return this.pages[this.path]
      }
    },
    data(){
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      let path = ''
      const paths = location.pathname.split('/')
      if(paths.length >= 5){
        path = paths[4]
      } else {
        path = 'profile'
      }
      return {
        path,
        pages: {
          'inbox': '我的消息',
          'profile': '修改个人资料',
          'chpwd': '修改登录密码',
          'change-email': '修改登录邮箱',
          'user-settings': '个人主页设置',
          'privacy': '个人隐私设置',
          'mail-settings': '邮件提醒设置',
          'openid': '第三方账号绑定',
          'mobile': '手机绑定设置',
          'drafts': '草稿箱',
          'blog-settings': '博客设置',
          'blog-catalogs': '分类管理',
          'blog-comments': '评论管理',
          'blog-exports': '导出备份',
          'translation': '我翻译的',
          'translation-delivered': '我投递的',
          'releases': '我投递的新闻',
          'projects': '投递软件管理',
          'favorites': '我的收藏夹',
          'login-log': '登录日志'
        },
        user: userSession
      }
    },
    watch:{
      $route(){
        const paths = location.pathname.split('/')

        if(paths.length === 5){
          this.path = paths[4]
        } else {
          this.path = 'profile'
        }
      }
    }
  }
</script>

<style scoped>
  @media only screen and (max-width: 768px) {
    .container {
      width: 100%;
    }
    .container>.right {
      width: 100% !important;
    }
  }
  @media only screen and (min-width: 1300px) {
    .container {
      width: 1300px;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 992px) {
    .container {
      width: 768px;
    }
    .user-info .user-action a {
      display: block;
      margin: 3px 5px;
      width: auto!important;
    }
  }
  @media only screen and (min-width: 993px) and (max-width: 1300px) {
    .container {
      width: 992px;
    }
  }
  h3,h5{
    font-weight: 600;
    color: rgba(0,0,0,.87);
    margin: 0;
  }
  h5 {
    margin-top: 20px;
    font-size: 15px;
    margin-bottom: 20px;
  }

  a{
    text-decoration: none;
  }
  .container {
    height: 100%;
    background-color: #eee;
    padding-top: 50px;
    margin-left: auto;
    margin-right: auto;
  }
  .container .content {
    display: inline-block;
    height: 100%;
    background-color: white;
    padding-top: 20px;
    min-height: 900px;
    box-sizing: inherit;
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
  }
  .container .left {
    width: 18.75%;
    float: left;
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
  }
  .menu {
    cursor: default;
  }
  .menu a {
    display: block;
    color: rgba(0,0,0,.5);
    line-height: 1;
  }
  .menu a:hover{
    color: rgba(0,0,0,.87);
  }
  .menu .item.active a{
    color: #32aa66!important;
    font-weight: 600;
  }
  .menu .item {
    padding-top: 7px;
    padding-bottom: 7px;
  }
  .container .right {
    width: 81.25%;
    float: left;
    position: relative;
    padding-left: 10px;
    padding-right: 20px;
  }

  .breadcrumb-path {
    background-color: transparent;
    margin-bottom: 0;
    padding-left: 0;
  }
  .breadcrumb-path li.active {
    font-weight: 700;
    color: rgba(0,0,0,.87);
  }
</style>
