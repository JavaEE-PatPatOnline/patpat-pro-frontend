<template>
  <NFlex justify="space-between" align="center" class="test-submission-header">
    <NFlex align="center" class="filter">
      <input type="text" placeholder="学号" v-model="filterBuaaId" />
      <input type="text" placeholder="姓名" v-model="filterName" />
      <NSelect v-model:value="filterProblemId" placeholder="题目" :options="problemSelectOptions" />
      <input type="number" placeholder="最低分" v-model="filterMinScore" />
      <input type="number" placeholder="最高分" v-model="filterMaxScore" />
      <button class="styled" @click="querySubmissions">筛选</button>
      <button @click="cancelFilter">取消</button>
    </NFlex>
    <NFlex align="center" class="test-submission-export">
      <NSelect v-model:value="iterToExport" placeholder="迭代" :options="iterSelectOptions" />
      <NSelect v-model:value="teacher" placeholder="教师" :options="teacherSelectOptions" />
      <button class="styled" @click="exportTestSubmissions">{{ exportText }}</button>
      <!-- <button class="styled" @click="startCreateAccount">创建账号</button> -->
    </NFlex>
  </NFlex>
  <NDataTable :columns="columns" :data="submissions" :pagination="false" :bordered="false" table-layout="fixed"
    v-if="submissions.length > 0" />

  <NFlex justify="center" align="center" class="pagination" v-if="submissions.length > 0">
    <NPagination v-model:page="page" :page-count="totalPages" @update:page="querySubmissions" />
  </NFlex>
  <div class="empty-hint" v-if="submissions.length === 0">暂无评测记录</div>

  <NModal v-model:show="testDetailShouldShow" preset="card" :style="modalStyle">
    <div class="result-wrapper">
      <b>详细评测结果</b>
      <ol>
        <li v-for="(result, index) in results" :key="index">
          <span v-if="result.flag !== 'CE'">评测点 {{ index + 1 }}</span>
          <span v-else>编译错误</span>
          <span class="test-flag" :class="{
            'ac-flag': result.flag === 'AC',
            'wa-flag': result.flag === 'WA'
          }">
            {{ result.flag }}
          </span>
          <MarkdownDisplayer v-if="result.result" :content="result.result" />
        </li>
      </ol>
    </div>
  </NModal>
</template>

<script>
import MarkdownDisplayer from '../components/markdown/MarkdownDisplayer.vue'
import Grade from '../api/Grade.js'
import Problem from '../api/Problem.js'
import Account from '../api/Account.js'
import Iter from '../api/Iter.js'

import download from '../components/utils/download.js'

import { h } from 'vue'

import { NFlex, NDataTable, NPagination, NModal, NSelect, useMessage } from 'naive-ui'

export default {
  name: 'TestSubmissionView',
  components: {
    MarkdownDisplayer,
    NFlex,
    NDataTable,
    NPagination,
    NModal,
    NSelect
  },
  data() {
    return {
      message: useMessage(),
      submissions: [],
      page: 1,
      pageSize: 20,
      totalItems: 0,
      results: [],
      testDetailShouldShow: false,
      modalStyle: {
        width: 'fit-content',
      },
      columns: [
        {
          title: '学号',
          key: 'buaaId'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '题目名称',
          key: 'problemName'
        },
        {
          title: '分数',
          key: 'score'
        },
        {
          title: '提交时间',
          key: 'submitTime'
        },
        {
          title: '评测结束时间',
          key: 'endTime'
        }
      ],
      problemSelectOptions: [],
      filterBuaaId: '',
      filterName: '',
      filterProblemId: null,
      filterMaxScore: null,
      filterMinScore: null,
      iterToExport: null,
      teacher: null,
      iterSelectOptions: [],
      teacherSelectOptions: [],
      // >>> download variables
      exporting: false,
      exportText: '导出迭代提交', // Stupid vue binding
      progress: 0,    // 0 ~ 100
      loaded: 0,      // bytes
      speed: 0,       // MB/s
      // <<< download variables
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    }
  },
  created() {
    // const download = this.downloadSubmission
    const detail = this.showTestDetail
    this.columns.push(
      {
        title: '评测详情',
        key: 'detail',
        render(row) {
          return h(
            'button',
            {
              class: 'styled',
              onClick: () => detail(row)
            },
            '查看详情'
          )
        }
      }
    )
  },
  mounted() {
    this.getAllProblems()
    this.initExportOptions()
    this.querySubmissions()
  },
  methods: {
    initExportOptions() {
      Iter.getIters(false).then(
        (response) => {
          const iters = response.data.data
          iters.forEach((iter) => {
            this.iterSelectOptions.push({
              label: iter.title,
              value: iter.id
            })
          })
        },
        (error) => {
          this.message.error('获取迭代列表失败')
        }
      )
      Account.getAllTeachers().then(
        (response) => {
          const teachers = response.data.data
          teachers.forEach((teacher) => {
            this.teacherSelectOptions.push({
              label: teacher.name,
              value: teacher.id
            })
          })
        },
        (error) => {
          this.message.error('获取教师列表失败')
        }
      )
    },
    getAllProblems() {
      Problem.getAllProblems().then(
        (response) => {
          const problems = response.data.data
          problems.forEach((problem) => {
            this.problemSelectOptions.push({
              label: problem.title,
              value: problem.id
            })
          })
        },
        (error) => {
          this.message.error('获取评测题列表失败')
        }
      )
    },
    querySubmissions() {
      let query = null
      if (this.filterBuaaId.trim() !== '' || this.filterName.trim() !== '' || this.filterProblemId ||
        this.filterMaxScore || this.filterMinScore) {
        query = {
          buaaId: this.filterBuaaId.trim() !== '' ? this.filterBuaaId.trim() : null,
          name: this.filterName.trim() !== '' ? this.filterName.trim() : null,
          problemId: this.filterProblemId,
          minScore: this.filterMinScore,
          maxScore: this.filterMaxScore
        }
      }

      Grade.querySubmissions(this.page, this.pageSize, query).then(
        (response) => {
          this.submissions = response.data.data.items
          this.totalItems = response.data.data.total
        },
        (error) => {
          this.message.error('获取评测记录失败')
        }
      )
    },
    cancelFilter() {
      this.filterBuaaId = ''
      this.filterName = ''
      this.filterProblemId = null
      this.filterMinScore = null
      this.filterMaxScore = null
      this.querySubmissions()
    },
    showTestDetail(row) {
      Grade.getTestDetail(row.id).then(
        (response) => {
          this.results = response.data.data.result.results
          this.testDetailShouldShow = true
        },
        (error) => {
          this.message.error('获取评测详情失败')
        }
      )
    },
    exportTestSubmissions() {
      if (this.exporting) {
        this.message.error('正在导出中，请稍后再试')
        return
      }
      if (!this.iterToExport || !this.teacher) {
        this.message.error('请选择实验和教师')
        return
      }
      this.exporting = true
      this.exportText = '打包中...'
      this.progress = -1
      this.loaded = 0
      this.speed = 0
      Grade.downloadTestSubmission(this.iterToExport, this.teacher).then(
        (response) => {
          download(response, 'submission.zip')
          this.iterToExport = null
          this.teacher = null
        },
        (error) => {
          this.message.error('打包迭代提交失败')
        }
      ).finally(() => {
        this.exporting = false
        this.exportText = '导出迭代提交'
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
.test-submission-header {
  margin-bottom: 20px;
}

.filter input {
  width: 120px;
}

.pagination {
  margin-top: 15px;
  padding-bottom: 15px;
}

.result-wrapper {
  min-width: 600px;
  margin-top: 10px;
  /* box-shadow: 0 0 5px var(--shadow-color); */
  border-radius: 5px;
  padding: 10px 20px;
  padding-top: 0;
  overflow: auto;
}

.result-wrapper b {
  font-weight: bold;
}

.score {
  font-weight: bold;
  font-size: 20px;
  color: var(--default-blue);
}

li {
  padding: 10px 0;
  border-bottom: 1px solid var(--default-grey-transparent);
  display: flex;
  align-items: center;
}

li:last-child {
  border: 0;
}

.test-flag {
  font-weight: bold;
  margin-left: 20px;
  color: var(--default-blue);
}

.ac-flag {
  color: var(--default-green);
}

.wa-flag {
  color: var(--default-red);
}
</style>