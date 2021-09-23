<template>
  <div>
    <!--卡片-->  
    <el-card class="box-card">
      <div>
        <div style="display:flex;justify-content: space-between;">
          <div>
              <el-input :disabled="showAdvSerach" style="width:300px;margin-right:10px" 
                      v-model="queryForm.name" 
                      clearable 
                      prefix-icon="el-icon-search" 
                      placeholder="请输入角色名称查询"
                      @clear="queryAll()"></el-input>
              <el-button type="primary" :disabled="showAdvSerach" size="mini" @click="queryAll()" icon="el-icon-search">查询</el-button>
              <el-button @click="showAddView()" type="primary" size="mini" icon="el-icon-plus">添加</el-button>
              <el-button @click="showAuthView()" type="primary" size="mini" icon="el-icon-setting">授权</el-button>
          </div>          
        </div>
      </div>
     
      <el-table :data="tableData" border stripe fit highlight-current-row            
                @selection-change="selectionLineChangeHandle" style="width: 100%">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column fixed label="#" width="60">
          <template scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="主键" width="150">
        </el-table-column> -->
        <el-table-column prop="name" fixed label="角色名称" width="150">
        </el-table-column>
        <el-table-column prop="description" label="角色描述" width="280">
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

      <el-dialog :title="title" :visible.sync="dialogVisible" v-if="dialogVisible" width="40%" :before-close="handleClose">
        <RoleAdd ref="RoleAdd" :modelId="modelId"  @reload="queryAll"></RoleAdd>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog  :title="title" :visible.sync="dialogAuthVisible" v-if="dialogAuthVisible" width="50%" :before-close="handleClose">
        <RoleAuth ref="RoleAuth" :modelId="modelId" @reload="queryAll"></RoleAuth>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAuth">取 消</el-button>
          <el-button type="primary" @click="submitAuth">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                      :current-page.sync="currentPage" :page-sizes="[2, 4, 6,10]" 
                      layout="total, sizes, prev, pager, next, jumper" :total="total" >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import RoleAdd from "./RoleAdd"
import RoleAuth from "./RoleAuth"

export default {
  methods: {
    deleteFun (row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/sysrole/deleteById/' + row.id).then((resp) => {
          debugger
          console.log(resp);
          if(resp.data.flag){
            this.$alert( row.name + '删除成功！', '消息', {
              confirmButtonText: '确定',
              callback: action => {
                //this.reload();
                this.queryAll();
              }
            })
          }else{

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
      this.title = '角色添加';
      this.dialogVisible = true;
      this.modelId = null;

    },
    showEditView (row) {
      this.title = '角色修改';
      this.dialogVisible = true;
      this.modelId = row.id;
    },
    showAuthView () {
      this.title = '角色授权';
      var ids = [];
      this.dataonLineListSelections.forEach(row => {
        ids.push(row.id)
      });
      if (ids.length == 1) {
        this.modelId = ids[0];
        this.dialogAuthVisible = true;
      }else{
        this.$message.error('角色授权时请选择一条记录!');
      }
      
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
    submitAuth(){
      this.$refs.RoleAuth.submitForm();
    },
    submitAdd(){
      this.$refs.RoleAdd.submitForm();
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
    closeAuth(){
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogAuthVisible = false;
        })
        .catch(_ => { });
    },
    queryAll () {    
      let url = '/sysrole/pageQuery/' + this.currentPage + '/' + this.pageSize;
      this.$postRequest(url, this.queryForm).then((resp) => {
        console.log(resp);
        this.tableData = resp.data.rows
        this.total = resp.data.total   
        this.dialogVisible = false;    
        this.dialogAuthVisible = false;
      })
    },
    handleCurrentChange(newCurrentPage){
      this.currentPage = newCurrentPage;
      this.queryAll();
    },
    handleSizeChange(newPageSize){
      this.pageSize = newPageSize;
      this.queryAll();
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
    filterTag(value, row) {
        return row.tag === value;
    },
    
    changeSwitch(row){      
        console.info(row);
        let role ={
          id:row.id,
          status:row.status
        }
        let url = '/sysrole/updateStatus';
        axios.put(url, role).then((resp) => {
          if(resp.flag){
              this.$alert( resp.msg, '消息', {
                confirmButtonText: '确定',
                callback: action => {
                   this.queryAll();
                }
            });
          }
        })
    }
  },

  inject: ['reload'],
  data () {
    return {
      showAdvSerach:false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogAuthVisible:false,
      tableData: [],
      dataonLineListSelections: [],
      title: '',
      modelId: null,
      ruleForm: {
        id: null,
        name: '',
      },
      queryForm: {
        name: ''    
      }, 
    }
  },
  components: {
    RoleAdd,
    RoleAuth
  },
  created () {
    this.dialogVisible = false;
    this.dialogAuthVisible = false;
    this.queryAll();
  }
}
</script>
<style scoped>

</style>