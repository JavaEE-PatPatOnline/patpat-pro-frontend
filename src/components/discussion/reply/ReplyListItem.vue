<template>
  <div class="reply">
    <!-- 顶部 -->
    <NFlex justify="space-between" align="center">
      <!-- 头像、名称、时间 -->
      <NFlex align="center">
        <div class="avatar" :style="{ 'background-image': `url('${reply.author.avatar}')` }"></div>
        <div>
          <div>
            {{ reply.author.name }}
            <template v-if="isSecond"><span class="at">@</span> {{ reply.toName }}</template>
          </div>
          <div class="time">{{ reply.createdAt }}</div>
        </div>
      </NFlex>
      <!-- 点赞和认证 -->
      <NFlex align="center">
        <NFlex align="center" class="like-wrapper clickable" :class="{ 'liked-wrapper': reply.liked }"
          @click="handleLike">
          <LikeIcon v-if="!reply.liked" />
          <LikedIcon v-else />
          点赞
          <template v-if="reply.likeCount > 0">{{ reply.likeCount }}</template>
        </NFlex>
        <div class="verify-wrapper" :class="{ 'verified-wrapper': reply.verified, 'clickable': isAdmin }"
          @click="handleVerify">
          <template v-if="reply.verified">已认证</template>
          <template v-else>未认证</template>
        </div>
      </NFlex>
    </NFlex>
    <!-- 内容 -->
    <NFlex class="reply-content" justify="space-between" align="flex-end">
      <div class="displayer-wrapper">
        <MarkdownDisplayer :content="reply.content" />
      </div>
      <NFlex justify="flex-end" align="center" v-if="!isEditingReply">
        <button v-if="!isSecond" class="styled reply-btn" @click="isEditingReply = true">回复</button>
        <NPopconfirm v-if="isAdmin || reply.author.buaaId == userBuaaId" positive-text="确认" negative-text="取消"
          :show-icon="false" @positive-click="deleteReply">
          <template #trigger>
            <DeleteIcon small />
          </template>
          确认删除回复？
        </NPopconfirm>
      </NFlex>
    </NFlex>
    <!-- 底部 -->

    <!-- 回复框 -->
    <div v-if="isEditingReply" class="reply-input">
      <MarkdownEditor v-model:value="replyContent" />
      <NFlex justify="flex-end" align="center" class="reply-btn-box">
        <button @click="cancelReply">取消</button>
        <button class="styled" @click="submitReply">回复</button>
      </NFlex>
    </div>
  </div>
</template>

<script>
import MarkdownDisplayer from '../../markdown/MarkdownDisplayer.vue'
import MarkdownEditor from '../../markdown/MarkdownEditor.vue'
import LikeIcon from '../../svg/LikeIcon.vue'
import LikedIcon from '../../svg/LikedIcon.vue'
import DeleteIcon from '../../svg/DeleteIcon.vue'
import { mapGetters } from 'vuex'
import { NFlex, NPopconfirm, useMessage } from 'naive-ui'
import Discussion from '../../../api/Discussion.js'

export default {
  name: 'ReplyListItem',
  props: {
    isSecond: {
      type: Boolean,
      default: false
    },
    reply: {
      type: Object,
      default: null
    },
    discussionId: {
      type: Number,
      required: true
    }
  },
  components: {
    MarkdownDisplayer,
    MarkdownEditor,
    LikeIcon,
    LikedIcon,
    DeleteIcon,
    NFlex,
    NPopconfirm
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters(['userBuaaId'])
  },
  data() {
    return {
      message: useMessage(),
      isEditingReply: false,
      replyContent: ''
    }
  },
  methods: {
    handleVerify() {
      if (!this.isAdmin) {
        return
      }
      const newVerifiedStatus = !this.reply.verified
      const action = newVerifiedStatus ? "认证" : "取消认证"
      if (confirm(`确定要${action}这条回复吗？`)) {
        Discussion.verify(this.reply.id, newVerifiedStatus).then(
          (response) => {
            this.reply.verified = newVerifiedStatus
            this.$bus.emit("reply-change")
          },
          (error) => {
            this.message.error(`${action}失败`)
          }
        )
      }
    },
    cancelReply() {
      this.isEditingReply = false
      this.replyContent = ''
    },
    submitReply() {
      if (this.replyContent.trim() === '') {
        this.message.error("评论内容不得为空")
        return
      }
      Discussion.createComment(this.discussionId, this.replyContent, this.reply.id).then(
        (response) => {
          this.cancelReply()
          // this.reply.replies.push(response.data.data)
          this.$bus.emit('reply-change')
        },
        (error) => {
          this.message.error("回复失败")
        }
      )
    },
    handleLike() {
      console.log(this.reply.liked)
      Discussion.likeComment(this.reply.id, !this.reply.liked).then(
        () => {
          this.reply.likeCount += 1
          this.$bus.emit("reply-change")
        },
        (error) => {
          this.message.error("点赞失败")
        }
      )
    },
    deleteReply() {
      Discussion.deleteComment(this.reply.id).then(
        () => {
          this.$bus.emit('reply-change')
        },
        (error) => {
          this.message.error("删除评论失败")
        }
      )
    }
  },
  computed: {
    ...mapGetters(['isAdmin', 'userBuaaId']),
  }
}
</script>

<style scoped>
.reply {
  padding: 10px 0;
  padding-top: 20px;
  border-bottom: 1px solid var(--default-grey-transparent);
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-size: cover;
}

.time {
  font-size: 14px;
  color: var(--default-grey);
}

.like-wrapper {
  border-radius: 3px;
  border: 1px solid var(--default-grey);
  color: var(--default-grey);
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
}

.liked-wrapper {
  border: 1px solid var(--default-pink);
  color: var(--default-pink);
}

.verify-wrapper {
  border-radius: 3px;
  border: 1px solid var(--default-grey);
  color: var(--default-grey);
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
}

.verified-wrapper {
  border: 1px solid var(--default-red);
  color: var(--default-red);
}

.clickable {
  cursor: pointer;
  transition: .5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.clickable:hover {
  scale: 1.02;
}

.reply-content {
  margin-left: 32px;
  margin-bottom: 10px;
}

.displayer-wrapper {
  width: calc(100% - 80px);
  margin-bottom: 10px;
}

.reply-btn {
  width: unset;
  height: unset;
  padding: 0;
  background: none !important;
  font-size: 14px;
}

.reply-input {
  box-sizing: border-box;
  padding: 0 10px;
  margin-left: 45px;
}

.reply-btn-box {
  margin-top: 10px;
}

span.at {
  color: var(--default-grey);
}
</style>