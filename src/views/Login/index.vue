<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form" label-width="80px">
        <!-- 用户名区域 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            autocomplete="off"
            show-password
          >
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="login_btns">
          <el-button type="primary" :plain="true" @click="loginFn">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入封装的api方法
import { userLoginAPI } from '../../api/index'
// 导入封装的token方法
import { setToken } from '../../utils/token'

export default {
  name: 'login',
  data () {
    return {
      // 登录表单的数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单校验规则
      loginFormRules: {
        // 用户名校验规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 密码校验规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 当点击重置按钮时
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 当点击登录按钮时
    loginFn () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 如果校验不通过，阻止后续代码继续执行
        if (!valid) return false
        // 发起网络请求
        const res = await userLoginAPI({
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        // 用户名不存在
        if (res.data.meta.status === 400) {
          this.$message({
            message: '用户不存在',
            type: 'error'
          })
        } else if (res.data.meta.status === 200) {
          // 登录成功
          // 提示用户登录成功
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 保存token
          setToken(res.data.data.token)
          // 跳转主页
          this.$router.replace('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 30px;

  .login_btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
