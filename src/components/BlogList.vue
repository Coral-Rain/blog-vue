<template>
  <div class="data-main">
    <div v-for="blog in blogs" class="blog text-left">
      <div style="display: flex">
        <div class="meta">
          <router-link class="title" target="_blank"
                       :to="{name: 'BlogDetail',path:'/#aaa', params: {userId: blog.user.id, blogId: blog.id}}">
            <div v-if="blog.stick" class="icon label blue" data-tooltip="置顶" data-position="top center">顶</div>
            <div v-if="blog.type" class="icon label teal" data-tooltip="原创" data-position="top center">原</div>
            <div v-else class="icon label" data-tooltip="转载" data-position="top center">转</div>
            <span>{{blog.title}}</span>
          </router-link>
          <!--<a href="#" class="title">-->
          <!--&lt;!&ndash;<div v-if="blog.stick" class="icon">顶</div>&ndash;&gt;-->
          <!--&lt;!&ndash;<div v-if="blog.type" class="icon">原</div>&ndash;&gt;-->
          <!--&lt;!&ndash;<div v-else class="icon">转</div>&ndash;&gt;-->
          <!--</a>-->
          <div class="desc">
            <p v-if="blog.markdown">
              {{blog.content | markdown}}
            </p>
            <p v-else>
              {{blog.content | delHTMLTag}}
            </p>
          </div>
        </div>
        <div v-if="hasImg(blog.content)" class="image">
          <router-link target="_blank" class="ui small"
                       :to="{name: 'BlogDetail', params: {userId: blog.user.id, blogId: blog.id}}">
            <img :src="imgSrc(blog.content)" style="height: 70px" alt="">
          </router-link>
        </div>
      </div>

      <div class="items text-left">
        <div class="item">
          <router-link v-if="blogTypes"
                       :to="{name: 'Newest', params: {userId: blog.user.id}, query: {categoryId: blog.userTagId}}">
            {{blogType(blog.userTagId)}}
          </router-link>
          <router-link target="_blank" v-else :to="{name: 'PersonHome', params: {userId: blog.user.id}}">
            {{blog.user.username}}
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
        <div class="item">
          <i class="fa fa-heart-o"></i>
          &nbsp;{{blog.likes.length}}
        </div>
        <div class="item pull-right">
          <router-link target="_blank" :to="{name: 'EditDraft', params: {userId: user.id, blogId: blog.id}}"
                       v-if="blogTypes && user && (user.id === blog.author)">
            <i class="edit icon"></i> 编辑
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import marked from 'marked'


  export default {
    name: 'BlogList',
    data() {
      return {}
    },
    props: {
      blogs: {
        type: Array,
        required: true
      },
      blogTypes: {
        type: Array,
        required: false
      },
      user: {
        type: Object,
        required: false
      }
    },
    computed: {
      blogType: function () {
        return function (typeId) {
          const res = this.blogTypes.filter(t => t.id === typeId);
          if (res.length > 0) {
            return res[0].name
          }
          return ''
        }
      },
      compiledMD: function () {
        return marked(this.blog.content, {sanitize: true})
      }
    },
    mounted: function () {
      const rendererMD = new marked.Renderer();
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
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }

  .desc p {
    width: 100%;
    height: 38px;
    color: rgba(0, 0, 0, .87);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .blog {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(0, 0, 0, .3);
    padding-bottom: 15px;
    padding-top: 15px;
  }

  .data-main .blog:last-child {
    border-bottom: none;
  }

  .blog .meta {
    display: inline-block;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
  }

  .blog .meta .title {
    font-weight: 600;
    font-size: 18px;
    display: inline-block;
    color: rgba(0, 0, 0, .85);
  }

  .blog .meta a.title:hover {
    color: #4283c4;
  }

  .blog .meta .desc {
    margin-top: 8px;
    color: rgba(0, 0, 0, .87);
    line-height: 1.4285em;
  }

  .blog .items {
    color: rgba(0, 0, 0, .4);
    padding-top: 10px;
    font-size: 14px;
  }

  .blog .items .item {
    display: inline-block;
    margin-left: 5px;
    margin-right: 10px;
  }

  .item a {
    color: rgba(0, 0, 0, .4);
  }

  .item a:hover {
    color: rgba(0, 0, 0, .87);
  }

  .blog .image {
    width: 110px;
    min-width: 110px;
    height: 70px;
    margin-left: 5px;
    border-radius: 5px;
  }

  .blog .image img {
    width: 100%;
  }

  .label {
    padding: 5px !important;
    font-weight: 500;
    font-size: 12px;
    margin-top: -2px;
  }

  .label.icon.blue {
    background-color: #2185d0 !important;
    border-color: #2185d0 !important;
    color: white !important;
  }

  .label.icon.teal {
    background-color: #00b5ad !important;
    border-color: #00b5ad !important;
    color: white !important;
  }
</style>
