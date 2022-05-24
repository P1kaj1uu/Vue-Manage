// 统一封装接口方法
// 每个方法负责请求一个url地址

// 导入封装的axios
import axios from '../utils/request'

// 用户登录
export const userLoginAPI = ({ username, password }) => axios({
  url: '/login',
  method: 'POST',
  data: {
    username,
    password
  }
})
