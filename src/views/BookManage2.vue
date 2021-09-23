<template>
  <div>
    <!--面包屑导航区-->
    
    <el-card class="box-card">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini">
        <el-form-item label="图书名">
          <el-input v-model="queryForm.name" placeholder="图书名"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="queryForm.author" placeholder="作者"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryAll(1)" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button @click="add()" size="mini">页面添加</el-button>
        <el-button type="primary" @click="showAddView()" size="mini" icon="el-icon-plus">弹窗添加</el-button>
        <el-button type="success" @click="showUpdWindow()" size="mini" icon="el-icon-edit">弹窗修改</el-button>
        <el-button type="danger" @click="batchDel()" size="mini" icon="el-icon-delete">删除</el-button>
      </el-row>

      <el-table :data="tableData" border stripe fit highlight-current-row            
                @selection-change="selectionLineChangeHandle" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" width="60">
          <template scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
        </el-table-column>
        <el-table-column prop="id" label="主键" width="150">
        </el-table-column>
        <el-table-column prop="name" label="图书名" width="230">
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="350">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="primary" size="mini" icon="el-icon-edit">修改</el-button>
            <el-button @click="showEditView(scope.row)" type="success" icon="el-icon-edit" size="mini">弹窗修改</el-button>
            <el-button @click="deleteBook(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="title" :visible.sync="dialogVisible" v-if="dialogVisible" width="50%" :before-close="handleClose">
        <AddBookDialog :modelId="modelId"></AddBookDialog>
      </el-dialog>
      <!-- <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="page" :current-page.sync="currentPage">
      </el-pagination> -->
      <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                      :current-page.sync="currentPage" :page-sizes="[2, 4, 6,10]" 
                      layout="total, sizes, prev, pager, next, jumper" :total="total" >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import AddBookDialog from "./AddBookDialog"
export default {
  methods: {
    deleteBook (row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/book/deleteById/' + row.id).then((params) => {
          this.$alert('《' + row.name + '》删除成功！', '消息', {
            confirmButtonText: '确定',
            callback: action => {
              this.reload();
            }
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    add () {
      this.$router.push({
        path: '/AddBook'
      })
    },
    edit (row) {
      this.$router.push({
        path: '/UpdateBook',
        query: {
          id: row.id
        }
      })
    },
    showAddView () {
      this.title = '弹窗方式添加';
      this.dialogVisible = true;
      this.modelId = null;

    },
    showEditView (row) {
      this.title = '弹窗方式修改';
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
          axios.delete('/book/deleteByIds/' + ids.join(',')).then((resp) => {
            //window.location.reload();
            this.reload();
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
    page (currentPage) { 
      axios.post('/book/pageQuery/' + (currentPage) + '/' + this.pageSize, this.queryForm).then((resp) => {
        console.log(resp);
        this.tableData = resp.data.content
        this.pageSize = resp.data.size
        this.total = resp.data.totalElements
      })
    },
    queryAll (currentPage) {     
      axios.post('/book/pageQuery/' + (currentPage) + '/' + this.pageSize, this.queryForm).then((resp) => {
        console.log(resp);
        this.tableData = resp.data.content
        this.pageSize = resp.data.size
        this.total = resp.data.totalElements
        this.currentPage = resp.data.number;
        if (this.currentPage < 1) {
          this.currentPage = 1;
        }      
      })
    },
    handleCurrentChange(newCurrentPage){
      this.currentPage = newCurrentPage;
      this.page(newCurrentPage);
    },
    handleSizeChange(newPageSize){
      this.pageSize = newPageSize;
      this.page(1);
    },
    selectionLineChangeHandle (val) {
      this.dataonLineListSelections = val
    },
  },

  inject: ['reload'],
  data () {
    return {
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
        author: ''
      },
      queryForm: {
        name: '',
        author: ''
      }    
    }
  },
  components: {
    AddBookDialog
  },
  created () {
    this.dialogVisible = false;
   
    this.queryAll(1);
  }
}
</script>