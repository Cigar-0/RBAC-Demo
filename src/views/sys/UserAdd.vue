<template>
  <div class="el-dialog-div">
   <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
        <el-row :gutter="20" style="margin-left: -10px;margin-right: 10px;">
            <el-col :span="12">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left: -10px;margin-right: 10px;">
            <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
            </el-col>
             <el-col :span="12">
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="ruleForm.nickName"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left: -10px;margin-right: 10px;">
            <el-col :span="12">
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="ruleForm.realName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="性别" >
                    <template>
                        <el-radio v-model="ruleForm.sex" :label="1" border>男</el-radio>
                        <el-radio v-model="ruleForm.sex" :label="2" border>女</el-radio>       
                    </template>
                </el-form-item>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-transfer :titles="transferTitle" v-model="ruleForm.roleIds" :data="roleAll" style="margin-left:25px; margin-bottom: 10px;"></el-transfer>
            </el-col>         
        </el-row>
   </el-form>
  
  </div>
 
</template>

<script>
export default {
    props: ["modelId"],
    inject: ['reload'],
    data(){       
        return{
            roleAll:[],        //左侧全部角色列表     
            transferTitle:['全部角色列表', '已选择角色列表'],
            title:"",
            roleForm:{
                id:null,
                name:'',
                description:'',
                status:1,
            },
            ruleForm: {
                id: null,
                username: '',
                password: '',
                phone:'',
                nickName:'',
                realName:'',
                sex:1,
                roleIds:[],
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                ],
                nickName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
                ],
                realName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
                ],
            }
        }
    },
    methods:{        
        resetForm() {
            if (this.$refs.ruleForm !== undefined) {
                this.$refs.ruleForm.resetFields();
            }
        },
        initAllRoles(){
            const data = [];
            this.$postRequest('/sysrole/findAll',this.roleForm).then((resp) => {
                debugger;
                if(resp.flag){                 
                   for (let i = 0; i < resp.data.length; i++) {
                        let role = resp.data[i];
                        data.push({
                            key: role.id,
                            label: role.name,
                            disabled: role.status === 0
                        });
                    }                 
                }               
            });
            this.roleAll = data;
        },
        submitForm() {  
            if(this.ruleForm.roleIds.length == 0){
                this.$message.error('请选择一个至少一个角色!');
                return;
            }
            this.$refs.ruleForm.validate((valid) => {               
                if (valid) {
                    let url = '';
                    let msg = '';
                    //alert(!this.modelId);
                    if (this.modelId != null) {
                        //修改
                        url = '/sysuser/update';
                        msg = '修改成功';
                        axios.put(url, this.ruleForm).then((resp) => {
                            if(resp.data.flag){
                                this.$alert( resp.data.msg, '消息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        //_this.$router.push('/BookManage')
                                        //this.reload();
                                        this.$emit('reload');
                                    }
                                });
                            }else{
                                this.$message.error(resp.data.msg);
                            }
                        })
                    } else {
                        //添加
                        url = '/sysuser/save';
                        msg = '添加成功';
                        axios.post(url, this.ruleForm).then((resp) => {
                            if(resp.data.flag){
                                this.$alert( resp.data.msg, '消息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        //_this.$router.push('/BookManage')
                                        //this.reload();
                                        this.$emit('reload');
                                    }
                                });
                            }else{
                                 //this.$message.error(resp.msg);
                                this.$message.error(resp.data.msg);
                            }
                        })
                    }

                } else {
                    return false;
                }
            });
        },
            
    },
    created () {
        //alert(this.modelId);
        //resetForm('ruleForm');
        if(this.modelId !=null){
            this.$getRequest('/sysuser/findById/' + this.modelId).then((resp) => {
                this.ruleForm = resp.data;
            });
        }

        this.initAllRoles();
    },
}
</script>

<style scoped>
  .el-dialog-div{
      height: 350px;   
      overflow-x: hidden;
    
  }
</style>