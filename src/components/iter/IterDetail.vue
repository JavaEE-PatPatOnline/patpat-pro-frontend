<template>
<!-- 下面这个 iter-container 不能删去 -->
  <div class="iter-container">
    <NFlex justify="space-between">
      <h3>{{ title }}</h3>
      <NFlex align="center" class="iter-btn">
        <!-- 编辑按钮 -->
        <EditIcon @click="startEditingIter"/>
        <!-- 删除按钮 -->
        <NPopconfirm
          positive-text="确认"
          negative-text="取消"
          :show-icon="false"
          @positive-click="deleteIter"
        >
          <template #trigger>
            <DeleteIcon />
          </template>
          确认删除迭代？
        </NPopconfirm>
      </NFlex>
    </NFlex>
    <NFlex justify="space-between" class="times">
      <span>开始时间：{{ startTime }}</span>
      <span>结束时间：{{ ddlTime }}</span>
      <span>迟交截止：{{ endTime }}</span>
    </NFlex>
    <MarkdownDisplayer :content="content" />
    <div class="test-area">
      <NFlex justify="space-between">
        <div class="uploader">
          <span class="upload-hint">仅限上传 .java，.zip 文件</span>
          <button @click="handleUpload">选择文件</button>
          <span v-if="filename !== ''">已选择：{{ filename }}</span>
          <input type="file" accept=".java,.zip" @change="setFilename" ref="fileInput" style="display: none" />
        </div>
        <button class="styled" @click="testCode">评测</button>
      </NFlex>
      <div class="test-result">
        <div v-if="waitingTestResult">
          <Vue3Lottie :animationData="javaIcon" :height="80" :width="80" style="margin: 0" />
          <div>正在等待评测结果...</div>
        </div>
        <div class="result-wrapper" v-if="testResultShouldShow">
          <NFlex justify="space-between" align="center">
            <div><b>提交时间：</b>{{ submitTime }}</div>
            <div class="score">评测得分：{{ score }}</div>
          </NFlex>
          <b>详细评测结果</b>
          <ol>
            <li v-for="(result, index) in results" :key="index">
              <span>评测点 {{ index + 1 }}</span>
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
        <div v-else-if="!testResultShouldShow && !waitingTestResult">
          暂无评测结果
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownDisplayer from '../markdown/MarkdownDisplayer.vue'
import EditIcon from '../svg/EditIcon.vue'
import DeleteIcon from '../svg/DeleteIcon.vue'
import { NFlex, NPopconfirm } from 'naive-ui'
import { Vue3Lottie } from 'vue3-lottie'
import javaIcon from '../../assets/icons8-java.json'

import Iter from '../../api/Iter.js'
import Problem from '../../api/Problem.js'
import Stream from '../../api/Stream.js'

export default {
  name: 'IterDetail',
  components: {
    MarkdownDisplayer,
    EditIcon,
    DeleteIcon,
    NFlex,
    NPopconfirm,
    Vue3Lottie
  },
  data() {
    return {
      javaIcon,
      fileToSubmit: null,
      filename: '',
      fileURL: '',
      waitingTestResult: false,
      testResultShouldShow: false,
      submitTime: '2024-10-01 12:01:23',
      score: 100,
      results: [],
      id: '',
      title: '',
      content: 'hhs',
      startTime: '',
      ddlTime: '',
      endTime: '',
      problemId: '',
      ws: null
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.id = to.params.id
        this.getIterDetail()
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getIterDetail()
    this.setupWebSocket()
  },
  methods: {
    getIterDetail() {
      Iter.getIterDetail(this.id).then(
        (response) => {
          const iter = response.data.data
          this.title = iter.title
          this.content = iter.content
          this.startTime = iter.startTime
          this.ddlTime = iter.deadlineTime
          this.endTime = iter.endTime
        },
        (error) => {
          alert('获取迭代详情失败')
        }
      )
      Iter.getLinkedProblem(this.id).then(
        (response) => {
          if (response.data.data.length > 0) {
            this.problemId = response.data.data[0].problemId
            Problem.getLatesSubmission(this.problemId).then(
              (response) => {
                if (response.data) {
                  const mostRecentTest = response.data.data
                  if (mostRecentTest.endTime) {
                    this.testResultShouldShow = true
                    this.submitTime = mostRecentTest.submitTime
                    this.score = mostRecentTest.score
                    this.results = mostRecentTest.result.results
                  } else {
                    // 刷新后还在评测
                    this.waitingTestResult = true
                  }
            }
              },
              (error) => {
                alert('获取评测记录失败')
              }
            )
          }
        },
        (error) => {
          alert('获取关联评测题失败')
        }
      )
    },
    startEditingIter() {
      this.$router.push('/iter/' + this.id + '/edit')
    },
    deleteIter() {
      Iter.deleteIter(this.id).then(
        (response) => {
          alert('删除迭代成功')
          this.$bus.emit('update-iter')
          this.$router.go(-1)
        },
        (error) => {
          alert('删除迭代失败')
        }
      )
    },
    handleUpload() {
      this.$refs.fileInput.click()
    },
    setFilename(event) {
      this.filename = event.target.files[0].name
    },
    setupWebSocket() {
      let wsUrl = ''
      Stream.getWebSocketURL().then(
        (response) => {
          wsUrl = response.data.data
          this.ws = new WebSocket(wsUrl)
          this.ws.onopen = () => {
            console.log('成功建立 WebSocket 连接')
          }

          this.ws.onmessage = (event) => {
            console.log(JSON.parse(event.data))
            const testData = JSON.parse(event.data).data
            if (testData && testData.endTime) {
              this.waitingTestResult = false
              this.testResultShouldShow = true
              this.submitTime = testData.submitTime
              this.score = testData.score
              this.results = testData.result.results
            }
          }
          this.ws.onerror = (error) => {
            alert('WebSocket 错误')
            console.error('WebSocket 错误:', error)
          }
          this.ws.onclose = () => {
            console.log('成功关闭 WebSocket 连接')
          }
        },
        (error) => {
          alert('获取 WebSocket URL 失败')
        }
      )
    },
    testCode() {
      const input = this.$refs.fileInput
      if (input && input.files && input.files.length > 0) {
        const file = input.files[0]
        let submission = new FormData()
        submission.append('file', file)
        submission.append('language', '17')
        Problem.submit(this.problemId, submission).then(
          (response) => {
            this.testResultShouldShow = false
            this.waitingTestResult = true
            // this.setupWebSocket()
          },
          (error) => {
            alert('提交评测失败')
          }
        )
      }
    }
  }
}
</script>

<style scoped>
h3 {
  font-size: 30px;
  font-weight: bold;
  color: var(--default-blue);
  margin-left: 25px;
}

.iter-btn {
  margin-right: 20px;
}

.times {
  margin-left: 25px;
  width: 60%;
}

.times span {
  font-size: 14px;
  color: var(--default-grey);
  font-weight: bold;
}

.iter-btn a {
  cursor: pointer;
}
.iter-btn a:hover {
  text-decoration: underline;
}

.test-area {
  margin-left: 25px;
  width: 70%;
  padding-bottom: 20px;
}

.uploader * {
  margin-right: 20px;
}

.upload-hint {
  font-size: 18px;
  font-weight: bold;
}

.result-wrapper {
  margin-top: 10px;
  box-shadow: 0 0 5px var(--shadow-color);
  border-radius: 5px;
  padding: 10px 20px;
}

.result-wrapper b {
  font-weight: bold;
}

.score {
  font-weight: bold;
  font-size: 20px;
  color: var(--default-blue);
}

.test-result li {
  padding: 10px 0;
  border-bottom: 1px solid var(--default-grey-transparent);
  display: flex;
  align-items: center;
}

.test-result li:last-child {
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