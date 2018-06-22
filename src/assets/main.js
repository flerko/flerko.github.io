import Vue from 'vue'
import VueRouter from 'vue-router'
import getRoute from './routes'
import getStore from './store'
import Layout from "./components/layout/Layout.vue"

async function initApp() {
  Vue.use(VueRouter)
  Vue.component("Layout", Layout)

  const store = await getStore()
  const router = await getRoute()

  router.beforeEach(async (to, from, next) => {
    return next()
  })

  await new Vue({
    el: '#layout',
    router: router,
    template: '<Layout/>',
    components: { layout },
    store,
  })
}

initApp()
