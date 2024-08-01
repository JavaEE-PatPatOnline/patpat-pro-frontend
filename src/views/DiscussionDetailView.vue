<template>
  <!-- Discussion Header -->
  <section class="header-container">
    <DiscussionHeader :discussion="discussion" :showContent="false" titleEllipsis />
  </section>
  <!-- 详情 -->
  <!-- 外包一层 div 是为了在 index.css 中清除 markdown 的部分样式 -->
  <section class="discussion-detail">
    <MarkdownDisplayer :content="discussion.content" />
  </section>
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
      <MarkdownEditor v-model:value="replyContent"/>
      <NFlex justify="flex-end" align="center" class="reply-btn">
        <button @click="isEditingReply = false">取消</button>
        <button class="styled" @click="reply">回复</button>
      </NFlex>
    </template>
  </section>

  <!-- 评论区 -->

</template>

<script>
import DiscussionHeader from '../components/discussion/DiscussionHeader.vue'
import MarkdownDisplayer from '../components/markdown/MarkdownDisplayer.vue'
import MarkdownEditor from '../components/markdown/MarkdownEditor.vue'
import { NFlex } from 'naive-ui'

export default {
  name: 'DiscussionDetailView.vue',
  components: {
    DiscussionHeader,
    MarkdownDisplayer,
    MarkdownEditor,
    NFlex,
  },
  data() {
    return {
      discussion: {
        title: '关于封装思想的再探讨',
        userAvatar: 'http://8.130.103.241/public/boy.svg',
        username: '柳政尧',
        createdAt: '2024.08.01 12:53:36',
        updatedAt: '2024.08.01 12:53:37',
        content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
        isStarred: true,
        isTopped: true
      },
      isEditingReply: false, // 是否正在编辑回复
      replyContent: '' // 回复的字符串内容

    }
  },
  methods: {
    reply() {
      // todo

      this.isEditingReply = false
    }
  }
}
</script>

<style scoped>
.header-container {
  margin-left: 25px;
  margin-bottom: 10px;
}

.discussion-reply {
  margin-left: 20px;
}

.reply-btn {
  margin-top: 10px;
}
</style>