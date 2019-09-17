<template>
  <div>
    <div class="pull-right" style="margin-top: -15px">
      <button class="btn btn-success" @click="showAddModal()">
        <i class="fa fa-plus fa-lg"></i>
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
      <tr class="center aligned" v-for="(c, index) in catalogs" :key="index">
        <td class="one wide">{{index + 1}}</td>
        <td class="ten wide">{{c.name}}</td>
        <td class="two wide">{{c.count}}</td>
        <td class="three wide">
          <button @click="showUpdateModal(c)" class="ui small compact button edit">修改</button>
          <button @click="showDeleteModal(c)" class="ui small compact button delete">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="ui mini catalog-add modal">
      <i class="icon close"></i>
      <div class="header">添加分类</div>
      <div class="content">
        <form>
          <div class="form-group">
            <label for="blogTypeInput">分类名称</label>
            <input id="blogTypeInput" v-model="newBlogCatalog" placeholder="请输入分类名称..." class="form-control"
                   type="text">
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button green" @click="addBlogCatalog()">确定</div>
      </div>
    </div>

    <div class="ui mini catalog-update modal">
      <i class="icon close"></i>
      <div class="header">修改分类</div>
      <div class="content">
        <form>
          <div class="form-group">
            <label for="blogTypeInput-update">分类名称</label>
            <input id="blogTypeInput-update" v-model="updatedCatalog.name" placeholder="请输入分类名称..." class="form-control"
                   type="text">
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button green" @click="updateCatalog()">确定</div>
      </div>
    </div>

    <div class="ui mini catalog-delete modal">
      <i class="icon close"></i>
      <div class="header">删除分类</div>
      <div class="content">
        确定删除分类 {{deletedCatalog.name}} 吗?
      </div>
      <div class="actions">
        <div class="ui cancel button">取消</div>
        <div class="ui button red" @click="deleteCatalog()">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {GET, POST} from '@/api'

  export default {
    name: 'BlogCatalogs',
    data() {
      const that = this;
      let catalogs = [];
      let userSession = localStorage.getItem("user");
      if (userSession) {
        // console.log(userSession)
        userSession = JSON.parse(userSession)
      }

      const formdata = new FormData();
      formdata.append('userId', this.$route.params.userId);

      POST({
        url: '/api/catalog/list',
        data: formdata,
        callback: res => {
          if (res.code === 200) {
            that.catalogs = res.data.catalogs
          }
        }
      });

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
        if (this.newBlogCatalog.replace(/^\s+|\s+$/gm, '').length === 0) {
          layerError("分类名称不能为空!");
          $('#blogTypeInput').focus();
          return
        }
        const formdata = new FormData();
        formdata.append("name", this.newBlogCatalog);
        formdata.append("userId", this.user.id);
        const that = this;
        POST({
          url: '/api/catalog/add',
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              $('.ui.modal.catalog-add').modal('hide');
              // Refresh localData
              that.catalogs = res.data.blogTypes
            } else {
              layerError(res.message)
            }
          }
        })
      },
      showUpdateModal: function (catalog) {
        this.updatedCatalog = JSON.parse(JSON.stringify(catalog));
        $('.catalog-update.mini.modal').modal('show')
      },
      showDeleteModal: function (catalog) {
        this.deletedCatalog = JSON.parse(JSON.stringify(catalog));
        $('.catalog-delete.mini.modal').modal('show')
      },
      showAddModal: function () {
        $('.catalog-add.mini.modal').modal('show')
      },
      updateCatalog: function () {
        if (this.updatedCatalog.name.replace(/^\s+|\s+$/gm, '').length === 0) {
          layerError("分类名称不能为空!");
          $('#blogTypeInput-update').focus();
          return
        }
        const formdata = new FormData();
        formdata.append("name", this.updatedCatalog.name);
        formdata.append("id", this.updatedCatalog.id);
        const that = this;
        POST({
          url: '/api/catalog/update',
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              $('.ui.modal.catalog-update').modal('hide');
              // Refresh localData
              // that.catalogs = res.data.blogTypes
              that.catalogs.filter(x => x.id === that.updatedCatalog.id)[0].name = that.updatedCatalog.name
            } else {
              layerError(res.message)
            }
          }
        })
      },
      deleteCatalog: function () {
        const that = this;
        const formdata = new FormData();
        formdata.append("id", this.deletedCatalog.id);
        formdata.append("userId", this.user.id);
        POST({
          url: '/api/catalog/delete',
          data: formdata,
          callback: res => {
            if (res.code === 200) {
              $('.ui.modal.catalog-delete').modal('hide');
              // Refresh localData
              that.catalogs = res.data.catalogs
            } else {
              layerError(res.message)
            }
          }
        })
      }
    },
    mounted: function () {
      document.title = '博客分类管理 - ' + this.user.username + '的个人空间'
    }
  }
</script>

<style scoped>
  td .ui.button {
    background-color: #f0f0f0;
    font-weight: 400;
  }

  .ui.modal {
    position: absolute;
    top: 40%;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .catalog-delete {
    height: 200px;
  }

  .catalog-update, .catalog-add {
    height: 250px;
  }

  @media only screen and (min-width: 768px) {
    .modal-dialog {
      width: 380px !important;
      height: 300px;
      position: absolute;
      bottom: 50%;
      left: 50%;
      margin-left: -190px;
      margin-bottom: -150px;
    }
  }

  .modal-header h4 {
    font-weight: 600;
  }

  .modal-body label {
    font-weight: 700;
    color: rgba(0, 0, 0, .87);
    float: left;
  }

  .modal-body label + input {
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
