<template>
    <div class="main">
      全部博文
      <!--引入子组件-->
    </div>
</template>

<script>
  import {POST} from '@/api'

  export default {
    name: 'BlogList',
    data() {
      let blogs = []
      let categoryId = "0"
      if(this.$route.query.categoryId){
        categoryId = this.$route.query.categoryId
      }

      const that = this
      //根据categoryId查询对应分类的数据
      const formdata = new FormData()
      formdata.append('userId', this.$route.params.userId)
      formdata.append('categoryId', categoryId)
      POST({
        url: '/api/blog/listByUserTag',
        data: formdata,
        callback: res => {
          if(res.code === 200) {
            that.blogs = res.data.blogs
          } else {
            layerError(res.message)
          }
        }
      })


      return{
        categoryId: categoryId,
        blogs
      }
    }
  }
</script>

<style scoped>

</style>
