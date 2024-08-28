<template>
  <!-- Discussion Header -->
  <section class="header-container">
    <DiscussionHeader :discussion="discussion" :showContent="false" titleEllipsis showState editable />
  </section>

  <!-- 详情 -->
  <section class="discussion-detail">
    <MarkdownDisplayer :content="discussion.content" />
  </section>

  <!-- 删除按钮 -->
  <NPopconfirm
    positive-text="确认"
    negative-text="取消"
    :show-icon="false"
    @positive-click="deleteDiscussion"
    v-if="canDelete"
  >
    <template #trigger>
      <button class="danger" >删除</button>
    </template>
    确认删除此讨论帖？
  </NPopconfirm>
  

  <!-- 回复讨论 -->
  <section class="discussion-reply">
    <!-- 如果未处于 isEditingReply，则显示"回复讨论"按钮 -->
    <NFlex justify="flex-end" align="center" v-if="!isEditingReply" class="reply-btn">
      <button class="styled" @click="isEditingReply = true">
        回复讨论
      </button>
    </NFlex>
    <!-- 否则显示回复框、"回复"和"取消"按钮 -->
    <template v-else>
      <MarkdownEditor v-model:value="replyContent" />
      <NFlex justify="flex-end" align="center" class="reply-btn">
        <button @click="cancelReply">取消</button>
        <button class="styled" @click="submitReply">回复</button>
      </NFlex>
    </template>
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
import { NFlex, NPopconfirm } from 'naive-ui'
import Discussion from '../api/Discussion.js'

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
      discussion: {},
      replies: [],
      isEditingReply: false,
      replyContent: '',
      route: useRoute(),
      router: useRouter(),
      store: useStore()
    }
  },
  computed: {
    userId() {
      return this.store.getters.getUserId
    },
    isAdmin() {
      return this.store.getters.isAdmin
    },
    canDelete() {
      return this.isAdmin || (this.discussion.author && this.discussion.author.id === this.userId)
    }
  },
  mounted() {
    this.fetchDiscussionDetails()
    this.$bus.on('comment-deleted', () => {
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
      if (confirm('确定要删除这个讨论吗？')) {
        Discussion.deleteDiscussion(this.discussion.id).then(
          () => {
            alert("删除成功")
            this.router.push('/discussions')
          },
          (error) => {
            console.log("删除失败", error)
          }
        )
      }
    },
    submitReply() {
      console.log("是在submit提交的")
      if (this.replyContent.trim() === '') {
        alert("评论内容不得为空")
        return
      }
      Discussion.createComment(this.discussion.id, this.replyContent, 0).then(
        (response) => {
          this.replies.push(response.data.data)
          this.cancelReply()
        },
        (error) => {
          console.log("回复失败", error)
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
</style>