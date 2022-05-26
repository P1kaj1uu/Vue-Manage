<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="queryFn"
            v-model="query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryFn"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="width">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="width">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="width">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="width">
        </el-table-column>
        <el-table-column label="状态" width="width">
          <!-- 作用域插槽{{scope.row}} -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="修改用户"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editUserFn(scope.row)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="删除用户"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteUser(scope.row.id)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" width="50%" @close="quitAdd">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quitAdd">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogFormVisible" width="50%" @close="quitEdit">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quitEdit">取消</el-button>
        <el-button type="primary" @click="editUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的api方法
import { getUsersListAPI, editUserStatusAPI, addUserAPI, queryUserByIdAPI, editUserAPI, deleteUserAPI } from '../../api/index'

export default {
  name: 'user',
  data () {
    // 自定义校验规则
    var validateEmail = (rule, value, callback) => {
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
        callback(new Error('请输入正确格式的邮箱'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
      } else {
        callback()
      }
    }
    return {
      query: '',
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 2,
      // 总数
      total: 0,
      // 用于存储用户列表数据
      userList: [],
      // 用于控制添加用户的对话框是否显示
      addDialogFormVisible: false,
      // 用于控制修改用户的对话框是否显示
      editDialogFormVisible: false,
      // 添加用户表单的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  async created () {
    // 发起网络请求获取用户数据列表
    const res = await getUsersListAPI({
      query: this.query,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })
    if (res.data.meta.status !== 200) {
      this.$message.error('获取用户列表数据失败')
    } else {
      // 当请求成功时
      this.total = res.data.data.total
      this.userList = res.data.data.users
    }
  },
  methods: {
    // 每页条数改变时会触发
    async handleSizeChange (val) {
      const res = await getUsersListAPI({
        pagenum: this.pagenum,
        pagesize: val
      })
      if (res.data.meta.status === 200) {
        this.userList = res.data.data.users
        this.pagesize = val
      }
    },
    // 当前页改变时会触发
    async handleCurrentChange (val) {
      const res = await getUsersListAPI({
        pagenum: val,
        pagesize: this.pagesize
      })
      if (res.data.meta.status === 200) {
        this.userList = res.data.data.users
        this.pagenum = val
      }
    },
    // 点击状态改变时
    async switchChange (newStatus) {
      const res = await editUserStatusAPI({
        uId: newStatus.id,
        type: newStatus.mg_state
      })
      if (res.data.meta.status !== 200) {
        newStatus.mg_state = !newStatus.mg_state
        this.$message.error('更新用户状态失败')
      } else {
        this.$message.success('更新用户状态成功')
      }
    },
    // 点击查询按钮
    async queryFn () {
      const res = await getUsersListAPI({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('查询失败')
      } else {
        // 当请求成功时
        this.total = res.data.data.total
        this.userList = res.data.data.users
      }
    },
    // 当点击添加用户的取消时
    quitAdd () {
      this.$refs.addFormRef.resetFields()
      this.addDialogFormVisible = false
    },
    // 当点击添加用户的确定时
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // 发起网络请求添加用户
        const res = await addUserAPI({
          username: this.addForm.username,
          password: this.addForm.password,
          email: this.addForm.email,
          mobile: this.addForm.mobile
        })
        if (res.data.meta.status !== 201) {
          this.$message.error('添加失败')
        } else {
          this.userList.push(res.data.data)
          this.total++
          this.$message.success('添加成功')
          this.addDialogFormVisible = false
        }
      })
    },
    // 当点击编辑小图标时
    async editUserFn (userInfo) {
      const res = await queryUserByIdAPI({
        id: userInfo.id
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      } else {
        // 存储该用户的id
        this.editForm.id = res.data.data.id
        this.editForm.username = res.data.data.username
        this.editDialogFormVisible = true
      }
    },
    // 当点击修改用户的取消时
    quitEdit () {
      this.$refs.editFormRef.resetFields()
      this.editDialogFormVisible = false
    },
    // 当点击修改用户的确定时
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 发起网络请求添加用户
        const res = await editUserAPI({
          id: this.editForm.id,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(res)
        if (res.data.meta.status !== 200) {
          this.$message.error('修改失败')
        } else {
          await getUsersListAPI({
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          })
          this.userList = res.data.data.users
          this.$message.success('修改成功')
          this.editDialogFormVisible = false
        }
      })
    },
    // 当点击删除小图标时
    deleteUser (userId) {
      // 弹出询问框
      this.$confirm('是否确定删除该用户?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发起网络请求删除用户
        const res = await deleteUserAPI({
          id: userId
        })
        console.log(res)
        if (res.data.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.total--
          await getUsersListAPI({
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
