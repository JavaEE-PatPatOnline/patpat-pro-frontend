<template>
  <!-- 外层容器 -->
  <div class='discussion-wrapper' @click='jumpToDiscussionDetail'>
    <DiscussionHeader :discussion='discussion' />
  </div>
</template>

<script>
import DiscussionHeader from './DiscussionHeader.vue'

export default {
  name: 'DiscussionListItem',
  props: {
    discussion: {
      type: Object,
      default: null,
    }
  },
  components: {
    DiscussionHeader,
  },
  methods: {
    jumpToDiscussionDetail() {
      this.$router.push('/discussion/' + this.discussion.id)
    }
  }
}
</script>

<style scoped>
.discussion-wrapper {
  padding: 10px;
  transition: .5s cubic-bezier(0.075, 0.82, 0.165, 1);
  border-bottom: 1px solid var(--bg-grey);
  cursor: pointer;
  gap: 0;
}

.discussion-wrapper:hover {
  transform: scale(1.01);
}
</style>