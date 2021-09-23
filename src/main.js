import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'

import 'font-awesome/css/font-awesome.min.css'

import { showLoading, hideLoading } from './utils/loading';

import './utils/dialog'

//日期时间格式化
import moment from 'moment'
Vue.use(require('vue-moment'));
Vue.prototype.moment = moment
Vue.filter('dateYMDHMSFormat',function(dateStr,pattern='YYYY-MM-DD HH:mm:ss'){
  if(dateStr != null && dateStr !=''){
    return moment(dateStr).format(pattern);
  }else{
    return dateStr;
  }
})

//进度条的组件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
//插件
Vue.prototype.$postRequest = postRequest;
Vue.prototype.$putRequest = putRequest;
Vue.prototype.$getRequest = getRequest;
Vue.prototype.$deleteRequest = deleteRequest;

Vue.prototype.baseURL="http://localhost:8181/vuedemo";



//为所有的请求加token的请求头
axios.interceptors.request.use(config =>{
  //showLoading();
  //request拦截器中调用显示进度条
  NProgress.start();
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})

axios.interceptors.response.use(config =>{
  //hideLoading();
  //response拦截器中调用隐藏进度条
  NProgress.done();
  return config;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
