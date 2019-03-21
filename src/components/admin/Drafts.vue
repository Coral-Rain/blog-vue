<template>
  <div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">草稿箱 （{{drafts.length}}）</h3>
    <div class="ui relaxed divided items list-container">
      <div class="item draft text-left" v-for="draft in drafts">
        <div class="content">
          <router-link :to="{name: 'EditDraft', params: {userId: user.id, blogId: draft.id}}" target="_blank" class="header">
            {{draft.title}}
          </router-link>
          <div class="description">
            <p class="line-clamp">{{draft.content}}</p>
          </div>
          <div class="extra">
            <div class="ui horizontal list">
              <div class="item">{{draft.updateTime | datetime}}</div>
              <div class="item">
                <router-link :to="{name: 'EditDraft', params: {userId: user.id, blogId: draft.id}}"><i class="edit icon"></i> 编辑</router-link>
              </div>
              <div class="item">
                <a class="delete-btn" @click="showDeleteModal(draft.id)"><i class="trash alternate icon"></i> 删除</a>
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasImg(draft.content)" class="images">
          <router-link target="_blank" class="ui small image" :to="{name: 'BlogDetail', params: {userId: blog.user.id, blogId: blog.id}}">
            <img :src="imgSrc(draft.content)" style="width: 100%; height: auto;" alt="">
          </router-link>
        </div>
      </div>
    </div>
    <div class="ui mini modal">
      <i class="icon close"></i>
      <div class="header">删除草稿</div>
      <div class="content">
        确定删除此草稿吗?
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button red" @click="deleteDraft()">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {POST} from '@/api'
  import marked from 'marked'

  export default {
    name: 'Drafts',
    data(){
      let drafts = []
      const that = this
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      //获取草稿列表
      const formdata = new FormData()
      formdata.append("userId", userSession.id)
      formdata.append("pageNo", "1")

      POST({
        url: '/api/blog/listDrafts',
        data: formdata,
        callback: res => {
          if(res.code === 200){
            that.drafts = res.data.blogs

          }
        }
      })

      return {
        user: userSession,
        drafts,
        deleteId: '',
        pageNo: 1
      }
    },
    methods: {
      showDeleteModal: function (blogId) {
        this.deleteId = blogId
        $('.mini.modal').modal('show')
      },
      deleteDraft: function () {

      }
    },
    computed: {
    hasImg: function () {
      return function (content) {
        const html =  marked(content, {sanitize: true})
        const imgs = $(html).find('img')
        return imgs.length > 0
      }
    },
    imgSrc: function () {
      return function (content) {
        const html =  marked(content, {sanitize: true})
        const imgs = $(html).find('img')
        console.log(imgs[0].src)
        return imgs[0].src
      }
    }
    }
  }
</script>

<style scoped>
  .draft .image {
    width: 110px;
    min-width: 110px;
    height: 70px;
    margin-left: 5px;
    border-radius: 5px;
  }

  .line-clamp{
    width: 100%;
    color: rgba(0,0,0,.87);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .extra .item a{
    color: rgba(0,0,0,.5);
  }
  .extra .item a:hover{
    color: #4183c4;
  }
  .ui.modal{
    height: 200px;
    position: absolute;
    top: 40%;
    margin-left: auto;
    margin-right: auto;
  }

</style>
