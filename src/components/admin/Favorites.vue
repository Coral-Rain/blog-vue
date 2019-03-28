<template>
    <div>
      <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">我的收藏夹 （{{collects.length}}）</h3>
      <div class="ui relaxed divided items attached tab">
        <div class="item collect text-left" v-for="c in collects">
          <div class="content">
            <div class="top">
              <div class="left">
                <router-link :to="{name: 'BlogDetail', params: {userId: c.user.id, blogId: c.blogId}}" target="_blank" class="header">
                  {{c.title}}
                </router-link>
                <div class="description">
                  <p class="line-clamp">{{c.content | markdown}}</p>
                </div>
              </div>
              <div v-if="hasImg(c.content)" class="images">
                <router-link target="_blank" class="ui small image" :to="{name: 'BlogDetail', params: {userId: c.user.id, blogId: c.blogId}}">
                  <img :src="imgSrc(c.content)" style="width: 100%; height: auto;" alt="">
                </router-link>
              </div>
            </div>
            <div class="extra">
              <div class="ui horizontal list">
                <div class="item">{{c.user.username}}</div>
                <div class="item">{{c.createTime | datetime}}</div>
                <div class="item"><i class="icon eye"></i> {{c.readCount}}</div>
                <div class="item"><i class="icon comment outline"></i> {{c.comments.length}}</div>
                <div class="item"><i class="icon heart outline"></i> {{c.likes.length}}</div>
              </div>
              <div class="ui horizontal list text-right">
                <div class="item">
                  <a><i class="icon tag"></i> 设置标签</a>
                </div>
                <div class="item">
                  <a class="delete-btn" @click="showDeleteModal(c.id)"><i class="trash alternate icon"></i> 取消收藏</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui mini favorite-delete modal">
        <i class="icon close"></i>
        <div class="header">取消收藏</div>
        <div class="content">
          确定取消收藏吗?
        </div>
        <div class="actions">
          <div class="ui cancel button">取消</div>
          <div class="ui button red" @click="deleteCollect()">确定</div>
        </div>
      </div>
    </div>
</template>

<script>
  import {GET, POST} from '@/api'

  export default {
    name: 'Favorites',
    data(){
      let collects = []
      const that = this
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      return {
        collects,
        user: userSession,
        deletedId: ''
      }
    },
    methods: {
      showDeleteModal: function (id) {
        this.deletedId = id
        $('.favorite-delete.modal').modal('show')
      },
      deleteCollect: function () {
        const that = this
        GET({
          url: '/api/blog/deleteCollect/' + that.deletedId,
          callback: res => {
            if(res.code === 200) {
              // 删除本地
              const index = that.collects.findIndex(x => x.id === that.deletedId)
              that.collects.splice(index, 1)

            } else {
              layerError(res.message)
            }
            $('.favorite-delete.modal').modal('hide')
          }
        })
      }
    },
    mounted: function () {
      document.title = '收藏夹 - ' + this.user.username + '的个人空间'
      $('.ui.attached.tab').addClass("loading").removeClass("display-block")
      const that = this
      const formdata = new FormData()
      formdata.append("userId", that.user.id)
      formdata.append("pageNo", "1")
      POST({
        url: '/api/blog/listCollect',
        data: formdata,
        callback: res => {
          if(res.code === 200) {
            that.collects = res.data.blogs
          } else {
            layerError(res.message)
          }
          $('.ui.attached.tab').removeClass("loading").addClass("display-block")
        }
      })
    }
  }
</script>

<style scoped>
  .collect .images {
    width: 110px;
    min-width: 110px;
    height: 70px;
    margin-left: 5px;
    border-radius: 5px;
  }

  .line-clamp{
    width: 100%;
    height: 42px;
    color: rgba(0,0,0,.87);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    line-height: 21px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .horizontal.list .item{
    padding: 0!important;
  }
  .extra{
    display: flex!important;
    margin-top: 3px!important;
  }
  .extra .item a{
    color: rgba(0,0,0,.5);
  }
  .extra .item a:hover{
    color: #4183c4;
  }
  .extra .horizontal.list {
    flex: 1;
  }

  .ui.relaxed.divided.items>.item {
    padding: 1em 0;
  }
  .ui.modal{
    height: 200px;
    position: absolute;
    top: 40%;
    margin-left: auto!important;
    margin-right: auto!important;
  }
  .display-block {
    display: block !important;
  }

  .content .top {
    display: flex;
  }
  .content .top .header:not(.ui) {
    font-size: 1.28571429em;
  }
  .content .top a.header {
    color: rgba(0,0,0,.87);
    display: inline-block;
    margin: -.21425em 0 0;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    font-weight: 700;
  }
  .content .top a.header:hover{
    color: #1e70bf;
  }
  .content .top .description {
    margin-top: .6em;
    font-size: 1em;
    line-height: 1.4285em;
    color: rgba(0,0,0,.87);
  }
  .content .top .left{
    flex: 1;
  }
</style>
