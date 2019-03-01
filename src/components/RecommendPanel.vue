<template>
    <div class="recommend-panel">
      <div class="recommend-panel-div" v-for="blog in blogs">
        <div>
          <img class="recommend-panel-image" src="../../static/14332c86c2bc49c25c0845fe85a94f9931e.jpg" alt="">
          <a href="#" target="_blank"></a>
        </div>
        <div class="recommend-content">
          <div class="text-left">
            <a href="#" target="_blank" :title="blog.name">{{blog.name}}</a>
          </div>
          <div class="recommend-meta text-left">
            <a class="author" target="_blank" href="#">
              <img class="img-circle" src="../../static/112321.jpg" alt="">
              <span>{{blog.author}}</span>
            </a>
            <a class="comment" target="_blank" href="#">
              <i class="fa fa-comment-o"></i>
              &nbsp;{{blog.comments}}
            </a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'RecommendPanel',
    props: {
      blogs: {
        type: Array
      }
    }
  }
</script>

<style scoped>

  @media only screen and (min-width: 768px) {
    .recommend-panel {
      display: flex;
      margin-left: -12px;
      margin-right: -12px;
    }
    .recommend-panel-div {
      margin: 14px 6px;
      width: calc(33.33333% - 12px);
      border: 1px solid rgba(0,0,0,.3);
      border-radius: 3px;
      position: relative;
    }
    .recommend-content .text-left {
      height: 40px
    }
    .recommend-panel-image {
      width: 100%;
      height: 120px;
      cursor: pointer;
    }
  }
  @media only screen and (max-width: 768px) {
    .recommend-panel {
      /*display: flex;*/
      margin-left: -12px;
      margin-right: -12px;
    }
    .recommend-panel-div {
      margin: 14px 6px;
      width: 100%;
      border: 1px solid rgba(0,0,0,.3);
      border-radius: 3px;
      position: relative;
    }
    .recommend-content .text-left {
      height: auto
    }
    .recommend-panel-image {
      width: 100%;
      height: 180px;
      cursor: pointer;
    }
  }
  /*.recommend-panel {*/
    /*display: flex;*/
    /*margin-left: -12px;*/
    /*margin-right: -12px;*/
  /*}*/
    /*.recommend-panel-div {*/
      /*margin: 14px 6px;*/
      /*width: calc(33.33333% - 12px);*/
      /*border: 1px solid rgba(0,0,0,.3);*/
      /*border-radius: 3px;*/
      /*position: relative;*/
    /*}*/

  /*.recommend-panel-image {*/
    /*width: 100%;*/
    /*height: 120px;*/
    /*cursor: pointer;*/
  /*}*/
  .recommend-content {
    padding: 14px;
  }
  a:hover,a:focus{
    text-decoration: none;
  }
  /*.recommend-content .text-left {*/
    /*height: 40px*/
  /*}*/
  .recommend-content a{
    color: rgba(0,0,0,.87);
    font-weight: 600;
    font-size: 15px;
  }
  .recommend-content a:hover{
    color: #337ab7;
  }
  .recommend-meta {
    margin-top: 15px;
  }

  .recommend-meta a.author{
    color: rgba(0,0,0,.4);
    font-weight: 500;
    line-height: 30px;
  }

  .recommend-meta a.author:hover {
    color: rgba(0,0,0,1);
  }

  .recommend-meta a.author img{
    width: 30px;
    height: 30px;
  }
  .comment{
    float: right;
    color: rgba(0,0,0,.4) !important;
    font-weight: 500!important;
    line-height: 30px;
  }
  .comment:hover{
    color: rgba(0,0,0,.8)!important;
  }

</style>
