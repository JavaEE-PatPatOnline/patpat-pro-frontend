<template>
    <NFlex justify="space-between" align="center" class="editor-top">
      <input type="text" placeholder="公告标题" v-model="title"/>
      <NFlex justify="flex-end" align="center">
        <button @click="goBack">取消</button>
        <button class="styled" @click="publishNotice">发布</button>
      </NFlex>
    </NFlex>
    <MarkdownEditor v-model:value="content" />
</template>

<script>
import MarkdownEditor from '../markdown/MarkdownEditor.vue'
import { NFlex } from 'naive-ui'

export default {
  name: 'NoticeEditor',
  components: {
    MarkdownEditor,
    NFlex
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      title: '这是公告标题｜Lab02 学习 OOP 的基本思想吧！',
      content: '# 一级标题 \n### 看看小标题 \n- 列表项 1 \n- 列表项 2 \n- 列表项 3 \n看看文本效果： **加粗** 、 *斜体* 、 ~~删除线~~  \n'
    }
  },
  methods: {
    goBack() {
      this.$bus.emit('endNoticeEditing')
    },
    publishNotice() {
      // todo
      // 注意区分发布新公告和修改现有公告的不同
      // 区别在于 id 不同

      this.goBack()
    }
  }
}
</script>

<style scoped>
.editor-top {
  margin-bottom: 20px;
}
</style>