<template>
  <el-container :class="homeContainerCss">
    <el-header class="homeHeader">
      <div class="title">
        <span>VUE学习DEMO</span>
      </div>
      <div>
        <el-tooltip class="item" effect="light" content="全屏按钮" placement="top-start">
          <span @click="toggleFullscreen" :class="isScreenFull ? 'fa fa-compress':'fa fa-expand'" style="margin-right:10px"></span>
        </el-tooltip>
        <el-dropdown  @command="commandHandler">
          <span class="el-dropdown-link">
            管理员<i><img src="@/assets/images/touxiang.jpg"/></i>
            <!-- 管理员<avatar username="志强" 
                        background-color="#fff" 
                        color="rgb(255, 208, 75)"
                        style=" vertical-align: middle;font-size:10px"></avatar> -->
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '68px' : '200px'" class="homeAside">
        <div class="toggle-button" @click="toggleCollapse">
          <i v-if="!isCollapse" class="el-icon-s-fold"></i>
          <i v-else class="el-icon-s-unfold"></i>
        </div>
        <el-menu
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <MenuTree :menuList="this.menuList"></MenuTree>
        </el-menu>
      </el-aside>
      <el-main :class="homMainCss">
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/Welcome'">
          <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MenuTree from "../components/MenuTree";
// import Avatar from 'vue-avatar'
import screenfull from 'screenfull'

export default {
  name: "Index",
  data() {
    return {
      homeContainerCss:'homeContainer',
      homMainCss:'homeMain',
      menuList: [],
      isCollapse: false,
      isScreenFull:false        //是否全屏
    };
  },
  components: {
    MenuTree,
    Avatar
  },
  mounted () {
    // 监听窗口大小改变，screenfull.isFullscreen的值为是否全屏，若是则true，反之false
    window.onresize = () => {
      this.isScreenFull = screenfull.isFullscreen;
      var bHeight = document.body.clientHeight;
      this.homMainCss = screenfull.isFullscreen ? 'homeMainFull':'homeMain';
      this.homeContainerCss = screenfull.isFullscreen ? 'homeContainerFull':'homeContainer';
      console.log(this.homMainCss)
    }
  },
  methods: {
    toggleFullscreen (){
      if(!screenfull.isEnabled){     //判断一下浏览器是否支持全屏显示
        this.$message({
          message:'浏览器不能全屏',
          type:'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    commandHandler(cmd) {
      if (cmd == "logout") {
        this.logOut();
      }
    },
    logOut() {
      this.$confirm("确认退系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //1.注销
        //2.清除用户信息
        window.sessionStorage.clear();
        //3.清空菜单
        //4.跳转登录页面
        this.$router.push("/Login");
      });
    },
    getMenuList() {
      axios.get("/menu/findAll").then((resp) => {
        console.info(resp);
        this.menuList = resp.data;
      });
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {
    this.getMenuList();
    //console.info(this.$router.currentRoute);
  },
};
</script>

<style scoped>
.toggle-button {
  background-color:rgb(238, 241, 246);
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
}

.homeContainer {
  height: 100%;
  overflow: hidden;
}

.homeContainerFull {
  height: 100%;
  
}

.homeHeader {
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
  overflow-y: hidden;
}

.homeAside{
  --background-color:rgb(238, 241, 246);
}

.homeMain{
  background-color: #e9eef3;
  overflow-y: auto;
  height: 500px;
}
.homeMainFull{
  background-color: #e9eef3;
  overflow-y: auto;
  height: 100%;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 宋体;
  color: #ffffff;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-menu{
    border-right: none;
}


.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
 
}

</style>
