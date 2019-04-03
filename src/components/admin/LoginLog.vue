<template>
  <div>
    <div class="divided hidden"></div>
    <div class="ui attached tab display-block">
      <table class="ui selectable celled table">
        <thead class="text-center">
        <tr>
          <th>序号</th>
          <th>登录IP</th>
          <th>登录地址</th>
          <th>状态</th>
          <th>登录时间</th>
        </tr>
        </thead>
        <tbody class="text-center">
        <tr v-for="(l,index) in logs">
          <td>{{(pager.pageNo-1) * pager.pageSize + index+1}}</td>
          <td>{{l.loginIp}}</td>
          <td>{{l.address}}</td>
          <td :class="resolveStatus(l.status)">{{l.status | status}}</td>
          <td>{{l.loginTime | datetime}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <Pagination :total="pager.total" :display="pager.pageSize" :currentPage="pager.pageNo" @pagechange="pagechange"></Pagination>
  </div>
</template>

<script>
  import {POST} from '@/api'
  import Pagination from '../tools/Pagination'

  export default {
    name: 'LoginLog',
    components: {Pagination},
    data(){
      let logs = []
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      return {
        logs,
        user: userSession,
        pager: {pageNo: 1, pageSize: 10, total: 0},
      }
    },
    mounted: function () {
      const that = this
      this.refreshData()
    },
    computed: {
      resolveStatus: function () {
        return function (status) {
          return status === 2 ? 'positive' : (status === -2 ? 'negative' : 'warning')
        }
      }
    },
    methods: {
      refreshData: function () {
        const that = this
        $('.ui.attached.tab').addClass("loading").removeClass("display-block")
        const formdata = new FormData()
        formdata.append("userId", this.user.id)
        formdata.append("pageNo", this.pager.pageNo)
        POST({
          url: '/api/user/log/list',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              setTimeout(function () {
                that.logs = res.data.logs
                that.pager = res.data.pager
                $('.ui.attached.tab').removeClass("loading").addClass("display-block")
                $('html,body').animate({scrollTop: '0px'}, 200)
              }, 300)
            }
          }
        })
      },
      pagechange: function(currentPage){
        this.pager.pageNo = currentPage
        this.refreshData()
      },
    }
  }
</script>

<style scoped>

  .display-block {
    display: block !important;
  }
</style>
