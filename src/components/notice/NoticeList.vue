<template>
  <NCollapse :trigger-areas="['main', 'arrow']" display-directive="show" v-if="notices.length > 0"
    :default-expanded-names="['0']">
    <NoticeListItem v-for="(notice, index) in notices" :key="notice.id" :notice="notice" :index="index"
      @updateState="handleUpdateState" />
  </NCollapse>
  <div class="empty-hint" v-else>
    暂无公告
  </div>
</template>

<script>
import NoticeListItem from './NoticeListItem.vue'
import { NCollapse } from 'naive-ui'
export default {
  name: 'NoticeList',
  components: {
    NoticeListItem,
    NCollapse
  },
  props: {
    notices: {
      type: Array,
      default: []
    }
  },
  methods: {
    handleUpdateState(payload) {
      const { index, isTopped, deleted } = payload
      if (deleted) {
        this.notices.splice(index, 1)
      } else {
        const notice = this.notices[index]
        const newNotice = {
          id: notice.id,
          title: notice.title,
          time: notice.time,
          isTopped: !notice.isTopped
        }
        const noticeDate = new Date(notice.time)

        let untoppedStart = 0 // 找到未置顶的第一条消息的下标
        for (; this.notices[untoppedStart].topped; untoppedStart++) { }
        if (!isTopped) {
          // 取消置顶
          let position = untoppedStart
          for (; position < this.notices.length; position++) {
            const date = new Date(this.notices[position].time)
            if (date < noticeDate) {
              break
            }
          }
          this.notices.splice(position, 0, newNotice)
          this.notices.splice(index, 1)
        } else {
          let position = 0
          for (; position < untoppedStart; position++) {
            const date = new Date(this.notices[position].time)
            if (date < noticeDate) {
              break
            }
          }
          this.notices.splice(index, 1)
          this.notices.splice(position, 0, newNotice)
        }
      }
    }
  }
}
</script>