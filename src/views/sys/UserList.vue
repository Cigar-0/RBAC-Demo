<template>
  <div>
    <!--卡片-->  
    <el-card class="box-card">
      <div>
           <div style="display:flex;justify-content: space-between;">
                <div>
                <el-input :disabled="showAdvSerach" style="width:300px;margin-right:10px" 
                          v-model="queryForm.username" 
                          clearable 
                          prefix-icon="el-icon-search" 
                          placeholder="请输入用户查询"
                          @clear="queryAll()"></el-input>
                <el-button type="primary" :disabled="showAdvSerach" size="mini" @click="queryAll()" icon="el-icon-search">查询</el-button>
                <el-button type="primary" size="mini" @click="reSetAdvForm()">
                    <i :class="showAdvSerach?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"> </i>&nbsp;高级查询</el-button>
                </div>
                <div>
                    <el-button type="success" size="mini">
                        <i class="fa fa-level-up" aria-hidden="true"> </i>&nbsp;导入数据
                    </el-button>
                    <el-button type="success" size="mini" @click="exportExcel()">
                        <i class="fa fa-level-down" aria-hidden="true"> </i>&nbsp;导出数据
                    </el-button>
                    <el-button @click="showAddView()" type="primary" size="mini" icon="el-icon-plus">添加</el-button>
                </div>
            </div>
      </div>
      <transition name="fade">
        <div class="advSerach" v-if="showAdvSerach">
            <el-row :gutter="20">
                <el-col :span="2" style="padding-top:10px">
                   用户名：
                </el-col>
                <el-col :span="4"><el-input v-model="queryForm.username"></el-input></el-col>  
                <el-col :span="2" style="padding-top:10px">
                   手机号码：
                </el-col>
                <el-col :span="4"><el-input v-model="queryForm.phone"></el-input></el-col> 
                <el-col :span="2" style="padding-top:10px">
                   创建时间：
                </el-col>
                <el-col :span="4">
                  <el-date-picker
                    v-model="queryForm.timeVule"                 
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:5px">
                <el-col :span="2" style="padding-top:10px">
                   昵称：
                </el-col>
                <el-col :span="4"><el-input v-model="queryForm.nickName"></el-input></el-col>  
                <el-col :span="2" style="padding-top:10px">
                   电子邮箱：
                </el-col>
                <el-col :span="4"><el-input v-model="queryForm.email"></el-input></el-col>  

                <el-col :span="2" style="padding-top:10px">
                   姓名：
                </el-col>
                <el-col :span="4"><el-input v-model="queryForm.realName"></el-input></el-col> 
                <el-col :offset="19" :span="5">
                    <el-button type="info" icon="el-icon-close" size="mini"  @click="showAdvSerach=!showAdvSerach">取消</el-button>
                    <el-button type="primary" size="mini" @click="queryAll(1)" icon="el-icon-search">查询</el-button>
                </el-col>                         
            </el-row>
            <el-row :gutter="20" style="margin-top:5px">
              
            </el-row>
        </div>
      </transition>
      <el-table :data="tableData" border stripe fit highlight-current-row            
                @selection-change="selectionLineChangeHandle" style="width: 100%">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column fixed label="#" width="60">
          <template scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="主键" width="150">
        </el-table-column> -->
        <el-table-column prop="username" fixed label="用户名" width="100">
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" width="180">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" width="100">
        </el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="150">
        </el-table-column> 
        <el-table-column
            prop="status"
            label="状态"
            width="100" 
            >
            <template slot-scope="scope">
                <el-tag :type="scope.row.status == '1' ? 'primary' : 'danger'"
                         disable-transitions>{{scope.row.status=='1'?'启用':'停用'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="60" :formatter="formatterSex">
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
            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-dialog top="1%" :title="title" :visible.sync="dialogVisible" v-if="dialogVisible" width="55%"  :before-close="handleClose">
          <UserAdd ref="UserAdd" :modelId="modelId" @reload="queryAll"></UserAdd>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeAdd">取 消</el-button>
            <el-button type="primary" @click="submitAdd">确 定</el-button>
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
import UserAdd from "./UserAdd"
import UserRoleAdd from "./UserRoleAdd"

import { downloadFile } from '../../utils/util.js';

export default {
  methods: {
    deleteUser (row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/sysuser/deleteById/' + row.id).then((resp) => {          
          console.log(resp);
          if(resp.data.flag){
            this.$alert( row.username + '删除成功！', '消息', {
              confirmButtonText: '确定',
              callback: action => {
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
    submitAdd(){
      this.$refs.UserAdd.submitForm();
    },
    showAddView () {
      this.title = '用户添加';
      this.dialogVisible = true;
      this.modelId = null;

    },
    closeAdd(){
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false;
        })
        .catch(_ => { });
    },
    showEditView (row) {
      this.title = '用户修改';
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
    batchDel () {
      var ids = [];
      this.dataonLineListSelections.forEach(row => {
        ids.push(row.id)
      });
      if (ids.length > 0) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/sysuser/deleteByIds/' + ids.join(',')).then((resp) => {
            //this.reload();
            this.queryAll();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    queryAll () {    
      let url = '/sysuser/pageQuery/' + this.currentPage + '/' + this.pageSize;
      this.$postRequest(url, this.queryForm).then((resp) => {
        console.log(resp);

        this.tableData = resp.data.rows
        this.total = resp.data.total  
        this.dialogVisible = false;
      })
    },
    exportExcel(){
      let url = "/sysuser/export";
      axios({
           method: 'get',
           url: '/sysuser/export',
           responseType: 'blob'
        }).then((resp) => {
        downloadFile(resp)
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
      dialogVisibleUserRole:false,
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
    UserAdd,
    UserRoleAdd
  },
  created () {
    this.dialogVisible = false;
    this.queryAll();
  }
}
</script>
<style scoped>
  .advSerach{  
      border:1px solid #409eff;
      border-radius:5px;
      box-sizing:border-box;
      padding:5px;
      margin:10px 0px;
      font-size: 12px;
  }
  
</style>