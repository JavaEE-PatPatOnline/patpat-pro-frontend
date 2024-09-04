<template>
  <NFlex justify="space-between" align="center" class="stu-header">
    <NFlex align="center" class="filter">
      <input type="text" placeholder="学号" v-model="filterBuaaId" />
      <input type="text" placeholder="姓名" v-model="filterName" />
      <NSelect v-model:value="filterTeacherId" placeholder="教师" :options="selectOptions" />
      <button class="styled" @click="queryStudents">筛选</button>
      <button @click="cancelFilter">取消</button>
    </NFlex>
    <NFlex align="center">
      是否删除不存在的学生
      <input type="radio" id="option1" value="do-not-clean" v-model="clean" />
      <label for="option1">否</label>
      <input type="radio" id="option2" value="clean" v-model="clean" />
      <label for="option2">是</label>
      <button class="styled" @click="handleSelectFile">导入学生</button>
      <input 
        type="file" accept=".xls, .xlsx" 
        @input="importStudents" ref="fileInput" style="display: none"/>
      <button class="styled" @click="exportStudents">导出学生</button>
    </NFlex>
  </NFlex>
  <NDataTable
    :columns="columns"
    :data="students"
    :pagination="false"
    :bordered="false"
    table-layout="fixed"
    v-if="students.length > 0"
  />
  <NFlex justify="center" align="center" class="pagination" v-if="students.length > 0">
    <NPagination v-model:page="page" :page-count="totalPages" @update:page="queryStudents" />
  </NFlex>
  <div class="empty-hint" v-if="students.length === 0">暂无学生</div>
</template>

<script>
import Student from '../api/Student.js'
import Account from '../api/Account.js'

import { NFlex, NPagination, NDataTable, NSelect, useMessage } from 'naive-ui'

export default {
  name: 'StudentView',
  components: {
    NFlex,
    NPagination,
    NDataTable,
    NSelect
  },
  data() {
    return {
      message: useMessage(),
      clean: 'do-not-clean',
      students: [],
      page: 1,
      pageSize: 12,
      totalItems: 0,
      columns: [
        {
          title: '学号',
          key: 'buaaId'
        },
        {
          title: '姓名',
          key: 'studentName'
        },
        {
          title: '学院',
          key: 'school'
        },
        {
          title: '专业',
          key: 'major'
        },
        {
          title: '班级',
          key: 'className'
        },
        {
          title: '教师',
          key: 'teacherName'
        }
      ],
      teachers: [],
      filterBuaaId: '',
      filterName: '',
      filterTeacherId: null,
      selectOptions: []
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    }
  },
  mounted() {
    this.getAllTeachers()
    this.queryStudents()
  },
  methods: {
    getAllTeachers() {
      Account.getAllTeachers().then(
        (response) => {
          this.teachers = response.data.data
          this.selectOptions = this.teachers.map((teacher) => ({
            label: teacher.name,
            value: teacher.id
          }))
        },
        (error) => {
          this.message.error('获取教师列表失败')
        }
      )
    },
    handleSelectFile() {
      this.$refs.fileInput.click()
    },
    importStudents(event) {
      Student.importStudents(event.target.files[0], 
                             this.clean === 'do-not-clean' ? false : true)
      .then(
        (response) => {
          this.message.success('成功导入：' + event.target.files[0].name)
        },
        (error) => {
          this.message.error('导入学生失败')
        }
      )
    },
    exportStudents() {
      Student.exportStudents().then(
        (response) => {
          const blob = response.data
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a') // 创建一个 a 标签
          link.href = downloadUrl // 设置 a 标签的 url
          link.download = 'students.xlsx' // 设置文件名
          document.body.appendChild(link) // 将 a 标签添加到 DOM
          link.click() // 模拟点击，开始下载
          document.body.removeChild(link) // 下载完成后移除 a 标签
        },
        (error) => {
          this.message.error('导出学生失败')
        }
      )
    },
    queryStudents() {
      let query = null
      if (this.filterBuaaId.trim() !== '' || this.filterName.trim() !== '' || this.filterTeacherId) {
        query = {
          buaaId: this.filterBuaaId.trim(),
          name: this.filterName.trim(),
          teacherId: this.filterTeacherId
        }
      }
      Student.queryStudents(this.page, this.pageSize, query).then(
        (response) => {
          this.students = response.data.data.items
          this.totalItems = response.data.data.total
          this.students.forEach((student) => {
            this.teachers.forEach((teacher) => {
              if (student.teacherId === teacher.id) {
                student.teacherName = teacher.name
              }
            })
          })
        },
        (error) => {
          this.message.error('获取学生列表失败')
        }
      )
    },
    cancelFilter() {
      this.filterBuaaId = ''
      this.filterName = ''
      this.filterTeacherId = null
      this.queryStudents()
    }
  }
}
</script>

<style scoped>
input[type="radio"] {
  width: 15px;
  height: 15px;
}

.stu-header {
  margin-bottom: 15px;
}

.pagination {
  margin-top: 15px;
  padding-bottom: 15px;
}

.filter input {
  width: 120px;
}
</style>