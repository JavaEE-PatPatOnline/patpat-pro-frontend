import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import NoticeView from '../views/NoticeView.vue'
import LabView from '../views/LabView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/notice',
      component: NoticeView,
    },
    {
      path: '/lab/:id',
      component: LabView
    },
    {
      path: '/lab/:id/edit',
      component: LabView
    },
    {
      path: '/lab/create',
      component: LabView
    }
  ]
})

export default router
