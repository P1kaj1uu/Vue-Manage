<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
            <el-button slot="append" icon="el-icon-search" @click="searchGoodsFn"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表表格区域 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="width">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100px">
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ $formatTime(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsFn(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsFn(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 25, 50, 100, 200]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑商品弹出框 -->
    <el-dialog title="编辑商品" :visible.sync="editGoodsDialog" @close="quitEditGoodsFn">
      <el-form :model="editGoodsForm" :rules="editGoodsFormRules" ref="editGoodsFormRef">
        <el-form-item label="商品名称" label-width="100px" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="100px" prop="goods_price">
          <el-input type="number" v-model="editGoodsForm.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" label-width="100px" prop="goods_weight">
          <el-input type="number" v-model="editGoodsForm.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" label-width="100px" prop="goods_number">
          <el-input type="number" v-model="editGoodsForm.goods_number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quitEditGoodsFn">取消</el-button>
        <el-button type="primary" @click="AgreeEditGoodsFn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的api方法
import { getGoodsListAPI, deleteGoodsByIdAPI, queryGoodsByIdAPI, editGoodsListByIdAPI } from '../../api/index.js'

export default {
  name: 'goodsList',
  data () {
    return {
      // 商品查询数据
      query: '',
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 10,
      // 商品列表总数
      total: 0,
      // 商品列表数据
      goodsList: [],
      // 用于控制编辑商品弹出框是否显示
      editGoodsDialog: false,
      // 编辑商品弹出框表单对象
      editGoodsForm: {
        goods_id: '',
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0
      },
      // 编辑商品弹出框表单对象校验规则
      editGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 当点击搜索按钮清除按钮时触发
    queryFn () {
      this.query = ''
      this.getGoodsList()
    },
    // 获取商品列表数据
    async getGoodsList () {
      const res = await getGoodsListAPI({
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      } else {
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
        this.$message.success('获取商品列表成功')
      }
    },
    // 分页器每页条数改变时触发
    handleSizeChange (val) {
      this.pagesize = val
      this.getGoodsList()
    },
    // 分页器当前页改变时触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
      // 平滑的回到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    // 当点击搜索图标按钮时
    async searchGoodsFn () {
      const res = await getGoodsListAPI({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('查询商品列表失败')
      } else {
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
        this.$message.success('查询商品列表成功')
      }
    },
    // 当点击删除按钮时
    deleteGoodsFn (row) {
      this.$confirm('是否删除该项商品列表数据?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteGoodsByIdAPI({
          id: row.goods_id
        })
        if (res.data.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          // 刷新列表
          this.getGoodsList()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 当点击添加商品按钮时
    goAddPage () {
      // 跳转到添加商品页面
      this.$router.push('/home/add')
    },
    // 当点击编辑按钮时
    async editGoodsFn (row) {
      const res = await queryGoodsByIdAPI({
        id: row.goods_id
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取商品信息失败')
      } else {
        this.editGoodsForm.goods_id = res.data.data.goods_id
        this.editGoodsForm.goods_name = res.data.data.goods_name
        this.editGoodsForm.goods_price = res.data.data.goods_price
        this.editGoodsForm.goods_weight = res.data.data.goods_weight
        this.editGoodsForm.goods_number = res.data.data.goods_number
        this.editGoodsDialog = true
      }
    },
    // 当点击取消按钮或关闭编辑弹出框时
    quitEditGoodsFn () {
      // 重置表单对象
      this.$refs.editGoodsFormRef.resetFields()
      // 关闭弹出框
      this.editGoodsDialog = false
    },
    // 当点击编辑的确定按钮时
    AgreeEditGoodsFn () {
      // 表单校验
      this.$refs.editGoodsFormRef.validate(async (valid) => {
        // 如果校验不通过，阻止后续代码继续执行
        if (!valid) {
          this.$message.error('请填写商品信息的必要项')
          return false
        } else {
          const res = await editGoodsListByIdAPI({
            id: this.editGoodsForm.goods_id,
            goodsName: this.editGoodsForm.goods_name,
            goodsPrice: this.editGoodsForm.goods_price,
            goodsNumber: this.editGoodsForm.goods_number,
            goodsWeight: this.editGoodsForm.goods_weight
          })
          if (res.data.meta.status !== 200) {
            this.$message.error('修改失败')
          } else {
            this.$message.success('修改成功')
            this.editGoodsDialog = false
            // 刷新页面
            this.getGoodsList()
          }
        }
      })
    }
  },
  created () {
    // 调用获取商品列表数据的方法
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.el-input-group__prepend {
  background-color: #fff;
}
</style>
