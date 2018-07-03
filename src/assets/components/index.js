import Vue from 'vue'

const Layout    =  Vue.component('layout',    () => import('./layout/Layout.vue'))
const Homepage  =  Vue.component('homepage',  () => import('./pages/Homepage.vue'))

export {
  Layout,
  Homepage
}
