<template>
  <div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">个人主页设置</h3>
    <div class="ui basic padded segment">
      <form class="ui form text-left">
        <div class="field">
          <label>我的网址</label>
          <div class="two fields">
            <div class="seven wide field">
              <div class=" ui labeled input">
                <div class="ui label" style="font-weight: 400">http://www.coralcloud.cn/</div>
                <input type="text" placeholder="请输入个性网址">
              </div>
            </div>
            <div class="field">
              <span class="tip">设置后不能修改，请妥善填写。</span>
            </div>
          </div>
        </div>
        <div class="fields">
          <div class="seven wide field">
            <label>网页标题</label>
            <input v-model="user.username + '的个人空间'" type="text" placeholder="请输入网页标题">
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
  export default {
    name: 'UserSettings',
    data() {
      let userSession = localStorage.getItem("user");
      if (userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }
      return {
        user: userSession
      }
    }
  }
</script>

<style scoped>
  .tip {
    font-weight: 400;
    color: rgba(0, 0, 0, .5);
    font-size: 13px;
    line-height: 38px;
  }
</style>
