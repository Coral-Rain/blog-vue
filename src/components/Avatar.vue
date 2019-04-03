<template>
    <div v-if="isShow" class="update-div">
      <div class="form">
        <div class="cropper-content">
          <div class="cropper">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              @realTime="realTime"
              @imgLoad="imgLoad"
            ></vueCropper>
          </div>
          <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>

        <div class="footer-btn">
          <div class="scope-btn">
            <label class="btn btn-success" for="uploads">更换图片</label>
            <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
                   accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">

            <button class="btn btn-warning" @click="changeScale(1)">+</button>
            <button class="btn btn-warning" @click="changeScale(-1)">-</button>
            <button class="btn btn-warning" @click="rotateLeft">↺</button>
            <button class="btn btn-warning" @click="rotateRight">↻</button>
          </div>
          <div class="upload-btn">
            <button  @click="uploadToServer" class="btn btn-primary">
              &nbsp;&nbsp;&nbsp;&nbsp;上传&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
            <button  @click="cancle" class="btn btn-default">
              &nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import VueCropper from "vue-cropper/src/vue-cropper"
    import EventBus from "../EventBus";
    import {POST} from "../api";
    export default {
        name: "Avatar",
        components: { VueCropper },
        props: {
          src: {
              type: String,
              required: true
          },
            isShow: {
              type: Boolean,
                required: true
            }
        },
        data: function() {
            return {
                crap: false,
                previews: {},
                option: {
                    img: this.src,
                    size: 1,
                    full: false,//输出原图比例截图 props名full
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    autoCropWidth: 200,
                    autoCropHeight: 200,
                    fixedBox: true
                },
                downImg: '#',
            };
        },
      mounted: function(){

      },
        methods: {
            changeScale: function(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            rotateLeft: function() {
                this.$refs.cropper.rotateLeft()
            },
            rotateRight: function() {
                this.$refs.cropper.rotateRight()
            },
            // finish: function(type) {
            //     // 输出
            //     // var test = window.open('about:blank')
            //     // test.document.body.innerHTML = '图片生成中..'
            //     if (type === 'blob') {
            //         this.$refs.cropper.getCropBlob((data) => {
            //             var img = window.URL.createObjectURL(data)
            //             this.model = true
            //             // this.modelSrc = img
            //         })
            //     } else {
            //         this.$refs.cropper.getCropData((data) => {
            //             this.model = true
            //             // this.modelSrc = data
            //         })
            //     }
            // },
            // 实时预览函数
            realTime: function(data) {
                this.previews = data
            },
            down: function(type) {
                // event.preventDefault()
                const aLink = document.createElement('a');
                aLink.download = 'author-img'
                // 输出
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob((data) => {
                        console.log(data)
                        this.downImg = window.URL.createObjectURL(data)
                        // aLink.download = this.downImg;
                        console.log(this.downImg)
                        aLink.href = window.URL.createObjectURL(data)
                        aLink.click()
                    })
                } else {
                    this.$refs.cropper.getCropData((data) => {
                        this.downImg = data
                        aLink.href = data
                        aLink.click()
                    })
                }
            },
            uploadImg: function(e, num) {
                //上传图片
                // this.option.img
                const file = e.target.files[0];
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                    return false
                }
                var reader = new FileReader()
                reader.onload = (e) => {
                    let data
                    if (typeof e.target.result === 'object') {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([e.target.result]))
                    } else {
                        data = e.target.result
                    }
                    if (num === 1) {
                        this.option.img = data
                    } else if (num === 2) {
                        this.example2.img = data
                    }
                }
                // 转化为base64
                // reader.readAsDataURL(file)
                // 转化为blob
                reader.readAsArrayBuffer(file)
            },
            imgLoad (msg) {
                console.log(msg)
            },
            uploadToServer: function () {
                const that = this
                that.$refs.cropper.getCropBlob((avatar) => {
                    var formdata = new FormData()
                    // console.log(avatar)
                    formdata.append("avatar", avatar)
                    POST({
                        url: '/api/user/updateAvatar',
                        data: formdata,
                        config: {
                            contentType: false,
                            processData: false,
                            headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
                        },
                        callback: res => {
                            if(res.code === 200){
                                let user = JSON.parse(localStorage.getItem("user"));
                                user['avatar'] = res.data.filename
                                localStorage.setItem("user", JSON.stringify(user))
                                EventBus.$emit("changeAvatar")
                                layerMsg("修改头像完成!")
                            } else {
                                layerError(res.message)
                            }
                        }
                    })
                })
            },
            cancle: function () {
                EventBus.$emit("closeAvatar")
            }
        }
    }

</script>

<style scoped>
  @media only screen and (max-width: 768px){
    .update-div .form{
      width: 95%!important;
    }
    .cropper-content .cropper{

    }
  }
    .cropper-content{
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;
    }
    .cropper-content .cropper{
        width: 350px;
        height: 300px;
    }
    .cropper-content .preview{
        overflow: hidden;
        border-radius: 50%;
        border:1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
    }
    .cropper-content .show-preview{
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
    }
    .footer-btn {
        margin-top: 30px;
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;
    }
    .scope-btn{
        width: 350px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
    }
    .upload-btn{
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
    }
    .upload-btn button{
        margin: 0 10px;
    }


    .update-div {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99999;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    .update-div .form {
        background-color: white;
        width: 680px;
        height: 420px;
        border-radius: 4px;
        margin: 15% auto auto;
      /*margin:-165px 0 0 -260px;*/
        padding-left: 20px;
        padding-top: 30px;
    }
</style>
