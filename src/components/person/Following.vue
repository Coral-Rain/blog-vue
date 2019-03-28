<template>
  <div>
    <FollowList :list="followers" title="我的关注"
                :userId="this.$route.params.userId" :tergetUserId="this.user.id ? this.user.id : '0'"
                :pager="pager" @pagechange="pagechange"/>
  </div>
</template>

<script>
  import FollowList from '../tools/FollowList'
  import {POST} from '../../api'
  export default {
    name: 'Following',
    components: {FollowList},
    data(){
      let followers = []
      const that = this
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      return {
        user: userSession,
        followers,
        sortType: this.$route.query.sort ? this.$route.query.sort : 'follow_time',
        pager: {pageNo: 1, total: 0, pageSize: 5}
      }
    },
    methods: {
      refreshData: function () {
        const that = this
        $('.ui.attached.tab').addClass("loading").removeClass("display-block")
        const formdata = new FormData()
        formdata.append("userId", this.$route.params.userId)
        formdata.append("tergetUserId", this.user ? this.user.id : '0')
        formdata.append("sortType", this.sortType)
        formdata.append("pageNo", this.pager.pageNo)
        POST({
          url: '/api/user/following',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              setTimeout(function () {
                that.followers = res.data.list
                that.pager = res.data.pager
                $('.ui.attached.tab').removeClass("loading").addClass("display-block")
              }, 300)
            }
          }
        })
      },
      pagechange: function(currentPage){
        this.pager.pageNo = currentPage
        this.refreshData()
      }
    },
    mounted: function () {
      const that = this

      this.refreshData()
    },
    watch: {
      $route(){
        this.sortType = this.$route.query.sort ? this.$route.query.sort : 'follow_time'
      },
      sortType(){
        this.refreshData()
      }
    }
  }
</script>

<style scoped>

</style>
