<template>
  <!-- 一级评论列表 -->
  <div class="reply-container" v-for="reply in replies" :key="reply.id">
    <!-- 二级评论列表 -->
    <ReplyListItem :reply="reply" />
    <div class="second-reply-container" v-for="secondReply in reply.children" :key="secondReply.id">
      <ReplyListItem :reply="secondReply" isSecond />
    </div>
  </div>
</template>

<script>
import ReplyListItem from './ReplyListItem.vue'

export default {
  name: 'ReplyList',
  props: {
    replies: {
      type: Array,
      default: []
    }
  },
  components: {
    ReplyListItem
  }
}
</script>

<style scoped>
.reply-container {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  box-shadow: 0 0 3px var(--shadow-color);
  border-radius: 5px;
  margin-bottom: 20px;
}

.second-reply-container {
  margin-left: 60px;
}
</style>