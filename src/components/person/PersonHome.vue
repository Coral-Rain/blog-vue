<template>
  <div class="container">
    <div class="content left">
      <div class="user-info">
        <div>
          <router-link :to="{name: 'PersonDefault'}"><img :src="avatar(user.avatar)" :alt="user.username"></router-link>
        </div>
        <p>{{user.username}}</p>
        <div class="signature" v-if="user.signature">{{user.signature}}</div>
        <router-link v-if="isTarget" class="btn btn-default" :to="{name: 'AdminDefault'}">
          <i class="fa fa-cog"></i> 账号设置
        </router-link>
        <div class="user-statistics">
          <a href="#" class="statistics">
            <div>{{count.score}}</div>
            <div>积分</div>
          </a>
          <router-link :to="{name: 'Followers'}" class="statistics">
            <div>{{count.fanCount}}</div>
            <div>粉丝</div>
          </router-link>
          <router-link :to="{name: 'Following'}" class="statistics">
            <div>{{count.followCount}}</div>
            <div>关注</div>
          </router-link>
          <router-link v-if="isTarget" :to="{name: 'Favorites'}" class="statistics">
            <div>{{count.collectCount}}</div>
            <div>收藏</div>
          </router-link>
        </div>
        <div class="user-action">
          <div v-if="isTarget">
            <router-link :to="{name: 'WriteBlog', params: {userId: user.id}}" style="width: 110px"
                         class="btn btn-success">
              <i class="fa fa-pencil-square fa-lg"></i>&nbsp;&nbsp;写博客
            </router-link>
            <router-link :to="{name: 'Drafts', params: {userId: user.id}}" class="btn btn-default">
              <i class="fa fa-folder-open-o fa-lg"></i>&nbsp;&nbsp;草稿箱 ({{count.draftCount}})
            </router-link>
          </div>
          <div v-else>
            <div class="item action clearfix">
              <a v-if="user.follow" class="ui green button follow-btn" @click="goFollow()"
                 @mouseover="hoverFollow = true" @mouseleave="hoverFollow = false">
                <i class="fa fa-heart" :class="hoverFollow ? 'fa-heart-o' : 'fa-heart'"></i>
                <span class="text">{{hoverFollow ? '取消关注' : '已关注'}}</span>
              </a>
              <a v-else class="ui green button follow-btn" @click="goFollow()" @mouseover="hoverFollow = true"
                 @mouseleave="hoverFollow = false">
                <i class="fa" :class="hoverFollow ? 'fa-heart' : 'fa-heart-o'"></i>
                <span class="text">关注</span>
              </a>
              <a class="ui green basic button" style="width: 90px" @click="showSendModal()"><i
                class="fa fa-envelope-o"></i>私信</a>
              <div class="ui basic dropdown more dropdown-more" tabindex="0">
                <div class="ui icon green basic button menu-btn"><i class="fa fa-bars"></i></div>
                <div class="menu transition hidden" tabindex="-1">
                  <a class="item" href="#" target="_blank"><i class="fa fa-comment-o"></i>提问</a>
                  <a class="item"><i class="fa fa-ban"></i><span class="text">加灰</span></a>
                  <a class="item ban">
                    <i class="fa fa-flag"></i>举报
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 class="pull-left">技能雷达</h4>
        <div id="echarts" style="width: 340px;height: 250px"></div>
      </div>
      <div class="user-record text-left">
        <h4>访问统计</h4>
        <div class="statistics text-left">
          <span class="count">今日访问: {{count.today}}</span>
          <span class="count">昨日访问: {{count.yesterday}}</span>
          <span class="count">本周访问: {{count.week}}</span>
          <span class="count">本月访问: {{count.month}}</span>
          <span class="count">所有访问: {{count.total}}</span>
          <span class="count">加入时间: {{user.createTime | datetime}}</span>
          <span class="count">最近登陆: {{count.lastLogin | datetime}}</span>
        </div>
      </div>
    </div>
    <div v-if="isTabActive" class="content right">
      <ul class="nav nav-tabs">
        <li role="presentation" id="tab-newest" class="active dropdown-tab dropdown btn-group">
          <!--<a href="#" class="btn btn-default">-->
          <!--全部博文 <span class="caret"></span></a>-->
          <router-link @click.native="changeTab($event)"
                       class="btn btn-default tab-dropdown-button"
                       :to="{name: 'Newest', params: {userId: user.id}, query: {categoryId: activeType.id}}">
            {{activeType.name}}
          </router-link>
          <button type="button" class="btn btn-default dropdown-toggle tab-dropdown-toggle"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="caret"></span>
            <span class="sr-only">Toggle Dropdown</span>
          </button>

          <ul class="dropdown-menu">
            <li @click="changeBlogType()">
              <router-link :to="{name: 'Newest', params: {userId: user.id}, query: {categoryId: 0}}"
                           class="blog-type-dropdown item-li" :class="isTypeActive(0) ? 'active' : ''">
                <span class="text-left">全部博文</span>
                <span class="text-right">{{blogCount}}</span>
              </router-link>
            </li>
            <li class="divider" role="separator"></li>
            <li v-for="(type, index) in blogTypes" :key="index" @click="changeBlogType()">
              <router-link :to="{name: 'Newest', params: {userId: user.id}, query: {categoryId: type.id}}"
                           class="blog-type-dropdown item-li" :class="isTypeActive(type.id) ? 'active' : ''">
                <span class="text-left">{{type.name}}</span>
                <span class="text-right">{{type.count}}</span>
              </router-link>
            </li>
          </ul>
        </li>
        <li role="presentation" id="tab-popular" class="dropdown-tab" @click="changeTab($event)">
          <router-link :to="{name: 'Popular', params: {userId: user.id}}">热门博文</router-link>
        </li>
        <li role="presentation" id="tab-activity" class="dropdown-tab" @click="changeTab($event)">
          <router-link :to="{name: 'Activity', params: {userId: user.id}}">动态</router-link>
        </li>
        <li role="presentation" id="tab-tweet" class="dropdown-tab" @click="changeTab($event)">
          <router-link :to="{name: 'Tweet', params: {userId: user.id}}">动弹</router-link>
        </li>
        <li class="pull-right search-group hidden-xs hidden-sm">
          <div class="ui icon small input">
            <input type="text" class="form-control" @keypress.enter="searchBlog()" v-model.trim="keyword"
                   :placeholder="'搜索' + user.username + '的博客'">
            <i class="fa-search icon link" @click="searchBlog()"></i>
          </div>
        </li>
      </ul>
      <!--引入组件-->
      <div class="ui tab attached">
        <router-view></router-view>
      </div>
    </div>
    <div v-else class="text-left content right">
      <div class="row">
        <ol class="breadcrumb breadcrumb-path">
          <li>
            <router-link :to="{name: 'PersonDefault'}"><i class="icon angle left"></i>{{title}}</router-link>
          </li>
        </ol>
      </div>
      <router-view></router-view>
    </div>
    <div class="message-send modal ui tiny not-hide editor">
      <i class="icon close"></i>
      <div class="header">发送私信给： {{send.username}}</div>
      <div class="content">
        <form class="ui form">
          <div class="field">
            <HTMLEditor ref="editor" />
            <!--            <textarea v-model="send.message" placeholder="请输入内容" rows="5" style="resize: none;height: 100px"></textarea>-->
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui positive right labeled icon button" @click="sendMessage()">发送<i class="send icon"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {GET, POST} from '../../api'
  import EventBus from '@/EventBus'
  import HTMLEditor from '../tools/HTMLEditor'

  export default {
    name: 'PersonHome',
    data() {
      let userSession = localStorage.getItem("user");
      if (userSession) {
        userSession = JSON.parse(userSession)
      }

      const formdata = new FormData();
      formdata.append('userId', this.$route.params.userId);
      const that = this;
      POST({
        url: '/api/catalog/list',
        data: formdata,
        callback: res => {
          if (res.code === 200) {
            that.blogTypes = res.data.catalogs;
            EventBus.$emit("refreshBlogTypes", that.blogTypes)
          } else {
            layerError(res.message)
          }
        }
      });

      let categoryId = 0;
      if (this.$route.query.categoryId) {
        categoryId = this.$route.query.categoryId
      }
      let userId = this.$route.params.userId;
      const fd = new FormData();
      fd.append('userId', userId);
      POST({
        url: '/api/user/getDetailById',
        data: fd,
        callback: res => {
          if (res.code === 200) {
            that.user = res.data.userDetail;
            document.title = that.user.username + '的个人空间'
          }
        }
      });

      let count = {};
      GET({
        url: '/api/user/statistics/' + userId,
        callback: res => {
          if (res.code === 200) {
            that.count = res.data.count
          }
        }
      });
      return {
        userSession: userSession,
        tagName: '',
        blogTypes: [
          {id: '1', name: '工作日志', count: 0},
          {id: '2', name: '日常作品', count: 0},
          {id: '3', name: '转载文章', count: 0}
        ],
        user: {id: '0',avatar: 'avatar.png'},
        hoverFollow: false,
        tabs: ['newest', 'popular', 'activity', 'tweet'],
        count,
        send: {id: '0', message: '', username: ''},
        keyword: this.$route.query.q
      }
    },
    components: {HTMLEditor},
    methods: {
      drawPie: function (id) {
        const charts = echarts.init(document.getElementById(id));
        const option = {
          tooltip: {},//提示层
          legend: {
            data: ['name1']
          },
          radar: {
            name: {
              textStyle: {
                color: '#000', //字体颜色
                backgroundColor: '#fff', //背景色
                borderRadius: 3, //圆角
                padding: [3, 5] //padding
              }
            },
            center: ['50%', '50%'],
            radius: '60%',
            startAngle: 270,
            indicator: [
              {
                name: '活动活跃性',
                max: 400
              },
              {
                name: '技术贡献度',
                max: 400
              },
              {
                name: '社区影响力',
                max: 400
              },
              {
                name: '社区活跃度',
                max: 400
              },
              {
                name: '学习积极性',
                max: 400
              },
              {
                name: '开源贡献度',
                max: 400
              }
            ],
          },
          series: [{
            name: '测试标题名字',
            type: 'radar',
            data: [{
              value: [300, 350, 110, 200, 78, 330],
              name: '技能雷达图'
            }]
          }]
        };
        charts.setOption(option);
      },
      changeTab: function (event) {
        console.log(event);
        $('.dropdown-tab').removeClass('active');
        event.target.parentElement.classList.add('active')
      },
      changeBlogType: function () {
        console.log("changeBlogType");
        $('.dropdown-tab').removeClass('active');
        $('#tab-newest').addClass('active')
      },
      showSendModal: function () {
        if (this.userSession) {
          this.send.id = this.user.id;
          this.send.message = '';
          this.$refs.editor.clear();
          this.send.username = this.user.username;
          $('.message-send.modal').modal('show');
          EventBus.$emit('initEditor');
        } else {
          layerError("请登录后操作")
        }
      },
      searchBlog: function () {
        console.log("search...");
        this.$router.push({
          name: 'Newest',
          params: {
            userId: this.$route.params.userId
          },
          query: {
            q: this.keyword
          }
        });
        $('.dropdown-tab').removeClass('active');
        $('#tab-newest').addClass('active')
      },
      goFollow: function () {
        if (!this.userSession) {
          layerError("请登录后操作");
          return;
        }
        const that = this;
        let url = "";
        if (that.user.follow) {
          // 取消关注
          url = "/api/user/follow/delete"
        } else {
          url = "/api/user/follow/add"
        }
        const formdata = new FormData();
        formdata.append("userId", that.user.id);
        formdata.append("follower", that.userSession.id);
        POST({
          url: url,
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              that.user.follow = !that.user.follow;
              if (that.user.follow) {
                that.count.fanCount += 1
              } else {
                that.count.fanCount -= 1
              }
            } else {
              layerError(res.message)
            }
          }
        })
      },
      sendMessage() {
        // 发送私信
        this.send.message = this.$refs.editor.value();
        if(this.send.message.trim().length === 0){
          layerError("私信内容不能为空!");
          return;
        }
        const formdata = new FormData();
        formdata.append("receiver", this.send.id);
        formdata.append("content", this.send.message);
        POST({
          url: '/api/message/send',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              layerMsg("成功发送私信！");
              $('.message-send.modal').modal('hide')
            } else {
              layerError(res.message)
            }
          }
        })
      }

    },
    mounted() {
      $('.ui.dropdown').dropdown();
      $('.dropdown-tab').removeClass('active');
      const path = location.pathname.split('/');
      if (path.length > 3) {
        const tagName = path[3];
        this.tagName = tagName;
        if (!tagName || tagName === 'newest') {
          this.tagName = 'newest';
          $('#tab-newest').addClass('active')
        } else if (tagName === 'activity') {
          $('#tab-activity').addClass('active')
        } else if (tagName === 'popular') {
          $('#tab-popular').addClass('active')
        } else if (tagName === 'tweet') {
          $('#tab-tweet').addClass('active')
        }
      } else {
        //  default
        this.tagName = 'newest';
        $('#tab-newest').addClass('active')
      }
      this.$nextTick(function () {
        this.drawPie('echarts')
      });
      const that = this;
      EventBus.$on("requestBlogTypes", function () {
        EventBus.$emit("refreshBlogTypes", that.blogTypes)
      });
      EventBus.$on("startLoad", function () {
        $('.ui.tab.attached').addClass("loading").removeClass("display-block")
      });
      EventBus.$on("endLoad", function () {
        $('.ui.tab.attached').removeClass("loading").addClass("display-block")
      });
      EventBus.$on("sendMessage", function (userId, username) {
        that.send.id = userId;
        that.send.message = '';
        that.send.username = username;
        $('.message-send.modal').modal('show')
      });
      EventBus.$on("loginSuccess", function () {
        let userSession = localStorage.getItem("user");
        if (userSession) {
          userSession = JSON.parse(userSession)
        }
        that.userSession = userSession
      })
    },
    computed: {
      isTypeActive: function () {
        return function (id) {
          return this.activeType.id === id
        }
      },
      blogCount: function () {
        let count = 0;
        this.blogTypes.forEach(type => {
          count += type.count
        });
        return count
      },
      activeType: function () {
        let categoryId = 0;
        if (this.$route.query.categoryId) {
          categoryId = this.$route.query.categoryId
        }

        const res = this.blogTypes.filter(type => type.id === categoryId);
        if (res.length > 0) {
          return res[0]
        } else {
          return {id: 0, name: '全部博文'}
        }
      },
      isTarget: function () {
        return this.userSession && this.userSession.id === this.user.id
      },
      isTabActive: function () {
        return this.tabs.filter(x => x === this.tagName).length > 0;
      },
      title: function () {
        if (this.userSession && this.userSession.id === this.user.id) {
          return "我的个人空间"
        } else {
          return this.user.username ? this.user.username + "的个人空间" : ''
        }
      }
    },
    watch: {
      $route() {
        this.keyword = this.$route.query.q;
        const path = location.pathname.split('/');
        if (path.length > 3) {
          const tagName = path[3];
          this.tagName = tagName;
          if (!tagName || tagName === 'newest') {
            this.tagName = 'newest';
            $('#tab-newest').addClass('active')
          } else if (tagName === 'activity') {
            $('#tab-activity').addClass('active')
          } else if (tagName === 'popular') {
            $('#tab-popular').addClass('active')
          } else if (tagName === 'tweet') {
            $('#tab-tweet').addClass('active')
          }
        } else {
          //  default
          this.tagName = 'newest';
          $('#tab-newest').addClass('active')
        }
      }
    }
  }
</script>

<style scoped>

  .display-block {
    display: block !important;
  }

  @media only screen and (max-width: 768px) {
    .container {
      width: 100%;
    }

    .container > .left {
      width: 100% !important;
    }

    .container > .right {
      width: 100% !important;
    }
  }

  @media only screen and (min-width: 1300px) {
    .container {
      width: 1300px;
    }
  }

  @media only screen and (min-width: 769px) and (max-width: 992px) {
    .container {
      width: 768px;
    }

    .user-info .user-action a {
      display: block;
      margin: 3px 5px;
      width: auto !important;
    }
  }

  @media only screen and (min-width: 993px) and (max-width: 1300px) {
    .container {
      width: 992px;
    }
  }

  h4 {
    font-weight: 600;
    margin: 20px
  }

  .container {
    height: 100%;
    background-color: #eeeeee;
    padding-top: 50px;
    margin-left: auto;
    margin-right: auto;
  }

  .container .content {
    display: inline-block;
    height: 100%;
    min-height: 900px;
    background-color: white;
    padding-top: 20px;
    box-sizing: inherit;
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
  }

  .container > .left {
    width: 31.25%;
    float: left;
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
  }

  .container .right {
    width: 68.75%;
    float: left;
    position: relative;
    padding-left: 10px;
    padding-right: 20px;
  }

  .user-info {
    padding: 14px;
  }

  .user-info img {
    width: 120px;
    height: 120px;
    border-radius: 60px;
  }

  .user-info p {
    font-size: 18px;
    margin-top: 15px;
    font-weight: 700;
  }

  .user-info .signature {
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, .6);
  }

  .user-info .user-statistics {
    display: flex;
    margin: 15px 0;
  }

  .user-info .user-statistics .statistics {
    flex: 1;
    color: black;
    font-weight: 600;
    text-decoration: none;
  }

  .user-info .user-statistics .statistics :last-child {
    font-size: 15px;
  }

  .user-info .user-statistics .statistics :first-child {
    font-size: 18px;
    font-weight: normal;
    color: #4b505d;
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
  }

  .user-info .user-action a {
    margin-left: 3px;
    margin-right: 3px;
  }

  .user-record {
    margin-top: 50px;
    margin-bottom: 10px;
  }

  .user-record .statistics {
    margin-left: 20px;
  }

  .statistics .count {
    display: block;
    margin: 3px 0;
    color: rgba(0, 0, 0, .87);
  }

  .blog-type-dropdown {
    display: flex;
    padding: 0 10px;
  }

  .blog-type-dropdown span {
    flex: 1;
    font-size: 16px;
    margin: 3px 5px;
  }

  .right li[role=presentation] a {
    font-size: 16px;
    color: black;
  }

  .right li[role=presentation].active > a, .right li[role=presentation] a.router-link-active:not(.item-li) {
    color: #32aa66 !important;
    cursor: pointer !important;
    font-weight: 600;
  }

  .search-group {
    margin-top: 5px;
    border-radius: 10px;
  }

  .dropdown-menu .item-li {
    padding: 5px 12px;
    cursor: pointer;
  }

  .dropdown-menu .item-li:hover {
    background-color: #eee;
  }

  .dropdown-menu .item-li.active {
    font-weight: 600;
    background-color: #eee;
  }

  .dropdown.open {
    z-index: 1550;
  }

  .tab-dropdown-button {
    margin-right: 0;
  }

  .tab-dropdown-button :hover, .tab-dropdown-button :focus {
    border-right: none;
  }

  .tab-dropdown-toggle {
    height: 44px;
    border-left: none;
  }

  li.active .tab-dropdown-toggle {
    border-bottom: none;
  }

  li:not(.active) .tab-dropdown-toggle {
    /*border: ;*/
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid rgb(221, 221, 221);
  }

  li:not(.active) .tab-dropdown-button {
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .green {
    background-color: #32aa66 !important;
    border-color: #32aa66 !important;
  }

  .green:hover {
    background-color: #08aa4b !important;
    border-color: #08aa4b !important;
  }

  .ui.basic.green.button {
    box-shadow: 0 0 0 1px #32aa66 !important;
    color: #32aa66 !important
  }

  .ui.button {
    font-weight: 400 !important;
  }

  .follow-btn {
    width: 100px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .user-action .action .dropdown {
    display: inline;
  }

  .breadcrumb-path {
    background-color: transparent;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 5px;
  }

  .breadcrumb-path li {
    width: 350px;
  }
  .editor.modal {
    height: 100%;
    width: 80%;
    position: absolute;
    margin: auto!important;
  }
  .editor.modal .content {
    height: calc(100% - 130px);
    overflow-y: auto;
  }

  i.fa {
    margin-right: 5px;
  }
</style>
