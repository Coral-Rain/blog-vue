<template>
    <div>
      <div v-for="comment in comments" class="comment">
        <router-link class="avatar" :to="{name: 'PersonDefault', params: {userId: comment.user.id}}">
          <img :src="avatar(comment.user.avatar)" alt="">
        </router-link>
        <div class="main text-left">
          <div class="head">
            <router-link :to="{name: 'PersonDefault', params: {userId: comment.user.id}}">
              {{comment.user.username}}
            </router-link>
            <div class="time">
              {{comment.createTime | datetime}}
            </div>
          </div>
          <CommentReply :comment="comment.parent" v-if="comment.replyTo !== '0'"/>
          <div class="content">
            {{comment.comment}}
          </div>
          <div class="control">
            <div v-if="user" @click="showCommentEditor(comment.id)"><i class="fa fa-comment-o"></i> 回复</div>
            <div><i class="fa fa-ban"></i> 举报</div>
          </div>
          <WriteComment v-if="comment.id === replyCommentId" :user="user" :comment="comment" />
        </div>

      </div>
    </div>
</template>

<script>
  import CommentReply from './CommentReply'
  import WriteComment from './WriteComment'
  import EventBus from '../../EventBus'
  export default {
    name: 'Comment',
    components: {WriteComment, CommentReply},
    props: {
      comments: {
        type: Array,
        required: true
      },
      user: {
        type: Object
      }
    },
    data(){
      return {
        reply: false,
        replyCommentId: 0
      }
    },
    methods: {
      showCommentEditor: function (id) {
        if(this.replyCommentId === id){
          $('#reply').focus()
        }
        this.replyCommentId = id
      }
    },
    mounted: function () {
      const that = this
      EventBus.$on('closeReplyEditor', function () {
        that.replyCommentId = 0
      })
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }
  .comment {
    padding-top: 0;
    padding-bottom: 10px;
  }

  .comment .avatar {
    float: left;
  }

  .comment .avatar img{
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .main {
    margin-left: 45px;
    color: rgba(0,0,0,.87);
  }

  .main .head a {
    font-size: 14px;
    font-weight: 700;
    color: rgba(0,0,0,.87);
  }
  .main .head a:hover{
    color: #4183c4;
  }

  .main .head .time {
    margin-left: 10px;
    color: rgba(0,0,0,.4);
    display: inline-block;
    font-size: 13px;
  }

  .content {
    padding: 10px 0;
  }

  .main .control div{
    display: inline-block;
    margin-right: 10px;
    color: rgba(0,0,0,.4);
    cursor: pointer;
  }
  .main .control div:hover {
    color: rgba(0,0,0,.87);
  }
</style>
