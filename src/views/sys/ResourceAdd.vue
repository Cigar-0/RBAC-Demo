<template>
    <div class="el-dialog-div">
        <div style="width:70%;margin-left:10%">    
            <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
                <el-form-item label="父节点:" prop="pid">
                <treeselect 
                        v-model="ruleForm.pid" 
                        :multiple="false" 
                        :options="treeData"
                        placeholder="请选择父级节点" 
                        :normalizer="normalizer"/>
                </el-form-item>
                <el-form-item label="资源类型:" prop="type">
                    <template>
                        <el-radio v-model="ruleForm.type" :label="1" border>目录</el-radio>
                        <el-radio v-model="ruleForm.type" :label="2" border>菜单</el-radio>  
                        <el-radio v-model="ruleForm.type" :label="3" border>按钮</el-radio>      
                    </template>
                </el-form-item>
                <el-form-item label="资源名称:" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="请求路径url:" prop="url">
                    <el-input v-model="ruleForm.url"></el-input>
                </el-form-item>
                <el-form-item label="权限码:" prop="perms">
                    <el-input v-model="ruleForm.perms"></el-input>
                </el-form-item>
                <el-form-item label="请求方式:" prop="method">
                    <el-select v-model="ruleForm.method" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标:" prop="icon">
                    <el-input v-model="ruleForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="排序:" prop="orderNum">
                    <el-input-number v-model="ruleForm.orderNum" controls-position="right"  :min="1" ></el-input-number>
                </el-form-item>        
            </el-form>
        </div>
    </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
  // import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
    components: { Treeselect },
    props: ["modelId"],
    inject: ['reload'],
    data(){
        return {
            // define options
            treeData: [],
            //后台返回的数据如果和VueTreeselect要求的数据结构不同，需要进行转换
            normalizer(node){
                //去掉children=[]的children属性         
                if(node.children && !node.children.length){
                    delete node.children;
                }
                return {
                    id: node.id,
                    label:node.title,
                    children:node.children
                }
            }, 
            ruleForm: {
                pid: null,
                type:1,
                title:"",
                url:"",
                perms:"",               
                method:"",
                orderNum:1,
                icon:""
            },
            options: [{
                value: 'GET',
                label: 'GET'
                }, {
                value: 'POST',
                label: 'POST'
                }, {
                value: 'PUT',
                label: 'PUT'
                }, {
                value: 'DELETE',
                label: 'DELETE'
            }],
            rules: {
                pid: [
                    { required: true, message: '请选择父节点', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择资源类型', trigger: 'blur' },
                ],
            },
        }
    },
    methods:{  
        initTree(){
            this.$getRequest('/syspermisson/getPermissionTreeWithRoot').then((resp) => {
                console.log(resp.data);              
                this.treeData = resp.data
            });
        },   
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
                        url = '/syspermisson/update';
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
                        url = '/syspermisson/save';
                        msg = '添加成功';
                        axios.post(url, this.ruleForm).then((params) => {
                            this.$alert(this.ruleForm.title + msg, '消息', {
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
            this.$getRequest('/syspermisson/findById/' + this.modelId).then((resp) => {
                debugger
                this.ruleForm = resp.data;
                console.log(this.ruleForm)
            });
        }
        this.initTree();

    },
}
</script>

<style scoped>
.el-dialog-div{
    height: 350px;   
    overflow-x: hidden;
}    
</style>