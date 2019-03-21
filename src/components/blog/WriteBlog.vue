<template>
    <div class="container">
      <div class="text-left">
        <ol class="breadcrumb breadcrumb-path">
          <li><router-link :to="{name: 'PersonDefault'}">{{user.username}}的个人空间</router-link></li>
          <li class="active">写博客</li>
        </ol>
      </div>
      <div style="margin-top: 20px">
        <form action="#">
          <div class="form-group form-title">
            <div class="col-xs-8">
            <label for="blogTitle" class="pull-left icon-must">文章标题</label>
            <input id="blogTitle" v-model="title" class="form-control" placeholder="文章标题，字数控制在 50 个字以内" type="text">
          </div>
            <div class="col-xs-4">
              <label class="pull-left">文章分类</label>
              <i class="glyphicon glyphicon-plus pointer pull-left" data-toggle="modal" data-target="#addBlogTypeModal"></i>
              <!--<select class="form-control" id="blogType" v-model="selectBlogType">-->
              <!--<option v-for="type in blogTypes" :value="type.id">{{type.name}}</option>-->
              <!--</select>-->
              <div class="dropdown text-left" style="margin-top: 25px">
                <button class="btn btn-default dropdown-toggle form-select" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  {{selectBlogType.name}}
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                  <li v-for="type in blogTypes" @click="changeType(type.id, type.name)"><div class="item-li" :class="isActive(type.id) ? 'active' : ''">{{type.name}}</div></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="form-tab">
            <ul class="nav nav-tabs">
              <li role="presentation"><a href="#">HTML编辑器</a></li>
              <li role="presentation" class="active"><a href="#">Markdown</a></li>
            </ul>
            <div class="field">
              <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" :toolbars="toolbars"/>
            </div>
          </div>
          <div class="form-group form-inline form-items">
            <label class="icon-must items-label v-center">系统分类</label>
            <div class="dropdown dropup text-left items-dropdown">
              <button class="btn btn-default dropdown-toggle form-select" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {{selectSysType.name}}
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="type in sysTypes" @click="changeSysType(type.id, type.name)"><div class="item-li" :class="isSysActive(type.id) ? 'active' : ''">{{type.name}}</div></li>
              </ul>
            </div>
            <div class="items-inline">
              <div class="item" :class="original ? 'checked' : ''" @click="original = !original">
                <label class="item-label">原创</label>
              </div>
              <div class="item" :class="stick ? 'checked' : ''" @click="stick = !stick">
                <label>置顶</label>
              </div>
              <div class="item" :class="privated ? 'checked' : ''" @click="privated = !privated">
                <label>仅自己可见</label>
              </div>
            </div>
          </div>
          <div v-if="!original" class="form-group form-inline text-left">
            <label class="icon-must items-label v-center">原文链接</label>
            <input v-model="reprintUrl" type="text" class="form-control" placeholder="请在此输入原文链接" style="margin-left: 10px;width: 450px">
          </div>
          <div class="form-inline text-left form-action">
            <button class="btn btn-success" @click.prevent="submitBlog()">发表文章</button>
            <button class="btn btn-default" @click.prevent="saveBlog()">保存草稿</button>
          </div>
        </form>
      </div>
      <div class="modal fade" id="addBlogTypeModal" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="gridSystemModalLabel">添加分类</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="blogTypeInput">分类名称</label>
                  <input id="blogTypeInput" v-model="newBlogType" placeholder="请输入分类名称..." class="form-control" type="text">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary" @click="addBlogType()">添加类别</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {POST} from '../../api'

  export default {
    name: 'WriteBlog',
    data() {
      let userSession = localStorage.getItem("user")
      if(userSession) {
        userSession = JSON.parse(userSession)
      }

      let bts = [{
          id: '1',
          name: '工作日志'
        },
        {
          id: '2',
          name: '日常记录'
        },
        {
          id: '3',
          name: '转载文章'
        }]
      let sts = bts
      const formdata = new FormData()
      formdata.append("userId", userSession.id)
      const that = this
      //请求获取分类列表, 个人分类/系统分类
      POST({
        url: '/api/blog/initData',
        data: formdata,
        callback: res => {
          if(res.code === 200){
            that.blogTypes = res.data.blogTypes
            that.sysTypes = res.data.sysTypes
            that.selectSysType = res.data.sysTypes[0]
            that.selectBlogType = res.data.blogTypes[0]
          }
        }
      })
      return {
        user: userSession,
        blogTypes: bts,
        sysTypes: sts,
        title: '',
        selectBlogType: bts[0],
        selectSysType: sts[0],
        content: '',
        newBlogType: '',
        original: true,
        reprintUrl: '',
        stick: false,
        privated: false,
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        }
      }
    },
    methods: {
      changeType: function (id, name) {
        this.selectBlogType = {id: id, name: name}
      },
      changeSysType: function (id, name) {
        this.selectSysType = {id: id, name: name}
      },
      submitBlog: function(){
        console.log(this.content)
        const title = this.title.replace(/^\s+|\s+$/gm,'')
        if(title.length === 0 || title.length > 50){
          layerError('文章标题不能为空, 且须限制在50个字符内!')
          return
        }
        if(this.selectSysType.name.length === 0){
          layerError('请选择系统分类!')
          return
        }

        if(this.content.replace(/^\s+|\s+$/gm,'').length === 0){
          layerError('文章内容不能为空!')
          return
        }

        if(!this.original && this.reprintUrl.length === 0){
          layerError('原文链接不能为空!')
          return
        }

        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("content", this.content.replace(/^\s+|\s+$/gm,''))
        formdata.append("type", this.original)
        if(!this.original){
          formdata.append("reprintUrl", this.reprintUrl)
        }
        formdata.append("stick", this.stick)
        formdata.append("privated", this.privated)
        formdata.append("userTagId", this.selectBlogType.id)
        formdata.append("tagId", this.selectSysType.id)
        formdata.append("author", this.user.id)
        formdata.append("status", "2")
        const that = this
        POST({
          url: '/api/blog/submitBlog',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              layerMsg("发表完成!")
              setTimeout(function () {
                //  that.$router.push('') / ?
                // location.href
                const blogId =res.data.blogId
                that.$router.push({
                  name: 'BlogDetail',
                  params: {
                    userId: that.user.id,
                    blogId: blogId
                  }
                })
              }, 2000)
            } else {
              layerError(res.message)
            }
          }
        })
      },
      saveBlog: function(){
        console.log("SaveBlog")
      },
      addBlogType: function(){
        console.log(this.newBlogType)
        if(this.newBlogType.replace(/^\s+|\s+$/gm,'').length === 0) {
          layerError("分类名称不能为空!")
          return
        }
        const formdata = new FormData()
        formdata.append("name", this.newBlogType)
        formdata.append("userId", this.user.id)
        const that = this
        POST({
          url: '/api/catalog/add',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              $('#addBlogTypeModal').modal('hide')
              $('#blogTypeInput').val('')
              // Refresh localData
              that.blogTypes = res.data.blogTypes
            } else {
              layerError(res.message)
            }
          }
        })
      },
      $imgAdd: function (pos, $file) {
        // 第一步.将图片上传到服务器., 返回路径
        const formdata = new FormData()
        formdata.append('image', $file);

        POST({
          url: '/api/file/upload',
          data: formdata,
          config: {
            headers: {'Content-Type': 'multipart/form-data'}
          },
          callback: res => {
            if(res.code === 200){
              //返回URL
              console.log(res.data.filename)
              const url = this.GLOBAL.FILE_SYS_URL + res.data.filename
              this.$refs.md.$img2Url(pos, url)
            }
          }
        })
      },
      $imgDel: function (pos) {

      }
    },
    computed: {
      isActive() {
        return function (id) {
          return this.selectBlogType.id === id
        }
      },
      isSysActive(){
        return function (id) {
          return this.selectSysType.id === id
        }
      }
    },
    mounted: function () {
      document.title = '写博客 - ' + this.user.username + '的个人空间'
    }
  }
</script>

<style scoped>
  @media only screen and (min-width: 768px) and (max-width: 992px) {
    .container {
      width: 768px;
    }
  }
  @media only screen and (min-width: 993px) and (max-width: 1300px) {
    .container {
      width: 992px;
    }
  }
  @media only screen and (max-width: 768px) {
    .container {
      width: 100%;
    }
  }
  @media only screen and (min-width: 1300px) {
    .container {
      width: 1300px;
    }
  }
  .container {
    height: 100%;
    background-color: #fff;
    padding: 70px 30px 30px;
    margin-left: auto;
    margin-right: auto;

  }

  .breadcrumb-path{
    background-color: transparent;
    padding-left: 0;
    margin-bottom: 5px;
    font-size: 17px;
  }
  .breadcrumb-path li.active{
    font-weight: 600;
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
    color: rgba(0,0,0,.87);
  }
  a:focus,a:hover{
    text-decoration: none;
  }

  .icon-must:after{
   content: '*';
    color: red;
    margin-left: 3px;
  }

  .pointer {
    cursor: pointer;
    margin-left: 10px;
  }

  .form-group .col-xs-8,.col-xs-4 {
    padding-left: 0;
    padding-right: 0;
  }
  .form-group .col-xs-4{
    padding-left: 10px;
  }
  .form-select {
    width: 100%;
    background-color: white!important;
    text-align: left!important;
  }
  .form-group .dropdown-menu{
    width: 100%;
    overflow: auto;
    max-height: 300px;
  }
  .form-items .dropdown-menu .item-li {
    padding: 5px 12px !important;
  }
  .dropdown .caret {
    position: absolute;
    right: 10px;
    top: 15px;
  }

  .dropdown-menu .item-li {
    padding: 10px 12px;
    cursor: pointer;
  }
  .dropdown-menu .item-li:hover {
    background-color: #eee;
  }
  .dropdown-menu .item-li.active {
    font-weight: 600;
    background-color: #eee;
  }
  .dropdown.open {
    z-index: 1550;
  }

  .form-tab {
    margin-top: 20px;
  }

  li[role=presentation] a {
    font-size: 16px;
    color: black;
  }

  li[role=presentation].active>a {
    color: #32aa66!important;
    cursor: pointer!important;
    font-weight: 600;
  }
  .form-title {
    min-height: 60px;
  }

  .form-tab .field {
    border: 1px solid rgb(221, 221, 221);
    min-height: 450px;
  }

  form .form-items {
    margin-top: 20px;
    text-align: left;
    height: 34px;
    line-height: 34px;
    align-items: center;
  }

  form .form-items select{
    margin-left: 10px;
  }

  form .form-items .v-center {
    height: 34px;
    line-height: 34px
  }

  input[type=checkbox]{
    width: 17px;
    height: 17px;
  }

  .form-items .items-label {
    width: 65px;
  }
  .form-items .items-dropdown {
    width: 250px;
    padding: 0;
    margin-left: 10px;
    display: inline-block;
  }
  .form-items .items-inline {
    display: inline-block;
    margin-left: 10px;
  }


  .form-items .item{
    display: inline;
    position: relative;
    cursor: pointer !important;
    padding-right: 15px;
  }

  .form-items .item label {
    width: auto;
    height: 17px;
    line-height: 17px;
    padding-left: 27px;
    font-weight: normal;
    cursor: pointer;
    color: rgba(0,0,0,.87);
  }

  .form-items .item:before{
    position: absolute;
    top: 0;
    left: 0;
    width: 17px;
    height: 17px;
    content: '';
    background: #fff;
    border-radius: .21428571rem;
    -webkit-transition: border .1s ease,opacity .1s ease,-webkit-transform .1s ease,-webkit-box-shadow .1s ease;
    transition: border .1s ease,opacity .1s ease,transform .1s ease,box-shadow .1s ease,-webkit-transform .1s ease,-webkit-box-shadow .1s ease;
    border: 1px solid #d4d4d5;
  }
  .form-items .item.checked:before{
    background: #1cab43;
    border-color: #1cab43;
  }

  .form-action button {
    width: 120px;
    height: 40px;
  }
  .form-action button:last-child {
    margin-left: 15px;
  }

  .modal {
    z-index: 3000!important;
  }

  .v-note-wrapper.markdown-body:not(.fullscreen) {
    height: 450px;
    z-index: auto;
  }

  @media only screen and (min-width: 768px) {
    .modal-dialog {
      width: 380px!important;
      height: 300px;
      position: absolute;
      bottom: 50%;
      left: 50%;
      margin-left: -190px;
      margin-bottom: -150px;
    }
  }

  .modal-header h4{
    font-weight: 600;
  }
  .modal-body label {
    font-weight: 700;
    color: rgba(0,0,0,.87);
    float: left;
  }
  .modal-body label+input {
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
