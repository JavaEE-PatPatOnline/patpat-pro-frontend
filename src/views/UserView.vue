<template>
  <!-- 占满全屏的容器 -->
  <NFlex justify="center" align="center" class="user-container">
    <!-- 用户面板 -->
    <NFlex vertical justify="space-around" align="center" class="user">
      <!-- 上方信息区 -->
      <NFlex justify="space-evenly" align="center" class="user-info">
        <!-- 头像 -->
        <div class="avatar" :style="{ backgroundImage: `url('${avatar}')` }" @click="handleUpload"></div>
        <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileChange" />
        <!-- 文字信息 -->
        <NFlex justify="center" align="center" class="list-wrapper">
          <ul>
            <li class="name">{{ name }}</li>
            <li>学工号：{{ buaaId }}</li>
            <li>学院：{{ school }}</li>
            <li v-if="type === '学生'">专业：{{ major }}</li>
            <li v-if="type === '学生'">班级：{{ classId }}</li>
            <li v-if="type === '学生'">授课教师：{{ teacher }}</li>
            <li>身份：{{ type }}</li>
          </ul>
        </NFlex>
      </NFlex>
      <!-- 下方按钮容器 -->
      <NFlex justify="flex-end" align="center" class="btn-box">
        <button @click="changePasswordModalShouldShow = true">修改密码</button>
        <button class="styled" @click="logout">退出登录</button>
      </NFlex>
    </NFlex>
  </NFlex>
  <NModal v-model:show="changePasswordModalShouldShow" preset="card" :style="modalStyle">
    <h4 class="modal-title">修改密码</h4>
    <input type="password" placeholder="原密码" v-model="originPassword" /><br />
    <input type="password" placeholder="新密码" v-model="newPassword" /><br />
    <input type="password" placeholder="确认密码" v-model="confirmedPassword" /><br />
    <NFlex justify="space-between" align="center" class="modal-btn">
      <button @click="changePasswordModalShouldShow = false">取消</button>
      <button class="styled" @click="changePassword">确认</button>
    </NFlex>
  </NModal>
</template>

<script>
import { NFlex, NModal } from 'naive-ui'
import User from '../api/User.js'
import Account from '../api/Account.js'

import { mapState } from 'vuex'

export default {
  name: 'UserView',
  components: {
    NFlex,
    NModal
  },
  data() {
    return {
      type: '教师', // 用户类型：学生/助教/教师
      name: '柳政尧', // 用户姓名
      buaaId: '21371300', // 学工号
      school: '软件学院', // 学院
      major: '软件工程', // 专业
      classId: '212113', // 小班号
      teacher: '高祥', // 教师名
      avatar: '', // 头像
      changePasswordModalShouldShow: false,
      originPassword: '',
      newPassword: '',
      confirmedPassword: '',
      modalStyle: {
        width: 'fit-content',
      }
    }
  },
  computed: {
    ...mapState(['isAdmin'])
  },
  mounted() {
    User.getUserInfo().then(
      (response) => {
        const userData = response.data.data
        if (userData) {
          this.type = userData.teacher ? "教师" : (userData.ta ? "助教" : "学生")
          this.name = userData.name || ''
          this.avatar = userData.avatar || 'http://8.130.103.241/public/boy.svg'
        }
      },
      (error) => {
        alert("获取用户信息失败")
        console.log(error.response.data.status)
      }
    )
    if (!this.isAdmin) {
      User.getStuInfo().then(
        (response) => {
          const stu = response.data.data
          this.avatar = stu.avatar
          this.buaaId = stu.buaaId
          this.school = stu.school
          this.major = stu.major
          this.classId = stu.className
          this.teacher = stu.teacherName
        },
        (error) => {
          alert('获取学生信息失败')
        }
      )
    }
  },
  methods: {
    handleUpload() {
      this.$refs.fileInput.click()
    },
    handleFileChange(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.avatar = URL.createObjectURL(event.target.files[0])
        // todo
      }
    },
    changePassword() {
      // todo
    },
    logout() {
      Account.logout().then(
        (response) => {
          alert('登出成功')
          this.$router.push('/login')
          this.$bus.emit('update-navigator')
        },
        (error) => {
          alert('登出失败')
        }
      )
    }
  }
}
</script>

<style scoped>
.user-container {
  width: 100%;
  min-height: calc(100% - 60px);
}

.user {
  min-width: 350px;
  width: 50%;
  padding: 20px 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px var(--shadow-color);
  overflow: hidden;
  margin: 20px auto;
}

.user-info {
  width: 99%;
  height: 60%;
  padding: 20px 0;
  border-bottom: 1px solid var(--default-grey-transparent);
}

.avatar {
  width: 250px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 50%;
  cursor: pointer;
  border: 2px dashed var(--default-grey);
  transition: 1.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  background-clip: content-box;
  background-size: cover;
}

.avatar:hover {
  transform: translate(-3px, -3px) scale(1.05);
}

.list-wrapper {
  width: 50%;
}

ul {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

ul li {
  width: 80%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: var(--default-grey);
}

ul li.name {
  color: var(--font-color);
  font-size: 36px;
  /* height: 50px; */
  font-weight: bold;
  margin-bottom: 20px;
}

.btn-box {
  width: 99%;
  height: 50px;
}

h4.modal-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 60px;
}

input {
  margin: 10px 60px;
}

.modal-btn {
  margin: 20px auto;
  width: 50%;
}
</style>