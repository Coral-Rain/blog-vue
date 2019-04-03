<template>
  <div>
    <div class="ui modal tools" :style="{'width': '400px','height': showLogin ? '400px': '580px','margin': 'auto'}">
      <div class="header">
        {{showLogin ? '账号密码登录' : '注册账号'}}
        <i class="icon close" @click="hideModal"></i>
      </div>
      <div class="content text-center">
        <div v-if="showLogin">
          <div class="ui basic segment padded">
            <form class="ui form">
              <div class="field">
                <input v-model.trim="email" id="account" name="account" placeholder="请输入邮箱" type="text">
              </div>
              <div class="field">
                <input v-model.trim="password" id="password" placeholder="请输入密码" type="password">
              </div>
              <div>
                <input @click.prevent="submitLoginForm()" type="submit" value="登录">
              </div>
            </form>
            <div class="goRegister text-center">
              <a href="javascript:" @click="goRegiste">注册账号</a>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="ui basic padded segment">
            <form class="ui form">
              <div class="field">
                <input type="text" id="petname" v-model.trim="username" placeholder="请输入用户名" />
              </div>
              <div class="field">
                <input type="text" id="email" v-model.trim="email" placeholder="请输入邮箱" />
              </div>
              <div class="field">
                <input type="password" id="passwordReg" autocomplete="new-password" v-model.trim="passwordReg" placeholder="请输入密码" />
              </div>
              <div class="field">
                <input type="password" id="repeatPassword" v-model.trim="repeat" placeholder="请重复密码" />
              </div>
              <div class="field">
                <div class="ui right labeled input">
                  <input type="text" v-model="captcha" name="captcha" placeholder="请输入验证码">
                  <div class="ui basic label captcha">
                    <img :src="getCaptcha" id="captchaImg" style="cursor: pointer" @click="signDate = new Date()">
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="ui right labeled input">
                  <input type="text" id="code" v-model.trim="code" placeholder="请输入邮件验证码" />
                  <div class="ui basic label btn-code">
                    <div @click="sendRegCode" class="ui button">获取验证码</div>
                  </div>
                </div>
              </div>
              <div>
                <input @click.prevent="submitRegForm()" type="submit" value="注册"><br>
                <a class="goLogin" @click="goLogin" href="javascript:">返回登录</a>
                <br>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {POST} from "@/api";
  import EventBus from '@/EventBus'

  export default {
    name: 'LoginModal',
    data(){
      return {
        signDate: new Date(),
        email: '',
        password: '',
        username: '',
        passwordReg: '',
        repeat: '',
        captcha: '',
        code: '',
        showLogin: false
      }
    },
    methods: {
      submitLoginForm: function () {
        if(!(/^[a-zA-Z0-9._]+@([a-z]|\d){2,10}[.][a-zA-Z0-9._]+$/.test(this.email))){
          layerError("错误: 账号格式输入错误！");
          $('#account').focus();
          return;
        }
        if(this.password.length < 1){
          layerError("错误: 你还没有输入密码！");
          $('#password').focus();
          return;
        }
        const data = new FormData()
        data.append("account", this.email)
        data.append("password", this.password)
        const that = this
        POST({
          url: '/api/user/login',
          data: data,
          callback: res => {
            if(res.code === 200) {
              if(res.data.message){
                layerMsg(res.data.message)
              } else {
                layerMsg("登录成功...")
              }
              localStorage.setItem("user", JSON.stringify(res.data.user))
              setTimeout(function(){
                EventBus.$emit("loginSuccess", res.data.user)
                $('.tools.modal').modal('hide')
              },2000)
            } else {
              layerError(res.message);
            }
          }
        })
      },
      goRegiste: function () {
        // EventBus.$emit("goRegiste")
        this.password = ''
        this.email = ''
        this.showLogin = false
      },
      goLogin: function () {
        // EventBus.$emit("goLogin")
        this.showLogin = true
        this.email = ''
        this.passwordReg = ''
        this.repeat = ''
        this.captcha = ''
        this.code = ''
        this.username = ''
      },
      hideModal: function() {
        // console.log("hideModal")
        $('.ui.tools.modal').modal('hide')
        this.email = ''
        this.passwordReg = ''
        this.repeat = ''
        this.captcha = ''
        this.code = ''
        this.username = ''
        this.password = ''

      },
      submitRegForm: function () {

        if(this.username.length === 0 || this.username.length > 10) {
          layerError('错误: 用户名应为1-10位字符！');
          $('#petname').focus();
          return;
        }
        if(!/^[a-zA-Z0-9._]+@([a-z]|\d){2,10}[.][a-zA-Z0-9._]+$/.test(this.email)){
          layerError('错误: 邮箱格式输入不正确！');
          $('#email').focus();
          return;
        }
        if (this.passwordReg.length < 6) {
          layerError('错误: 密码不能少于6个字符！');
          $('#passwordReg').focus();
          return;
        }
        if (this.passwordReg !== this.repeat) {
          layerError('错误: 两次输入的密码不相同！');
          $('#repeatPassword').focus();
          return;
        }
        const data = new FormData()
        data.append("username", this.username)
        data.append("email", this.email)
        data.append("password", this.passwordReg)
        data.append("repeatPassword", this.repeat)
        data.append("code", this.code)
        const that = this
        POST({
          url: '/api/user/registe',
          data: data,
          callback: res => {
            if (res.data.code === 200) {
              layerMsg('注册成功！');
              // setTimeout(function(){
              //   that.$router.replace("/index/login")
              // },2000)
            } else {
              if (res.code === 402){
                $('#email').focus();
              } else if (res.code === 401){
                $('#code').focus();
              } else if(res.code === 403){
                $('#petname').focus();
              } else if(res.code === 404){
                $('#passwordReg').focus();
              } else {
                $('#repeatPassword').focus();
              }
              that.signDate = new Date()
              layerError(res.message);
            }
          }
        })
      },
      sendRegCode: function () {
        if(!/^[a-zA-Z0-9._]+@([a-z]|\d){2,10}[.][a-zA-Z0-9._]+$/.test(this.email)){
          layerError('错误: 邮箱格式输入不正确！');
          $('#email').focus();
          return;
        }
        const that = this
        const data = new FormData()
        data.append("email", this.email)
        data.append("captcha", this.captcha)
        POST({
          url: '/api/user/sendRegCode',
          data: data,
          callback: res => {
            if (res.code === 200) {
              layerMsg('已发送验证邮件, 请登录邮箱查收！');
              // setTimeout(function(){
              //   that.$router.replace("/index/login")
              // },2000)
              $('#code').focus()
            } else {
              if (res.code === 401){
                $('#captcha').focus();
                that.signDate = new Date()
              } else if (res.code === 400){
                $('#email').focus();
              }
              layerError(res.message);
            }
          }
        })
      }
    },
    mounted: function () {
      const that = this
      EventBus.$on('showLoginModal', function (showLogin) {
        that.showLogin=showLogin
        that.email = ''
        that.passwordReg = ''
        that.repeat = ''
        that.captcha = ''
        that.code = ''
        that.username = ''
        that.password = ''
        $('.tools.modal').modal('show')
      })
      EventBus.$on('hideLoginModal', function () {
        $('.tools.modal').modal('hide')
      })
    },
    computed: {
      getCaptcha: function () {
        return this.GLOBAL.BLOG_BACK + "/user/captcha?date=" + this.signDate
      }
    }
  }
</script>

<style scoped>
  input[type=text], input[type=password]{
    height: 40px;
    width: 100%;
    margin: 8px 0;
    outline: none;
    border: 1px solid #aaa;
    padding: 0 10px;
    font-size: 14px;
    text-align: center;
    border-radius: 3px;
  }
  input:focus {
    border: 1px solid #3582f8;
  }
  input[type=submit] {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background-color: #3582f8;
    border: none;
    color: #fff;
    padding: 0;
    margin: 8px 0;
    cursor: pointer;
    -webkit-appearance: none;
    border-radius: 3px;
    display: inline-block;
    text-decoration: none;
  }

  .goRegister {
    margin: 8px 0;
    border-radius: 3px;
    background-color: #eee;
  }

  .goRegister a {
    font-size: 15px;
    color: #88f;
    height: 40px;
    line-height: 40px;
    text-decoration: none;
  }
  .login img {
    display: block;
    width: 150px;
    margin: 0 auto;
  }
  p {
    text-align: center;
    margin: 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #444;
    padding-bottom: 5px;
  }

  .goLogin {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background-color: #3582f8;
    border: none;
    color: #fff;
    padding: 0;
    margin: 5px 0;
    cursor: pointer;
    -webkit-appearance: none;
    border-radius: 3px;
    display: inline-block;
    text-decoration: none;
  }

  .btn-code {
    line-height: 26px;
    float: right;
    width: 40%;
  }
  .ui.modal.login {
    width: 400px;
    margin: auto;
  }
  .label.captcha,.label.btn-code {
    padding: 0!important;
  }
  .label.captcha img {
    height: 38px!important;
  }
  .label.btn-code .button{
    height: 38px!important;
    width: 100%;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
</style>
