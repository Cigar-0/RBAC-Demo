<template>
  <div id="app" @click="isTimeOut">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<style>
 
</style>

<script>
  export default {
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
        lastTime: null, // 最后一次点击的时间
        currentTime: null, // 当前点击的时间
        timeOut: 30*60*1000 // 设置超时时间:30分钟
      }
    },
    created () {
      this.lastTime = new Date().getTime()
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      },
      //登录超时函数
      isTimeOut () {
        this.currentTime = new Date().getTime() // 记录这次点击的时间
        if (this.currentTime - this.lastTime > this.timeOut) { // 判断上次最后一次点击的时间和这次点击的时间间隔是否大于30分钟
          if (window.sessionStorage.getItem("token") != null) { // 如果是登录状态
            //登录超时，返回登录页面
            window.sessionStorage.clear();
            this.$router.push("/Login");
          } else {
            this.lastTime = new Date().getTime()
          }
        } else {
          this.lastTime = new Date().getTime() // 如果在30分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
        }
      }
    }
  };
</script>