<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为Echarts准备一个具备大小宽高的盒子 -->
      <div id="main" style="width: 600px; height: 400px;">
      </div>
    </el-card>
  </div>
</template>

<script>
// 1.引入echarts
import * as echarts from 'echarts'
// 导入封装的api方法
import { getDataChartAPI } from '../../api/index.js'

export default {
  name: 'Report',
  data () {
    return {
      // 数据统计数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    // 获取数据统计数据
    async getDataChart () {
      const res = await getDataChartAPI()
      if (res.data.meta.status !== 200) {
        this.$message.error('获取报表数据失败')
      } else {
        this.$message.success('获取报表数据成功')
        // 浅拷贝(目标对象, 源对象)
        const result = Object.assign(this.options, res.data.data)
        // 3.初始化Echarts实例
        var myChart = echarts.init(document.getElementById('main'))
        // 4.准备数据和配置项
        // 5.展示数据
        myChart.setOption(result)
      }
    }
  },
  created () {
    // 调用获取数据统计数据的方法
    this.getDataChart()
  }
}
</script>

<style lang="less" scoped>

</style>
