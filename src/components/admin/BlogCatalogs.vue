<template>
  <div>
    <div class="pull-right" style="margin-top: -15px">
      <button class="btn btn-success" data-toggle="modal" data-target="#addBlogCatalogModal">
        <i class="plus icon"></i>
        添加分类
      </button>
    </div>
    <h3 class="main-title ui dividing header text-left" style="margin-top: 10px">博客分类管理</h3>
    <table class="ui celled table">
      <thead>
        <tr class="center aligned">
          <th class="one wide">序号</th>
          <th class="ten wide">分类名称</th>
          <th class="two wide">文章数</th>
          <th class="three wide">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="center aligned" v-for="(c, index) in catalogs">
          <td class="one wide">{{index + 1}}</td>
          <td class="ten wide">{{c.name}}</td>
          <td class="two wide">{{c.count}}</td>
          <td class="three wide">
            <button data-toggle="modal" data-target="#updateBlogCatalogModal" @click="showUpdateModal(c)" class="ui small compact button edit">修改</button>
            <button data-toggle="modal" data-target="#deleteBlogCatalogModal" @click="deletedCatalog = c" class="ui small compact button delete">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="modal fade" id="addBlogCatalogModal" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
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
                <input id="blogTypeInput" v-model="newBlogCatalog" placeholder="请输入分类名称..." class="form-control" type="text">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-success" @click="addBlogCatalog()">确定</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="updateBlogCatalogModal" tabindex="-1" role="dialog" aria-labelledby="updateCatalog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="updateCatalog">修改分类</h4>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="blogTypeInput-update">分类名称</label>
                <input id="blogTypeInput-update" v-model="updatedCatalog.name" placeholder="请输入分类名称..." class="form-control" type="text">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-success" @click="updateCatalog()">确定</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="deleteBlogCatalogModal" tabindex="-1" role="dialog" aria-labelledby="deleteCatalog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="deleteCatalog">删除分类</h4>
          </div>
          <div class="modal-body text-left">
            确定删除分类 {{deletedCatalog.name}} 吗?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCatalog()">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {GET, POST} from '@/api'

  export default {
    name: 'BlogCatalogs',
    data(){
      const that = this
      let catalogs = []
      let userSession = localStorage.getItem("user")
      if(userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      const formdata = new FormData()
      formdata.append('userId', this.$route.params.userId)

      POST({
        url: '/api/catalog/list',
        data: formdata,
        callback: res => {
          if(res.code === 200){
            that.catalogs = res.data.catalogs
          }
        }
      })

      return {
        user: userSession,
        catalogs,
        newBlogCatalog: '',
        updatedCatalog: {},
        deletedCatalog: {}
      }
    },
    methods: {
      addBlogCatalog: function () {
        if(this.newBlogCatalog.replace(/^\s+|\s+$/gm,'').length === 0) {
          layerError("分类名称不能为空!")
          $('#blogTypeInput').focus()
          return
        }
        const formdata = new FormData()
        formdata.append("name", this.newBlogCatalog)
        formdata.append("userId", this.user.id)
        const that = this
        POST({
          url: '/api/catalog/add',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              $('#addBlogCatalogModal').modal('hide')
              $('#blogTypeInput').val('')
              // Refresh localData
              that.catalogs = res.data.blogTypes
            } else {
              layerError(res.message)
            }
          }
        })
      },
      showUpdateModal: function (catalog) {
        this.updatedCatalog = JSON.parse(JSON.stringify(catalog))
      },
      updateCatalog: function () {
        if(this.updatedCatalog.name.replace(/^\s+|\s+$/gm,'').length === 0) {
          layerError("分类名称不能为空!")
          $('#blogTypeInput-update').focus()
          return
        }
        const formdata = new FormData()
        formdata.append("name", this.updatedCatalog.name)
        formdata.append("id", this.updatedCatalog.id)
        const that = this
        POST({
          url: '/api/catalog/update',
          data: formdata,
          callback: res => {
            if(res.code === 200){
              $('#updateBlogCatalogModal').modal('hide')
              // Refresh localData
              // that.catalogs = res.data.blogTypes
              that.catalogs.filter(x => x.id = that.updatedCatalog.id)[0].name = that.updatedCatalog.name
            } else {
              layerError(res.message)
            }
          }
        })
      },
      deleteCatalog: function () {
        const that = this
        GET({
          url: '/api/catalog/delete/' + that.deletedCatalog.id,
          callback: res => {
            if(res.code === 200){
              $('#deleteBlogCatalogModal').modal('hide')
              // Refresh localData
              that.catalogs = res.data.catalogs
            } else {
              layerError(res.message)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  td .ui.button {
    background-color: #f0f0f0;
    font-weight: 400;
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
