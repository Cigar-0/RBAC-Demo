<template>
    <el-transfer v-model="value" :data="data" style="margin-left:25px"></el-transfer>
</template>

<script>
export default {
    props: ["modelId"],
    inject: ['reload'],
    data(){
        const generateData = _ => {
            const data = [];
            for (let i = 1; i <= 15; i++) {
            data.push({
                key: i,
                label: `备选项 ${ i }`,
                disabled: i % 4 === 0
            });
            }
            return data;
        };
        return{
            data: generateData(),
            title:"",
            ruleForm: {
                id: null,
                username: '',
                password: '',
                phone:'',
                nickName:'',
                realName:'',
                sex:1
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let url = '';
                    let msg = '';
                    //alert(!this.modelId);
                    if (this.modelId != null) {
                        //修改
                        url = '/sysuser/update';
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
                        url = '/sysuser/save';
                        msg = '添加成功';
                        axios.post(url, this.ruleForm).then((params) => {
                            this.$alert(this.ruleForm.username + msg, '消息', {
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
            this.$getRequest('/sysuser/findById/' + this.modelId).then((resp) => {
                this.ruleForm = resp.data;
            });
        }
    },
}
</script>

<style>

</style>