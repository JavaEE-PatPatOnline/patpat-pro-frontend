<template>
  <button class="styled full-btn" @click="newProblemShouldShow = true">+</button>
  <NFlex justify="space-between" align="center" class="new-problem" v-if="newProblemShouldShow">
    <div>
      新建评测题：
      <input type="text" v-model="title" placeholder="评测题标题" />
      <input ref="newProblemInput" type="file" style="display: none" accept=".zip" @input="changeConfigFile" />
      <button @click="uploadConfig">上传配置文件</button>
    </div>
    <div>
      <button @click="newProblemShouldShow = false">取消</button>
      <button class="styled" @click="createProblem">确定</button>
    </div>
  </NFlex>
  
  <NCollapse :trigger-areas="['arrow']" display-directive="show" v-if="problems.length > 0">
    <NCollapseItem 
      display-directive="show" v-for="problem in problems" 
      :key="problem.id"
    >
      <template #header>
        <div class="title" v-if="!problem.isEditingTitle" @click.prevent="editTitle(problem)">
          {{ problem.title }}
        </div>
        <NFlex align="center" v-else>
          <input type="text" v-model="problem.title" placeholder="评测题标题">
          <button @click="changeTitle(problem)" class="styled">确定</button>
          <button @click="problem.isEditingTitle = false">取消</button>
        </NFlex>
      </template>
      <template #header-extra>
        <NFlex align="center">
          <!-- 上传评测文件 -->
          <UploadIcon @click="handleUpload(problem.id)" />
          <input :ref="'fileInput' + problem.id" @input="uploadFile($event, problem.id)" type="file" accept=".zip" style="display: none"/>
          <!-- 下载评测文件 -->
          <DownloadIcon @click="handleDownload(problem.id)" />
          <!-- 删除评测题 -->
          <NPopconfirm
            positive-text="确认"
            negative-text="取消"
            :show-icon="false"
            @positive-click="deleteProblem(problem.id)"
          >
            <template #trigger>
              <DeleteIcon />
            </template>
            确认删除评测题？
          </NPopconfirm>
        </NFlex>
      </template>
      <ul>
        <li v-for="(case_, index) in problem.cases" :key="case_.id" class="test-case">
          测试点 {{ index + 1 }}：{{ case_.description }}({{ case_.score }})
        </li>
      </ul>
    </NCollapseItem>
  </NCollapse>
  <div class="empty-hint" v-else>
    暂无评测题
  </div>
</template>

<script>
import UploadIcon from '../components/svg/UploadIcon.vue'
import DownloadIcon from '../components/svg/DownloadIcon.vue'
import DeleteIcon from '../components/svg/DeleteIcon.vue'

import Problem from '../api/Problem.js'

import download from '../components/utils/download.js'

import { NCollapse, NCollapseItem, NFlex, NPopconfirm, useMessage } from 'naive-ui'

export default {
  name: 'ProblemView',
  components: {
    UploadIcon,
    DownloadIcon,
    DeleteIcon,
    NCollapse,
    NCollapseItem,
    NFlex,
    NPopconfirm
  },
  data() {
    return {
      message: useMessage(),
      problems: [],
      title: '',
      configFile: null,
      newProblemShouldShow: false
    }
  },
  mounted() {
    this.getProblemList()
  },
  methods: {
    getProblemList() {
      Problem.getAllProblems().then(
        (response) => {
          this.problems = response.data.data
          this.problems.forEach((problem) => {
            problem.cases = []
          })
          this.problems.forEach((problem) => {
            Problem.getProblemDetail(problem.id).then(
              (response) => {
                problem.cases = response.data.data.descriptor.cases
              },
              (error) => {
                this.message.error('获取题目详情失败')
              }
            )
          })
        },
        (error) => {
          this.message.error('获取评测题列表失败')
        }
      )
    },
    editTitle(problem) {
      this.problems.forEach((problem) => {
        problem.isEditingTitle = false
      })
      problem.isEditingTitle = true
    },
    changeTitle(problem) {
      let problemData = new FormData()
      problemData.append('title', problem.title)
      Problem.updateProblem(problem.id, problemData).then(
        (response) => {
          this.message.success('更新评测题标题成功')
          this.getProblemList()
        },
        (error) => {
          this.message.error('更新评测题标题失败')
        }
      ) 
    },
    handleUpload(id) {
      this.$refs['fileInput' + id][0].click()
    },
    uploadFile(event, id) {
      if (event.target.files && event.target.files.length > 0) {
        let problemData = new FormData()
        problemData.append('file', event.target.files[0])
        Problem.updateProblem(id, problemData).then(
          (response) => {
            this.message.success('上传配置文件成功：' + event.target.files[0].name)
            this.getProblemList()
          },
          (error) => {
            this.message.error('上传配置文件失败')
          }
        )
      }
    },
    uploadConfig() {
      this.$refs.newProblemInput.click()
    },
    changeConfigFile(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.configFile = event.target.files[0]
        this.message.success('成功上传：' + this.configFile.name)
      }
    },
    createProblem(event) {
      Problem.createProblem(this.title, this.configFile).then(
        (response) => {
          this.message.success('新建题目成功')
          this.newProblemShouldShow = false
          this.getProblemList()
        },
        (error) => {
          this.message.error('新建题目失败')
        }
      )
    },
    handleDownload(id) {
      Problem.getConfig(id).then(
        (response) => {
          download(response, 'sample.zip')
        },
        (error) => {
          this.message.error('获取配置文件失败')
        }
      )
    },
    deleteProblem(id) {
      Problem.deleteProblem(id).then(
        (response) => {
          this.message.success('删除评测题成功')
          this.getProblemList()
        },
        (error) => {
          this.message.error('删除评测题失败')
        }
      )
    }
  }
}
</script>

<style scoped>
.new-problem {
  margin-bottom: 20px;
}

.new-problem>div {
  font-size: 18px;
  font-weight: bold;
  color: var(--default-blue);
}

.new-problem button {
  margin-left: 10px;
}

.title {
  font-size: 18px;
  color: var(--default-blue);
  font-weight: bold;
  cursor: pointer;
}

.title:hover {
  text-decoration: underline;
}

li.test-case {
  margin-left: 25px;
  font-size: 14px;
}
</style>