<template>
  <!--  多TAB页(全部消息/未读消息/系统消息/私信)-->
  <div>
    <div>
      <div class="ui green pointing secondary massive menu">
        <router-link :to="{name: 'AdminInboxDefault', params: {userId: userSession.id}, query: {tab: 'all'}}" class="message-tab item" :class="{'active': !tab || tab === 'all'}">全部消息</router-link>
        <router-link :to="{name: 'AdminInboxDefault', params: {userId: userSession.id}, query: {tab: 'unread'}}" class="message-tab item" :class="{'active': tab === 'unread'}">未读消息</router-link>
        <router-link :to="{name: 'AdminInboxDefault', params: {userId: userSession.id}, query: {tab: 'private'}}" class="message-tab item" :class="{'active': tab === 'private'}">私信</router-link>
        <router-link :to="{name: 'AdminInboxDefault', params: {userId: userSession.id}, query: {tab: 'system'}}" class="message-tab item" :class="{'active': tab === 'system'}">系统消息</router-link>
      </div>
      <div class="ui attached tab display-block">
        <div class="ui divided items message-wrap">
          <!--          循环创建节点-->
          <div class="item" v-for="(m, index) in messages" :key="index">
            <router-link :to="{name: 'PersonDefault', params: {userId: m.sender}}" target="_blank" class="ui avatar image"
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
                  <router-link class="item pointer" :to="{name: 'InboxMessages', params: {userId: userSession.id}, query: {user: m.sender}}">
                    查看此人的全部消息
                  </router-link>
                  <div class="item pointer pull-right" @click="showReplyModal(m.sender, m.senderName)">
                    <span>
                      <i class="fa fa-reply"></i>回复
                    </span>
                  </div>
                  <div class="item pointer pull-right" @click="showDeleteModal()">
                    <span>
                      <i class="fa fa-trash"></i>删除
                    </span>
                  </div>
                  <div class="item pointer pull-right" @click="showBanModal()">
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
    <Pagination :total="pager.total" :display="pager.pageSize" :currentPage="pager.pageNo" @pagechange="pagechange"/>
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
  import Pagination from "../tools/Pagination";
  import {GET, POST} from "../../api";
  import HTMLEditor from "../tools/HTMLEditor";
  import EventBus from "../../EventBus";
  // 字数统计插件
  export default {
    name: "InboxDefault",
    components: {HTMLEditor, Pagination},
    data() {
      let messages = [];
      let userSession = localStorage.getItem("user");
      if (userSession) {
        userSession = JSON.parse(userSession)
      }
      return {
        userSession: userSession,
        userId: this.$route.params.userId,
        pager: {pageNo: 1, pageSize: 5, total: 0},
        tab: this.$route.query.tab,
        messages,
        send: {id: '0', message: '', username: ''},
        detailMessage: {senderName: ''},
        deleteId: 0
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
        EventBus.$emit('initEditor');
      },
      showDeleteModal(deleteId){
        this.deleteId = deleteId;
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
      readMessage(messageId){
        const that = this;
        GET({
          url: '/api/message/read?messageId=' + messageId,
          callback: res => {
            if(res.code === 200){
              that.messages.forEach(m => {
                if(m.id === messageId){
                  m.status = 2;
                }
              })
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
        const formdata = new FormData();
        formdata.append("pageNo", this.pager.pageNo);
        formdata.append("receiver", this.userSession.id);
        if(this.tab){
          if(this.tab === 'unread') {
            formdata.append("status", "0");
          } else if(this.tab === 'private') {
            formdata.append("type", "2");
          } else if(this.tab === 'system') {
            formdata.append("type", "1");
          }
        }
        POST({
          url: '/api/message/list',
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              that.messages = res.data.messages;
              that.pager = res.data.pager;
            } else {
              layerError(res.message)
            }
            $('.ui.attached.tab').removeClass("loading").addClass("display-block")
          }
        })

      },
      pagechange(currentPage) {
        this.pager.pageNo = currentPage;
        this.getMessage()
      }
    },
    mounted() {
      this.getMessage();
    },
    watch: {
      $route(){
        this.tab = this.$route.query.tab;
      },
      tab(){
        this.getMessage()
      }
    }
  }
</script>

<style scoped>

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
    margin: auto!important;
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
