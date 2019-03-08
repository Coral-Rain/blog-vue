<template>
    <div>
      <TabPage :tabs="tabs" />
      <div v-if="targetTab.toLowerCase() === 'baseinfo'" class="baseinfo">

      </div>
      <div></div>
      <div></div>
    </div>
</template>

<script>
  import TabPage from '../TabPage'
  export default {
    name: 'Profile',
    components: {TabPage},
    data(){
      const targetTab = this.$route.query.tab
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }
      return {
        tabs: [
          {id: 1, to: {query: {tab: 'baseInfo'}}, name: '基本资料'},
          {id: 2, to: {query: {tab: 'contactInfo'}}, name: '联系信息'},
          {id: 3, to: {query: {tab: 'skillInfo'}}, name: 'IT职业技能'}
        ],
        targetTab: targetTab,
        username: userSession.username
      }
    },
    watch: {
      $route(){
        this.targetTab = this.$route.query.tab
      }
    }
  }
</script>

<style scoped>

</style>
