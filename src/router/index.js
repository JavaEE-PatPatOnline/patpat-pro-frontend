import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import NoticeView from '../views/NoticeView.vue'
import LabView from '../views/LabView.vue'
import UserView from '../views/UserView.vue'
import DiscussionView from '../views/DiscussionView.vue'
import DiscussionDetailView from '../views/DiscussionDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/notice'
    },
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
    },
    {
      path: '/user',
      component: UserView
    },
    {
      path: '/discussion',
      component: DiscussionView
    },
    {
      path: '/discussion/:id',
      component: DiscussionDetailView
    }
  ]
})

export default router
