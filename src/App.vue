<template>
  <NMessageProvider>
    <Navigator v-if="instance.proxy.$route.path !== '/'" />
    <template 
      v-if="!(instance.proxy.$route.path.includes('user') || 
      instance.proxy.$route.path.includes('login') || 
      instance.proxy.$route.path.includes('select-course') ||
      instance.proxy.$route.path === '/')" 
    >
      <NLayout has-sider>
        <NLayoutSider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="250"
          :collapsed="false"
        >
          <NMenu
            v-model:value="activeKey"
            :collapsed="false"
            :collapsed-width="64"
            :icon-size="40"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :indent="48"
            :root-indent="12"
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
  HelpCircleOutline as ProblemIcon,
} from '@vicons/ionicons5'

import User from './api/User.js'

// 访问 store 中的 isAdmin
import { useStore } from 'vuex'
const store = useStore()
const isAdmin = store.state.isAdmin

const instance = getCurrentInstance()

// 绑定左侧导航菜单的值
let activeKey = ref('notice')

// 渲染导航菜单的图标
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

import Lab from './api/Lab.js'
let labs = ref([])
let labMenuOptions = ref([])

function getAllLabs() {
  Lab.getLabs(false).then(
    (response) => {
      labs.value = response.data.data
      console.log(labs.value)
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
      // 如果是助教，labMenuOptions 的第一项是新建 lab
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
      }
    },
    (error) => {
      alert('获取实验列表失败')
    }
  )
}


if (instance.proxy.$cookies.get('jwt') && instance.proxy.$cookies.get('course')) {
  getAllLabs()
}
// 如果收到更新通知，重新获取 lab 列表
instance.proxy.$bus.on('update-lab', () => {
  getAllLabs()
})

import Iter from './api/Iter.js'
let iters = ref([])
let iterMenuOptions = ref([])


function getAllIters() {
  Iter.getIters(false).then(
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
      }
    }
  )
}

if (instance.proxy.$cookies.get('jwt') && instance.proxy.$cookies.get('course')) {
  getAllIters()
}
instance.proxy.$bus.on('update-iter', () => {
  getAllIters()
})

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
  // ,
  // {
  //   label: () => h(
  //     RouterLink,
  //     {
  //       to: '/problem',
  //     },
  //     { default: () => '题目列表' }
  //   ),
  //   key: 'problem',
  //   icon: renderIcon(ProblemIcon)
  // }
])

if (isAdmin) {
  menuOptions.push(
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

// 监听路由变化，设置 activeKey 控制菜单样式
watch(() => instance.proxy.$route.path, (newPath, oldPath) => {
  console.log(`路由从 ${oldPath} 变为了 ${newPath}`);
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
  }
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
