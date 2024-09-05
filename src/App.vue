<template>
  <NMessageProvider>
    <Navigator />
    <template 
      v-if="!(instance.proxy.$route.path.includes('user') || 
      instance.proxy.$route.path.includes('login') || 
      instance.proxy.$route.path.includes('select-course') ||
      instance.proxy.$route.path === '/game' ||
      instance.proxy.$route.path === '/course')" 
    >
      <NLayout has-sider>
        <NLayoutSider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="250"
          :collapsed="collapsed"
          style="height: calc(100vh - 60px)"
          :native-scrollbar="false"
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <NMenu
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :icon-size="30"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :indent="36"
            :root-indent="10"
          />
        </NLayoutSider>
        <NLayoutContent>
          <main>
            <RouterView />
          </main>
        </NLayoutContent>
      </NLayout>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </NMessageProvider>
</template>

<script setup>
import { h, nextTick, ref, watch, getCurrentInstance } from 'vue'
import Navigator from './components/navigator/Navigator.vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { NLayout, NLayoutSider, NLayoutContent, NMenu, NFlex, NIcon, NMessageProvider } from 'naive-ui'
import {
  NotificationsOutline as NoticeIcon,
  CodeSlashOutline as LabIcon,
  CodeWorkingOutline as IterIcon,
  ChatbubbleEllipsesOutline as ChatIcon,
  PeopleOutline as TeamIcon,
  InformationCircleOutline as InfoIcon,
  // FileTrayFullOutline as ResourceIcon,
  HelpCircleOutline as ProblemIcon,
  // PersonCircleOutline as StudentIcon,
  SettingsOutline as CourseIcon
} from '@vicons/ionicons5'

import User from './api/User.js'

// 访问 store 中的 isAdmin
import { useStore } from 'vuex'
const store = useStore()
const instance = getCurrentInstance()

// 绑定左侧导航菜单的值
let activeKey = ref('notice')
let collapsed = ref(true)

// 渲染导航菜单的图标
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

import Lab from './api/Lab.js'

let labs = ref([])
let labMenuOptions = ref([])

import Iter from './api/Iter.js'

let iters = ref([])
let iterMenuOptions = ref([])

let menuOptions = ref([
  {
    label: () => h(
      RouterLink,
      {
        to: {
          path: '/notice'
        }
      },
      { default: () => '课程公告' }
    ),
    key: 'notice',
    icon: renderIcon(NoticeIcon)
  },
  {
    label: '实验作业',
    key: 'lab',
    icon: renderIcon(LabIcon),
    children: labMenuOptions
  },
  {
    label: '迭代作业',
    key: 'iteration',
    icon: renderIcon(IterIcon),
    children: iterMenuOptions
  },
  {
    label: () => h(
      RouterLink,
      {
        to: '/discussion',
      },
      { default: () => '讨论中心' }
    ),
    key: 'discussion',
    icon: renderIcon(ChatIcon)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: '/group',
      },
      { default: () => '团队管理' }
    ),
    key: 'group',
    icon: renderIcon(TeamIcon)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: '/tutorial'
      },
      { default: () => '课程资料' }
    ),
    key: 'tutorial',
    icon: renderIcon(InfoIcon)
  }
])

function getAllLabs(isAdmin) {
  if (instance.proxy.$cookies.get('course') && instance.proxy.$cookies.get('course') !=='') {
    Lab.getLabs(isAdmin).then(
      (response) => {
        labs.value = response.data.data
        labMenuOptions.value = labs.value.map(lab => ({
          label: () => h(
            RouterLink,
            {
              to: {
                path: '/lab/' + lab.id
              }
            },
            { default: () => lab.title }
          ),
          key: 'lab' + lab.id
        }))
        if (isAdmin) {
          labMenuOptions.value.unshift({
            label: () => h(
              RouterLink,
              {
                to: {
                  path: '/lab/create'
                }
              },
              { default: () => '新建实验' }
            ),
            key: 'creating-lab'
          })
          menuOptions.value[1].children.value = labMenuOptions.value
        }
      }
    )
  }
}

function getAllIters(isAdmin) {
  if (instance.proxy.$cookies.get('course') && instance.proxy.$cookies.get('course') !=='') {
    Iter.getIters(isAdmin).then(
      (response) => {
        iters.value = response.data.data
        iterMenuOptions.value = iters.value.map(iter => ({
          label: () => h(
            RouterLink,
            {
              to: {
                path: '/iter/' + iter.id
              }
            },
            { default: () => iter.title }
          ),
          key: 'iter' + iter.id
        }))
        if (isAdmin) {
          iterMenuOptions.value.unshift({
            label: () => h(
              RouterLink,
              {
                to: {
                  path: '/iter/create'
                }
              },
              { default: () => '新建迭代' }
            ),
            key: 'creating-iter'
          })
          menuOptions.value[2].children.value = iterMenuOptions.value
        }
      }
    )
  }
}

watch(() => store.state.isAdmin, (a, b) => {
  getAllLabs(store.state.isAdmin)
  getAllIters(store.state.isAdmin)
  if (store.state.isAdmin && menuOptions.value.length < 7) {
    menuOptions.value.push(
      {
        label: () => h(
          RouterLink,
          {
            to: '/problem',
          },
          { default: () => '题目列表' }
        ),
        key: 'problem',
        icon: renderIcon(ProblemIcon)
      }
    )
  }
  if (store.state.isAdmin && menuOptions.value.length < 8) {
    menuOptions.value.push(
      {
        label: '管理菜单',
        key: 'admin',
        icon: renderIcon(CourseIcon),
        children: [
          {
            label: () => h(
              RouterLink,
              {
                to: '/admin/course'
              },
              { default: () => '课程管理' },
            ),
            key: 'course'
          },
          {
            label: () => h(
              RouterLink,
              {
                to: '/admin/teaching'
              },
              { default: () => '教学管理' },
            ),
            key: 'teaching'
          },
          {
            label: () => h(
              RouterLink,
              {
                to: '/admin/student',
              },
              { default: () => '学生管理' }
            ),
            key: 'student'
          },
          // {
          //   label: () => h(
          //     RouterLink,
          //     {
          //       to: '/admin/submission'
          //     },
          //     { default: () => '成绩管理' }
          //   ),
          //   key: 'submission'
          // },
          {
            label: '成绩管理',
            key: 'grade',
            children: [
              {
                label: () => h(
                  RouterLink,
                  {
                    to: '/admin/test-submission',
                  },
                  { default: () => '评测记录' }
                ),
                key: 'test-submission'
              },
              {
                label: () => h(
                  RouterLink,
                  {
                    to: '/admin/all-submission',
                  },
                  { default: () => '提交汇总' }
                ),
                key: 'all-submission'
              },
            ]
          },
          {
            label: () => h(
              RouterLink,
              {
                to: '/admin/resource',
              },
              { default: () => '资源管理' }
            ),
            key: 'resource'
          }
        ]
      }
    )
  }

  if (!store.state.isAdmin && menuOptions.value.length === 8) {
    menuOptions.value.pop()
    menuOptions.value.pop()
  }
}, { immediate: true })

// if (instance.proxy.$cookies.get('jwt') && instance.proxy.$cookies.get('course')) {
//   getAllLabs(store.state.isAdmin)
// }
instance.proxy.$bus.on('update-lab', () => {
  getAllLabs(store.state.isAdmin)
})


// if (instance.proxy.$cookies.get('jwt') && instance.proxy.$cookies.get('course')) {
//   getAllIters(store.state.isAdmin)
// }
instance.proxy.$bus.on('update-iter', () => {
  getAllIters(store.state.isAdmin)
})

// 监听路由变化，设置 activeKey 控制菜单样式
watch(() => instance.proxy.$route.path, (newPath, oldPath) => {
  if (newPath === '/notice') {
    // 公告
    activeKey.value = 'notice'
  } else if (newPath === '/lab/create') {
    // 创建实验
    activeKey.value = 'creating-lab'
  } else if (newPath.includes('lab')) {
    // 实验详情
    const id = instance.proxy.$route.params.id
    activeKey.value = 'lab' + id
  } else if (newPath === '/iter/create') {
    // 创建迭代
    activeKey.value = 'creating-iter'
  } else if (newPath.includes('iter')) {
    // 实验详情
    const id = instance.proxy.$route.params.id
    activeKey.value = 'iter' + id
  } else if (newPath.includes('discussion')) {
    // 讨论区
    activeKey.value = 'discussion'
  } else if (newPath.includes('group')) {
    // 团队
    activeKey.value = 'group'
  } else if (newPath.includes('tutorial')) {
    // 教程
    activeKey.value = 'tutorial'
  } else if (newPath.includes('problem')) {
    // 题目库
    activeKey.value = 'problem'
  } else if (newPath.includes('student')) {
    // 学生管理
    activeKey.value = 'student'
  } else if (newPath.includes('course')) {
    // 课程管理
    activeKey.value = 'course'
  } else if (newPath.includes('resource')) {
    // 资源管理
    activeKey.value = 'resource'
  } else if (newPath.includes('test-submission')) {
    // 成绩管理
    activeKey.value = 'test-submission'
  } else if (newPath.includes('teaching')) {
    // 教学管理
    activeKey.value = 'teaching'
  } else if (newPath.includes('all-submission')) {
    // 教学管理
    activeKey.value = 'all-submission'
  }
  nextTick(() => {
    const menus = document.getElementsByClassName('n-layout-sider')
    if (menus.length > 0) {
      const menu = menus[0]
      menu.addEventListener('mouseenter', function() {
        collapsed.value = false
      })
      menu.addEventListener('mouseleave', function() {
        collapsed.value = true
      })
    }
  })
}, {
  immediate: true
})


</script>

<style scoped>
main {
  height: calc(100vh - 60px);
  box-sizing: border-box;
  padding: 10px 20px;
}
</style>
