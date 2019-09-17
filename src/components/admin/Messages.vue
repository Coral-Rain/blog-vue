<template>
  <div>
    <div class="text-left">
      <h3 style="display: inline-block">
        {{'与 ' + data.friend.username + ' 的私信（共' + data.pager.total + '条）'}}
        <span class="ui button positive" @click="showReplyModal(data.friend.id, data.friend.username)">发私信</span>
      </h3>
      <router-link class="pull-right" :to="{name: 'AdminInboxDefault'}">
        <i class="icon angle left"></i>返回消息中心
      </router-link>
    </div>
    <div>
      <div class="ui attached tab display-block">
        <div class="ui divided items message-wrap">
          <!--          循环创建节点-->
          <div class="item" v-for="(m, index) in data.messages" :key="index">
            <router-link :to="{name: 'PersonDefault', params: {userId: m.sender}}" target="_blank"
                         class="ui avatar image"
                         style="width: 35px">
              <img :src="avatar(m.avatar)" :alt="m.senderName">
            </router-link>
            <div class="content text-left">
              <router-link :to="{name: 'PersonDefault', params: {userId: m.sender}}" target="_blank"
                           class="ui header small">
                {{m.senderName}}
              </router-link>
              <div class="description"><p class="line-clamp">{{m.content | delHTMLTag}}</p></div>
              <div class="extra user-actions">
                <div class="ui horizontal list" style="width: 100%">
                  <div class="item">
                    {{m.createTime | datetime}}
                  </div>
                  <div class="item pointer" @click="showDetailModal(m)">
                    <span class="btn-detail" style="position: relative">查看详情<i v-if="m.status === 0 && m.receiver === userSession.id"></i></span>
                  </div>
                  <div v-if="m.receiver === userSession.id" class="item pointer pull-right" @click="showReplyModal(m.sender, m.senderName)">
                    <span>
                      <i class="fa fa-reply"></i>回复
                    </span>
                  </div>
                  <div class="item pointer pull-right" @click="showDeleteModal()">
                    <span>
                      <i class="fa fa-trash"></i>删除
                    </span>
                  </div>
                  <div v-if="m.receiver === userSession.id" class="item pointer pull-right" @click="showBanModal()">
                    <span>
                      <i class="fa fa-ban"></i>举报
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination :total="data.pager.total" :display="data.pager.pageSize" :currentPage="data.pager.pageNo" @pagechange="pagechange"/>
    <!--Modals-->
    <div class="ui mini message-delete modal">
      <i class="icon close"></i>
      <div class="header">删除私信</div>
      <div class="content">
        确定删除此私信吗?
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button red" @click="deleteMessage()">确定</div>
      </div>
    </div>
    <div class="ui mini message-detail modal editor">
      <i class="icon close"></i>
      <div class="header">{{'来自 ' + detailMessage.senderName + ' 的私信'}}</div>
      <div v-html="detailMessage.content" class="content">
        <!--        {{detailMessage.content}}-->
      </div>
      <div class="actions">
        <div class="ui cancel button">关闭</div>
        <div class="ui positive right button" @click="showReplyModal(detailMessage.sender, detailMessage.senderName)">回复</div>
      </div>
    </div>
    <div class="ui mini user-ban modal">
      <i class="icon close"></i>
      <div class="header">开发中的功能</div>
      <div class="content">
        该功能正在开发中，请耐心等待
      </div>
      <div class="actions">
        <div class="ui cancel button">确定</div>
      </div>
    </div>
    <div class="message-send modal ui tiny editor">
      <i class="icon close"></i>
      <div class="header">发送私信给： {{send.username}}</div>
      <div class="content">
        <form class="ui form">
          <div class="field">
            <!--            textarea替换为富文本编辑器-->
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
  import {GET, POST} from "../../api";
  import HTMLEditor from "../tools/HTMLEditor";
  import Pagination from '../tools/Pagination'

  export default {
    name: "Messages",
    components: {HTMLEditor, Pagination},
    data() {
      let messages = [];
      let friend = {};
      const that = this;
      let userSession = localStorage.getItem("user");
      if (userSession) {
        userSession = JSON.parse(userSession)
      }
      let otherUserId = this.$route.query.user;
      GET({
        url: '/api/message/findByUser?userId=' + otherUserId + '&pageNo=1',
        callback: res => {
          if (res.code === 200) {
            that.data = res.data;
          } else {
            layerError(res.message);
          }
        }
      });

      return {
        userSession: userSession,
        data: {
          friend,
          messages,
          pager: {pageNo: 1, pageSize: 5, total: 0}
        },
        detailMessage: {senderName: ''},
        send: {id: 0, message: '', username: ''}
      }
    },
    methods: {
      showReplyModal(userId, username){
        $('.modal').modal("hide");
        this.send.id = userId;
        this.send.message = '';
        this.$refs.editor.clear();
        this.send.username = username;
        $('.message-send.modal').modal('show');
        this.$refs.editor.init();
      },
      showDeleteModal(){
        $('.message-delete.modal').modal('show')
      },
      showBanModal(){
        $('.user-ban.modal').modal('show')
      },
      showDetailModal(message){
        this.detailMessage = message;
        // 发送已读接口?
        if(this.detailMessage.status === 0 && this.detailMessage.receiver === this.userSession.id){
          this.readMessage(this.detailMessage.id);
        }
        $('.message-detail.modal').modal('show')
      },
      readMessage(messageId){
        const that = this;
        GET({
          url: '/api/message/read?messageId=' + messageId,
          callback: res => {
            if(res.code === 200){
              that.data.messages.forEach(m => {
                if(m.id === messageId){
                  m.status = 2;
                }
              })
            }
          }
        })
      },
      sendMessage(){
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
      },
      deleteMessage(){
        const that = this;
        GET({
          url: '/api/message/delete?messageId=' + this.deleteId,
          callback: res => {
            if(res.code === 200){
              layerMsg("成功删除消息!");
              that.getMessage();
            } else {
              layerError(res.message);
            }
          }
        })
      },
      getMessage() {
        $('.ui.attached.tab').addClass("loading").removeClass("display-block");
        const that = this;
        GET({
          url: '/api/message/findByUser?userId=' + that.data.friend.id + '&pageNo=' + that.data.pager.pageNo,
          callback: res => {
            if (res.code === 200) {
              that.data = res.data;
            } else {
              layerError(res.message);
            }
            $('.ui.attached.tab').addClass("display-block").removeClass("loading");
          }
        });

      },
      pagechange(currentPage) {
        this.data.pager.pageNo = currentPage;
        this.getMessage()
      }
    },
    watch:{
      data(){
        const messageId = this.$route.query.detail;
        const that = this;
        if(messageId){
          // 查询messageDetail
          GET({
            url: '/api/message/detail?messageId=' + messageId,
            callback: res => {
              if(res.code === 200){
                that.detailMessage = res.data.message;
                if(that.detailMessage.status === 0 && that.detailMessage.receiver === that.userSession.id){
                  // 设置为已读
                  that.readMessage(messageId);
                }
                $('.message-detail.modal').modal('show');
              }
            }
          });
        }
      }
    }
  }
</script>

<style scoped>
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

  .pointer {
    cursor: pointer;
  }

  .pointer:hover {
    color: #0d71bb;
  }

  .pointer .fa {
    margin-right: 5px;
  }

  .ui.modal {
    height: 200px;
    position: absolute;
    margin: auto !important;
  }

  .editor.modal {
    height: 100%;
    width: 80%;
    position: absolute;
    margin: auto !important;
  }

  .editor.modal .content {
    height: calc(100% - 130px);
    overflow-y: auto;
  }
  .btn-detail i{
    display:block;
    background: #ff3822;
    border-radius:50%;
    width:4px;
    height:4px;
    top: 1px;
    right:-4px;
    position:absolute;
  }
</style>
