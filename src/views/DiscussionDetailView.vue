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
  <section class="reply">
    <h4>全部回复</h4>
    <ReplyList v-if="replies.length > 0" :replies="replies" />
    <div class="empty-hint" v-else>暂无回复</div>
  </section>
</template>

<script>
import DiscussionHeader from '../components/discussion/DiscussionHeader.vue'
import MarkdownDisplayer from '../components/markdown/MarkdownDisplayer.vue'
import MarkdownEditor from '../components/markdown/MarkdownEditor.vue'
import ReplyList from '../components/discussion/reply/ReplyList.vue'
import { NFlex } from 'naive-ui'

export default {
  name: 'DiscussionDetailView.vue',
  components: {
    DiscussionHeader,
    MarkdownDisplayer,
    MarkdownEditor,
    ReplyList,
    NFlex,
  },
  data() {
    return {
      discussion: {
        title: '关于封装思想的再探讨',
        authorAvatar: 'http://8.130.103.241/public/boy.svg',
        authorName: '柳政尧',
        createdAt: '2024.08.01 12:53:36',
        updatedAt: '2024.08.01 12:53:37',
        content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
        isStarred: true,
        isTopped: true,
        likeCount: 10,
        isLiked: true
      },
      isEditingReply: false, // 是否正在编辑回复
      replyContent: '', // 回复的字符串内容
      replies: [
        {
          id: '1',
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          createdAt: '2024.08.01 12:53:36',
          content: '封装是面向对象编程（OOP）的三大基本特征之一哈佛啊回复哦啊哦发动行情奥if电话啊哦哦回复从i啊是佛卡佛i啊搜ID号ID号奥i回复i哦啊哈佛卡哦if好if厚爱发',
          to: '柳政尧',
          isVerified: true,
          isLiked: true,
          likeCount: 10,
          children: [
            {
              id: '2',
              authorAvatar: 'http://8.130.103.241/public/boy.svg',
              authorName: '周奕航',
              createdAt: '2024.08.01 12:53:37',
              content: '封装是面向对象编程（OOP）的三大基本特征之一',
              to: '柳政尧',
              isVerified: false,
              isLiked: false,
              likeCount: 12
            },
            {
              id: '3',
              authorAvatar: 'http://8.130.103.241/public/girl.svg',
              authorName: '冉超月',
              createdAt: '2024.08.01 12:54:36',
              content: '封装是面向对象编程（OOP）的三大基本特征之一',
              to: '周奕航',
              isVerified: false,
              isLiked: true,
              likeCount: 1,
            }
          ]
        },
        {
          id: '4',
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '周奕航',
          createdAt: '2024.08.01 12:55:36',
          content: '战无不胜的 **柳政尧主义思想** 万岁！',
          to: '柳政尧',
          isVerified: true,
          isLiked: false,
          likeCount: 100,
          children: [
            {
              id: '5',
              authorAvatar: 'http://8.130.103.241/public/girl.svg',
              authorName: '冉超月',
              createdAt: '2024.08.02 08:57:36',
              content: '# 非常认同\n',
              to: '周奕航',
              isVerified: false,
              isLiked: false,
              likeCount: 0,
            }
          ]
        }
      ]
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
  margin-left: 25px;
}

.reply-btn {
  margin-top: 10px;
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