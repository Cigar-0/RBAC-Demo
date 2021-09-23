<template>
  <div class="login_container">
    <div class="login_mask">
      <div class="login_box">
        <h2 class="title">Vue权限管理系统</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="login_form">
          <el-form-item prop="username">
            <el-input size="normal" v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input size="normal" v-model="loginForm.password" type="password" :show-password="true" prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input size="normal" type="text" v-model="loginForm.code" auto-complete="false" placeholder="点击图片更换验证码" style="width:250px;margin-right: 5px;vertical-align:top;"></el-input>
            <img :src="captchaUrl" @click="updateCaptcha">
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" size="normal" @click="submitLoginForm">登录</el-button>
            <el-button type="info" size="normal" @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      captchaUrl: this.baseURL+'/captcha?time=' + new Date(),
      code: "6666",
      loginForm: {
        username: "",
        password: "",
        code: "",
        type: 1,
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = this.baseURL+"/captcha?time=" + new Date();
    },
    submitLoginForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          window.sessionStorage.setItem("token", "12345678");
          //push 浏览器可以后退回登录页，replace浏览器不可以后退回登录页
          //this.$router.push("/Index");
          //this.$router.replace("/Index");
          
          let path = this.$route.query.redirect;
          this.$router.replace((path=='/' || path==undefined)?'/Index':path);
          this.$message({
            message: "登录成功，欢迎您！",
            type: "success",
          });

        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.login_container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  background: rgb(81, 90, 110);
}
.login-container .title {
  margin-top: 32px;
  font-size: 26px;
  color: #666;
}
.login_mask {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgb(81, 90, 110);
}
.login_box {
  width: 450px;
  height: 330px;
  background-color: #fff;
  border-radius: 7px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  --border: 1px solid #eaeaea;
  --box-shadow: 0 0 25px #cac6c6;
}
.login_form {
  width: 80%;
  margin: 0 auto;
  padding-bottom: 10px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
 
}
.login_btn{
  display: flex;
  justify-content: flex-end;
  margin: 20px;
}
</style>