<template>
  <DiscussionListItem v-for="discussion in discussions" :key="discussion.id" :discussion="discussion" />
</template>

<script>
import DiscussionListItem from './DiscussionListItem.vue'

export default {
  name: 'DiscussionList',
  props: {
    discussions: {
      type: Array,
      default: []
    }
  },
  components: {
    DiscussionListItem,
  }
}
</script>
