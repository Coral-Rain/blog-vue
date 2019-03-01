// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import 'jquery'
import layer from '../static/lib/layer/layer'
import Global from './tools/Global.vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.prototype.GLOBAL = Global
Vue.config.productionTip = false
axios.defaults.withCredentials=true;


Vue.use(mavonEditor,VueAxios,axios,Vuex, layer);

Vue.filter('fileSize', function (value) {
  var size = parseInt(value);
  var kb = 1024;
  var mb = 1024 * 1024;
  var gb = 1024 * 1024 * 1024;

  if (value < kb) return size + 'B';

  if (value < mb) {
    if (value % kb === 0) {
      return (value / kb) + "K"
    }
    else {
      return (value / kb).toFixed(2) + "K"
    }
  }

  if (value < gb) {
    if (value % mb === 0) {
      return (value / mb) + "M"
    }
    else {
      return (value / mb).toFixed(2) + "M"
    }
  }

  if (value % gb === 0) {
    return (value / gb) + "G"
  }
  else {
    return (value / gb).toFixed(2) + "G"
  }
});

Vue.filter('datetime', function (value) {
  var dt = new Date(value);
  var y = dt.getFullYear();
  var M = dt.getMonth() + 1;
  var d = dt.getDate();
  var h = dt.getHours();
  var m = dt.getMinutes();

  if (M < 10) M = '0' + M;
  if (d < 10) d = '0' + d;
  if (h < 10) h = '0' + h;
  if (m < 10) m = '0' + m;

  return y + '-' + M + '-' + d + ' ' + h + ':' + m;
});

Vue.filter('memberLevel', function (exp) {
  if(exp >= 0 && exp <= 100){
    return 1;
  } else if (exp >= 101 && exp <= 500){
    return 2;
  } else if (exp >= 501 && exp <= 3000){
    return 3;
  } else if (exp >= 3001 && exp <= 10000){
    return 4;
  } else if (exp >= 10001 && exp <= 20000){
    return 5;
  } else if (exp >= 20001 && exp <= 35000){
    return 6;
  } else if (exp >= 35001 && exp <= 60000){
    return 7;
  } else if (exp >= 60001 && exp <= 100000){
    return 8;
  } else if (exp >= 100001 && exp < 200000){
    return 9;
  } else {
    return 10;
  }
})

Vue.filter('isNull', function (string) {
  if(string == null) return ''
  else return string.toString()
})

Vue.filter('getDate', function (timestamp) {
  if(timestamp === '') return '未设置'
  var date = new Date(parseInt(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
  return Y+M+D;
})

Vue.filter('status', function (status) {
  if(status === -2){
    return '登录失败，密码错误'
  }else if (status === 0){
    return '登录失败，未激活'
  } else {
    return '登录成功'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
