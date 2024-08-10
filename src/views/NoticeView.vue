<template>
  <NFlex justify="space-between" align="center" class="notice-top" v-if="!isEditingNotice">
    <h3>公告列表</h3>
    <button class="styled add-btn" @click="newNotice">+</button>
  </NFlex>
  <NoticeList v-if="!isEditingNotice" :notices="notices" />
  <NoticeEditor v-else :id="editingNoticeId" />
</template>

<script>
import NoticeList from '../components/notice/NoticeList.vue'
import NoticeEditor from '../components/notice/NoticeEditor.vue'
import { NFlex } from 'naive-ui'
import Notice from '../api/Notice.js'
export default {
  name: 'NoticeView',
  components: {
    NoticeList,
    NoticeEditor,
    NFlex
  },
  data() {
    return {
      // notices: [
      //   {
      //     id: '1',
      //     title: '哈佛i奥纳影城',
      //     content: '方便发 阿红的豪华房i啊部分i啊部分iu奥和',
      //     time: '2024.07.23 10:21:08',
      //     isTopped: false
      //   },
      //   {
      //     id: '2',
      //     title: '的红安 掉 阿绿咖啡等你按烂哦',
      //     content: '# 一级标题\n## Hello \n **这是加粗吗**，我猜这是 *斜体*',
      //     time: '2024.07.23 10:21:08',
      //     isTopped: false
      //   },
      //   {
      //     id: '3',
      //     title: 'biahfnoda oafnan qn oan lak',
      //     content: '符号烦\n恼\n啊\n啊\n看\n见\n你\n发了呢烂啊',
      //     time: '2024.07.23 10:21:08',
      //     isTopped: false
      //   },
      //   {
      //     id: '4',
      //     title: '佛难哦 按佛呢啊',
      //     content: '发不发闹你发吧 ',
      //     time: '2024.07.23 10:21:08',
      //     isTopped: false
      //   },
      // ],
      editingNoticeId: null,
      isEditingNotice: false,
      notices: []
    }
  },
  mounted() {
    this.$bus.on('startNoticeEditing', (id) => {
      this.editingNoticeId = id
      this.isEditingNotice = true
    })
    this.$bus.on('endNoticeEditing', () => {
      this.editingNoticeId = null
      this.isEditingNotice = false
    })
    Notice.getNoticeList().then(
      (response) => {
        this.notices = response.data.data.map(notice => ({
          id: notice.id,
          time: notice.createdAt,
          title: notice.title,
          content: notice.content,
          isTopped: notice.topped
        }))
        for (let i = 0; i < this.notices.length; i++) {
          this.triggerAreas.push('main')
        }
      },
      (error) => {
        this.$bus.emit('message', { title: '获取公告列表失败', ok: false })
        console.error(error)
      }
    )
  },
  methods: {
    newNotice() {
      this.editingNoticeId = ''
      this.isEditingNotice = true
    }
  }
}
</script>

<style scoped>
.notice-top {
  margin-bottom: 10px;
}

h3 {
  font-size: 30px;
  color: var(--default-blue);
  font-weight: bold;
}

button.add-btn {
  font-size: 30px;
  font-weight: normal;
  height: fit-content;
  padding: 0 30px;
}
</style>