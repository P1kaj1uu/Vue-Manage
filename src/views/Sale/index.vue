<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="query" placeholder="请输入内容" clearable @clear="getSalesList">
            <el-button slot="append" icon="el-icon-search" @click="getSalesList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="EditMailDialog = true">查看物流信息</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        :data="saleGoodsList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="width">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100px">
        </el-table-column>
        <el-table-column
          label="是否付款"
          width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100px">
        </el-table-column>
        <el-table-column
          label="下单时间"
          width="width">
          <template slot-scope="scope">
            {{ $formatTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="EditSaleByIdFn(scope.row)">编辑订单</el-button>
            <el-button type="success" size="small" icon="el-icon-location" @click="EditLocationDialog = true">修改地址</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 15, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 查看物流信息弹出框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="EditMailDialog"
      width="40%"
      @close="EditMailDialog = false">
      <el-timeline reverse>
        <el-timeline-item
          v-for="(activity, index) in saleMail.data"
          :key="index"
          :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <!-- 编辑订单弹出框 -->
    <el-dialog title="编辑订单" :visible.sync="EditMailFormDialog" @close="quitEditMailFn">
      <el-form :model="EditMailForm" :rules="EditMailFormRules" ref="EditMailFormRef">
        <el-form-item label="订单价格" label-width="100px" prop="order_price">
          <el-input v-model="EditMailForm.order_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否付款" label-width="100px" prop="pay_status">
          <el-radio v-model="EditMailForm.pay_status" name="pay_status" label="1">已付款</el-radio>
          <el-radio v-model="EditMailForm.pay_status" name="pay_status" label="0">未付款</el-radio>
        </el-form-item>
        <el-form-item label="支付方式" label-width="100px" prop="order_pay">
          <el-radio v-model="EditMailForm.order_pay" name="order_pay" label="0">未支付</el-radio>
          <el-radio v-model="EditMailForm.order_pay" name="order_pay" label="1">支付宝</el-radio>
          <el-radio v-model="EditMailForm.order_pay" name="order_pay" label="2">微信</el-radio>
          <el-radio v-model="EditMailForm.order_pay" name="order_pay" label="3">银行卡</el-radio>
        </el-form-item>
        <el-form-item label="是否发货" label-width="100px" prop="is_send">
          <el-radio v-model="EditMailForm.is_send" name="is_send" label="1">已发货</el-radio>
          <el-radio v-model="EditMailForm.is_send" name="is_send" label="0">未发货</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quitEditMailFn">取消</el-button>
        <el-button type="primary" @click="AgreeEditMailFn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改地址弹出框 -->
    <el-dialog width="30%" title="修改地址" :visible.sync="EditLocationDialog" @close="quitEditLocationFn">
      <el-form :model="EditLocationForm" :rules="EditLocationFormRules" ref="EditLocationFormRef">
        <el-form-item label="省市区/县" label-width="100px" prop="location">
          <el-cascader
            v-model="EditLocationForm.location"
            placeholder="请选择省市区/县"
            :options="cityData"
            clearable
            :props="cityDataProps">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px" prop="address">
          <el-input v-model="EditLocationForm.address" autocomplete="off" placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quitEditLocationFn">取消</el-button>
        <el-button type="primary" @click="AgreeEditLocationFn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的api方法
import { getSalesListAPI, querySalesByIdAPI, editSalesListAPI } from '../../api/index.js'
// 导入省市区县
import cityData from '../../utils/city.js'
// 导入物流信息
import saleMail from '../../utils/mail.js'

export default {
  name: 'Sale',
  data () {
    return {
      // 搜索框搜索内容
      query: '',
      // 物流信息数据
      saleMail: saleMail,
      // 用于存储订单数据列表
      saleGoodsList: [],
      cityData: cityData,
      cityDataProps: {
        value: 'value',
        label: 'label',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 10,
      // 总条数
      total: 0,
      // 用于控制查看物流信息弹出框是否显示
      EditMailDialog: false,
      // 用于控制修改地址弹出框是否显示
      EditLocationDialog: false,
      // 修改地址弹出框表单对象
      EditLocationForm: {
        // 省市区/县
        location: [],
        // 详细地址
        address: ''
      },
      // 修改地址弹出框表单验证规则
      EditLocationFormRules: {
        location: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 用于控制编辑订单弹出框是否显示
      EditMailFormDialog: false,
      // 编辑订单弹出框表单对象
      EditMailForm: {
        // 订单id
        order_id: '',
        // 订单价格
        order_price: '',
        // 是否付款
        pay_status: '',
        // 支付方式
        order_pay: '',
        // 是否发货
        is_send: ''
      },
      // 编辑订单弹出框表单验证规则
      EditMailFormRules: {
        order_price: [
          { required: true, message: '请输入订单价格', trigger: 'blur' }
        ],
        pay_status: [
          { required: true, message: '请选择是否付款', trigger: 'blur' }
        ],
        order_pay: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        is_send: [
          { required: true, message: '请选择是否发货', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取订单商品数据
    async getSalesList () {
      const res = await getSalesListAPI({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取商品订单列表失败')
      } else {
        this.saleGoodsList = res.data.data.goods
        this.total = res.data.data.total
      }
    },
    // 每页条数改变时触发
    handleSizeChange (val) {
      this.pagesize = val
      this.getSalesList()
    },
    // 当前页码改变时触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.getSalesList()
    },
    // 当点击取消按钮或关闭修改地址弹出框时
    quitEditLocationFn () {
      this.$refs.EditLocationFormRef.resetFields()
      this.EditLocationDialog = false
    },
    // 当点击修改地址弹出框的确定按钮时
    AgreeEditLocationFn () {
      // 校验修改地址弹出框表单是否通过验证
      this.$refs.EditLocationFormRef.validate((valid) => {
        // 如果校验未通过则阻止后续代码继续执行
        if (!valid) {
          this.$message.warning('请完善修改地址信息')
          return false
        } else {
          this.$message.success('修改地址成功')
          this.EditLocationDialog = false
        }
      })
    },
    // 当点击编辑订单按钮时
    async EditSaleByIdFn (row) {
      const res = await querySalesByIdAPI({
        id: row.order_id
      })
      if (res.data.meta.status !== 200) {
        this.$message.error('获取订单详情失败')
      } else {
        this.$message.success('获取订单详情成功')
        this.EditMailForm.order_id = res.data.data.order_id
        this.EditMailForm.order_price = res.data.data.order_price
        this.EditMailForm.order_pay = res.data.data.order_pay
        this.EditMailForm.is_send = res.data.data.is_send === '是' ? '1' : '0'
        this.EditMailForm.pay_status = res.data.data.pay_status
        this.EditMailFormDialog = true
      }
    },
    // 当点击编辑订单的取消按钮或关闭弹出框时
    quitEditMailFn () {
      this.$refs.EditMailFormRef.resetFields()
      this.EditMailFormDialog = false
    },
    // 当点击编辑订单的确定按钮
    AgreeEditMailFn () {
      this.$refs.EditMailFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请完善修改订单信息')
          return false
        } else {
          const res = await editSalesListAPI({
            id: this.EditMailForm.order_id,
            isSend: this.EditMailForm.is_send,
            orderPay: this.EditMailForm.order_pay,
            orderPrice: this.EditMailForm.order_price,
            payStatus: this.EditMailForm.pay_status
          })
          if (res.data.meta.status !== 201) {
            this.$message.error('修改订单失败')
          } else {
            this.$message.success('修改订单成功')
            this.EditMailFormDialog = false
            // 刷新页面
            this.getSalesList()
          }
        }
      })
    }
  },
  created () {
    // 调用获取订单商品数据的方法
    this.getSalesList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
