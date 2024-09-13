<template>
  <NFlex justify="space-between" align="center" class="editor-top">
    <input type="text" placeholder="实验标题" v-model="title" />
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
      <DatePicker ref="start" v-model="startTime" locale="zh-CN" format="yyyy-MM-dd HH:mm:SS"
        model-type="yyyy-MM-dd HH:mm:SS">
        <template #action-buttons>
          <button class="styled" @click="selectStartTime">选择</button>
        </template>
      </DatePicker>
    </NFlex>

    <NFlex align="center" :wrap="false">
      <span class="time-text">结束时间</span>
      <DatePicker ref="ddl" v-model="ddlTime" locale="zh-CN" format="yyyy-MM-dd HH:mm:ss"
        model-type="yyyy-MM-dd HH:mm:ss">
        <template #action-buttons>
          <button class="styled" @click="selectDdlTime">选择</button>
        </template>
      </DatePicker>
    </NFlex>

    <NFlex align="center" :wrap="false">
      <span class="time-text">补交截止</span>
      <DatePicker ref="end" v-model="endTime" locale="zh-CN" format="yyyy-MM-dd HH:mm:ss"
        model-type="yyyy-MM-dd HH:mm:ss">
        <template #action-buttons>
          <button class="styled" @click="selectEndTime">选择</button>
        </template>
      </DatePicker>
    </NFlex>

  </NFlex>
  <MarkdownEditor v-model:value="content" />
</template>

<script>
import MarkdownEditor from '../markdown/MarkdownEditor.vue'

import Lab from '../../api/Lab.js'

import { NFlex, useMessage } from 'naive-ui'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { btoaUTF8 } from 'bestbase64utf8'

export default {
  name: 'LabEditor',
  components: {
    MarkdownEditor,
    NFlex,
    DatePicker
  },
  data() {
    return {
      message: useMessage(),
      visibility: 'invisible',
      title: '',
      content: '',
      startTime: '',
      ddlTime: '',
      endTime: '',
      id: ''
    }
  },
  mounted() {
    if (!this.$route.path.includes('create')) {
      this.id = this.$route.params.id
      this.getLabDetail()
    }
  },
  methods: {
    getLabDetail() {
      Lab.getLabDetail(this.id).then(
        (response) => {
          const lab = response.data.data
          this.title = lab.title
          this.content = lab.content
          this.startTime = lab.startTime
          this.ddlTime = lab.deadlineTime
          this.endTime = lab.endTime
          this.visibility = lab.visible ? 'visible' : 'invisible'
        },
        (error) => {
          this.message.error('获取实验详情失败')
        }
      )
    },
    goBack() {
      this.$router.go(-1)
    },
    confirmChange() {
      if (this.title === '') {
        this.message.error('实验标题不得为空')
        return
      }
      if (this.content === '') {
        this.message.error('实验内容不得为空')
        return
      }
      if (this.startTime === '' || this.dllTime === '' || this.endTime === '') {
        this.message.error('实验起止时间不得为空')
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

      const labData = {
        title: this.title,
        content: btoaUTF8(this.content),
        visible: this.visibility === 'visible' ? true : false,
        startTime: this.startTime,
        deadlineTime: this.ddlTime,
        endTime: this.endTime
      }

      if (this.id === '') {
        // id 为空表示新建实验
        Lab.createLab(labData).then(
          (response) => {
            this.message.success('创建实验成功')
            this.$bus.emit('update-lab')
            this.$router.push('/lab/' + response.data.data.id)
          },
          (error) => {
            this.message.error('创建实验失败')
          }
        )
      } else {
        // 否则为修改实验内容
        Lab.updateLab(this.id, labData).then(
          (response) => {
            this.message.success('更新实验成功')
            this.$bus.emit('update-lab')
            this.$router.push('/lab/' + this.id)
            // 
          },
          (error) => {
            this.message.error('更新实验失败')
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
</style>