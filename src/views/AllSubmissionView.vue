<template>
  <div class="title">评分配置</div>
  <NFlex justify="space-between" align="center" class="all-submission-header">
    <NFlex align="center">
      实验分数 <input type="number" v-model="labScore" />
      迭代分数 <input type="number" v-model="iterScore" />
      组队作业分数 <input type="number" v-model="projScore" />
      迟交得分比例 <input type="number" v-model="latePercent" />
      <button class="styled" @click="updateScoreConfig">修改</button>
      <button class="styled" @click="exportAll">导出所有成绩</button>
    </NFlex>
  </NFlex>

  <NFlex justify="space-between" class="all-submission-header">
    <NFlex align="center" class="lab-submission-export">
      <NSelect v-model:value="labToExport" placeholder="实验" :options="labSelectOptions" />
      <NSelect v-model:value="teacher" placeholder="教师" :options="teacherSelectOptions" />
      <button class="styled" @click="exportLab">{{ exportText }}</button>
    </NFlex>
    <NFlex align="center" class="filter">
      <input type="text" placeholder="学号" v-model="filterBuaaId" />
      <input type="text" placeholder="姓名" v-model="filterName" />
      <NSelect v-model:value="filterTeacherId" placeholder="教师" :options="teacherSelectOptions" />
      <button class="styled" @click="filterGrades">筛选</button>
      <button @click="cancelFilter">取消</button>
    </NFlex>
  </NFlex>

  <NDataTable 
    :columns="columns" 
    :data="gradesToShow" 
    :pagination="false" 
    :bordered="false" 
    table-layout="fixed"
    v-if="gradesToShow.length > 0" 
    @update:sorter="handleSorterChange"
  />

  <NFlex justify="center" align="center" class="pagination" v-if="gradesToShow.length > 0">
    <NPagination v-model:page="page" :page-count="totalPages" @update:page="updateGradesToShow" />
  </NFlex>

  <div class="empty-hint" v-if="gradesToShow.length === 0">暂无提交</div>
</template>

<script>
import Grade from '../api/Grade.js'
import Account from '../api/Account.js'

import download from '../components/utils/download.js'

import { h } from 'vue'

import { NFlex, NDataTable, NPagination, NSelect, useMessage } from 'naive-ui'

export default {
  name: 'AllSubmissionView',
  components: {
    NFlex,
    NDataTable,
    NPagination,
    NSelect
  },
  data() {
    return {
      message: useMessage(),
      page: 1,
      pageSize: 20,
      totalItems: 0,
      students: [],
      tasks: [],
      teachers: [],
      columns: [
        {
          title: '学号',
          key: 'buaaId',
          defaultSortOrder: 'ascend',
          sorter: true
        },
        {
          title: '姓名',
          key: 'name',
          defaultSortOrder: 'ascend',
          sorter: true
        },
        {
          title: '教师',
          key: 'teacherName',
          defaultSortOrder: 'ascend',
          sorter: true
        }
      ],
      grades: [],
      groupScores: [],
      columnIsAscending: {
        buaaId: false,
        name: false,
        teacherName: false
      },
      gradesToShow: [],
      copiedGrades: [],
      filterBuaaId: '',
      filterName: '',
      filterTeacherId: null,
      teacherSelectOptions: [],
      labScore: 0,
      iterScore: 0,
      projScore: 0,
      latePercent: 0,
      labToExport: null,
      teacher: null,
      labSelectOptions: [],
      // >>> download variables
      exporting: false,
      exportText: '导出 Lab 提交', // Stupid vue binding
      progress: 0,    // 0 ~ 100
      loaded: 0,      // bytes
      speed: 0,       // MB/s
      // <<< download variables
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.grades.length / this.pageSize)
    }
  },
  watch: {
    grades(newValue) {
      this.updateGradesToShow()
    }
  },
  mounted() {
    this.queryAllData()
  },
  methods: {
    handleSorterChange(sorter) {
      // console.log(sorter.columnKey)
      if (this.columnIsAscending[sorter.columnKey]) {
        // 将整体降序
        // alert('aaa')
        this.grades.sort(function(a, b) {
          return String(b[sorter.columnKey]).localeCompare(String(a[sorter.columnKey]))
        })
      } else {
        // 将整体升序
        // alert('bbb')
        this.grades.sort(function(a, b) {
          return String(a[sorter.columnKey]).localeCompare(String(b[sorter.columnKey]))
        })
      }
      this.updateGradesToShow()
      this.columnIsAscending[sorter.columnKey] = !this.columnIsAscending[sorter.columnKey]
    },
    queryAllData() {
      const downloadFunc = this.downloadReport
      // 获取教师列表
      Account.getAllTeachers().then(
        (response) => {
          this.teachers = response.data.data
          this.teachers.forEach((teacher) => {
            this.teacherSelectOptions.push(
              {
                label: teacher.name,
                value: teacher.id
              }
            )
          })
          // 获取学生列表
          Grade.getAllStudents().then(
            (response) => {
              this.students = response.data.data
              // 通过 student 的 teacherId 获取 teacherName
              this.students.forEach((student) => {
                this.teachers.forEach((teacher) => {
                  if (teacher.id === student.teacherId) {
                    student.teacherName = teacher.name
                  }
                })
              })
              // 获取组队作业成绩列表
              Grade.getAllGroupScores().then(
                (response) => {
                  this.groupScores = response.data.data
                  // 获取作业列表
                  Grade.getAllTasks().then(
                    (response) => {
                      this.tasks = response.data.data
                      // 为 columns 添加列
                      let labCnt = 1
                      let iterCnt = 1
                      this.tasks.forEach((task) => {
                        if (task.type === 1) {
                          // 实验
                          this.columns.push(
                            {
                              title: task.title,
                              key: 'lab' + labCnt,
                              defaultSortOrder: 'ascend',
                              sorter: true
                            }
                          )
                          this.columnIsAscending['lab' + labCnt] = false
                          this.labSelectOptions.push(
                            {
                              label: task.title,
                              value: task.id
                            }
                          )
                          labCnt++
                        } else if (task.type === 2) {
                          // 迭代
                          this.columns.push(
                            {
                              title: task.title,
                              key: 'iter' + iterCnt,
                              defaultSortOrder: 'ascend',
                              sorter: true
                            }
                          )
                          this.columnIsAscending['iter' + iterCnt] = false
                          iterCnt++
                        }
                      })
                      this.columns.push(
                        {
                          title: '组队作业成绩',
                          key: 'groupAssignmentScore',
                          defaultSortOrder: 'ascend',
                          sorter: true
                        }
                      )
                      this.columnIsAscending.groupAssignmentScore = false
                      this.columns.push(
                        {
                          title: '下载报告',
                          key: 'report',
                          render(row) {
                            return h(
                              NSelect,
                              {
                                class: 'styled',
                                options: row.selectOptions,
                                placeholder: '选择实验',
                                disabled: row.selectOptions.length === 0,
                                value: row.selectModalValue,
                                onUpdateValue: (value) => {
                                  downloadFunc(row, value)
                                }
                              }
                            )
                          }
                        }
                      )
                      // 获取每一项作业的成绩
                      let pendingRequests = this.tasks.length
                      this.tasks.forEach((task) => {
                        Grade.getScoreList(task.id).then(
                          (response) => {
                            pendingRequests--
                            task.scores = response.data.data
                            if (pendingRequests === 0) {
                              this.dataProcessing()
                            }
                          },
                          (error) => {
                            pendingRequests--
                            this.message.error('获取成绩失败')
                          }
                        )
                      })
                    },
                    (error) => {
                      this.message.error('获取作业列表失败')
                    }
                  )
                },
                (error) => {
                  this.message.error('获取组队作业成绩失败')
                }
              )
              
            },
            (error) => {
              this.message.error('获取学生列表失败')
            }
          )
        },
        (error) => {
          this.message.error('获取教师列表失败')
        }
      )
      Grade.getScoreConfig().then(
        (response) => {
          const config = response.data.data
          this.labScore = config.labScore
          this.iterScore = config.iterScore
          this.projScore = config.projScore
          this.latePercent = config.latePercent
        },
        (error) => {
          this.message.error('获取评分配置失败')
        }
      )
    },
    dataProcessing() {
      // 表格的每一行都是学生
      this.grades = this.students
      // 对于每一个学生
      this.grades.forEach((student) => {
        student.selectOptions = []
        student.selectModalValue = null
        let labCnt = 1
        let iterCnt = 1
        // 对于每一次作业
        this.tasks.forEach((task) => {
          // 在这次作业的 scores 中查找是否有学生
          let index = -1
          for (let i = 0; i < task.scores.length; i++) {
            if (task.scores[i].accountId === student.accountId) {
              index = i
              break
            }
          }
          let th = ''
          if (task.type === 1) {
            // 实验
            th = 'lab' + labCnt
            labCnt++
          } else if (task.type === 2) {
            // 迭代
            th = 'iter' + iterCnt
            iterCnt++
          }
          if (index == -1) {
            // 未提交
            student[th] = '未提交'
          } else {
            // 提交
            if (task.type === 1) {
              // 实验可能是“已提交” / “迟交”
              if (task.scores[index].late) {
                student[th] = '迟交'
              } else {
                student[th] = '已提交'
              }
              student.selectOptions.push({
                label: '实验' + (labCnt - 1),
                value: task.id
              })
            } else if (task.type === 2) {
              // 迭代如果有交就显示分数
              student[th] = String(task.scores[index].score)
            }
          }
        })
      })
      this.grades.forEach((grade) => {
        let i = 0
        grade.groupAssignmentScore = '未提交'
        for (; i < this.groupScores.length; i++) {
          if (this.groupScores[i].accountId === grade.accountId) {
            const score = this.groupScores[i].score
            grade.groupAssignmentScore = score == -1 ? '未评分' : score;
            break
          }
        }
      })
      this.copiedGrades = this.grades.map(item => ({ ...item }))
    },
    downloadReport(row, lab) {
      Grade.downloadReport(lab, row.accountId).then(
        (response) => {
          download(response, 'report.pdf')
        },
        (error) => {
          this.message.error('下载实验报告失败')
        }
      )
    },
    updateGradesToShow() {
      const startIndex = (this.page - 1) * this.pageSize
      const endIndex = Math.min(startIndex + this.pageSize - 1, this.grades.length - 1)
      this.gradesToShow = this.grades.slice(startIndex, endIndex + 1)
    },
    filterGrades() {
      this.grades = this.copiedGrades.map(item => ({ ...item }))

      if (this.filterBuaaId.trim() === '' && this.filterName.trim() === '' && !this.filterTeacherId) {
        return
      }
      if (this.filterBuaaId.trim() !== '') {
        this.grades = this.grades.filter(grade => grade.buaaId.includes(this.filterBuaaId.trim()))
      }
      if (this.filterName.trim() !== '') {
        this.grades = this.grades.filter(grade => grade.name.includes(this.filterName.trim()))
      }
      if (this.filterTeacherId) {
        this.grades = this.grades.filter(grade => grade.teacherId === this.filterTeacherId)
      }
    },
    cancelFilter() {
      this.filterBuaaId = ''
      this.filterName = ''
      this.filterTeacherId = null
      this.filterGrades()
    },
    updateScoreConfig() {
      Grade.updateConfig(this.labScore, this.iterScore, this.projScore, this.latePercent).then(
        (response) => {
          this.message.success('更新评分配置成功')
        },
        (error) => {
          this.message.error('更新评分配置失败')
        }
      )
    },
    exportAll() {
      Grade.exportAll().then(
        (response) => {
          download(response, '成绩汇总.xlsx')
        },
        (error) => {
          this.message.error('导出成绩失败')
        }
      )
    },
    exportLab() {
      if (this.exporting) {
        this.message.error('正在导出中，请稍后再试')
        return
      }
      if (!this.labToExport || !this.teacher) {
        this.message.error('请选择实验和教师')
        return
      }
      this.exporting = true
      this.exportText = '打包中...'
      this.progress = -1
      this.loaded = 0
      this.speed = 0
      Grade.exportLabSubmissions(this.labToExport, this.teacher, this.onProgressCallback).then(
        (response) => {
          download(response, 'submissions.zip')
          this.labToExport = null
          this.teacher = null
        },
        (error) => {
          this.message.error('下载实验提交失败')
        }
      ).finally(() => {
        this.exporting = false
        this.exportText = '导出 Lab 提交'
      })
    },
    onProgressCallback(progressEvent) {
      if (progressEvent.lengthComputable) {
        this.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.speed = (progressEvent.loaded - this.loaded) / 1024 / 1024
        this.loaded = progressEvent.loaded
        this.exportText = `导出中... ${this.progress}% (${this.speed.toFixed(2)} MB/s)`
      }
    }
  }
}
</script>

<style scoped>
.all-submission-header {
  margin-bottom: 15px;
}

.all-submission-header input {
  width: 120px;
}

.all-submission-header input[type="number"] {
  width: 100px;
}

.all-submission-header input[type="number"]::placeholder {
  font-size: 14px;
}

div.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--default-blue);
}

.pagination {
  margin-top: 15px;
  padding-bottom: 15px;
}
</style>