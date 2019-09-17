<template>
    <div id="tinymce">
<!--      <editor id="tinymce" v-model="value" init=""></editor>-->
    </div>
</template>/

<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  import 'tinymce/plugins/image'// 插入上传图片插件
  // import 'tinymce/plugins/media'// 插入视频插件
  import 'tinymce/plugins/table'// 插入表格插件
  import 'tinymce/plugins/lists'// 列表插件
  import 'tinymce/plugins/wordcount'
  import EventBus from "../../EventBus";
  // 字数统计插件
    export default {
      name: "HTMLEditor",
      components:{Editor},
      data(){
        return{
          options: {
            selector: '#tinymce',
            language_url: '/static/tinymce/zh_CN.js',// 语言包的路径
            language: 'zh_CN',//语言
            skin_url: '/static/tinymce/skins/ui/oxide',// skin路径，注意这个，很多网上教程都是skins/lightgray，但是发现其实并没有这个玩意儿
            height: 450,//编辑器高度
            branding: false,//是否禁用“Powered by TinyMCE”
            menubar: true,//顶部菜单栏显示
            plugins: 'lists image table wordcount',
            toolbar: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat',
          }
        }
      },
      mounted(){
        const that = this;
        EventBus.$on("initEditor", function () {
          tinymce.init(that.options);
        })
      },
      methods: {
        init(){
          tinymce.init(this.options);
        },
        value(){
          return tinymce.get('tinymce') ? tinymce.get('tinymce').getContent() : '';
        },
        clear(){
          if(tinymce.get('tinymce')) {
            tinymce.get('tinymce').setContent('');
          }
        }
      }
    }
</script>

<style scoped>

</style>
