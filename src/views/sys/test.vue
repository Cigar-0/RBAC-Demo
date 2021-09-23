<template>
    <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['1', '3']">
            <el-submenu index="1">
                <template slot="title"><i class="el-icon-message"></i>导航一</template>
                <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title"><i class="el-icon-menu"></i>导航二</template>
                <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                <el-menu-item index="2-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title"><i class="el-icon-setting"></i>导航三</template>
                <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                <el-menu-item index="3-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="3-4">
                <template slot="title">选项4</template>
                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                </el-submenu>
            </el-submenu>
            </el-menu>
        </el-aside>
        
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
            <el-dropdown>
                <i class="el-icon-setting" style="margin-right: 15px"></i>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span>王小虎</span>
            </el-header>
            
            <el-main>
            <el-table :data="tableData">
                <el-table-column prop="date" label="日期" width="140">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址">
                </el-table-column>
            </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        name: 'demo',
        data() {
            return {
                demoString: '',
                closeTree: false,
                data: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 2,
                        label: '二级 1-1',
                        children: [{
                            id: 3,
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    id: 4,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1',
                        children: [{
                            id: 6,
                            label: '三级 2-1-1'
                        }]
                    }, {
                        id: 7,
                        label: '二级 2-2',
                        children: [{
                            id: 8,
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    id: 9,
                    label: '一级 3',
                    children: [{
                        id: 10,
                        label: '二级 3-1',
                        children: [{
                            id: 11,
                            label: '三级 3-1-1'
                        }]
                    }, {
                        id: 12,
                        label: '二级 3-2',
                        children: [{
                            id: 13,
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        created() {

        },
        methods: {
            // 点击 树状里面当前那个
            handleNodeClick(data) {
                this.demoString = data.label; // 前端显示中文
                this.demoNumber = data.id; // 传后台值为对应 id
                this.closeTree = !this.closeTree;
            },
            // 点击 input 打开 树状，
            getTree() {
                this.closeTree = !this.closeTree;
            },
        },
    };

</script>
<style scoped>


</style>