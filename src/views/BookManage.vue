<template>
    <div>
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item label="图书名">
                <el-input v-model="queryForm.name" placeholder="图书名"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="queryForm.author" placeholder="作者"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryAll(1)">查询</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-button @click="add()" size="mini">页面添加</el-button>
            <el-button type="primary" @click="showAddView()" size="mini">弹窗添加</el-button>
            <el-button type="success" @click="showUpdWindow()" size="mini">弹窗修改</el-button>
            <el-button type="danger" @click="batchDel()" size="mini">删除</el-button>
        </el-row>
        <br>
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
                    <el-button @click="edit(scope.row)" type="primary" size="mini">修改</el-button>
                    <el-button @click="showEditView(scope.row)" type="success" size="mini">弹窗修改</el-button>
                    <el-button @click="deleteBook(scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="page"
            :current-page.sync="currentPage">
        </el-pagination>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
            <el-form style="width: 80%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="图书名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="ruleForm.author"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        methods: {
            deleteBook(row) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // const _this = this
                    // axios.delete('http://localhost:8181/book/deleteById/' + row.id).then(function (resp) {
                    //     _this.$alert('《' + row.name + '》删除成功！', '消息', {
                    //         confirmButtonText: '确定',
                    //         callback: action => {
                    //             window.location.reload()
                    //         }
                    //     })
                    // })

                    axios.delete('/book/deleteById/' + row.id).then((params) => {
                        this.$alert('《' + row.name + '》删除成功！', '消息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.reload();
                            }
                        })
                    })

                    // this.$message({
                    //     type: 'success',
                    //     message: '删除成功!'
                    // });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            add() {
                this.$router.push({
                    path: '/AddBook'
                })
            },
            edit(row) {
                this.$router.push({
                    path: '/UpdateBook',
                    query: {
                        id: row.id
                    }
                })
            },
            showAddView() {
                if (this.$refs['ruleForm'] !== undefined) {
                    this.$refs['ruleForm'].resetFields();
                }
                this.title = '弹窗方式添加';
                this.dialogVisible = true;

            },
            showEditView(row) {
                this.title = '弹窗方式修改';
                this.dialogVisible = true;
                this.modelId = row.id;
                axios.get('/book/findById/' + row.id).then((resp) => {
                    this.ruleForm = resp.data;
                });
            },
            showUpdWindow() {
                var rowDatas = this.dataonLineListSelections
                debugger;
                if (rowDatas.length != 1) {
                    this.$alert('修改时只能选择一条数据', '系统提示', {
                        confirmButtonText: '确定',

                    });
                } else {
                    this.title = '弹窗方式修改';
                    this.dialogVisible = true;
                    this.modelId = rowDatas[0].id;
                    axios.get('/book/findById/' + rowDatas[0].id).then((resp) => {
                        this.ruleForm = resp.data;
                    });
                }
            },
            batchDel() {
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
                        axios.delete('/book/deleteByIds/'+ids.join(',')).then((resp) => {
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
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => { });
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
            resetForm(formName) {
                if (this.$refs['ruleForm'] !== undefined) {
                    this.$refs['ruleForm'].resetFields();
                }
            },
            page(currentPage) {
                axios.post('/book/pageQuery/' + (currentPage) + '/'+this.pageSize, this.queryForm).then((resp) => {
                    console.log(resp);
                    this.tableData = resp.data.content
                    this.pageSize = resp.data.size
                    this.total = resp.data.totalElements
                })
            },
            queryAll(currentPage) {
                axios.post('/book/pageQuery/' + (currentPage) + '/'+this.pageSize, this.queryForm).then((resp) => {
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
            selectionLineChangeHandle(val) {
                this.dataonLineListSelections = val
            },
        },

        inject: ['reload'],
        data() {
            return {
                pageSize: 5,
                currentPage: 1,
                total: 11,
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

        created() {
            const _this = this;
            axios.get('/book/findAll/'+this.currentPage+'/'+this.pageSize).then(function (resp) {
                console.log(resp);
                _this.tableData = resp.data.content;
                _this.pageSize = resp.data.size;
                _this.total = resp.data.totalElements;

            })
        }
    }
</script>