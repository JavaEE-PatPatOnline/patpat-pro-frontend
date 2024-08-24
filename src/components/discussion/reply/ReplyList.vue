<template>
  <div class='reply-container' v-for='reply in replies' :key='reply.id'>
    <ReplyListItem 
      :reply='reply' 
      :discussionId='discussionId'
       @comment-deleted='handleCommentDeleted(reply)'
    />
    <div class='second-reply-container' v-for='secondReply in reply.replies' :key='secondReply.id'>
      <ReplyListItem 
        :reply='secondReply' 
        :discussionId='discussionId'
        isSecond 
        @comment-deleted='handleCommentDeleted(reply)'
      />
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
      default: () => []
    },
    discussionId: {
      type: Number,
      required: true
    }
  },
  components: {
    ReplyListItem
  },
  methods: {
     handleCommentDeleted(reply) {
      if (reply.toId == 0) {
        const index = this.replies.findIndex(item => item.id === reply.id);
        if (index > -1) {
          this.replies.splice(index, 1);
        }
      } else {
        const parentReply = this.replies.find(item => item.id == reply.toId);
        if (parentReply) {
          const index = parentReply.replies.findIndex(item => item.id === reply.id);
          if (index > -1) {
            parentReply.replies.splice(index, 1);
          }
        }
      }
    }
  },
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