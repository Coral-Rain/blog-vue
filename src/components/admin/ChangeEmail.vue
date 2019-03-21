<template>
  <div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">修改登录邮箱</h3>
    <div class="ui basic padded segment" style="margin-top: 0">
      <form class="ui form text-left">
        <div class="six wide field">
          <label>当前绑定邮箱</label>
          <div class="ui input disabled">
            <input type="text" v-model="user.email" placeholder="">
          </div>
        </div>
        <div class="six wide field">
          <label>登录密码</label>
          <input type="text" v-model="password" name="password" placeholder="请输入登录密码">
        </div>
        <div class="six wide field">
          <label>新邮箱</label>
          <input type="text" v-model="email" name="email" placeholder="请输入新邮箱">
        </div>
        <div class="six wide field">
          <label>验证码</label>
          <div class="ui right labeled input">
            <input type="text" v-model="captcha" name="captcha" placeholder="请输入验证码">
            <div class="ui basic label captcha">
              <img :src="getCaptcha" id="captchaImg" @click="signDate = new Date()">
            </div>
          </div>
        </div>
        <div class="six wide field">
          <div class="ui yellow message">
            <ul class="list">
              <li>系统将向新邮箱发送一封验证邮件，请点击邮件中的激活链接即可完成修改。</li>
              <li>如没收到邮件，请确认邮箱地址是否正确，或者在垃圾箱里检查是否误投。</li>
            </ul>
          </div>
        </div>
        <div class="submit ui large button teal">
          保存修改
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {POST} from '@/api'

  export default {
    name: 'ChangeEmail',
    data(){
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }
      return {
        user: userSession,
        signDate: new Date(),
        password: '',
        email: '',
        captcha: ''
      }
    },
    methods: {
      submitChangeEmail: function () {
        const that = this
        const formdata = new FormData()
        formdata.append('password', that.password)
        formdata.append('email', that.email)
        formdata.append('captcha', that.captcha)

        POST({
          url: '/api/user/change-email',
          data: formdata,
          callback: res => {
            if(res.code === 200) {
              layerMsg("验证邮箱已发送, 请点击链接激活!")
              that.password = ''
              that.email = ''
              that.captcha = ''
            } else if(res.code === 400){
              $('.ui.form').form('add prompt', 'password', '密码错误')
            } else if(res.code === 401){
              $('.ui.form').form('add prompt', 'captcha', '验证码错误')
            } else if(res.code === 402){
              $('.ui.form').form('add prompt', 'email', '请输入正确的邮箱地址')
            }
          }
        })
      }
    },
    computed: {
      getCaptcha: function () {
        return this.GLOBAL.BLOG_BACK + "/user/captcha?date=" + this.signDate
      }
    },
    mounted: function () {
      document.title = '修改登录邮箱 - ' + this.user.username + '的个人空间'
      const that = this
      $(document).ready(function () {
        $('.ui.form').form({
          inline: true,
          on: 'blur',
          fields: {
            password: {
              identifier: 'password',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入登录密码'
                }
              ]
            },
            email: {
              identifier: 'email',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入新邮箱'
                },
                {
                  type: 'email',
                  prompt: '请输入正确的邮箱地址'
                }
              ]
            },
            captcha: {
              identifier: 'captcha',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入验证码'
                }
              ]
            }
          },
          onSuccess: function (e) {
            e.preventDefault()
            that.submitChangeEmail()
          }
        })
      })
    }
  }
</script>

<style scoped>
  .label.captcha {
    padding: 0!important;
  }
  .label.captcha img {
    height: 38px!important;
  }
</style>
