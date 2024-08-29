<template>
  <!-- Discussion Header -->
  <section class="header-container">
    <DiscussionHeader :discussion="discussion" :showContent="false" titleEllipsis :showState="showState"
      :editable="editable" />
  </section>

  <!-- 详情 -->
  <section class="discussion-detail">
    <MarkdownDisplayer :content="discussion.content" />
  </section>

  <!-- 操作按钮区域 -->
  <section class="discussion-actions">
    <NFlex justify="flex-end" align="center">
      <NPopconfirm positive-text="确认" negative-text="取消" :show-icon="false" @positive-click="deleteDiscussion"
        v-if="canDelete">
        <template #trigger>
          <button class="danger">删除</button>
        </template>
        确认删除此讨论帖？
      </NPopconfirm>
      <button class="styled" @click="isEditingReply = true" v-if="!isEditingReply">
        回复讨论
      </button>
    </NFlex>
  </section>

  <!-- 回复讨论 -->
  <section class="discussion-reply" v-if="isEditingReply">
    <MarkdownEditor v-model:value="replyContent" />
    <NFlex justify="flex-end" align="center" class="reply-btn">
      <button @click="cancelReply">取消</button>
      <button class="styled" @click="submitReply">回复</button>
    </NFlex>
  </section>

  <!-- 评论区 -->
  <section class="reply">
    <h4>全部回复</h4>
    <ReplyList v-if="replies.length > 0" v-model:replies="replies" :discussionId="discussion.id" />
    <div class="empty-hint" v-else>暂无回复</div>
  </section>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DiscussionHeader from '../components/discussion/DiscussionHeader.vue'
import MarkdownDisplayer from '../components/markdown/MarkdownDisplayer.vue'
import MarkdownEditor from '../components/markdown/MarkdownEditor.vue'
import ReplyList from '../components/discussion/reply/ReplyList.vue'
import { NFlex, NPopconfirm, useMessage } from 'naive-ui'
import Discussion from '../api/Discussion.js'
import { mapGetters } from 'vuex'
export default {
  name: 'DiscussionDetail',
  components: {
    DiscussionHeader,
    MarkdownDisplayer,
    MarkdownEditor,
    ReplyList,
    NFlex,
    NPopconfirm
  },
  data() {
    return {
      message: useMessage(),
      discussion: {},
      replies: [],
      isEditingReply: false,
      replyContent: '',
      route: useRoute(),
      router: useRouter(),
      store: useStore(),
    }
  },
  computed: {
    ...mapGetters(['isAdmin', 'userBuaaId']),
    showState() {
      return this.isAdmin
    },
    editable() {
      return this.isAdmin
    },
    canDelete() {
      return this.isAdmin || (this.discussion.author && this.discussion.author.buaaId === this.userBuaaId)
    }
  },
  mounted() {
    this.fetchDiscussionDetails()
    this.$bus.on('reply-change', () => {
      this.fetchDiscussionDetails()
    })
  },
  methods: {
    fetchDiscussionDetails() {
      const id = this.route.params.id
      Discussion.getDiscussionDetail(id).then(
        (response) => {
          this.discussion = response.data.data.discussion
          this.replies = response.data.data.replies
        },
        (error) => {
          console.log('获取讨论详情失败' + error)
        }
      )
    },
    deleteDiscussion() {
      Discussion.deleteDiscussion(this.discussion.id).then(
        (response) => {
          this.message.success('删除讨论帖成功')
          this.router.push('/discussions')
        },
        (error) => {
          this.message.error('删除讨论帖失败')
        }
      )
    },
    submitReply() {
      console.log("是在submit提交的")
      if (this.replyContent.trim() === '') {
        this.message.error('评论内容不得为空')
        return
      }
      Discussion.createComment(this.discussion.id, this.replyContent, 0).then(
        (response) => {
          this.replies.push(response.data.data)
          this.cancelReply()
        },
        (error) => {
          this.message.error('回复评论失败')
        }
      )
    },
    cancelReply() {
      this.isEditingReply = false
      this.replyContent = ''
    },
  }
}
</script>

<style scoped>
.discussion-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header-container {
  margin-bottom: 20px;
}

.discussion-detail {
  margin-bottom: 30px;
}

.discussion-actions {
  margin-bottom: 20px;
}

.discussion-reply {
  margin-left: 25px;
}

.comment {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-actions {
  margin-top: 10px;
}

.comment-actions button {
  margin-right: 10px;
}

.delete-btn,
.styled {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* .delete-btn {
  background-color: #ff4d4f;
  color: white;
} */

/* .styled {
  background-color: #1890ff;
  color: white;
} */

.reply {
  margin-left: 25px;
  /* DO NOT MODIFY: */
  padding-bottom: 1px;
}

h4 {
  font-size: 24px;
  font-weight: bold;
  color: var(--default-blue);
  margin-bottom: 10px;
}

.discussion-actions {
  margin-bottom: 20px;
}

.discussion-actions button {
  margin-left: 10px;
}
</style>