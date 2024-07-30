<template>
  <NMessageProvider>
    <Navigator />
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
          <RouterView/>
        </main>
      </NLayoutContent>
    </NLayout>
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
  InformationCircleOutline as InfoIcon
} from '@vicons/ionicons5'

const instance = getCurrentInstance()

// 绑定左侧导航菜单的值
let activeKey = ref('notice')

// 渲染导航菜单的图标
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// labs 存储通过 API 获取的实验列表
let labs = ref([
  {
    id: '1',
    title: 'Lab01：初识 Java 如果名字很长怎么办呀！！！',
    content: '# 测试一下'
  },
  {
    id: '2',
    title: 'Lab02：OOP 基本思想',
    content: '## 测试一下'
  }
])
// labMenuOptions 存储用于菜单渲染和路由跳转的数据
let labMenuOptions = labs.value.map(lab => ({
  label: () => h(
    RouterLink,
    {
      to: {
        path: '/lab/' + lab.id
      }
    },
    { default: () => lab.title }
  ),
  key: lab.id
}))
// 如果是助教，labMenuOptions 的第一项是新建 lab
labMenuOptions.unshift({
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
    children: [
      {
        label: '迭代一',
        key: 'iter1'
      },
      {
        label: '迭代二',
        key: 'iter2'
      }
    ]
  },
  {
    label: '讨论中心',
    key: 'discussion',
    icon: renderIcon(ChatIcon)
  },
  {
    label: '团队管理',
    key: 'team',
    icon: renderIcon(TeamIcon)
  },
  {
    label: '课程资料',
    key: 'information',
    icon: renderIcon(InfoIcon)
  },
])

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
    activeKey.value = id
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
