<template>
  <el-container class="container">
    <el-header class="header">
      <h1>Cron 任务列表</h1>
    </el-header>
    <el-main>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading = "loading"
        :data="cronList"
        style="width: 100%">
        <el-table-column
          label="任务名称"
          width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="shell命令"
          width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.command }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="cron表达式"
          width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.cronExpr }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="210">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleKill(scope.$index, scope.row)">强杀
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加或修改对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">

          <el-form-item label="任务名称" prop="name">
            <el-input v-model="form.name" placeholder="任务名称"
            />
          </el-form-item>
          <el-form-item label="shell命令" prop="command">
            <el-input v-model="form.command" placeholder="shell命令"
            />
          </el-form-item>
          <el-form-item label="cron表达式" prop="cronExpr">
            <el-input v-model="form.cronExpr" placeholder="cron表达式"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>

</template>

<script>

  import {
    listCron,
    deleteCron,
    insertCron,
    updateCron,
    killCron,
  } from '@/api/cron'

  export default {
    name: "Cronlist",
    data() {
      return {
        cronList:[],
        loading:true,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
        },
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        isEdit: false,
        // 表单参数
        form: {}
        ,
        // 表单校验
        rules: {
          name:
            [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ],
          command:
            [
              {required: true, message: '执行命令不能为空', trigger: 'blur'}
            ],
          cronExpr:
            [
              {required: true, message: '定时命令不能为空', trigger: 'blur'}
            ],
        }
      }
    },
    created() {
      //默认获取列表
      this.handleList()
    },
    methods: {
      handleList() {
        this.loading = true
        listCron(this.queryParams).then(response => {
            this.cronList = response.data
            this.loading = false
          }
        )
      },
      handleEdit(index, row) {
        this.reset()
        console.log(row)
        this.open = true
        this.title = '修改账户'
        this.isEdit = true
        this.form = row
        //进入修改
        this.form.id = index
      },
      handleDelete(index, row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return deleteCron(row.name)
        }).then(() => {
          this.handleList()
          this.msgSuccess('删除成功')
        }).catch(function () {
        })
      },
      handleKill(index, row) {
        this.$confirm('是否确认强杀名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return killCron(row.name)
        }).then(() => {
          this.handleList()
          this.msgSuccess('kill成功')
        }).catch(function () {
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          name: undefined,
          command: undefined,
          cronExpr: undefined,
        }
        this.resetForm('form')
      },
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加账户'
        this.isEdit = false
      },
      submitForm: function () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            //此处例外，新增和修改同一接口
            if (this.form.id !== undefined) {
              updateCron(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.handleList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              insertCron(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.handleList()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
  .container{
    width:1140px;
    margin: 0 auto;
  }
  .header{
    text-align:center;
    margin:30px auto;
  }
</style>
