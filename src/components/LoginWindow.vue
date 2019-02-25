<template>
  <div v-show="showLoginWindow" class="tool-window">
    <div v-if="showLogin" class="tool-login">
      <p>账号密码登录</p>
      <form>
        <div>
          <input v-model.trim="account" id="account" type="text" placeholder="请输入邮箱">
        </div>
        <div>
          <input v-model.trim="password" id="password" type="password" placeholder="请输入密码">
        </div>
        <div>
          <input @click.prevent="submitLoginForm()" type="submit" value="登录">
        </div>
      </form>
      <div class="goRegister">
        <a href="javascript:" @click="goRegiste">注册账号</a>
      </div>
    </div>
    <div v-else class="tool-registe">
      <p>注册账号</p>
      <form>
        <div>
          <input type="text" id="petname" v-model.trim="petname" placeholder="请输入用户名" />
        </div>
        <div>
          <input type="text" id="email" v-model.trim="email" placeholder="请输入邮箱" />
        </div>
        <div>
          <input type="password" id="passwordReg" v-model.trim="passwordReg" placeholder="请输入密码" />
        </div>
        <div>
          <input type="password" id="repeatPassword" v-model.trim="repeat" placeholder="请重复密码" />
        </div>
        <div>
          <input type="text" id="captcha" v-model.trim="captcha" placeholder="请输入验证码"
                 style="width: 40%;display: inline-block;float: left"/>
          <img :src="getCaptcha" id="captchaImg" @click="signDate = new Date()"
               style="vertical-align: middle;width: 60%; padding-top: 7px; height: 47px;">
        </div>
        <div>
          <input @click.prevent="submitRegForm()" type="submit" value="注册"><br>
          <a class="goLogin" @click="goLogin" href="javascript:">返回登录</a>
          <br>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {POST} from "../api";
  import EventBus from '@/EventBus'
  export default {
    name: 'LoginWindow',
    data() {
      return {
        signDate: new Date(),
        account: '',
        password: '',
        petname: '',
        passwordReg: '',
        repeat: '',
        captcha: ''
      }
    },
    props: {
      showLoginWindow: {
        type: Boolean
      },
      showLogin: {
        type: Boolean
      }
    },
    computed: {
      getCaptcha: function () {
        return this.GLOBAL.BLOG_BACK + "/user/captcha?date=" + this.signDate
      }
    },
    methods: {
      submitLoginForm: function () {

        EventBus.$emit("loginSuccess", {username: '测试'})
        return;

        if(!(/^[a-zA-Z0-9._]+@([a-z]|\d){2,10}[.][a-zA-Z0-9._]+$/.test(this.account))){
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
        data.append("account", this.account)
        data.append("password", this.password)
        const that = this
        POST({
          url: '/api/user/login',
          data: data,
          callback: res => {
            if(res.code === 200) {
              localStorage.setItem("user", JSON.stringify(res.data.user))
              if(res.data.message){
                layerMsg(res.data.message)
              } else {
                layerMsg("登录成功...")
              }
              EventBus.$emit("loginSuccess", res.data.user)
              // setTimeout(function(){
              //   that.$router.replace("/cloud")
              // },2000)
            } else {
              layerError(res.message);
            }
          }
        })
      },
      goRegiste: function () {
        EventBus.$emit("goRegiste")
      },
      goLogin: function () {
        EventBus.$emit("goLogin")
      },
      submitRegForm: function () {

        if(this.petname.length === 0 || this.petname.length > 10) {
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
        if (this.password !== this.repeat) {
          layerError('错误: 两次输入的密码不相同！');
          $('#repeatPassword').focus();
          return;
        }
        const data = new FormData()
        data.append("petname", this.petname)
        data.append("email", this.email)
        data.append("password", this.passwordReg)
        data.append("repeatPassword", this.repeat)
        data.append("captcha", this.captcha)
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
                $('#captcha').focus();
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
      }
    }
  }
</script>

<style scoped>

  .tool-window {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  }

  .tool-window .tool-login{
    padding: 15px;
    background-color: white;
    width: 400px;
    height: 400px;
    position: relative;
    border-radius: 6px;
    top: 20%;
    left: 40%;
    box-shadow: #111 0 0 20px;
  }

  .tool-window .tool-registe{
    padding: 15px;
    background-color: white;
    width: 400px;
    height: 580px;
    position: relative;
    border-radius: 6px;
    top: 15%;
    left: 40%;
    box-shadow: #111 0 0 20px;
  }

  form {
    padding: 0 30px 15px 30px;
    text-align: center;
  }

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
    margin: 8px 30px;
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
</style>
