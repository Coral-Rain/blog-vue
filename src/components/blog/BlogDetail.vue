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
          <li><router-link :to="{name: 'PersonHome'}">Coralrain的个人空间</router-link></li>
          <li><router-link to="">工作日志</router-link></li>
          <li class="active">正文</li>
        </ol>
      </div>
      <div>
        <!--<h1>FastDFS</h1>-->
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
  import {POST} from '../../api'

  export default {
    name: 'BlogDetail',
    data() {
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

          } else {

          }
        }
      })


      return {
        blogId: blogId,
        blog: {}
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
    height: 100%;
    padding: 50px 0 30px;
    margin-left: auto;
    margin-right: auto;
    display: flex;

  }

  .breadcrumb-path{
    background-color: transparent;
    padding-left: 0;
    margin-bottom: 5px;
    font-size: 17px;
  }
  .breadcrumb-path li.active{
    font-weight: 600;
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
</style>
