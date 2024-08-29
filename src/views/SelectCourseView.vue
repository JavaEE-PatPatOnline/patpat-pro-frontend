<template>
  <NFlex justify="center" align="center" class="container" :wrap="true">
    <div>
      <h3>选择课程</h3>
      <ul>
        <li v-for="course in courses" :key="course.id" @click="selectCourse(course.id)">
          {{ course.name }}（{{ course.semester }}）
        </li>
      </ul>
    </div>
  </NFlex>
</template>

<script>
import Course from '../api/Course.js'
import { NFlex } from 'naive-ui'

export default {
  name: 'SelectCourseView',
  components: {
    NFlex
  },
  data() {
    return {
      courses: [] 
    }
  },
  mounted() {
    Course.getAllCourses().then(
      (response) => {
        this.courses = response.data.data
      },
      (error) => {
        alert('获取课程列表失败')
      }
    )
  },
  methods: {
    selectCourse(id) {
      Course.selectCourse(id).then(
        (response) => {
          alert('选择课程成功')
          this.$router.push('/notice')
          this.$bus.emit('update-lab')
          this.$bus.emit('update-iter')
        },
        (error) => {
          alert('选择课程失败')
        }
      )
    }
  }
}
</script>

<style scoped>
.container {
  height: calc(100% - 60px);
}

h3 {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: var(--default-blue);
  margin-bottom: 10px;
}

ul {
  width: 100%;
  padding-bottom: 100px;
}

li {
  font-size: 18px;
  padding: 10px 5px;
  border-bottom: 1px solid var(--default-grey-light);
  cursor: pointer;
  text-align: center;
}

li:hover {
  background: var(--default-grey-transparent);
}

li:last-child {
  border: 0;
}
</style>