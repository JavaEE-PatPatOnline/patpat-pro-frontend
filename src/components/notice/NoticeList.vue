<template>
  <NCollapse :trigger-areas="['main', 'arrow']" display-directive="show" v-if="notices.length > 0"
    :default-expanded-names="['0']">
    <NoticeListItem v-for="(notice, index) in notices" :key="notice.id" :notice="notice" :index="index" />
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
  }
}
</script>