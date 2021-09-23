<template>
  <div>
    <!--卡片-->  
    <el-card class="box-card">
      <div>
        <div style="display:flex;justify-content: space-between;">
          <div>         
              <el-button @click="showAddView()" type="primary" size="mini" icon="el-icon-plus">添加</el-button>
          </div>          
        </div>
      </div>
     
      <el-table :data="tableData" border stripe fit highlight-current-row            
                @selection-change="selectionLineChangeHandle" row-key="id" 
                style="width: 100%">
        <el-table-column fixed label="#" width="120">
          <template scope="scope"><span>{{scope.$index + 1}} </span></template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="主键" width="150">
        </el-table-column> -->
        <el-table-column prop="type" fixed label="资源类型" width="80">
            <template slot-scope="scope">
                <el-tag :type="formatTagType(scope.row.type)">{{formatTagTypeStr(scope.row.type)}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="title" fixed label="资源名称" width="180">
            <template slot-scope="scope">
                <i :class="scope.row.icon"></i>
                {{scope.row.title}}
            </template>
        </el-table-column>
        <el-table-column prop="url" label="请求路径" width="180">
        </el-table-column>
        <el-table-column prop="perms" label="权限码" width="180">
        </el-table-column>
        <el-table-column prop="method" label="请求方式" width="100">
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="70">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150" >
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.status"
                    :active-value="1"
                    :inactive-value="2"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="停用"
                    @change="changeSwitch(scope.row)"/>
            </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150">
            <template slot-scope="scope">{{scope.row.createTime | dateYMDHMSFormat}}</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="150">
            <template slot-scope="scope">{{scope.row.updateTime | dateYMDHMSFormat}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="showEditView(scope.row)" type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button @click="deleteFun(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog  v-dialogDrag :title="title" :visible.sync="dialogVisible" v-if="dialogVisible" width="50%" :before-close="handleClose">
        <ResourceAdd ref="ResourceAdd" :modelId="modelId" @reload="queryAll"></ResourceAdd>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import ResourceAdd from "./ResourceAdd"


export default {
  methods: {
    deleteFun (row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/syspermisson/deleteById/' + row.id).then((resp) => {
          debugger
          console.log(resp);
          if(resp.data.flag){
            this.$alert( row.title + '删除成功！', '消息', {
              confirmButtonText: '确定',
              callback: action => {
                //this.reload();
                this.queryAll();
              }
            })
          }else{
             this.$message.error(resp.data.msg);
          }         
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
   
    showAddView () {
      this.title = '资源添加';
      this.dialogVisible = true;
      this.modelId = null;

    },
    showEditView (row) {
      this.title = '资源修改';
      this.dialogVisible = true;
      this.modelId = row.id;
    },
    showUpdWindow () {
      var rowDatas = this.dataonLineListSelections
      if (rowDatas.length != 1) {
        this.$alert('修改时只能选择一条数据', '系统提示', {
          confirmButtonText: '确定',

        });
      } else {
        this.title = '弹窗方式修改';
        this.dialogVisible = true;
        this.modelId = rowDatas[0].id;
      }
    },
   
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    closeAdd(){
      this.$confirm('确认关闭？')
          .then(_ => {
            this.dialogVisible = false;
          })
          .catch(_ => { });
    },
    submitAdd(){
      this.$refs.ResourceAdd.submitForm();
    },
    queryAll () {    
      let url = '/syspermisson/getPermissionTreeNoRoot';
      this.$getRequest(url, this.queryForm).then((resp) => {
        console.log(resp);
        this.tableData = resp.data; 
        this.dialogVisible = false;  
      })
    },
    
    selectionLineChangeHandle (val) {
      this.dataonLineListSelections = val
    },
    formatterSex(row, column, cellValue, index){
        if(cellValue == '1'){
            return '男';
        }
        if(cellValue == '2'){
            return '女';
        }
        return cellValue;
    },
    formatterStatus(row, column, cellValue, index){
        if(cellValue == '1'){
            return '正常';
        }
        if(cellValue == '0'){
            return '停用';
        }
        return cellValue;
    },
   
    reSetAdvForm(){
        let nullValus = {
          username: '',
          phone:'',
          realName:"",
          nickName:"",
          email:"",
        }
        //对象赋空，清空queryForm的数据
        this.queryForm = Object.assign({},nullValus)
        this.showAdvSerach = !this.showAdvSerach
    },
    changeSwitch(row){      
        console.info(row);
        let obj ={
          id:row.id,
          status:row.status
        }
        let url = '/syspermisson/updateStatus';
        axios.put(url, obj).then((resp) => {
          if(resp.flag){
              this.$alert( resp.msg, '消息', {
                confirmButtonText: '确定',
                callback: action => {
                   this.queryAll();
                }
            });
          }
        })
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
  },

  inject: ['reload'],
  data () {
    return {
      showAdvSerach:false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      tableData: [],
      dataonLineListSelections: [],
      title: '',
      modelId: null,
      ruleForm: {
        id: null,
        name: '',
      },
      queryForm: {
        username: '',
        phone:'',
        realName:"",
        nickName:"",
        email:"",
        timeVule:""
      }, 
    }
  },
  components: {
    ResourceAdd
  },
  created () {
    this.dialogVisible = false;
    this.queryAll();
  }
}
</script>
<style scoped>

</style>