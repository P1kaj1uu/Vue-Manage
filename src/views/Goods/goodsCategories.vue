<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogFn">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 商品分类列表 -->
      <tree-table
        :data="goodsCategoryList"
        :selection-type="false"
        show-index
        :expand-type="false"
        :columns="columns"
        border
        :stripe="true"
        :show-row-hover="false"
      >
        <!-- 是否有效的模板结构 -->
        <template slot="is_delete" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序的模板结构 -->
        <template slot="is_sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作的模板结构 -->
        <template slot="is_action" slot-scope="scope">
          <el-button
            @click="editFn(scope.row.cat_id, scope.row.cat_name)"
            icon="el-icon-edit"
            type="primary"
            size="mini"
            >编辑</el-button
          >
          <el-button
            @click="deleteFn(scope.row.cat_id)"
            icon="el-icon-delete"
            type="danger"
            size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialog"
      width="35%"
      @close="addDialogClose"
    >
      <el-form :model="addCategoryForm" :rules="addRules" ref="addRef">
        <el-form-item label="分类名称" label-width="80px" prop="catName">
          <el-input
            class="addInput"
            v-model="addCategoryForm.catName"
            autocomplete="off"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="80px">
          <el-cascader
            class="addInput"
            :props="cascaderProps"
            v-model="parentCategory"
            :options="parentCategoryList"
            @change="parentCateChange"
            clearable
            placeholder="请选择父级分类"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogClose">取消</el-button>
        <el-button type="primary" @click="confirmAddCate">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类的弹出框 -->
    <el-dialog title="编辑分类" :visible.sync="editCategoryDialog" width="35%" @close="quitEditFn">
      <el-form :model="editCategoryForm" :rules="editRules" ref="editFormRef">
        <el-form-item label="分类名称" label-width="80px" prop="catName">
          <el-input v-model="editCategoryForm.catName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quitEditFn">取消</el-button>
        <el-button type="primary" @click="confirmEditFn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的api方法
import { getCategoriesListAPI, addCategoriesListAPI, deleteCategoryAPI, editCategoryAPI } from '../../api/index.js'

export default {
  name: 'goodsCategories',
  data () {
    return {
      // 用于存储商品分类列表
      goodsCategoryList: [],
      // 用于存储添加分类下拉框父级分类
      parentCategoryList: [],
      // 用于控制添加分类弹出框是否显示
      addCategoryDialog: false,
      // 用于控制编辑分类弹出框是否显示
      editCategoryDialog: false,
      // 指定级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 添加分类表单对象
      addCategoryForm: {
        // 分类名称
        catName: '',
        // 分类父id
        catPid: 0,
        // 分类层级,0表示一级分类,1表示二级分类,2表示三级分类
        catLevel: 0
      },
      // 编辑分类表单对象
      editCategoryForm: {
        catId: '',
        // 分类名称
        catName: ''
      },
      // 选中的父级分类id
      parentCategory: [],
      // 当前页码值
      pagenum: 1,
      // 每页显示条数
      pagesize: 5,
      // 商品分类总数
      total: 0,
      // 添加分类表单校验规则
      addRules: {
        catName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editRules: {
        catName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 表格列
      columns: [
        {
          prop: 'cat_name',
          label: '分类名称',
          width: 'width'
        },
        {
          label: '是否有效',
          width: 'width',
          type: 'template',
          template: 'is_delete'
        },
        {
          label: '排序',
          width: 'width',
          type: 'template',
          template: 'is_sort'
        },
        {
          label: '操作',
          width: 'width',
          type: 'template',
          template: 'is_action'
        }
      ]
    }
  },
  methods: {
    // 获取商品分类列表数据
    async getCategoriesList () {
      const res = await getCategoriesListAPI({
        type: 3,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取商品分类列表失败')
      } else {
        this.goodsCategoryList = res.data.data.result
        this.total = res.data.data.total
      }
    },
    // 当每页条数改变时触发
    handleSizeChange (val) {
      this.pagesize = val
      this.getCategoriesList()
    },
    // 当前页码改变时触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoriesList()
    },
    // 当点击添加分类按钮时
    addDialogFn () {
      this.getParentCategoryList()
      this.addCategoryDialog = true
    },
    // 添加分类弹出框关闭时触发
    addDialogClose () {
      this.$refs.addRef.resetFields()
      this.parentCategory = []
      this.addCategoryForm.catPid = 0
      this.addCategoryForm.catName = ''
      this.addCategoryForm.catLevel = 0
      this.addCategoryDialog = false
    },
    // 获取添加分类下拉框父级分类的数据列表
    async getParentCategoryList () {
      const res = await getCategoriesListAPI({
        type: 2
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取父级分类列表失败')
      } else {
        this.parentCategoryList = res.data.data
      }
    },
    // 当选中节点变化时触发
    parentCateChange () {
      // 判断是否选择了父级分类列表数据的某一项
      if (this.parentCategory.length > 0) {
        // 如果选择了,则将选中的父级分类的id赋值给表单对象的catPid属性
        this.addCategoryForm.catPid = this.parentCategory[this.parentCategory.length - 1]
        // 如果选择了,则将选中的父级分类的层级赋值给表单对象的catLevel属性
        this.addCategoryForm.catLevel = this.parentCategory.length
      } else {
        // 如果没有选择,则将表单对象的catPid属性设置为0
        this.addCategoryForm.catPid = 0
        // 如果没有选择,则将表单对象的catLevel属性设置为0
        this.addCategoryForm.catLevel = 0
      }
    },
    // 当点击添加分类的确定按钮时
    confirmAddCate () {
      // 检验表单是否校验通过
      this.$refs.addRef.validate(async (valid) => {
        if (!valid) return false
        // 发起添加分类的网络请求
        const res = await addCategoriesListAPI({
          catPid: this.addCategoryForm.catPid,
          catName: this.addCategoryForm.catName,
          catLevel: this.addCategoryForm.catLevel
        })
        if (res.data.meta.status !== 201) {
          this.$message.error('添加分类失败')
        } else {
          this.$message.success('添加分类成功')
          this.addCategoryDialog = false
          this.getCategoriesList()
        }
      })
    },
    // 当点击删除按钮时
    deleteFn (Did) {
      this.$confirm('是否删除该项商品分类?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteCategoryAPI({
          id: Did
        })
        if (res.data.meta.msg !== '删除成功') {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          // 重新渲染表格数据
          this.getCategoriesList()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 当取消编辑时
    quitEditFn () {
      this.$refs.editFormRef.resetFields()
      this.editCategoryDialog = false
    },
    // 当点击编辑按钮时
    editFn (Eid, name) {
      this.editCategoryForm.catId = Eid
      this.editCategoryForm.catName = name
      this.editCategoryDialog = true
    },
    // 当点击编辑分类确定按钮时
    confirmEditFn () {
      // 检验表单是否校验通过
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return false
        const res = await editCategoryAPI({
          id: this.editCategoryForm.catId,
          catName: this.editCategoryForm.catName
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('编辑失败')
        } else {
          this.$message.success('编辑成功')
          this.editCategoryDialog = false
          this.getCategoriesList()
        }
      })
    }
  },
  created () {
    // 调用获取商品分类列表数据的方法
    this.getCategoriesList()
  }
}
</script>

<style lang="less" scoped>
.el-icon-success {
  color: green;
}
.el-icon-error {
  color: red;
}
.zk-table {
  margin-top: 20px;
}
.addInput {
  width: 100%;
}
</style>
