<template>
  <div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">修改登录密码</h3>
    <div class="ui basic padded segment">
      <form class="ui form text-left">
        <div class="field">
          <label>旧的登录密码</label>
          <div class="two fields">
            <div class="six wide field" style="padding-right: 0">
              <input type="password" v-model="oldPassword" name="oldPassword" placeholder="请输入旧的登录密码" minlength="6">
            </div>
            <div class="field">
              <a href="#" class="tip">忘记登录密码?</a>
            </div>
          </div>
        </div>
        <div class="six wide field">
          <label>新的密码</label>
          <input type="password" v-model="newPassword" name="newPassword" placeholder="请输入新密码" minlength="6">
        </div>
        <div class="six wide field">
          <label>重复新密码</label>
          <input type="password" v-model="repeatPassword" name="repeatPassword" placeholder="请再次输入新密码" minlength="6">
        </div>
        <div class="submit ui large button teal">
          保存修改
        </div>
      </form>
    </div>
  </div>

</template>

<script>
  import {POST} from '../../api'

  export default {
    name: 'Chpwd',
    data(){
      return {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      }
    },
    mounted: function () {
      const that = this
      $(document).ready(function () {
        $('.ui.form').form({
          inline: true,
          on: 'blur',
          fields: {
            oldPassword: {
              identifier: 'oldPassword',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入旧的登录密码'
                },
                {
                  type: 'minLength[6]',
                  prompt: '密码长度应大于{ruleValue}位'
                }
              ]
            },
            newPassword: {
              identifier: 'newPassword',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入新密码'
                },
                {
                  type: 'minLength[6]',
                  prompt: '密码长度应大于{ruleValue}位'
                }
              ]
            },
            repeatPassword: {
              identifier: 'repeatPassword',
              rules: [
                {
                  type: 'match[newPassword]',
                  prompt: '两次密码输入不相同'
                }
              ]
            }
          },
          onSuccess: function (e) {
            e.preventDefault()
            that.submitChangePwd()
          }
        })
      })
    },
    methods: {
      submitChangePwd: function () {
        const formdata = new FormData()
        formdata.append('oldPassword', this.oldPassword)
        formdata.append('newPassword', this.newPassword)
        formdata.append('repeatPassword', this.repeatPassword)
        const that = this
        POST({
          url: '/api/user/chpwd',
          data: formdata,
          callback: res => {
            if(res.code === 200) {
              layerMsg("成功修改密码")
              // $('.ui.form').reset()
              that.oldPassword = ''
              that.newPassword = ''
              that.repeatPassword = ''
            } else if(res.code === 400) {
              $('.ui.form input[name=oldPassword]').focus()
              $('.ui.form').form('add prompt', 'oldPassword', '密码错误')
            } else {
              layerError(res.message)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .tip{
    margin-left: 10px;
    font-size: 13px;
    line-height: 38px;
  }
</style>
