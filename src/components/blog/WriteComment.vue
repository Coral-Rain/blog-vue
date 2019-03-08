<template>
    <div>
      <div class="form">
        <textarea id="reply" v-model.trim="content" :placeholder="placeholder"></textarea>
        <div class="control">
          <div class="tools">
            <div class="tool"><i class="fa fa-smile-o"></i> 插入表情</div>
            <div class="tool"># 插入软件</div>
          </div>
          <div class="count">
            <span @click="closeReplyEditor()" class="closed">关闭</span>
            <div class="count">{{content.length}}/1000</div>
          </div>
          <!--<div class="submit">-->
            <a @click="submitReply()" class="btn btn-success submit" role="button" :class="content.length <= 0 ? 'disabled' : ''">回复</a>
          <!--</div>-->
        </div>
      </div>
    </div>
</template>

<script>
  import EventBus from '../../EventBus'
  import {POST} from '../../api'

  export default {
    name: 'WriteComment',
    props: {
      comment: {
        type: Object
      },
      user: {
        type: Object
      }
    },
    data() {
      return {
        content: ''
      }
    },
    methods: {
      closeReplyEditor: function () {
        // this.content = ''
        EventBus.$emit('closeReplyEditor')
      },
      submitReply: function () {
        if(this.content.length <= 0) {
          return
        }
        const formdata = new FormData()
        formdata.append("userId", this.user.id)
        formdata.append("blogId", this.comment.blogId)
        formdata.append("replyTo", this.comment.id)
        formdata.append("comment", this.content)
        const that = this
        POST({
          url: '/api/blog/addComment',
          data: formdata,
          callback: res => {
            if(res.code === 200) {
              that.closeReplyEditor()
              EventBus.$emit("addComment", res.data.comment)
            } else {
              layerError(res.message())
            }
          }
        })
      }
    },
    computed: {
      placeholder: function () {
        return "回复 " + this.comment.user.username + "："
      }
    },
    mounted: function () {
      $('#reply').focus()
    }
  }
</script>

<style scoped>
  .form textarea {
    width: 100%;
    height: 100px;
    border: 1px solid rgba(0,0,0,.2);
    resize: none;
    font-size: 14px;
    padding: 10px 15px;
    margin-top: 10px;
  }

  .form .control {
    padding-top: 10px;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }

  .form .tools {
    text-align: left;
    flex: 1;
  }
  .form .control .count{
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
    color: rgba(0,0,0,.4);
  }
  .closed {
    padding: 10px 10px;
    border-radius: 3px;
  }
  .count .closed:hover {
    cursor: pointer;
    background-color: #eee;
    color: rgba(0,0,0,.5);
  }

  .form .control .tools .tool {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    color: rgba(0,0,0,.4);
  }
  .form .control .tools .tool:hover {
    color: rgba(0,0,0,.87);
  }
  a.submit[role=button]{
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
