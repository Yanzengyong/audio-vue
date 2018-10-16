import AudioComponent from './Audio.vue'

const comment = {
  install: (Vue) => {
    Vue.component(AudioComponent.name, AudioComponent)
  }
}
// global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment)
}
// 导出模块
export default comment
