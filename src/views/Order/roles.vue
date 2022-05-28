<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table
        :data="rolesList"
        border
        stripe
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="handleClose(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="handleClose(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="handleClose(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column
          prop="roleName"
          align="center"
          label="角色名称"
          sortable
          width="width"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          align="center"
          label="角色描述"
          sortable
          width="width"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="width">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="handleSetAuth(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsTree"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultChecked"
        ref="treeRef"
      ></el-tree>
      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的api方法
import { getAllRolesAPI, deleteRoleRightAPI, getAllRightsTreeAPI, addRoleRightTreeAPI } from '../../api/index'

export default {
  name: 'Roles',
  data () {
    return {
      // 用于存储角色列表数据
      rolesList: [],
      // 设置对话框是否显示
      setRightDialogVisible: false,
      // 用于存储权限树数据
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 用于存储默认选中的权限
      defaultChecked: [],
      // 用于存储角色id
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表数据
    async getAllRoles () {
      const res = await getAllRolesAPI()
      if (res.data.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      } else {
        this.rolesList = res.data.data
      }
    },
    // 获取权限树数据
    async getAllRightsTree () {
      const res = await getAllRightsTreeAPI()
      if (res.data.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      } else {
        this.rightsTree = res.data.data
      }
    },
    // 删除角色权限
    handleClose (role, id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteRoleRightAPI({
          roleId: role.id,
          rightId: id
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          role.children = res.data.data
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 通过递归的形式获取三级权限id
    getCheckedKey (data) {
      let checkedKeys = []
      data.forEach(item => {
        if (item.children) {
          checkedKeys = checkedKeys.concat(this.getCheckedKey(item.children))
        } else {
          checkedKeys.push(item.id)
        }
      })
      return checkedKeys
    },
    // 点击分配权限
    handleSetAuth (row) {
      // 获取角色id
      this.roleId = row.id
      // 获取所有权限的数据
      this.getAllRightsTree()
      // 选中三级权限下选中的
      this.defaultChecked = this.getCheckedKey(row.children)
      // 设置对话框显示
      this.setRightDialogVisible = true
    },
    // 当关闭分配权限的对话框时
    setRightDialogClose () {
      // 清空默认选中的权限
      this.defaultChecked = []
      this.setRightDialogVisible = false
    },
    // 当点击确定按钮关闭对话框时
    async confirmClose () {
      const res = await addRoleRightTreeAPI({
        roleId: this.roleId,
        rids: [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()].join(',')
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('分配权限失败')
      } else {
        this.$message.success('分配权限成功')
        this.setRightDialogVisible = false
        // 重新获取角色列表
        this.getAllRoles()
      }
    }
  },
  created () {
    // 调用获取角色列表数据的方法
    this.getAllRoles()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.el-row {
  border-bottom: 1px solid #eee;
}
.el-row:first-child {
  border-top: 1px solid #eee;
}
</style>
