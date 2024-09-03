<template>
  <NFlex justify="space-between" align="center" class="editor-top">
    <input type="text" placeholder="迭代标题" v-model="title"/>
    <NFlex justify="flex-end" align="center">
      <input type="radio" id="option1" value="invisible" v-model="visibility" />
      <label for="option1">不可见</label>
      <input type="radio" id="option2" value="visible" v-model="visibility" />
      <label for="option2">可见</label>
      <button @click="goBack">取消</button>
      <button class="styled" @click="confirmChange">确认</button>
    </NFlex>
  </NFlex>

  <NFlex justify="flex-start" align="center" class="date-pickers">
    <NFlex justify="flex-start" align="center" :wrap="false">
      <span class="time-text">开始时间</span>
      <DatePicker 
        ref="start" v-model="startTime" locale="zh-CN" 
        format="yyyy-MM-dd HH:mm:ss" model-type="yyyy-MM-dd HH:mm:ss"
      >
        <template #action-buttons>
          <button class="styled" @click="selectStartTime">选择</button>
        </template>  
      </DatePicker>
    </NFlex>

    <NFlex align="center" :wrap="false">
      <span class="time-text">结束时间</span>
      <DatePicker 
        ref="ddl" v-model="ddlTime" locale="zh-CN" 
        format="yyyy-MM-dd HH:mm:ss" model-type="yyyy-MM-dd HH:mm:ss"
      >
        <template #action-buttons>
          <button class="styled" @click="selectDdlTime">选择</button>
        </template>  
      </DatePicker>
    </NFlex>

    <NFlex align="center" :wrap="false">
      <span class="time-text">迟交截止</span>
      <DatePicker 
        ref="end" v-model="endTime" locale="zh-CN" 
        format="yyyy-MM-dd HH:mm:ss" model-type="yyyy-MM-dd HH:mm:ss"
      >
        <template #action-buttons>
          <button class="styled" @click="selectEndTime">选择</button>
        </template>  
      </DatePicker>
    </NFlex>

  </NFlex>
  
  <MarkdownEditor v-model:value="content" />

  <NFlex align="center" class="selector">
    <NSelect placeholder="评测题目" v-model:value="problem" :options="selectOptions" />
  </NFlex>
  
</template>

<script>
import MarkdownEditor from '../markdown/MarkdownEditor.vue'

import Problem from '../../api/Problem.js'
import Iter from '../../api/Iter.js'

import { NFlex, NSelect, useMessage } from 'naive-ui'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'LabEditor',
  components: {
    MarkdownEditor,
    NFlex,
    NSelect,
    DatePicker
  },
  data() {
    return {
      message: useMessage(),
      id: '',
      visibility: 'invisible',
      title: '',
      content: '',
      startTime: null,
      ddlTime: null,
      endTime: null,
      problem: null,
      problems: [],
      selectOptions: []
    }
  },
  mounted() {
    if (!this.$route.path.includes('create')) {
      this.id = this.$route.params.id
      this.getIterDetail()
    }

    Problem.getAllProblems().then(
      (response) => {
        this.problems = response.data.data
        this.selectOptions = this.problems.map(problem => ({
          label: problem.title,
          value: problem.id
        }))
      },
      (error) => {
        this.message.error('获取评测题列表失败')
      }
    )
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
          this.visibility = iter.visible ? 'visible' : 'invisible'
        },
        (error) => {
          this.message.error('获取迭代详情失败')
        }
      )
      Iter.getLinkedProblem(this.id).then(
        (response) => {
          if (response.data.data.length > 0) {
            this.problem = response.data.data[0].problemId
          }
        },
        (error) => {
          this.message.error('获取关联评测题失败')
        }
      )
    },
    goBack() {
      this.$router.go(-1)
    },
    confirmChange() {
      if (this.title === '') {
        this.message.error('迭代标题不得为空')
        return
      }
      if (this.content === '') {
        this.message.error('迭代内容不得为空')
        return
      }
      if (this.startTime === '' || this.dllTime === '' || this.endTime === '') {
        this.message.error('迭代起止时间不得为空')
        return
      }
      const start = new Date(this.startTime)
      const ddl = new Date(this.ddlTime)
      const end = new Date(this.endTime)
      if (start.getTime() >= ddl.getTime()) {
        this.message.error('开始时间不得晚于结束时间')
        return
      }
      if (ddl.getTime() >= end.getTime()) {
        this.message.error('结束时间不得晚于截止时间')
        return
      }

      if (!this.problem) {
        this.message.error('迭代需关联一道评测题')
        return
      }

      const iterData = {
        title: this.title,
        content: this.content,
        visible: this.visibility === 'visible' ? true : false,
        startTime: this.startTime,
        deadlineTime: this.ddlTime,
        endTime: this.endTime
      }

      if (this.id === '') {
        Iter.createIter(iterData).then(
          (response) => {
            this.id = response.data.data.id
            Iter.linkProblem(this.id, this.problem).then(
              (response) => {
                this.message.success('创建迭代成功')
                this.$bus.emit('update-iter')
                this.$router.push('/iter/' + this.id)
              },
              (error) => {
                this.message.error('创建迭代失败')
              }
            )
          },
          (error) => {
            this.message.error('创建迭代失败')
          }
        )
      } else {
        Iter.updateIter(this.id, iterData).then(
          (response) => {
            Iter.linkProblem(this.id, this.problem).then(
              (response) => {
                this.message.success('更新迭代成功')
                this.$bus.emit('update-iter')
                this.$router.push('/iter/' + this.id)
              },
              (error) => {
                this.message.error('更新迭代失败')
              }
            )
          },
          (error) => {
            this.message.error('更新迭代失败')
          }
        )
      }
    },
    selectStartTime() {
      this.$refs.start.selectDate()
    },
    selectDdlTime() {
      this.$refs.ddl.selectDate()
    },
    selectEndTime() {
      this.$refs.end.selectDate()
    }
  }
}
</script>

<style scoped>
.editor-top,
.date-pickers {
  margin-bottom: 20px;
}

.time-text {
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
  width: 60px;
}

input[type="radio"] {
  width: 15px;
  height: 15px;
}

.selector {
  padding: 20px 0;
  font-weight: bold;
  color: var(--default-blue);
}

</style>