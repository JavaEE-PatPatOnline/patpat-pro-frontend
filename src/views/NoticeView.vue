<template>
  <NFlex justify="space-between" align="center" class="notice-top" v-if="!isEditingNotice">
    <h3>公告列表</h3>
    <button class="styled add-btn" @click="newNotice" v-if="isAdmin">+</button>
  </NFlex>
  <NoticeList v-if="!isEditingNotice" :notices="notices" />
  <NoticeEditor v-else :id="editingNoticeId" />
</template>

<script>
import NoticeList from '../components/notice/NoticeList.vue'
import NoticeEditor from '../components/notice/NoticeEditor.vue'
import { NFlex } from 'naive-ui'
import Notice from '../api/Notice.js'

import { mapState } from 'vuex'

export default {
  name: 'NoticeView',
  components: {
    NoticeList,
    NoticeEditor,
    NFlex
  },
  data() {
    return {
      editingNoticeId: null,
      isEditingNotice: false,
      notices: [],
      triggerAreas: [],
    }
  },
  computed: {
    ...mapState(['isAdmin'])
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
    this.fetchNotice()
    this.$bus.on('updateState', () => {
      this.fetchNotice()
    })
  },
  methods: {
    fetchNotice() {
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
          alert('获取公告列表失败')
        }
      )
    },
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