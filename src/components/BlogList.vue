<template>
    <div class="data-main">
      <div v-for="blog in blogs" class="blog text-left">
        <div class="meta">
          <router-link class="title" :to="{name: 'BlogDetail',path:'/#aaa', params: {userId: blog.user.id, blogId: blog.id}}">
            <div v-if="blog.stick" class="icon label blue">顶</div>
            <div v-if="blog.type" class="icon label teal">原</div>
            <div v-else class="icon label">转</div>
            <span>{{blog.title}}</span>
          </router-link>
          <!--<a href="#" class="title">-->
            <!--&lt;!&ndash;<div v-if="blog.stick" class="icon">顶</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div v-if="blog.type" class="icon">原</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div v-else class="icon">转</div>&ndash;&gt;-->
          <!--</a>-->
          <div class="desc">
            <p>
              {{blog.content | markdown}}
            </p>
          </div>
          <div class="items text-left">
            <div class="item">
              <router-link :to="{name: 'Newest', params: {userId: blog.user.id}, query: {categoryId: blog.userTagId}}">
                {{blogType(blog.userTagId)}}
              </router-link>
            </div>
            <div class="item">{{blog.createTime | datetime}}</div>
            <div class="item">
              <i class="fa fa-eye"></i>
              &nbsp;{{blog.readCount}}
            </div>
            <div class="item comment">
              <router-link :to="{name: 'BlogDetailComment', params: {userId: blog.user.id, blogId: blog.id}}">
                <i class="fa fa-comment-o"></i>
                &nbsp;{{blog.comments.length}}
              </router-link>
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
  import marked from 'marked'

  const rendererMD = new marked.Renderer()
  marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  })
  export default {
    name: 'BlogList',
    props: {
      blogs: {
        type: Array
      },
      blogTypes: {
        type: Array
      }
    },
    computed: {
      blogType: function () {
        return function (typeId) {
          const res = this.blogTypes.filter(t => t.id === typeId)
          if(res.length > 0){
            return res[0].name
          }
          return ''
        }
      },
      compiledMD: function () {
        return marked(this.blog.content, {sanitize: true})
      }
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }

  .desc p {
    width: 100%;
    height: 38px;
    color: rgba(0,0,0,.87);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .blog {
    display: flex;
    border-bottom: 1px solid rgba(0,0,0,.3);
    padding-bottom: 15px;
    padding-top: 15px;
  }
  .blog .meta{
    display: inline-block;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
  }
  .blog .meta .title {
    font-weight: 600;
    font-size: 20px;
    display: inline-block;
    color: rgba(0,0,0,.85);
  }

  .blog .meta a.title:hover{
    color: #4283c4;
  }

  .blog .meta .desc {
    margin-top: 8px;
  }

  .blog .meta .items{
    color: rgba(0,0,0,.4);
  }

  .blog .meta .items .item {
    display: inline-block;
    margin-left: 5px;
    margin-right: 10px;
  }

  .item a {
    color: rgba(0,0,0,.4);
  }
  .item a:hover {
    color: rgba(0,0,0,.87);
  }

  .blog .image {
    width: 110px;
    min-width: 110px;
    height: 70px;
  }

  .label{
    padding: 5px!important;
    font-weight: 500;
    font-size: 12px;
    margin-top: -2px;
  }

  .label.icon.blue {
    background-color: #2185d0!important;
    border-color: #2185d0!important;
    color: white!important;
  }

  .label.icon.teal {
    background-color: #00b5ad!important;
    border-color: #00b5ad!important;
    color: white!important;
  }
</style>
