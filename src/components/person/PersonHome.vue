<template>
    <div class="container">
      <div class="content left">
        <div class="user-info">
          <div>
            <a href=""><img src="../../../static/avatar.png" :alt="user.username"></a>
          </div>
          <p>{{user.username}}</p>
          <router-link class="btn btn-default" :to="{name: 'PersonProfile', params: {userId: user.id}}">
            <i class="glyphicon glyphicon-cog"></i> 账号设置
          </router-link>
          <div class="user-statistics">
            <a href="#" class="statistics">
              <div>0</div>
              <div>积分</div>
            </a>
            <a href="#" class="statistics">
              <div>0</div>
              <div>粉丝</div>
            </a>
            <a href="#" class="statistics">
              <div>0</div>
              <div>关注</div>
            </a>
            <a href="#" class="statistics">
              <div>0</div>
              <div>收藏</div>
            </a>
          </div>
          <div class="user-action">
            <router-link :to="{name: 'WriteBlog', params: {userId: user.id}}" style="width: 110px" class="btn btn-success">
              <i class="glyphicon glyphicon-edit"></i>&nbsp;&nbsp;写博客
            </router-link>
            <router-link :to="{name: 'PersonDrafts', params: {userId: user.id}}" class="btn btn-default">
              <i class="glyphicon glyphicon-folder-open"></i>&nbsp;&nbsp;草稿箱 (0)
            </router-link>
          </div>
        </div>
        <div>
          <h4 class="pull-left">技能雷达</h4>
          <div id="echarts" style="width: 340px;height: 200px"></div>
        </div>
        <div class="user-record text-left">
          <!--访问统计-->
          <!--
          今日访问：0
          昨日访问：0
          本周访问：0
          本月访问：0
          所有访问：0
          加入时间：昨天 17:39
          最近登录：昨天 17:39
          -->
          <h4>访问统计</h4>
          <div class="statistics text-left">
            <span class="count">今日访问: 0</span>
            <span class="count">昨日访问: 0</span>
            <span class="count">本周访问: 0</span>
            <span class="count">本月访问: 0</span>
            <span class="count">加入时间: 昨天 17:22</span>
            <span class="count">最近登陆: 今天 10:22</span>
          </div>
        </div>
      </div>
      <div class="content right">
        <ul class="nav nav-tabs">
          <li role="presentation" id="tab-newest" class="active dropdown-tab" >
            <!--<a href="#" class="btn btn-default">-->
              <!--全部博文 <span class="caret"></span></a>-->
            <router-link @click.native="changeTab($event)" :to="{name: 'Newest', params: {userId: user.id}}">全部博文</router-link>
            <!--<ul class="dropdown-menu">-->
              <!--<li><a href="#" class="blog-type-dropdown"><span class="text-left">全部博文</span><span class="text-right">0</span></a></li>-->
              <!--<li><a href="#" class="blog-type-dropdown"><span class="text-left">工作日志</span><span class="text-right">0</span></a></li>-->
              <!--<li><a href="#" class="blog-type-dropdown"><span class="text-left">日常记录</span><span class="text-right">0</span></a></li>-->
              <!--<li><a href="#" class="blog-type-dropdown"><span class="text-left">转载文章</span><span class="text-right">0</span></a></li>-->
            <!--</ul>-->
          </li>
          <li role="presentation" id="tab-popular" class="dropdown-tab" @click="changeTab($event)"><router-link :to="{name: 'Popular', params: {userId: user.id}}">热门博文</router-link></li>
          <li role="presentation" id="tab-activity" class="dropdown-tab" @click="changeTab($event)"><router-link :to="{name: 'Activity', params: {userId: user.id}}">动态</router-link></li>
          <li role="presentation" id="tab-tweet" class="dropdown-tab" @click="changeTab($event)"><router-link :to="{name: 'Tweet', params: {userId: user.id}}">动弹</router-link></li>
          <li class="pull-right search-group">
            <div class="input-group">
              <input type="text" class="form-control"  :placeholder="'搜索' + user.username + '的博客'">
            </div>
          </li>
        </ul>
        <!--引入组件-->
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'PersonHome',
    data() {
      let userSession = localStorage.getItem("user")
      if(userSession) {
        userSession = JSON.parse(userSession)
      }

      return {
        user: userSession
      }
    },
    methods: {
      drawPie: function (id) {
        const charts = echarts.init(document.getElementById(id))
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
              value: [0, 0, 0, 0, 0, 0],
              name: '技能雷达图'
            }]
          }]
        }
        charts.setOption(option);
      },
      changeTab: function (event) {
        console.log(event)
        $('.dropdown-tab').removeClass('active')
        event.target.parentElement.classList.add('active')
      }
    },
    mounted() {
      $('.dropdown-tab').removeClass('active')
      const path = location.pathname.split('/')
      if(path.length > 3){
        const tagName = path[3]
        if(!tagName || tagName === 'newest'){
          $('#tab-newest').addClass('active')
        }else if(tagName === 'activity'){
          $('#tab-activity').addClass('active')
        }else if(tagName === 'popular'){
          $('#tab-popular').addClass('active')
        } else if(tagName === 'tweet'){
          $('#tab-tweet').addClass('active')
        }
      } else {
        //  default
        $('#tab-newest').addClass('active')
      }
      this.$nextTick(function () {
        this.drawPie('echarts')
      })
    }
  }
</script>

<style scoped>

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
  h4{
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
    background-color: white;
    padding-top: 20px;
    box-sizing: inherit;
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
  }
  .container .left {
    width: 31.25%;
    float: left;
    position: relative;
  }
  .container .right {
    width: 68.75%;
    float: left;
    position: relative;
    padding-left: 10px;
    padding-right: 20px;
  }
  .user-info {
    padding: 10px;
  }

  .user-info img{
    width: 120px;
    height: 120px;
    border-radius: 60px;
  }

  .user-info p {
    font-size: 17px;
    margin-top: 15px;
    font-weight: 700;
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
  .user-info .user-statistics .statistics :last-child{
    font-size: 15px;
  }
  .user-info .user-statistics .statistics :first-child{
    font-size: 18px;
    font-weight: normal;
    color: #4b505d;
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
  }
  .user-info .user-action a{
    margin-left: 3px;
    margin-right: 3px;
  }

  .user-record {
    margin-top: 70px;
    margin-bottom: 10px;
  }

  .user-record .statistics {
    margin-left: 20px;
  }
  .statistics .count {
    display: block;
    margin: 3px 0;
  }

  .blog-type-dropdown {
    display: flex;
    padding: 0 10px;
  }

  .blog-type-dropdown span{
    flex: 1;
    font-size: 16px;
    margin: 5px 0;
  }

  .right li[role=presentation] a {
    font-size: 16px;
    color: black;
  }

  .right li[role=presentation].active>a {
    color: #32aa66!important;
    cursor: pointer!important;
    font-weight: 600;
  }

  .search-group {
    margin-top: 5px;
    border-radius: 10px;
  }

</style>
