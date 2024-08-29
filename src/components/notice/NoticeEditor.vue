<template>
  <NFlex justify="space-between" align="center" class="editor-top">
    <input type="text" placeholder="公告标题" v-model="title" />
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
import Notice from '../../api/Notice.js'
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
      title: '',
      content: '',
      state: false
    }
  },
  mounted() {
    if (this.id !== '') {
      Notice.getOneNotice(this.id).then(
        (response) => {
          this.title = response.data.data.title
          this.content = response.data.data.content
        },
        (error) => {
          console.log(this.id)
          alert("公告不存在")
        }
      )
    }
  },
  methods: {

    goBack() {
      this.$bus.emit('endNoticeEditing')
    },
    publishNotice() {
      console.log(this.content)
      if (this.title === '') {
        alert("公告标题不得为空")
        return
      }
      if (this.content === '') {
        alert("公告内容不得为空")
        return
      }
      if (this.id === '') {
        Notice.createNotice(this.title, this.content).then(
          (response) => {
            this.$bus.emit('message', { title: '发布公告成功', ok: true })
            this.title = ''
            this.content = ''
          },
          (error) => {
            this.$bus.emit('message', { title: '发布公告失败', ok: false })
            console.error(error)
          }
        )
      }
      else {
        Notice.updateNotice(this.id,
          this.title,
          this.content,
          this.state)
          .then(
            (response) => {
              this.title = ''
              this.content = ''
              this.$bus.emit('message', { title: '更新公告成功', ok: true })
            },
            (error) => {
              this.$bus.emit('message', { title: '更新公告失败', ok: false })
              console.error(error)
            }
          )
      }
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