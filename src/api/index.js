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

// 所有权限列表
export const getAllRightsAPI = () => axios({
  url: '/rights/list',
  method: 'GET'
})

// 角色列表
export const getAllRolesAPI = () => axios({
  url: '/roles',
  method: 'GET'
})

// 删除角色指定权限
export const deleteRoleRightAPI = ({ roleId, rightId }) => axios({
  url: `/roles/${roleId}/rights/${rightId}`,
  method: 'DELETE'
})

// 角色授权
export const addRoleRightAPI = ({ roleId, rids }) => axios({
  url: `/roles/${roleId}/rights`,
  method: 'POST',
  data: {
    rids
  }
})

// 所有权限列表(树形结构)
export const getAllRightsTreeAPI = () => axios({
  url: '/rights/tree',
  method: 'GET'
})

// 角色授权
export const addRoleRightTreeAPI = ({ roleId, rids }) => axios({
  url: `/roles/${roleId}/rights`,
  method: 'POST',
  data: {
    rids
  }
})

// 分配用户角色
export const addUserRoleAPI = ({ id, rid }) => axios({
  url: `/users/${id}/role`,
  method: 'PUT',
  data: {
    rid
  }
})

// 商品分类数据列表
export const getCategoriesListAPI = ({ type, pagenum, pagesize }) => axios({
  url: '/categories',
  method: 'GET',
  params: {
    type,
    pagenum,
    pagesize
  }
})

// 添加分类
export const addCategoriesListAPI = ({ catPid, catName, catLevel }) => axios({
  url: '/categories',
  method: 'POST',
  data: {
    cat_pid: catPid,
    cat_name: catName,
    cat_level: catLevel
  }
})

// 删除分类
export const deleteCategoryAPI = ({ id }) => axios({
  url: `/categories/${id}`,
  method: 'DELETE'
})

// 编辑提交分类
export const editCategoryAPI = ({ id, catName }) => axios({
  url: `categories/${id}`,
  method: 'PUT',
  data: {
    cat_name: catName
  }
})

// 获取商品参数列表
export const getAttributesListAPI = ({ id, sel }) => axios({
  url: `/categories/${id}/attributes`,
  method: 'GET',
  params: {
    sel
  }
})

// 添加动态参数或者静态属性
export const addAttributesListAPI = ({ id, attrName, attrSel, attrVals = null }) => axios({
  url: `/categories/${id}/attributes`,
  method: 'POST',
  data: {
    attr_name: attrName,
    attr_sel: attrSel,
    attr_vals: attrVals
  }
})

// 删除参数
export const deleteAttributesListAPI = ({ id, attrid }) => axios({
  url: `/categories/${id}/attributes/${attrid}`,
  method: 'DELETE'
})

// 根据ID查询参数
export const queryAttributesListAPI = ({ id, attrId, attrSel, attrVals = null }) => axios({
  url: `/categories/${id}/attributes/${attrId}`,
  method: 'GET',
  params: {
    attr_sel: attrSel,
    attr_vals: attrVals
  }
})

// 编辑提交参数
export const editAttributesListAPI = ({ id, attrId, attrName, attrSel, attrVals = null }) => axios({
  url: `/categories/${id}/attributes/${attrId}`,
  method: 'PUT',
  data: {
    attr_name: attrName,
    attr_sel: attrSel,
    attr_vals: attrVals
  }
})

// 商品列表数据
export const getGoodsListAPI = ({ query = null, pagenum, pagesize }) => axios({
  url: '/goods',
  method: 'GET',
  params: {
    query,
    pagenum,
    pagesize
  }
})

// 添加商品
export const addGoodsListAPI = ({ goodsName, goodsCat, goodsPrice, goodsNumber, goodsWeight, goodsIntroduce = null, pics = null, attrs = null }) => axios({
  url: '/goods',
  method: 'POST',
  data: {
    goods_name: goodsName,
    goods_cat: goodsCat,
    goods_price: goodsPrice,
    goods_number: goodsNumber,
    goods_weight: goodsWeight,
    goods_introduce: goodsIntroduce,
    pics,
    attrs
  }
})

// 根据ID查询商品
export const queryGoodsByIdAPI = ({ id }) => axios({
  url: `/goods/${id}`,
  method: 'GET'
})

// 编辑提交商品
export const editGoodsListByIdAPI = ({ id, goodsName, goodsPrice, goodsNumber, goodsWeight, goodsIntroduce = null, pics = null, attrs = null }) => axios({
  url: `/goods/${id}`,
  method: 'PUT',
  data: {
    goods_name: goodsName,
    goods_price: goodsPrice,
    goods_number: goodsNumber,
    goods_weight: goodsWeight,
    goods_introduce: goodsIntroduce,
    pics,
    attrs
  }
})

// 删除商品
export const deleteGoodsByIdAPI = ({ id }) => axios({
  url: `/goods/${id}`,
  method: 'DELETE'
})

// 图片上传
export const uploadFileAPI = ({ file }) => axios({
  url: '/upload',
  method: 'POST',
  data: {
    file
  }
})

// 添加商品
export const addGoodsAPI = ({ goodsName, goodsCat, goodsPrice, goodsNumber, goodsWeight, goodsIntroduce = null, pics = null, attrs = null }) => axios({
  url: '/goods',
  method: 'POST',
  data: {
    goods_name: goodsName,
    goods_cat: goodsCat,
    goods_price: goodsPrice,
    goods_number: goodsNumber,
    goods_weight: goodsWeight,
    goods_introduce: goodsIntroduce,
    pics,
    attrs
  }
})
