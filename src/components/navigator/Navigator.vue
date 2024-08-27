<template>
  <NFlex justify="space-between" align="center" class="header">
    <NFlex justify="center" align="center" class="banner" @click="jumpToHome" @mouseenter="$refs.java.play()"
      @mouseleave="$refs.java.pause()">
      <Vue3Lottie ref="java" :animationData="javaIcon" :height="50" :width="50" />
      <h1>Patpat Online</h1>
    </NFlex>
    <NFlex justify="flex-end" align="center">
      <ColorModeIcon @click="changeColorMode" />
      <div @click="jumpToUser" class="avatar" :style="{ 'backgroundImage': `url('${avatar}')` }">
      </div>
    </NFlex>
  </NFlex>
</template>

<script>
import ColorModeIcon from '../svg/ColorModeIcon.vue'
import javaIcon from '../../assets/icons8-java.json'
import User from '../../api/User.js'

import { mapMutations } from 'vuex'

import { NFlex } from 'naive-ui'
import { Vue3Lottie } from 'vue3-lottie'

export default {
  name: 'Navigator',
  components: {
    ColorModeIcon,
    NFlex,
    Vue3Lottie
  },
  data() {
    return {
      avatar: null,
      javaIcon
    }
  },
  created() {
    // 根据 local storage 初始化颜色模式
    const colorMode = localStorage.getItem('color-mode')
    if (colorMode) {
      this.setColorMode(colorMode)
    }
    setTimeout(() => {
      document.body.style.setProperty('transition', 'color 1s cubic-bezier(0.075, 0.82, 0.165, 1), background 1s cubic-bezier(0.075, 0.82, 0.165, 1)')
    }, 1500)
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.java) {
        this.$refs.java.pause()
      }
    }, 1)
    User.getUserInfo().then(
      (response) => {
        const user = response.data.data
        this.setUserAvatar(user.avatar)
        this.setUserBuaaId(user.buaaId)
        this.setIsAdmin(user.ta || user.teacher)
        this.avatar = user.avatar
      },
      (error) => {
        alert('获取用户信息失败')
      }
    )
    this.$bus.on('updateAvatar', (newAvatar) => {
      this.avatar = newAvatar
    })
  },
  methods: {
    ...mapMutations([
      'setIsAdmin',
      'setUserAvatar',
      'setUserBuaaId'
    ]),
    jumpToHome() {
      this.$router.push('/')
    },
    jumpToUser() {
      this.$router.push('/user')
    },
    changeColorMode() {
      const colorMode = localStorage.getItem('color-mode')
      if (colorMode) {
        if (colorMode === 'light') {
          // 当前为浅色，设置为深色
          this.setColorMode('dark')
        } else {
          // 当前为深色，设置为浅色
          this.setColorMode('light')
        }
      } else {
        // 无 local storage，设置为深色
        this.setColorMode('dark')
      }
    },
    setColorMode(mode) {
      if (mode === 'light') {
        // 设置颜色为浅色
        document.documentElement.style.setProperty('--font-color', '#333333')
        document.documentElement.style.setProperty('--bg-color', '#fbfbfc')
        document.documentElement.style.setProperty('--bg-like', '#fafafc')
        document.documentElement.style.setProperty('--bg-grey', '#eaeaea')
        document.documentElement.style.setProperty('--shadow-color', '#d9d9d9')

        // 修改主题蓝色
        document.documentElement.style.setProperty('--default-blue', 'rgb(0, 116, 189)')
        document.documentElement.style.setProperty('--default-blue-transparent', 'rgba(0, 116, 189, .1)')
        document.documentElement.style.setProperty('--default-blue-light', 'rgb(0, 116, 189, .2)')

        localStorage.setItem('color-mode', 'light')
      } else {
        // 设置颜色为深色
        document.documentElement.style.setProperty('--font-color', '#d6d6d6')
        document.documentElement.style.setProperty('--bg-color', '#181818')
        document.documentElement.style.setProperty('--bg-like', '#161619')
        document.documentElement.style.setProperty('--bg-grey', '#464649')
        document.documentElement.style.setProperty('--shadow-color', '#2f2f33')

        // 修改主题蓝色
        document.documentElement.style.setProperty('--default-blue', 'rgb(3, 122, 255)')
        document.documentElement.style.setProperty('--default-blue-transparent', 'rgba(3, 122, 255, .1)')
        document.documentElement.style.setProperty('--default-blue-light', 'rgba(3, 122, 255, .2)')

        localStorage.setItem('color-mode', 'dark')
      }
    }
  }
}
</script>

<style scoped>
.header {
  width: 99%;
  height: 60px;
  margin-left: 1%;
}

.banner {
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  position: relative;
  cursor: pointer;
  gap: 0;
}

.banner:hover {
  scale: 1.05;
}

.banner h1 {
  color: var(--default-blue);
  font-size: 24px;
  font-weight: bold;
}

.avatar {
  width: 45px;
  height: 45px;
  background: green;
  border-radius: 50%;
  margin-right: 20px;
  cursor: pointer;
  transition: 1s ease-in-out;
  background-size: cover;
}

.avatar:hover {
  transform: rotate(360deg);
}
</style>