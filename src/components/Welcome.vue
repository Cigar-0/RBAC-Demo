<template>
  <div>
    <div>
      <div class="homeWelcome">
        这是vue 前后端分离demo，您将学习到如下内容
      </div>
      <div class="homeContainer">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>前端</span>
            <el-button style="float: right; padding: 3px 0;color:red" icon="el-icon-delete" type="text"></el-button>
          </div>
          <div class="text item">
            <div>1.登录，校验，验证码，页面跳转</div>
            <div>2.布局容器，菜单，弹出窗口，列表CRUD，分页，头像组件</div>
            <div>3.动态面包屑，树</div>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>后端</span>
            <el-button style="float: right; padding: 3px 0;color:red" icon="el-icon-delete" type="text"></el-button>
          </div>
          <div >
            <div>1.shrio</div>
            <div>2.jwt</div>
            
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>前端</span>
            <el-button style="float: right; padding: 3px 0;color:red" icon="el-icon-delete" type="text"></el-button>
          </div>
          <div>
            <div>1.布局容器，菜单，弹出窗口，列表CRUD，分页，头像组件</div>
            <div>2.动态菜单，动态路由，路由守卫</div>
            <div>3.axios封装</div>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>后端</span>
            <el-button style="float: right; padding: 3px 0;color:red" icon="el-icon-delete" type="text"></el-button>
          </div>
          <div>
            <div>1.页面访问权限</div>
            <div>2.按钮访问权限</div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.homeWelcome {
  text-align: center;
  font-size: 38px;
  padding-top: 10px;
  font-family: "华文楷体";
  color: #409eef;
}
.homeContainer {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  flex-wrap: wrap;
}
.box-card {
  width: 380px;
  margin-bottom: 5px;
}
</style>
