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

// 左侧菜单权限列表数据
export const menuListAPI = () => axios({
  url: '/menus',
  method: 'GET'
})

// 用户数据列表
export const getUsersListAPI = ({ query, pagenum, pagesize }) => axios({
  url: '/users',
  method: 'GET',
  params: {
    query,
    pagenum,
    pagesize
  }
})

// 修改用户状态
export const editUserStatusAPI = ({ uId, type }) => axios({
  url: `/users/${uId}/state/${type}`,
  method: 'PUT'
})

// 添加用户
export const addUserAPI = ({ username, password, email, mobile }) => axios({
  url: '/users',
  method: 'POST',
  data: {
    username,
    password,
    email,
    mobile
  }
})

// 根据ID查询用户信息
export const queryUserByIdAPI = ({ id }) => axios({
  url: `/users/${id}`,
  method: 'GET'
})

// 编辑用户提交
export const editUserAPI = ({ id, email, mobile }) => axios({
  url: `/users/${id}`,
  method: 'PUT',
  data: {
    email,
    mobile
  }
})

// 删除单个用户
export const deleteUserAPI = ({ id }) => axios({
  url: `/users/${id}`,
  method: 'DELETE'
})
