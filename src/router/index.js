import { createRouter, createWebHistory } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'
import LoginView from '../views/LoginView.vue'
import SelectCourseView from '../views/SelectCourseView.vue'
import NoticeView from '../views/NoticeView.vue'
import LabView from '../views/LabView.vue'
import IterView from '../views/IterView.vue'
import UserView from '../views/UserView.vue'
import DiscussionView from '../views/DiscussionView.vue'
import DiscussionDetailView from '../views/DiscussionDetailView.vue'
import ProblemView from '../views/ProblemView.vue'
import GroupView from '../views/GroupView.vue'
import TutorialView from '../views/TutorialView.vue'


import VueCookies from 'vue-cookies'

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
      path: '/select-course',
      component: SelectCourseView
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
      path: '/iter/:id',
      component: IterView
    },
    {
      path: '/iter/:id/edit',
      component: IterView
    },
    {
      path: '/iter/create',
      component: IterView
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
    },
    {
      path: '/group',
      component: GroupView
    },
    {
      path: '/problem',
      component: ProblemView
    },
    {
      path: '/tutorial',
      component: TutorialView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (VueCookies.get('jwt') && to.path === '/login') {
    next('/notice')
  } else if (VueCookies.get('jwt') && (!VueCookies.get('course') || VueCookies.get('course') === '') && to.path !== '/select-course') {
    next('/select-course')
  } else if (VueCookies.get('jwt') && (VueCookies.get('course') && VueCookies.get('course') !== '') && to.path === '/select-course') {
    next('/notice')
  } else if (!VueCookies.get('jwt') && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})


export default router
