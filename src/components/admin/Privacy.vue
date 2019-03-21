<template>
  <div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">个人隐私设置</h3>
    <div class="ui basic padded segment">
      <form class="ui form text-left">
        <CheckBox ref="post" text='不在动态中显示我发表的"回帖"'/>
        <CheckBox ref="codeComment" text='不在动态中显示我发表的"代码"评论'/>
        <CheckBox ref="newsComment" text='不在动态中显示我发表的"新闻"评论'/>
        <CheckBox ref="blogComment" text='不在动态中显示我发表的"博客"评论'/>
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
    name: 'Privacy',
    components: {CheckBox},
    mounted: function () {
      document.title = '个人隐私设置 - ' + this.user.username + '的个人空间'
    }
  }
</script>

<style scoped>

</style>
