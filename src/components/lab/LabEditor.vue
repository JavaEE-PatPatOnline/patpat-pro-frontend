<template>
  <NFlex justify="space-between" align="center" class="editor-top">
    <input type="text" placeholder="实验标题" v-model="title"/>
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
</template>

<script>
import MarkdownEditor from '../markdown/MarkdownEditor.vue'
import { NFlex } from 'naive-ui'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'LabEditor',
  components: {
    MarkdownEditor,
    NFlex,
    DatePicker
  },
  data() {
    return {
      visibility: 'invisible',
      title: '这是公告标题｜Lab02 学习 OOP 的基本思想吧！',
      content: '# 一级标题 \n### 看看小标题 \n- 列表项 1 \n- 列表项 2 \n- 列表项 3 \n看看文本效果： **加粗** 、 *斜体* 、 ~~删除线~~  \n',
      startTime: null,
      ddlTime: null,
      endTime: null
    }
  },
  mounted() {
    // 如果路由是 create 则是由新建跳转的
    // 如果路由有 lad id，则是从编辑跳转的
    // todo
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    confirmChange() {
      // todo
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