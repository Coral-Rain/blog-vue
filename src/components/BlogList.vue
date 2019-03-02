<template>
    <div>
      <div v-for="blog in blogs" class="blog text-left">
        <div class="meta">
          <div class="title">
            <!--<div v-if="blog.stick" class="icon">顶</div>-->
            <!--<div v-if="blog.type" class="icon">原</div>-->
            <!--<div v-else class="icon">转</div>-->
            <h3>{{blog.title}}</h3>
          </div>
          <div class="content">
            <p>
              {{blog.content | markdown}}
            </p>
          </div>
          <div class="items">
            <div class="item"></div>
            <div class="item">{{blog.createTime | datetime}}</div>
            <div class="item">
              <i class="fa fa-eye"></i>
            </div>
            <div class="item">
              <i class="fa fa-comment-o"></i>
            </div>
          </div>
        </div>
        <div class="image">
          <img src="" alt="">
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'BlogList',
    props: {
      blogs: {
        type: Array
      }
    }
  }
</script>

<style scoped>

</style>
