<template>
  <div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">博客评论管理 （{{pager.total}}）</h3>
    <div class="ui relaxed divided items attached tab">
      <div class="item text-left" v-for="(c, index) in comments" :key="index">
        <router-link :to="{name: 'PersonDefault', params: {userId: c.userId}}" target="_blank" class="ui avatar image"
                     style="width: 35px">
          <img :src=avatar(c.avatar)>
        </router-link>
        <div class="content">
          <router-link :to="{name: 'PersonDefault', params: {userId: c.userId}}" target="_blank"
                       class="ui header small">
            {{c.username}}
          </router-link>
          <div class="description"><p class="line-clamp">{{circle(c) + c.content}}</p></div>
          <div class="extra user-actions">
            <div class="ui left floated middle aligned pub-date-info">
              {{c.createTime | datetime}} 于
              <router-link :to="{name: 'BlogDetail', params: {blogId: c.blogId}}" target="_blank">{{c.blogTitle}}
              </router-link>
            </div>
            <div class="ui right floated basic mini buttons">
              <div class="ui button delete" @click="showDeleteModal(c)">删除</div>
              <div class="ui button delete-user-all" @click="showDeleteAllModal(c)">删除此人全部评论</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination :total="pager.total" :display="pager.pageSize" :currentPage="pager.pageNo"
                @pagechange="pagechange"></Pagination>
    <div class="comment-delete modal ui mini">
      <i class="icon close"></i>
      <div class="header">删除评论</div>
      <div class="content">
        确定删除此评论吗?
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button red" @click="deleteComment()">确定</div>
      </div>
    </div>
    <div class="comment-delete-all modal ui mini">
      <i class="icon close"></i>
      <div class="header">删除此人全部评论</div>
      <div class="content">
        确定删除此人全部评论吗?
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button red" @click="deleteAllComment()">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {POST} from '../../api'
  import Pagination from '../tools/Pagination'
  import {GET} from '@/api'

  export default {
    name: 'BlogComments',
    components: {Pagination},
    data() {
      let comments = [];
      const that = this;
      let userSession = localStorage.getItem("user");
      if (userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      return {
        comments,
        user: userSession,
        pager: {pageNo: 1, total: 0, pageSize: 5},
        deletedComment: {}
      }
    },
    methods: {
      circle: function (comment) {
        const parent = comment.parent;
        if (parent) {
          return this.circle(parent) + "引用来自\"" + parent.username + "\"的评论 [" + parent.content + "] "
        } else {
          return ""
        }
      },
      getLogs: function () {
        $('.ui.attached.tab').addClass("loading").removeClass("display-block");
        const data = new FormData();
        data.append("userId", this.user.id);
        data.append("pageNo", this.pager.pageNo);
        const that = this;
        POST({
          url: '/api/user/comments',
          data: data,
          callback: res => {
            that.comments = res.data.comments;
            that.pager = res.data.pager;
            $('.ui.attached.tab').removeClass("loading").addClass("display-block");
            $('html,body').animate({scrollTop: '0px'}, 200)
          }
        })
      },
      pagechange: function (currentPage) {
        this.pager.pageNo = currentPage;
        this.getLogs()
      },
      showDeleteModal: function (comment) {
        this.deletedComment = comment;
        $('.comment-delete.modal').modal('show')
      },
      showDeleteAllModal: function (comment) {
        this.deletedComment = comment;
        $('.comment-delete-all.modal').modal('show')
      },
      deleteComment: function () {
        const that = this;
        GET({
          url: '/api/blog/deleteComment/' + that.deletedComment.commentId,
          callback: res => {
            if (res.code === 200) {
              // 删除本地,刷新视图

            } else {
              layerError(res.message)
            }
            $('.comment-delete.modal').modal('hide')
          }
        })
      },
      deleteAllComment: function () {
        const that = this;
        const formdata = new FormData();
        formdata.append("userId", this.user.id);
        formdata.append("deleteUserId", this.deletedComment.userId);
        POST({
          url: '/api/blog/deleteAllComment',
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              //刷新视图

            } else {
              layerError(res.message)
            }
            $('.comment-delete-all.modal').modal('hide')
          }
        })
      }
    },
    mounted: function () {
      document.title = '博客评论管理 - ' + this.user.username + '的个人空间';
      const that = this;

      this.getLogs(this.pager.pageNo, this.pager.pageSize)
    }
  }
</script>

<style scoped>
  .ui.modal {
    height: 200px;
    position: absolute;
    top: 40%;
    margin-left: auto;
    margin-right: auto;
  }

  .avatar.image img {
    width: 35px !important;
    height: 35px !important;
    border-radius: 50% !important
  }

  .display-block {
    display: block !important;
  }

  .line-clamp {
    width: 100%;
    color: rgba(0, 0, 0, .87);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  a:visited {
    text-decoration: none;
  }
</style>
