<template>
 <div>
   <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限列表区域 -->
      <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="authName"
          label="权限名称" >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="path"
          label="路径" >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="权限等级" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
 </div>
</template>

<script>
// 导入封装的api方法
import { getAllRightsAPI } from '../../api/index'

export default {
  name: 'Rights',
  data () {
    return {
      // 用于存储所有的权限列表数据
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表数据的方法
    async getAllRights () {
      const res = await getAllRightsAPI({})
      if (res.data.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      } else {
        this.rightsList = res.data.data
      }
    }
  },
  created () {
    this.getAllRights()
  }
}
</script>

<style lang="less" scoped>

</style>
