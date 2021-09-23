<template>
 <div class="el-dialog-div" >
        <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
            <el-form-item label="角色名称:" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述:" prop="description">
                <el-input v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
                <el-switch
                    v-model="ruleForm.status"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="启用"
                    inactive-text="停用"
                />
            </el-form-item>     
        </el-form>
   </div>
</template>

<script>
export default {
    props: ["modelId"],
    inject: ['reload'],
    data(){
        return{
            title:"",
            ruleForm: {
                id: null,
                name: '',
                description: '',
                status:1
            },
            rules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                ],
            }
        }
    },
    methods:{        
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        resetForm() {
            if (this.$refs.ruleForm !== undefined) {
                this.$refs.ruleForm.resetFields();
            }
        },
        submitForm() {                  
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let url = '';
                    let msg = '';
                    //alert(!this.modelId);
                    if (this.modelId != null) {
                        //修改
                        url = '/sysrole/update';
                        msg = '修改成功';
                        axios.put(url, this.ruleForm).then((params) => {
                            this.$alert( msg, '消息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    //_this.$router.push('/BookManage')
                                    //this.reload();
                                    this.$emit('reload');
                                }
                            });
                        })
                    } else {
                        //添加
                        url = '/sysrole/save';
                        msg = '添加成功';
                        axios.post(url, this.ruleForm).then((params) => {
                            this.$alert(this.ruleForm.name + msg, '消息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    //_this.$router.push('/BookManage')
                                    //this.reload();
                                    this.$emit('reload');
                                }
                            });
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
            this.$getRequest('/sysrole/findById/' + this.modelId).then((resp) => {
                this.ruleForm = resp.data;
            });
        }
    },
}
</script>

<style scoped>
.el-dialog-div{
    height: 200px;   
    overflow-x: hidden;  
    width: 70%;
}
</style>