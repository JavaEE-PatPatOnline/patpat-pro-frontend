<template>
  <!-- Discussion Header -->
  <section class="header-container">
    <DiscussionHeader :discussion="discussion" :showContent="false" titleEllipsis showState editable />
  </section>
  <!-- 详情 -->
  <!-- 外包一层 div 是为了在 index.css 中清除 markdown 的部分样式 -->
  <section class="discussion-detail">
    <MarkdownDisplayer :content="discussion.content" />
  </section>
  <!-- 删除按钮 -->
  <button class="delete-btn" @click="deleteDiscussion">删除</button>
  <!-- 回复讨论 -->
  <section class="discussion-reply">
    <!-- 如果未处于 isEditingReply，则显示“回复讨论”按钮 -->
    <NFlex justify="flex-end" align="center" v-if="!isEditingReply" class="reply-btn">
      <button class="styled" @click="isEditingReply = true">
        回复讨论
      </button>
    </NFlex>
    <!-- 否则显示回复框、“回复”和“取消”按钮 -->
    <template v-else>
      <MarkdownEditor v-model:value="replyContent" />
      <NFlex justify="flex-end" align="center" class="reply-btn">
        <button @click="isEditingReply = false">取消</button>
        <button class="styled" @click="submitReply">回复</button>
      </NFlex>
    </template>
  </section>
  <!-- 评论区 -->
  <section class="reply">
    <h4>全部回复</h4>
    <ReplyList v-if="replies.length > 0" :replies="replies" />
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
import { NFlex } from 'naive-ui'
import Discussion from '../api/Discussion.js'

export default {
  name: 'DiscussionDetail',
  components: {
    DiscussionHeader,
    MarkdownDisplayer,
    MarkdownEditor,
    ReplyList,
    NFlex,
  },
  data() {
    return {
      discussion: {},
      comments: [],
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
    const id = this.route.params.id
    Discussion.getDiscussionDetail(id).then(
      (response) => {
        this.discussion = response.data.data.discussion
        this.comments = response.data.data.replies
      },
      (error) => {
        console.log('获取讨论详情失败' + error)
      }
    )
  },
  methods: {
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
      if (this.replyContent.trim() === '') {
        this.replyContent = "恢复"
      }
      Discussion.createComment(this.discussion.id, this.replyContent, 0).then(
        (response) => {
          this.comments.push(response.data.data)

        },
        (error) => {
          console.log("回复失败", error)
        }
      )
      this.replyContent = ''
      this.isEditingReply = false
    },
    cancelReply() {
      this.isEditingReply = false
      this.replyContent = ''
    },
    likeComment(comment) {
      Discussion.likeComment(comment.id, !comment.liked).then(
        () => {
          comment.liked = !comment.liked
        },
        (error) => {
          console.log("点赞失败", error)
        }
      )
    },
    replyToComment(comment) {
      // 实现回复特定评论的逻辑
      console.log("回复评论", comment.id)
    },
    deleteComment(comment) {
      if (confirm('确定要删除这条评论吗？')) {
        Discussion.deleteComment(comment.id).then(
          () => {
            const index = this.comments.findIndex(c => c.id === comment.id)
            if (index !== -1) {
              this.comments.splice(index, 1)
            }
          },
          (error) => {
            console.log("删除评论失败", error)
          }
        )
      }
    },
    canDeleteComment(comment) {
      return this.isAdmin || comment.author.id === this.userId
    }
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

.delete-btn {
  background-color: #ff4d4f;
  color: white;
}

.styled {
  background-color: #1890ff;
  color: white;
}

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