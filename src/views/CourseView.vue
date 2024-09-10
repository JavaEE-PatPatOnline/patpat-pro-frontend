<template>
  <button class="styled full-btn" @click="startCreateCourse">+</button>
  <NFlex align="center" class="create-course" v-if="createCourseShouldShow">
    <input type="text" v-model="newCode" placeholder="课程代码" />
    <input type="text" v-model="newName" placeholder="课程名称" />
    <input type="text" v-model="newSemester" placeholder="课程学期" />
    <input type="radio" id="option1" value="inactive" v-model="newActiveState" />
    <label for="option1">不开放</label>
    <input type="radio" id="option2" value="active" v-model="newActiveState" />
    <label for="option2">开放</label><br />
    <button @click="cancelCreateCourse">取消</button>
    <button class="styled" @click="createCourse">创建</button>
  </NFlex>
  <ul>
    <li v-for="course in courses" :key="course.id">
      <NFlex justify="space-between" align="center">
        <NFlex align="center">
          <span class="code" >{{ course.code }}</span>
          <span class="name">{{ course.name }}</span>
          <span class="semester">{{ course.semester }}</span>
          <span class="active">{{ course.active ? '开放' : '未开放' }}</span>
        </NFlex>
        <NFlex align="center">
          <EditIcon @click="startEditCourse(course)" />
          <NPopconfirm positive-text="确认" negative-text="取消"
            :show-icon="false" @positive-click="deleteCourse(course.id)">
            <template #trigger>
              <DeleteIcon />
            </template>
            确认删除该课程？
          </NPopconfirm>
        </NFlex>
      </NFlex>
    </li>
  </ul>
  <NModal v-model:show="editCourseShouldShow" preset="card" :style="modalStyle">
    <h4 class="modal-title">修改课程信息</h4>
    <input class="modal-input" type="text" placeholder="课程代码" v-model="newCode" /><br />
    <input class="modal-input" type="text" placeholder="课程名称" v-model="newName" /><br />
    <input class="modal-input" type="text" placeholder="课程学期" v-model="newSemester" /><br />
    <span class="inline-placeholder"></span>
    <input class="modal-radio" type="radio" id="option1" value="inactive" v-model="newActiveState" />
    <label for="option1">不开放</label>
    <input class="modal-radio" type="radio" id="option2" value="active" v-model="newActiveState" />
    <label for="option2">开放</label><br />
    <NFlex justify="space-between" align="center" class="modal-btn">
      <button @click="cancelEditCourse">取消</button>
      <button class="styled" @click="editCourse">确认</button>
    </NFlex>
  </NModal>
</template>

<script>
import EditIcon from '../components/svg/EditIcon.vue'
import DeleteIcon from '../components/svg/DeleteIcon.vue'
import Course from '../api/Course.js'

import { NFlex, NPopconfirm, NModal, useMessage } from 'naive-ui'

export default {
  name: 'CourseView',
  components: {
    EditIcon,
    DeleteIcon,
    NFlex,
    NPopconfirm,
    NModal
  },
  data() {
    return {
      message: useMessage(),
      courses: [],
      modalStyle: {
        width: 'fit-content',
      },
      createCourseShouldShow: false,
      editCourseShouldShow: false,
      courseIdEditing: null,
      newCode: '',
      newName: '',
      newSemester: '',
      newActiveState: ''
    }
  },
  mounted() {
    this.getAllCourses()
  },
  methods: {
    getAllCourses() {
      Course.getAllCourses().then(
        (response) => {
          this.courses = response.data.data
        },
        (error) => {
          this.message.error('获取课程列表失败')
        }
      )
    },
    startCreateCourse() {
      this.newCode = ''
      this.newName = ''
      this.newSemester = ''
      this.newActiveState = 'inactive'
      this.createCourseShouldShow = true
    },
    cancelCreateCourse() {
      this.newCode = ''
      this.newName = ''
      this.newSemester = ''
      this.newActiveState = ''
      this.createCourseShouldShow = false
    },
    createCourse() {
      Course.createCourse(
        this.newCode, this.newName, this.newSemester,
        this.newActiveState === 'active' ? true : false).then(
        (response) => {
          this.message.success('创建课程成功')
          this.getAllCourses()
          this.cancelCreateCourse()
        },
        (error) => {
          if (error.response.data.status === 403) {
            this.message.error(error.response.data.message)
          } else {
            this.message.error('删除课程失败')
          }
        }
      )
    },
    startEditCourse(course) {
      this.newCode = course.code
      this.newName = course.name
      this.newSemester = course.semester
      this.newActiveState = course.active ? 'active' : 'inactive'
      this.courseIdEditing = course.id
      this.editCourseShouldShow = true
    },
    cancelEditCourse() {
      this.newCode = ''
      this.newName = ''
      this.newSemester = ''
      this.newActiveState = ''
      this.courseIdEditing = null
      this.editCourseShouldShow = false
    },
    editCourse() {
      Course.updateCourse(
        this.courseIdEditing, this.newCode, this.newName, this.newSemester, 
        this.newActiveState === 'active' ? true : false).then(
          (response) => {
            this.message.success('修改课程成功')
            this.getAllCourses()
            this.cancelEditCourse()
          },
          (error) => {
            this.message.error('修改课程失败')
          }
        )
    },
    deleteCourse(id) {
      Course.deleteCourse(id).then(
        (response) => {
          this.message.success('删除课程成功')
          this.getAllCourses()
        },
        (error) => {
          if (error.response.data.status === 403) {
            this.message.error(error.response.data.message)
          } else {
            this.message.error('删除课程失败')
          }
        }
      )
    }
  }
}
</script>

<style scoped>
.create-course {
  margin-bottom: 10px;
}

.create-course input:not(input[type="radio"]) {
  width: 250px;
}

.create-course input[type="radio"] {
  width: 15px;
  height: 15px;
}

li {
  padding: 15px 0;
  border-bottom: 1px solid var(--default-grey-transparent);
}

li:last-child {
  border: 0;
}

span.code, span.name {
  font-size: 20px;
  color: var(--default-grey);
  font-weight: bold;
  margin-right: 10px;
}

span.name {
  color: var(--default-blue);
}

span.semester, span.active {
  color: var(--default-grey);
}

span.active {
  font-weight: bold;
}

input.modal-radio[type="radio"] {
  height: 15px;
  width: 15px;
  margin: 10px;
}

input.modal-input:not(input[type="radio"]) {
  margin: 10px 60px;
}

span.inline-placeholder {
  width: 50px;
  display: inline-block;
}

.modal-btn {
  margin: 20px auto;
  width: 50%;
}

h4.modal-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 60px;
}
</style>