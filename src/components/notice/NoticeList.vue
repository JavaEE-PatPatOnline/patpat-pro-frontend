<template>
  <NCollapse
    :trigger-areas="['main', 'arrow']"
    v-if="notices.length > 0"
  >
    <NoticeListItem v-for="notice in notices"
      :key="notice.id"
      :id="notice.id"
      :title="notice.title"
      :content="notice.content"
      :time="notice.time"
      :isTopped="notice.isTopped"
    />
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
  }
}
</script>