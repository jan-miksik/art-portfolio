import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Homepage from '@/pages/Homepage.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/:topic?',
    name: 'Home',
    component: Homepage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
