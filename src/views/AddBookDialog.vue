<template>
   <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
        <el-form-item label="图书名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
            <el-input v-model="ruleForm.author"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
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
                author: ''
            },
            rules: {
                name: [
                    { required: true, message: '图书名称不能为空', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '作者不能为空', trigger: 'blur' }
                ]
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
        resetForm(formName) {
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].resetFields();
            }
        },
        submitForm(formName) {
            this.dialogVisible = false;
            const _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let url = '';
                    let msg = '';
                    //alert(!this.modelId);
                    if (this.modelId != null) {
                        //修改
                        url = '/book/update';
                        msg = '修改成功';
                        axios.put(url, this.ruleForm).then((params) => {
                            this.$alert(this.ruleForm.name + msg, '消息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    //_this.$router.push('/BookManage')
                                    this.reload();
                                }
                            });
                        })
                    } else {
                        //添加
                        url = '/book/save';
                        msg = '添加成功';
                        axios.post(url, this.ruleForm).then((params) => {
                            this.$alert(this.ruleForm.name + msg, '消息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    //_this.$router.push('/BookManage')
                                    this.reload();
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
            axios.get('/book/findById/' + this.modelId).then((resp) => {
                this.ruleForm = resp.data;
            });
        }
    },
}
</script>

<style>

</style>