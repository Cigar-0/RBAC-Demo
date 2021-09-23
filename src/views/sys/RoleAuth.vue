<template>
    <div class="advSerach">
        <div class="el-dialog-div">
            <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
                <el-tree
                    ref="tree"
                    :data="treeData"
                    show-checkbox
                    check-strictly
                    node-key="id"
                    :default-expanded-keys="[2, 3]"
                    :default-checked-keys="defaultCheckedKeys"
                    :props="defaultProps"
                    @check="checkeTree"
                    @check-change="checkChange">
                    <span slot-scope="{ node, treeData }">
                        <span>{{ node.label }}</span>
                        <span style="margin-left:20px">
                        <el-tag :type="formatTagType(node.data.type)">{{formatTagTypeStr(node.data.type)}}</el-tag>
                        </span>
                    </span>
                </el-tree>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    props: ["modelId"],
    inject: ['reload'],
    data(){
        return{
            treeData: [],
            checkStrictly:false,
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            defaultCheckedKeys:[],
            title:"",
            ruleForm: {
                roleId: null,
                permissionIds:[]
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
        resetForm() {
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].resetFields();
            }
        },
        formatTagType(type) {
            if (type === 1) return 'nomal'
            else if (type === 2 ) return 'success'
            else if (type === 3) return 'danger'
            else return 'success'
        },
        formatTagTypeStr(type) {
            if (type === 1) return '目录'
            else if (type === 2 ) return '菜单'
            else if (type === 3) return '按钮'
            else return type
        },
        getCheckedId(){
            // 类似easyuitree 因为cascadeCheck:true时，勾选了子节点后，提交的数据，没有包含父节点
            let halfKeys = this.$refs.tree.getHalfCheckedKeys();
            let checkedKeys = this.$refs.tree.getCheckedKeys();           
            console.log(halfKeys);       
            console.log(checkedKeys);
            return halfKeys.concat(checkedKeys);
        },

        // 选中子节点，默认选中父节点
        checkeTree (data) {          
            let thisNode = this.$refs.tree.getNode(data.id) // 获取当前节点
            debugger;
            const keys = this.$refs.tree.getCheckedKeys() // 获取已勾选节点的key值      
            if (thisNode.checked) { // 当前节点若被选中
                for (let i = thisNode.level; i > 1; i--) { // 判断是否有父级节点
                    if (!thisNode.parent.checked) { // 父级节点未被选中，则将父节点替换成当前节点，往上继续查询，并将此节点key存入keys数组
                        thisNode = thisNode.parent
                        keys.push(thisNode.data.id)
                    }
                }
            }  
            this.$refs.tree.setCheckedKeys(keys) // 将所有keys数组的节点全选中
        },

        checkChange(a,b,c){
            debugger
            //如果为取消
            if(b === false){
                //如果当前节点有子集
                if(a.children){
                    //循环子集将他们的选中取消
                    a.children.map(item => {
                        this.$refs.tree.setChecked(item.id,false);
                    })
                }
            }else{
                //否则(为选中状态)
                //判断父节点id是否为空
                if(a.pid !== ""){
                    //如果不为空则将其选中
                    this.$refs.tree.setChecked(a.pid,true);
                }
            }
        },
        submitForm() {         
            let allKeys = this.getCheckedId();
            debugger
            if (allKeys.length >0 ) {   
                if (this.modelId != null) {                   
                    this.ruleForm.roleId = this.modelId;
                    this.ruleForm.permissionIds = allKeys;
                    let url = '/sysrole/roleGantAuth';
                    let msg = '角色分配资源成功';
                    axios.put(url, this.ruleForm).then((resp) => {   
                        console.log(resp)
                        debugger                    
                        if(resp.data.flag){
                            this.$alert( msg, '消息', {
                                confirmButtonText: '确定',
                                callback: action => {                                 
                                    this.$emit('reload');
                                }
                            });
                        }else{
                            //授权失败
                            this.$message.error('角色授权失败!');
                        }
                    })
                } 
            } else {
                 this.$message.error('请选择资源!');
                return false;
            }
        },
        initTree(){
            this.$getRequest('/syspermisson/getPermissionTreeNoRoot').then((resp) => {
                this.treeData = resp.data;
            });
            if(this.modelId !=null){
               this.$getRequest('/sysrole/getPermissonByRoleId/'+this.modelId).then((resp) => {
                    this.defaultCheckedKeys = resp.data;                 
              });
            }
        }     
    },
    created () {
       this.initTree();
    },
}
</script>

<style scoped>
    .el-dialog-div{
        height: 320px;   
        overflow-x: hidden; 
        margin-left: 30px;   
    }
    .advSerach{  
        border:1px solid #409eff;
        border-radius:5px;
        box-sizing:border-box;
        padding:5px;
        margin:10px 0px;
        font-size: 12px;
    }
</style>