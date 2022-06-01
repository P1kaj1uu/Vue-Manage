<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- Alert警告区域 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        :closable="false"
        center
        show-icon
      ></el-alert>

      <!-- Steps步骤条区域 -->
      <el-steps :active="stepActive - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="goodsAddForm"
        :rules="goodsAddFormRules"
        ref="goodsAddFormRef"
        label-position="top"
        label-width="100px"
      >
        <!-- Tabs标签页区域 -->
        <el-tabs
          tab-position="left"
          @tab-click="tabClick"
          :before-leave="tagsBeforeLeave"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                placeholder="请输入商品名称"
                v-model="goodsAddForm.goods_name"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                placeholder="请输入商品价格"
                v-model="goodsAddForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                placeholder="请输入商品重量"
                v-model="goodsAddForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                placeholder="请输入商品数量"
                v-model="goodsAddForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsAddForm.goods_cat"
                :options="goodsCate"
                placeholder="请输入商品分类"
                clearable
                :props="goodsCateProps"
                @change="goodsCateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item
              v-for="item in goodsManyList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item1"
                  v-for="item1 in item.attr_vals"
                  :key="item1"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              :label="item3.attr_name"
              v-for="item3 in goodsOnlyList"
              :key="item3.attr_id"
            >
              <el-input v-model="item3.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headersObj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器组件 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="goodsAddForm.goods_introduce"
            />
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addGoodFn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览弹出框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="photoDialogVisible"
      width="30%"
    >
      <div style="width: 250px; height: 250px; margin: 0 auto;">
        <el-image
        style="width: 100%; height: 100%"
        :src="photoUrl"
        ></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的api方法
import { getCategoriesListAPI, getAttributesListAPI, addGoodsAPI } from '../../api/index.js'
// 导入封装的token方法
import { getToken } from '../../utils/token.js'

export default {
  name: 'goodsAdd',
  data () {
    return {
      // 激活项步骤条索引
      stepActive: 0,
      // 级联选择器区域
      goodsCate: [],
      // 商品参数选项卡数据
      goodsManyList: [],
      // 商品属性选项卡数据
      goodsOnlyList: [],
      // 控制图片预览弹出框是否显示
      photoDialogVisible: false,
      // 图片预览时的图片地址
      photoUrl: '',
      // 商品图片上传头部信息
      headersObj: {
        Authorization: getToken()
      },
      goodsCateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 添加商品表单对象
      goodsAddForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品分类
        goods_cat: [],
        // 商品图片
        pics: [],
        // 商品详情
        goods_introduce: ''
      },
      // 添加商品表单校验规则
      goodsAddFormRules: {
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
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const res = await getCategoriesListAPI({
        type: 3
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
      } else {
        this.goodsCate = res.data.data
      }
    },
    // 切换Tabs标签页之前的钩子，若返回false或者返回Promise且被reject，则阻止切换
    tagsBeforeLeave (activeName) {
      if (activeName === '1' || activeName === '2' || activeName === '3' || activeName === '4') {
        if (this.goodsAddForm.goods_cat.length !== 3) {
          this.$message.warning('请先选择商品分类')
          return false
        } else {
          this.stepActive = activeName
        }
      }
    },
    async tabClick (tab) {
      if (this.goodsAddForm.goods_cat.length !== 3) {
        this.stepActive = 0
        this.$message.warning('请先选择商品分类')
      } else {
        this.stepActive = tab.index
        // 当点击商品参数选项卡时
        if (tab.index === '1') {
          const res = await getAttributesListAPI({
            id: this.goodsAddForm.goods_cat[2],
            sel: 'many'
          })
          if (res.data.meta.status !== 200) {
            this.$message.error('获取商品参数失败')
          } else {
            this.goodsManyList = res.data.data
            res.data.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
            })
            this.$message.success('获取商品参数成功')
          }
        } else if (tab.index === '2') {
          // 当点击商品属性选项卡时
          const res = await getAttributesListAPI({
            id: this.goodsAddForm.goods_cat[2],
            sel: 'only'
          })
          if (res.data.meta.status !== 200) {
            this.$message.error('获取商品属性失败')
          } else {
            this.goodsOnlyList = res.data.data
            this.$message.success('获取商品属性成功')
          }
        }
      }
    },
    // 当选择商品分类级联选择器时
    goodsCateChange () {
      if (this.goodsAddForm.goods_cat.length !== 3) {
        this.goodsAddForm.goods_cat = []
        this.$message.warning('请输入三级分类下的商品')
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview (file) {
      this.photoUrl = file.response.data.url
      // 将图片预览弹出框显示
      this.photoDialogVisible = true
    },
    // 文件列表移除文件时的钩子
    handleRemove (file) {
      // 获取将要删除的图片临时路径
      const picTmp = file.response.data.tmp_path
      // 从pics数组中，找到该项的索引值，然后删除该项
      const index = this.goodsAddForm.pics.findIndex(item => item.pic === picTmp)
      this.goodsAddForm.pics.splice(index, 1)
    },
    // 文件上传成功时的钩子
    handleSuccess (response) {
      // 拼接得到一个图片临时路径
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象push到pics数组中
      this.goodsAddForm.pics.push(picInfo)
    },
    // 当点击添加商品按钮时
    addGoodFn () {
      // 校验表单是否通过验证
      this.$refs.goodsAddFormRef.validate(async (valid) => {
        // 如果表单校验不通过，阻止后续代码继续执行
        if (!valid) {
          this.$message.error('请填写必要的商品信息')
          return false
        } else {
          const res = await addGoodsAPI({
            goodsName: this.goodsAddForm.goods_name,
            goodsCat: this.goodsAddForm.goods_cat.join(','),
            goodsPrice: this.goodsAddForm.goods_price,
            goodsNumber: this.goodsAddForm.goods_number,
            goodsWeight: this.goodsAddForm.goods_weight,
            goodsIntroduce: this.goodsAddForm.goods_introduce,
            pics: this.goodsAddForm.pics.tmp_path,
            attrs: [...this.goodsManyList, ...this.goodsOnlyList]
          })
          if (res.data.meta.status !== 201) {
            this.$message.error('添加商品失败')
          } else {
            this.stepActive = '6'
            this.$message.success('添加商品成功')
            this.goodsAddForm = {
              goods_name: '',
              goods_cat: [],
              goods_price: 0,
              goods_number: 0,
              goods_weight: 0,
              goods_introduce: '',
              pics: []
            }
            setTimeout(() => {
              this.$router.replace('/home/goods')
            }, 1000)
          }
        }
      })
    }
  },
  created () {
    // 调用获取商品分类数据
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
</style>
