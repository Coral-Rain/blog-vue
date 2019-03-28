<template>
  <div>
    <div class="ui grid">
      <div class="row">
        <div class="ten wide computer ten wide tablet sixteen wide mobile column">
          <h2 class="ui header">{{title}}（{{list.length}}）</h2>
        </div>
        <div class="six wide computer six wide tablet sixteen wide mobile column right aligned bottom aligned ta-left-mobile">
          <div class="ui inline dropdown" tabindex="0">
            排序：
            <div class="text">关注时间</div>
            <i class="dropdown icon"></i>
            <div class="menu" tabindex="-1">
              <router-link class="item active selected" :to="{query: {sort: 'follow_time'}}">关注时间</router-link>
              <router-link class="item" :to="{query: {sort: 'recent_login'}}">最近登录</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui hidden divider"></div>
    <div class="ui relaxed divided items attached tab" style="margin-left: -15px;margin-right: 15px">
        <div class="item" v-for="l in list">
          <router-link :to="{name: 'PersonDefault', params: {userId: l.follower}}" class="ui avatar image" target="_blank" style="width: 35px">
            <img :src=avatar(l.avatar) :alt="l.username" :title="l.username">
          </router-link>
          <div class="content">
            <router-link class="header" :to="{name: 'PersonDefault', params: {userId: l.follower}}" target="_blank">{{l.username}}
              <span class="nickname-wrap" v-if="l.remark"> (备注名：<span class="nickname">{{l.remark}}</span>)</span>
            </router-link>
            <div class="meta">积分 <span class="score-count">{{l.score}}</span> | 关注  <span class="following-count">{{l.followCount}}</span> | 粉丝 <span class="followers-count">{{l.fanCount}}</span></div>
            <div class="extra">  {{l.province}} {{l.city}}</div>
          </div>
          <div class="ui image user-actions" v-if="tergetUserId !== l.follower">
            <div class="ui basic mini buttons">
              <a class="ui button set-nickname-btn" v-if="tergetUserId === userId && title === '我的关注'" @click="showEditRemarkModal(l)"><i class="pencil alternate icon"></i>备注</a>
              <a class="ui button send-message-btn" @click="showSendMessageModal(l)"><i class="envelope outline icon"></i>私信</a>
              <a class="ui button follow-btn" :class="hoverFollowed ? 'hover-followed' : ''" v-if="l.follow" @mouseover="hoverFollowed=true" @mouseleave="hoverFollowed=false">
                <i class="heart icon" :class="hoverFollowed ? 'outline' : 'red'"></i>
                <span class="text">{{hoverFollowed ? '取消关注' : '已关注'}}</span>
              </a>
              <a class="ui button follow-btn" v-else @mouseover="hoverFollow=true" @mouseleave="hoverFollow=false">
                <i class="heart icon" :class="hoverFollow ? 'red' : 'outline'"></i><span class="text">关注</span>
              </a>
            </div>
          </div>
        </div>
        <Pagination :total="pager.total" :display="pager.pageSize" :currentPage="pager.pageNo" @pagechange="pagechange" />
      </div>
    <div class="remark-update modal ui tiny">
      <i class="icon close"></i>
      <div class="header">设置备注： {{operationObject.username}}</div>
      <div class="content">
        <form class="ui form">
          <div class="field">
            <label>请输入备注</label>
            <input placeholder="请输入备注" v-model="operationObject.remark" type="text">
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button green" @click="editRemark()">提交</div>
      </div>
    </div>
    <div class="message-send modal ui tiny">
      <i class="icon close"></i>
      <div class="header">发送私信给： {{operationObject.username}}</div>
      <div class="content">
        <form class="ui form">
          <div class="field">
            <textarea v-model="message" placeholder="请输入内容" rows="5" style="resize: none;height: 100px"></textarea>
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
  import Pagination from './Pagination'
  export default {
    name: 'FollowList',
    components: {Pagination},
    data(){
      return {
        hoverFollow: false,
        hoverFollowed: false,
        operationObject: {},
        message: ''
      }
    },
    props: {
      list: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      tergetUserId: {
        type: String,
        required: true
      },
      pager: {
        type: Object,
        required: true
      }
    },
    methods: {
      pagechange: function (currentPage) {
        this.$emit("pagechange", currentPage)
      },
      showSendMessageModal: function(l){
        this.operationObject = JSON.parse(JSON.stringify(l))
        this.message = ''
        $('.message-send.modal').modal('show')
      },
      showEditRemarkModal: function (l) {
        this.operationObject = JSON.parse(JSON.stringify(l))
        $('.remark-update.modal').modal('show')
      },
      editRemark: function () {

      }
    },
    mounted(){
      $('.ui.dropdown').dropdown()
    }
  }
</script>

<style scoped>
  .avatar.image img{
    width: 35px!important;
    height: 35px!important;
    border-radius: 50% !important
  }
  .nickname-wrap{
    font-size: 14px;
    color: #999;
    display: inline-block;
    margin-left: 5px;
    font-weight: 400;
  }

  .nickname-wrap .nickname {
    color: #32aa66;
  }

  .follow-btn {
    width: 103px;
  }

  .display-block{
    display: block;
  }
  .hover-followed {
    padding-left: 10px;
    padding-right: 10px;
  }
  .remark-update.modal{
    height: 230px;
    position: absolute;
    top: 40%;
    margin-left: auto;
    margin-right: auto;
  }
  .message-send.modal{
    height: 270px;
    position: absolute;
    top: 40%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
