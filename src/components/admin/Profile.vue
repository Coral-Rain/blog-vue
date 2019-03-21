<template>
    <div>
      <TabPage :activeId="activeId" :tabs="tabs" />
      <div v-if="targetTab.toLowerCase() === 'baseinfo'" class="ui basic padded segment">
        <form class="ui form baseinfo">
          <div class="ui grid stackable">
            <div class="text-left twelve wide column">
              <div class="field">
                <label>昵称</label>
                <div class="two fields">
                  <div class="eight wide field">
                    <input type="text" name="username" placeholder="输入昵称" maxlength="20" v-model="user.username">
                  </div>
                  <div class="field">
                    <span class="tip">2~20个字符</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <label>性别</label>
                <div class="fields inline disabled">
                  <div class="field">
                    <div class="ui radio checkbox">
                      <input type="radio" :checked="user.male ? 'checked' : ''" value="0" name="male" class="hidden">
                      <label>男</label>
                    </div>
                  </div>
                  <div class="field">
                    <div class="ui radio checkbox">
                      <input type="radio" value="1" :checked="user.male ? '' : 'checked'" name="male" class="hidden">
                      <label>女</label>
                    </div>
                  </div>
                  <div class="field">
                    <span class="tip">性别不可修改</span>
                  </div>
                </div>
              </div>
              <div class="four wide field">
                <label>出生日期</label>
                <div class="ui calendar birthday">
                  <div class="ui input left icon">
                    <i class="calendar alternate outline icon"></i>
                    <input type="text" name="birthday" placeholder="请选择出生日期" v-model="user.birthday">
                  </div>
                </div>
              </div>
              <div class="field">
                <label>居住地区</label>
                <div class="fields">
                  <div class="four wide field">
                    <select class="ui fluid dropdown" v-model="user.province" @change="changeProvince()" name="province">
                      <option value="">请选择省份</option>
                      <option v-for="p in provinces" :value="p.id">{{p.province}}</option>
                    </select>
                  </div>
                  <div class="four wide field">
                    <select class="ui fluid dropdown" id="city" v-model="user.city" name="city">
                      <option value="">请选择地区</option>
                      <option v-for="c in cities" :value="c.id">{{c.city}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <label>
                  个性签名
                  <span class="tip">&nbsp;&nbsp;&nbsp;&nbsp;(不超过100字)</span>
                </label>
                <div class="fields">
                  <div class="thirteen wide field">
                    <textarea placeholder="请输入个性签名" maxlength="100" v-model="user.signature" rows="3"></textarea>
                  </div>
                </div>
              </div>
              <div class="submit ui large button teal">
                保存修改
              </div>
            </div>
            <div class="four wide column">
              <div class="field">
                <label>头像</label>
                <div class="avatar-wrap" >
                  <div class="ui small circular image bordered dimmable">
                    <div class="ui dimmer upload-btn-wrap transition hidden">
                      <div class="content" @click="showUploadAvatar()">
                        <div class="ui small primary button upload-avatar-btn">上传头像</div>
                      </div>
                    </div>
                    <div class="field">
                      <img class="" src="/static/avatar.png" alt="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div v-if="targetTab.toLowerCase() === 'contactinfo'" class="ui basic padded segment">
        <form class="ui text-left form contactinfo">
          <div class="four wide field">
            <label>联系电话</label>
            <input type="text" v-model="user.mobile" name="mobile" placeholder="请输入联系电话" maxlength="11">
          </div>
          <div class="inline field">
              <div class="item" :class="user.openMobile ? 'checked' : ''" @click="user.openMobile = !user.openMobile">
                <label class="item-label">对外公开</label>
              </div>
          </div>
          <div class="six wide field">
            <label>邮箱地址</label>
            <input type="text" v-model="user.email" name="email" placeholder="请输入邮箱地址" maxlength="100">
          </div>
          <div class="inline field">
            <div class="item" :class="user.openEmail ? 'checked' : ''" @click="user.openEmail = !user.openEmail">
              <label class="item-label">对外公开</label>
            </div>
          </div>
          <div class="four wide field">
            <label>QQ</label>
            <input type="text" v-model="user.qq" name="qq" placeholder="请输入QQ" maxlength="12">
          </div>
          <div class="six wide field">
            <label>我的其它网站</label>
            <input type="text" v-model="user.website" name="website" placeholder="请输入网址" maxlength="100">
          </div>
          <div class="submit ui large button teal">
            保存修改
          </div>
        </form>
      </div>
      <div v-if="targetTab.toLowerCase() === 'skillinfo'" class="skillinfo ui basic padded segment">
        <form class="ui form"></form>
      </div>
    </div>
</template>

<script>
  import TabPage from '../TabPage'
  import {GET, POST} from '@/api'
  import Avatar from '@/components/Avatar'
  import EventBus from '@/EventBus'
  export default {
    name: 'Profile',
    components: {Avatar, TabPage},
    data(){

      const that = this
      let timeSetting = {
        type: 'date',//这里可自定义，参照github上的说明
        formatter: { // 自定义日期的格式
          date: function (date, settings) {
            if (!date) return '';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;

            return year + '-' + month + '-' + day;
          }
        },
        ampm: false,
        disableMinute:true,
        text: {
          days: ['日', '一', '二', '三', '四', '五', '六'],
          months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          today: '今天',
          now: '当前',
        },
        maxDate: new Date(),
        onChange: function (date, text, mode) {
          if(that.user.birthday !== text){
            that.user.birthday = text
          }
        }
      };
      const tabs = [
        {id: 1, to: {query: {tab: 'baseInfo'}}, name: '基本资料'},
        {id: 2, to: {query: {tab: 'contactInfo'}}, name: '联系信息'},
        {id: 3, to: {query: {tab: 'skillInfo'}}, name: 'IT职业技能'}
      ]

      let targetTab = this.$route.query.tab
      let activeId = 1
      const matched = tabs.filter(x => x.to.query.tab === targetTab)

      if(!targetTab || matched.length === 0) {
        targetTab = 'baseinfo'
      }
      if(matched.length > 0) {
        activeId = matched[0].id
      }

      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }
      GET({
        url: '/api/city/province',
        callback: res => {
          if(res.code === 200){
            that.provinces = res.data.provinces
          }
        }
      })

      if(userSession && userSession.province !== 0){
        GET({
          url: '/api/city/city/' + userSession.province,
          callback: res => {
            if(res.code === 200){
              that.cities = res.data.cities
            }
          }
        })
      }

      return {
        tabs,
        targetTab: targetTab,
        activeId,
        // username: userSession.username,
        // male: userSession.male,
        // birthday: userSession.birthday,
        // province: userSession.province,
        // city: userSession.city,
        // signature: userSession.signature,
        user: userSession,
        provinces: [],
        cities: [],
        timeSetting,
        uploadAvatar: false
      }
    },
    mounted: function () {
      document.title = '修改个人资料 - ' + this.user.username + '的个人空间'
      this.init()
      const that = this
      EventBus.$on("closeAvatar", function () {
        let userSession = localStorage.getItem("user")
        if(userSession) {
          // console.log(userSession)
          userSession = JSON.parse(userSession)
        }
        that.user = userSession
      })
    },
    methods: {
      changeProvince: function () {
        console.log("change province: ", this.user.province)
        this.queryCity(this.user.province)
      },
      queryCity: function (provinceId) {
        const that = this
        that.cities = []
        GET({
          url: '/api/city/city/' + provinceId,
          callback: res => {
            if(res.code === 200){
              that.cities = res.data.cities
              that.user.city = that.cities[0].id
            }
          }
        })
      },
      // showUploadAvatarBtn: function () {
      //   $('.upload-btn-wrap').removeClass('hidden').addClass('active')
      // },
      // hideUploadAvatarBtn: function () {
      //   $('.upload-btn-wrap').removeClass('active').removeClass('visible').addClass('hidden')
      // },
      submitBaseInfo: function () {
        console.log('submitBaseInfo')
        // this.user.birthday = $('input[name=birthday]').val()
        const that = this
        const formdata = new FormData()
        formdata.append('username', this.user.username)
        formdata.append('birthday', this.user.birthday)
        formdata.append('province', this.user.province)
        formdata.append('city', this.user.city)
        formdata.append('signature', this.user.signature)

        POST({
          url: '/api/user/updateBaseInfo',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              localStorage.setItem('user', JSON.stringify(res.data.user))
              layerMsg("成功修改基础资料")
            } else {
              layerError(res.message)
            }
          }
        })
      },
      submitContactInfo:function () {
        const that = this
        const formdata = new FormData()
        formdata.append('mobile', this.user.mobile)
        formdata.append('email', this.user.email)
        formdata.append('qq', this.user.qq)
        formdata.append('website', this.user.website)
        formdata.append('openMobile', this.user.openMobile)
        formdata.append('openEmail', this.user.openEmail)

        POST({
          url: '/api/user/updateContactInfo',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              localStorage.setItem('user', JSON.stringify(res.data.user))
              layerMsg("成功修改联系信息")
            } else {
              layerError(res.message)
            }
          }
        })
      },
      init: function () {
        const that = this
        $(document).ready(function () {
          $('.ui.dropdown').dropdown()
          $('.birthday').calendar(that.timeSetting)
          $('.avatar-wrap .image').dimmer({
            on: 'hover'
          })
          // baseinfo 表单验证
          $('.ui.form.baseinfo').form({
            inline: true,
            on: 'blur',
            fields: {
              username: {
                identifier: 'username',
                rules: [
                  {
                    type: 'empty',
                    prompt: '昵称不能为空'
                  },
                  {
                    type: 'minLength[2]',
                    prompt: '昵称长度不能少于{ruleValue}个字符'
                  },
                  {
                    type: 'maxLength[20]',
                    prompt: '昵称长度不能多于{ruleValue}个字符'
                  }
                ]
              }
            },
            onSuccess: function (e) {
              e.preventDefault()
              that.submitBaseInfo()
            }
          })

          $('.ui.form.contactinfo').form({
            inline: true,
            on: 'blur',
            fields: {
              mobile: {
                identifier: 'mobile',
                optional: true,
                rules: [
                  {
                    type: 'regExp[/^1[3456789][0-9]{9}$/]',
                    prompt: '请输入正确的联系电话'
                  }
                ]
              },
              email: {
                identifier: 'email',
                optional: true,
                rules: [
                  {
                    type: 'email',
                    prompt: '请输入正确的邮箱地址'
                  }
                ]
              },
              qq: {
                identifier: 'qq',
                optional: true,
                rules: [
                  {
                    type: 'number',
                    prompt: '请输入正确的QQ'
                  }
                ]
              },
              website: {
                identifier: 'website',
                optional: true,
                rules: [
                  {
                    type: 'url',
                    prompt: '请输入正确的网址'
                  }
                ]
              }
            },
            onSuccess: function (e) {
              e.preventDefault()
              that.submitContactInfo()
            }
          })
        })
      },
      showUploadAvatar: function () {
        this.uploadAvatar = true
        EventBus.$emit("showAvatar")
      }
    },
    watch: {
      $route(){
        let targetTab = this.$route.query.tab
        const matched = this.tabs.filter(x => x.to.query.tab === targetTab)

        if(!targetTab || matched.length === 0) {
          targetTab = 'baseinfo'
        }
        if(matched.length > 0) {
          this.activeId = matched[0].id
        } else {
          this.activeId = 1
        }
        let updateTab = false
        if(this.targetTab !== targetTab){
          this.targetTab = targetTab
          updateTab = true
        }
        if(updateTab){
          this.init()
        }
      }
    }
  }
</script>

<style scoped>
  .tip{
    font-weight: 400;
    color: rgba(0,0,0,.5);
    font-size: 13px;
    line-height: 38px;
  }
  .avatar-wrap {
    margin: 0 auto!important;
    cursor: pointer;
  }
  .avatar-wrap .dimmer {
    background-color: rgba(0,0,0,.1)!important;
  }

  .item {
    display: inline-block;
    position: relative;
  }
  .item:before{
    position: absolute;
    top: 0;
    left: 0;
    width: 17px;
    height: 17px;
    content: '';
    background: #fff;
    border-radius: .21428571rem;
    -webkit-transition: border .1s ease,opacity .1s ease,-webkit-transform .1s ease,-webkit-box-shadow .1s ease;
    transition: border .1s ease,opacity .1s ease,transform .1s ease,box-shadow .1s ease,-webkit-transform .1s ease,-webkit-box-shadow .1s ease;
    border: 1px solid #d4d4d5;
  }
  .item.checked:before{
    background: #1cab43;
    border-color: #1cab43;
    content: '\e800';
    font-family: Checkbox;
    opacity: 1;
    color: white;
  }
  .item label {
    width: auto;
    height: 17px;
    line-height: 17px;
    padding-left: 27px;
    font-weight: normal;
    cursor: pointer;
    color: rgba(0,0,0,.87);
  }
</style>
