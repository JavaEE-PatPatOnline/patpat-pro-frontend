<template>
  <NFlex justify="center" align="center" class="container">
    <NFlex vertical justify="flex-start" align="center" wrap class="login-container">
      <h2>欢迎来到 Patpat Online</h2>
      <div class="input-container">
        <span>
          用户名
        </span>
        <input type="text" v-model="username" />
      </div>
      <div class="input-container position-wrapper">
        <span>
          密码
        </span>
        <input type="password" v-model="password" @keydown.enter="login" />
        <svg @click="login" t="1711444356055" class="icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="10103" width="200" height="200">
          <path
            d="M512 832c-176.448 0-320-143.552-320-320S335.552 192 512 192s320 143.552 320 320-143.552 320-320 320m0-704C300.256 128 128 300.256 128 512s172.256 384 384 384 384-172.256 384-384S723.744 128 512 128"
            fill="#3E3A39" p-id="10104"></path>
          <path
            d="M469.376 360.192a31.968 31.968 0 1 0-42.752 47.616l134.016 120.32-134.496 125.856a32 32 0 0 0 43.712 46.72l160-149.696a31.968 31.968 0 0 0-0.48-47.168l-160-143.68z"
            fill="#3E3A39" p-id="10105"></path>
        </svg>
      </div>
    </NFlex>
  </NFlex>
</template>

<script>
import { NFlex, useMessage } from 'naive-ui'
import Account from '../api/Account.js'
import User from '../api/User.js'
import { mapMutations } from 'vuex'

export default {
  name: 'LoginView',
  components: {
    NFlex
  },
  data() {
    return {
      username: '',
      password: '',
      message: useMessage()
    }
  },
  methods: {
    ...mapMutations(['setIsAdmin', 'setUserBuaaId']),
    login() {
      if (this.username === '' || this.password === '') {
        this.message.error('用户名和密码不得为空')
      } else {
        Account.login(this.username, this.password).then(
          (response) => {
            if (response.data.status === 200) {
              User.getUserInfo().then(
                (response) => {
                  this.setIsAdmin(response.data.data.ta | response.data.data.teacher)
                  this.setUserBuaaId(response.data.data.id)
                },
                (error) => {
                  this.message.error('获取用户信息失败')
                }
              )
              this.$bus.emit('update-navigator')
              this.$router.push('/select-course')
            }
          },
          (error) => {
            if (error.response.data.status === 403 || error.response.data.status === 400) {
              this.message.error(error.response.data.message)
            } else {
              this.message.error('登录失败')
            }
          }
        )
      }
    }
  }
}
</script>

<style scoped>
.container {
  height: calc(100% - 60px);
}

h2 {
  font-size: 30px;
  width: 100%;
  font-weight: bold;
  color: var(--default-blue);
  text-align: center;
  margin: 35px 0;
}

.login-container {
  width: 500px;
  height: 300px;
  box-sizing: border-box;
  box-shadow: 1px 1px 5px grey;
  border-radius: 10px;
}

.input-container {
  margin-bottom: 35px;
}

.input-container span {
  display: inline-block;
  width: 60px;
  font-size: 18px;
}

.position-wrapper {
  position: relative;
}

.position-wrapper svg {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 1px;
  right: 3px;
  cursor: pointer;
}
</style>