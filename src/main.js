import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入树形结构表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入封装的时间格式化方法
import formatTime from './utils/day.js'

Vue.prototype.$formatTime = formatTime

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

if (process.env.NODE_ENV !== 'development') {
  // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function () {}
  console.error = function () {}
  console.dir = function () {}
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
