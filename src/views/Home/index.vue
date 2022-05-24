<template>
 <div>
   <el-button type="info" @click="quitLogin">退出</el-button>
 </div>
</template>

<script>
// 导入封装的token方法
import { removeToken } from '../../utils/token'

export default {
  name: 'home',
  data () {
    return {

    }
  },
  methods: {
    // 当点击退出按钮时
    quitLogin () {
      // 清空token
      removeToken()
      // 提示用户
      this.$message({
        message: '退出成功',
        type: 'success'
      })
      // 跳转到登录页面
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
