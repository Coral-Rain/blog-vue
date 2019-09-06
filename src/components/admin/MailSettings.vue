<template>
  <div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">邮箱提醒设置</h3>
    <div class="ui basic padded segment">
      <form class="ui form text-left">
        <CheckBox ref="weeklyReport" text="订阅每周精粹邮件"/>
        <CheckBox ref="notify" text="收藏的信息有更新时邮件提醒我"/>
        <div class="six wide field">
          <label>接收邮箱</label>
          <input name="email" placeholder="请输入接收邮箱" type="text">
        </div>
        <div class="submit ui large button teal">
          保存修改
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import CheckBox from '@/components/CheckBox'

  export default {
    name: 'MailSettings',
    components: {CheckBox},
    data() {
      return {}
    },
    computed: {
      weeklyReport: function () {
        return this.$refs.weeklyReport.checked
      },
      notify: function () {
        return this.$refs.notify.checked
      }
    },
    mounted: function () {

      document.title = '邮件提醒设置 - ' + this.user.username + '的个人空间'
    }
  }
</script>

<style scoped>

</style>
