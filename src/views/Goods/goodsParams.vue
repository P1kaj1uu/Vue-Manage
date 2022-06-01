<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- Alert警告提示区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-form ref="selectFormRef" :model="goodsCate">
        <el-form-item label="选择商品分类" label-width="100px">
          <el-cascader
            :props="selectCateProps"
            v-model="parentCategory"
            :options="parentCategoryList"
            clearable
            placeholder="请选择商品分类"
            @change="handleSelectCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- Tabs标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数区域 -->
        <el-tab-pane label="动态参数" name="first">
          <el-button
            type="primary"
            :disabled="is_disabled"
            @click="activeDialog = true"
            >添加参数</el-button
          >
          <el-table :data="activeCateParams" border stripe style="width: 100%">
            <el-table-column type="expand" width="100px">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              width="width"
            ></el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="activeEditFn(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="activeDeleteFn(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性区域 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button
            type="primary"
            :disabled="is_disabled"
            @click="staticDialog = true"
            >添加属性</el-button
          >
          <el-table :data="staticCateParams" border stripe style="width: 100%">
            <el-table-column type="expand" width="100px">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
              width="width"
            ></el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="staticEditFn(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="staticDeleteFn(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数弹出框 -->
    <el-dialog
      title="添加动态参数"
      :visible.sync="activeDialog"
      @close="activeCloseFn"
    >
      <el-form
        :model="activeDialogForm"
        ref="activeDialogFormRef"
        :rules="activeRules"
      >
        <el-form-item label="动态参数" label-width="100px" prop="attr_name">
          <el-input
            v-model="activeDialogForm.attr_name"
            autocomplete="off"
            placeholder="请输入动态参数"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="activeCloseFn">取消</el-button>
        <el-button type="primary" @click="activeAgreeFn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加静态属性弹出框 -->
    <el-dialog
      title="添加静态属性"
      :visible.sync="staticDialog"
      @close="staticCloseFn"
    >
      <el-form
        :model="staticDialogForm"
        ref="staticDialogFormRef"
        :rules="staticRules"
      >
        <el-form-item label="静态属性" label-width="100px" prop="attr_name">
          <el-input
            v-model="staticDialogForm.attr_name"
            autocomplete="off"
            placeholder="请输入静态属性"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="staticCloseFn">取消</el-button>
        <el-button type="primary" @click="staticAgreeFn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑动态参数弹出框 -->
    <el-dialog
      title="编辑动态参数"
      :visible.sync="activeEditDialog"
      @close="activeEditCloseFn"
    >
      <el-form
        :model="activeEditDialogForm"
        ref="activeEditDialogFormRef"
        :rules="activeEditRules"
      >
        <el-form-item label="动态参数" label-width="100px" prop="attr_name">
          <el-input
            v-model="activeEditDialogForm.attr_name"
            autocomplete="off"
            placeholder="请输入动态参数"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="activeEditCloseFn">取消</el-button>
        <el-button type="primary" @click="activeEditAgreeFn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑静态属性弹出框 -->
    <el-dialog
      title="编辑静态属性"
      :visible.sync="staticEditDialog"
      @close="staticEditCloseFn"
    >
      <el-form
        :model="staticEditDialogForm"
        ref="staticEditDialogFormRef"
        :rules="staticEditRules"
      >
        <el-form-item label="静态属性" label-width="100px" prop="attr_name">
          <el-input
            v-model="staticEditDialogForm.attr_name"
            autocomplete="off"
            placeholder="请输入静态属性"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="staticEditCloseFn">取消</el-button>
        <el-button type="primary" @click="staticEditAgreeFn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的api方法
import { getCategoriesListAPI, getAttributesListAPI, addAttributesListAPI, deleteAttributesListAPI, queryAttributesListAPI, editAttributesListAPI } from '../../api/index.js'

export default {
  name: 'goodsParams',
  data () {
    return {
      // 选中的父级分类id
      parentCategory: [],
      // 用于存储选择商品分类区域下拉框父级分类
      parentCategoryList: [],
      // 用于存储选择商品分类区域的商品分类数据
      goodsCate: {
        goodsName: ''
      },
      selectCateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的标签页
      activeName: 'first',
      // 用于存储选中的商品分类下的动态参数
      activeCateParams: [],
      // 用于存储选中的商品分类下的静态属性
      staticCateParams: [],
      // 控制添加按钮是否可用
      is_disabled: true,
      // 用于控制动态参数弹出框是否显示
      activeDialog: false,
      // 用于控制静态属性弹出框是否显示
      staticDialog: false,
      // 动态参数弹出框表单对象
      activeDialogForm: {
        attr_name: ''
      },
      // 静态属性弹出框表单对象
      staticDialogForm: {
        attr_name: ''
      },
      // 动态参数弹出框表单校验规则
      activeRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      },
      // 静态属性弹出框表单校验规则
      staticRules: {
        attr_name: [
          { required: true, message: '请输入静态属性', trigger: 'blur' }
        ]
      },
      // 用于控制编辑动态参数弹出框是否显示
      activeEditDialog: false,
      // 用于控制编辑静态属性弹出框是否显示
      staticEditDialog: false,
      // 编辑动态参数表单对象
      activeEditDialogForm: {
        attr_name: ''
      },
      // 编辑静态属性表单对象
      staticEditDialogForm: {
        attr_name: ''
      },
      // 编辑动态参数表单校验规则
      activeEditRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      },
      // 编辑静态属性表单校验规则
      staticEditRules: {
        attr_name: [
          { required: true, message: '请输入静态属性', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      const res = await editAttributesListAPI({
        id: this.parentCategory[this.parentCategory.length - 1],
        attrId: row.attr_id,
        attrName: row.attr_name,
        attrSel: row.attr_sel,
        attrVals: row.attr_vals.join(',')
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('删除参数/属性失败')
      } else {
        this.$message.success('删除参数/属性成功')
      }
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        const res = await editAttributesListAPI({
          id: this.parentCategory[this.parentCategory.length - 1],
          attrId: row.attr_id,
          attrName: row.attr_name,
          attrSel: row.attr_sel,
          attrVals: row.attr_vals.join(',')
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('添加参数/属性失败')
        } else {
          this.$message.success('添加参数/属性成功')
        }
      }
    },
    // 获取父级分类数据
    async getParentCateList () {
      // 获取父级分类数据
      const { data: { data, meta } } = await getCategoriesListAPI({
        pid: 0
      })
      // 判断获取父级分类数据是否成功
      if (meta.status !== 200) {
        this.$message.error('获取父级分类数据失败')
        return
      }
      // 将父级分类数据赋值给父级分类数据
      this.parentCategoryList = data
    },
    // 当选择商品分类区域下拉框的父级分类时
    handleSelectCateChange () {
      // 判断是否选择的是三级分类
      if (this.parentCategory.length === 1 || this.parentCategory.length === 2) {
        this.$message.warning('请选择三级分类下的数据')
        this.parentCategory = []
        // 禁用添加按钮
        this.is_disabled = true
      }
      if (this.parentCategory.length === 0) {
        // 禁用添加按钮
        this.is_disabled = true
        // 清空动态参数和静态属性的数据
        this.activeCateParams = []
        this.staticCateParams = []
      }
      if (this.parentCategory.length === 3) {
        // 取消禁用添加按钮
        this.is_disabled = false
      }
    },
    // 点击标签页切换时
    async handleClick () {
      // 判断父级分类数据是否存在
      if (this.parentCategory.length === 0) {
        this.$message.warning('请先选择商品分类')
        return false
      } else {
        if (this.activeName === 'first') {
          // 获取商品分类下的参数
          const res = await getAttributesListAPI({
            id: this.parentCategory[this.parentCategory.length - 1],
            sel: 'many'
          })
          if (res.data.meta.status !== 200) {
            this.$message.error('获取商品分类下的参数失败')
            return false
          } else {
            if (res.data.data.length === 0) {
              this.$message.warning('该商品分类下没有参数')
              return false
            } else {
              this.activeCateParams = res.data.data
              // 将动态参数项展开项转为数组格式
              this.activeCateParams.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                // 控制tab标签的输入框与按钮的切换
                this.$set(item, 'inputVisible', false)
                this.$set(item, 'inputValue', '')
              })
              this.getParentCateList()
            }
          }
        }
        if (this.activeName === 'second') {
          // 获取商品分类下的参数
          const res = await getAttributesListAPI({
            id: this.parentCategory[this.parentCategory.length - 1],
            sel: 'only'
          })
          if (res.data.meta.status !== 200) {
            this.$message.error('获取商品分类下的参数失败')
            return false
          } else {
            if (res.data.data.length === 0) {
              this.$message.warning('该商品分类下没有参数')
              return false
            } else {
              this.staticCateParams = res.data.data
              // 将静态属性项展开项转为数组格式
              this.staticCateParams.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                // 控制tab标签的输入框与按钮的切换
                this.$set(item, 'inputVisible', false)
                this.$set(item, 'inputValue', '')
              })
              this.getParentCateList()
            }
          }
        }
      }
    },
    // 当动态参数弹出框关闭或点击取消按钮时
    activeCloseFn () {
      // 清空表单内容
      this.$refs.activeDialogFormRef.resetFields()
      // 关闭动态参数弹出框
      this.activeDialog = false
    },
    // 当静态属性弹出框关闭或点击取消按钮时
    staticCloseFn () {
      // 清空表单内容
      this.$refs.staticDialogFormRef.resetFields()
      // 关闭静态属性弹出框
      this.staticDialog = false
    },
    // 当点击动态参数弹出框的确定按钮时
    activeAgreeFn () {
      // 如果表单校验是否通过
      this.$refs.activeDialogFormRef.validate(async (valid) => {
        // 如果表单校验没有通过，阻止后续代码继续执行
        if (!valid) return false
        // 发起网络请求，添加动态参数
        const res = await addAttributesListAPI({
          id: this.parentCategory[this.parentCategory.length - 1],
          attrName: this.activeDialogForm.attr_name,
          attrSel: 'many',
          attrVals: ''
        })
        if (res.data.meta.status !== 201) {
          this.$message.error('添加动态参数失败')
        } else {
          this.$message.success('添加动态参数成功')
          this.activeDialog = false
          // 刷新页面
          this.handleClick()
        }
      })
    },
    // 当点击静态属性弹出框的确定按钮时
    staticAgreeFn () {
      // 如果表单校验是否通过
      this.$refs.staticDialogFormRef.validate(async (valid) => {
        // 如果表单校验没有通过，阻止后续代码继续执行
        if (!valid) return false
        // 发起网络请求，添加动态参数
        const res = await addAttributesListAPI({
          id: this.parentCategory[this.parentCategory.length - 1],
          attrName: this.staticDialogForm.attr_name,
          attrSel: 'only'
        })
        if (res.data.meta.status !== 201) {
          this.$message.error('添加静态属性失败')
        } else {
          this.$message.success('添加静态属性成功')
          this.staticDialog = false
          // 刷新页面
          this.handleClick()
        }
      })
    },
    // 当点击动态参数的删除按钮时
    activeDeleteFn (attrId) {
      this.$confirm('是否删除该动态参数项?', '删除动态参数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发起网络请求，删除动态参数
        const res = await deleteAttributesListAPI({
          id: this.parentCategory[this.parentCategory.length - 1],
          attrid: attrId
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('删除动态参数失败')
        } else {
          this.$message.success('删除动态参数成功')
          // 刷新页面
          this.handleClick()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 当点击静态属性的删除按钮时
    staticDeleteFn (attrId) {
      this.$confirm('是否删除该静态属性项?', '删除静态属性', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发起网络请求，删除静态属性
        const res = await deleteAttributesListAPI({
          id: this.parentCategory[this.parentCategory.length - 1],
          attrid: attrId
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('删除静态属性失败')
        } else {
          this.$message.success('删除静态属性成功')
          // 刷新页面
          this.handleClick()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 当关闭动态参数的编辑弹出框时
    activeEditCloseFn () {
      // 重置表单
      this.$refs.activeEditDialogFormRef.resetFields()
      // 关闭动态参数的编辑弹出框
      this.activeEditDialog = false
    },
    // 当关闭静态属性的编辑弹出框时
    staticEditCloseFn () {
      // 重置表单
      this.$refs.staticEditDialogFormRef.resetFields()
      // 关闭静态属性的编辑弹出框
      this.staticEditDialog = false
    },
    // 当点击动态参数的编辑按钮时
    async activeEditFn (id) {
      const res = await queryAttributesListAPI({
        id: this.parentCategory[this.parentCategory.length - 1],
        attrId: id,
        attrSel: 'many',
        attrVals: ''
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取动态参数失败')
      } else {
        // 将获取到的动态参数数据赋值给编辑弹出框的表单
        this.activeEditDialogForm = res.data.data
        // 打开动态参数的编辑弹出框
        this.activeEditDialog = true
      }
    },
    // 当点击静态属性的编辑按钮时
    async staticEditFn (id) {
      const res = await queryAttributesListAPI({
        id: this.parentCategory[this.parentCategory.length - 1],
        attrId: id,
        attrSel: 'only'
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取静态属性失败')
      } else {
        // 将获取到的静态属性数据赋值给编辑弹出框的表单
        this.staticEditDialogForm = res.data.data
        // 打开静态属性的编辑弹出框
        this.staticEditDialog = true
      }
    },
    // 当点击编辑动态参数的弹出框的确定按钮时
    activeEditAgreeFn () {
      // 表单验证
      this.$refs.activeEditDialogFormRef.validate(async (valid) => {
        // 如果表单校验失败，阻止后续代码继续执行
        if (!valid) return false
        // 发起网络请求，更新动态参数
        const res = await editAttributesListAPI({
          id: this.parentCategory[this.parentCategory.length - 1],
          attrId: this.activeEditDialogForm.attr_id,
          attrName: this.activeEditDialogForm.attr_name,
          attrSel: 'many',
          attrVals: ''
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('更新动态参数失败')
        } else {
          this.$message.success('更新动态参数成功')
          // 关闭动态参数的编辑弹出框
          this.activeEditCloseFn()
          // 刷新页面
          this.handleClick()
        }
      })
    },
    // 当点击编辑静态属性的弹出框的确定按钮时
    staticEditAgreeFn () {
      // 表单校验
      this.$refs.staticEditDialogFormRef.validate(async (valid) => {
        // 如果表单校验失败，阻止后续代码继续执行
        if (!valid) return false
        // 发起网络请求，更新静态属性
        const res = await editAttributesListAPI({
          id: this.parentCategory[this.parentCategory.length - 1],
          attrId: this.staticEditDialogForm.attr_id,
          attrName: this.staticEditDialogForm.attr_name,
          attrSel: 'only'
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('更新静态属性失败')
        } else {
          this.$message.success('更新静态属性成功')
          // 关闭静态属性的编辑弹出框
          this.staticEditCloseFn()
          // 刷新页面
          this.handleClick()
        }
      })
    }
  },
  created () {
    // 调用获取父级分类数据的方法
    this.getParentCateList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
