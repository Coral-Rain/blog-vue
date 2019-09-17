<template>
  <div class="follow-wrap">
    <div class="ui grid">
      <div class="ten wide computer ten wide tablet sixteen wide mobile column">
        <h2 class="ui header">{{title}}（{{list.length}}）</h2>
      </div>
      <div
        class="six wide computer six wide tablet sixteen wide mobile column right aligned bottom aligned ta-left-mobile">
        <div class="ui inline dropdown" tabindex="0">
          排序：
          <div class="text">{{this.$route.query.sort === 'recent_login' ? '最近登录' : '关注时间'}}</div>
          <i class="dropdown icon"></i>
          <div class="menu" tabindex="-1">
            <router-link class="item"
                         :class="!this.$route.query.sort || this.$route.query.sort === 'follow_time' ? 'selected active' : ''"
                         :to="{query: {sort: 'follow_time'}}">关注时间
            </router-link>
            <router-link class="item" :class="this.$route.query.sort === 'recent_login' ? 'selected active' : ''"
                         :to="{query: {sort: 'recent_login'}}">最近登录
            </router-link>
          </div>
        </div>
      </div>

    </div>
    <div class="ui hidden divider"></div>
    <div class="ui relaxed divided items attached tab">
      <div class="item" v-for="(l, index) in list" :key="index">
        <router-link :to="{name: 'PersonDefault', params: {userId: l.follower}}" class="ui avatar image" target="_blank"
                     style="width: 35px">
          <img :src=avatar(l.avatar) :alt="l.username" :title="l.username">
        </router-link>
        <div class="content">
          <router-link class="header" :to="{name: 'PersonDefault', params: {userId: l.follower}}" target="_blank">
            {{l.username}}
            <span class="nickname-wrap" v-if="l.remark"> (备注名：<span class="nickname">{{l.remark}}</span>)</span>
          </router-link>
          <div class="meta">积分 <span class="score-count">{{l.score}}</span> | 关注 <span class="following-count">{{l.followCount}}</span>
            | 粉丝 <span class="followers-count">{{l.fanCount}}</span></div>
          <div class="extra"> {{l.province}} {{l.city}}</div>
        </div>
        <div class="ui image user-actions" v-if="tergetUserId !== l.follower">
          <div class="ui basic mini buttons">
            <a class="ui button set-nickname-btn" v-if="tergetUserId === userId && title === '我的关注'"
               @click="showEditRemarkModal(l)"><i class="pencil alternate icon"></i>备注</a>
            <a class="ui button send-message-btn" @click="showSendMessageModal(l)"><i class="envelope outline icon"></i>私信</a>
            <a class="ui button follow-btn" @click="cancleFollow(l)" v-if="l.isFollow" @mouseenter="overFollowed($event)"
               @mouseleave="leaveFollowed($event)">
              <i class="heart icon red"></i>
              <span class="text">已关注</span>
            </a>
            <a class="ui button follow-btn" v-else @click="addFollow(l)" @mouseenter="overFollow($event)"
               @mouseleave="leaveFollow($event)">
              <i class="fa fa-heart"></i>
              <span class="text">关注</span>
            </a>
          </div>
        </div>
      </div>
      <Pagination :total="pager.total" :display="pager.pageSize" :currentPage="pager.pageNo" @pagechange="pagechange"/>
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
    <!--<div class="message-send modal ui tiny">-->
    <!--<i class="icon close"></i>-->
    <!--<div class="header">发送私信给： {{operationObject.username}}</div>-->
    <!--<div class="content">-->
    <!--<form class="ui form">-->
    <!--<div class="field">-->
    <!--<textarea v-model="message" placeholder="请输入内容" rows="5" style="resize: none;height: 100px"></textarea>-->
    <!--</div>-->
    <!--</form>-->
    <!--</div>-->
    <!--<div class="actions">-->
    <!--<div class="ui cancel button">取消</div>-->
    <!--<div class="ui positive right labeled icon button" @click="sendMessage()">发送<i class="send icon"></i></div>-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import Pagination from './Pagination'
  import {GET, POST} from '@/api'
  import EventBus from '@/EventBus'

  export default {
    name: 'FollowList',
    components: {Pagination},
    data() {
      return {
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
      overFollowed: function (event) {
        // console.log($(event.srcElement))
        $(event.srcElement).addClass('hover-followed');
        $(event.srcElement).find('i.icon.heart').removeClass('red').addClass('outline');
        $(event.srcElement).find('span.text').text("取消关注")
      },
      leaveFollowed: function (event) {
        // console.log(event.srcElement)
        $(event.srcElement).removeClass('hover-followed');
        $(event.srcElement).find('i').addClass('red').removeClass('outline');
        $(event.srcElement).find('span.text').text("已关注")
      },
      overFollow: function (event) {
        $(event.srcElement).find('i.icon.heart').removeClass('outline').addClass('red')
      },
      leaveFollow: function (event) {
        $(event.srcElement).find('i').addClass('outline').removeClass('red')
      },
      showSendMessageModal: function (l) {
        if (this.tergetUserId !== '0') {
          EventBus.$emit("sendMessage", l.follower, l.username)
        } else {
          layerError("请登录后操作")
        }
      },
      showEditRemarkModal: function (l) {
        this.operationObject = JSON.parse(JSON.stringify(l));
        $('.remark-update.modal').modal('show')
      },
      editRemark: function () {
        const that = this;
        const formdata = new FormData();
        formdata.append("userId", this.operationObject.follower);
        formdata.append("follower", this.tergetUserId);
        formdata.append("remark", this.operationObject.remark);
        POST({
          url: "/api/user/follow/update",
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              $('.remark-update.modal').modal('hide');
              that.list.filter(x => x.userId === that.operationObject.userId && x.follower === that.operationObject.follower)[0].remark = that.operationObject.remark
            } else {
              layerError(res.message)
            }
          }
        })
      },
      cancleFollow: function (follow) {
        const formdata = new FormData();
        formdata.append("userId", follow.follower);
        formdata.append("follower", this.tergetUserId);
        POST({
          url: "/api/user/follow/delete",
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              follow.isFollow = false
            } else {
              layerError(res.message)
            }
          }
        })
      },
      addFollow: function (follow) {
        if (this.tergetUserId !== '0') {
          const formdata = new FormData();
          formdata.append("userId", follow.follower);
          formdata.append("follower", this.tergetUserId);
          POST({
            url: '/api/user/follow/add',
            data: formdata,
            callback: res => {
              if (res.code === 200) {
                follow.isFollow = true
              } else {
                layerError(res.message)
              }
            }
          })
        } else {
          layerError("请登录后操作")
        }
      }
    },
    mounted() {
      $('.ui.dropdown').dropdown()
    }
  }
</script>

<style scoped>
  .avatar.image img {
    width: 35px !important;
    height: 35px !important;
    border-radius: 50% !important
  }

  .nickname-wrap {
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

  .display-block {
    display: block !important;
  }

  .hover-followed {
    padding-left: 10px;
    padding-right: 10px;
  }

  .remark-update.modal {
    height: 230px;
    position: absolute;
    top: 40%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
