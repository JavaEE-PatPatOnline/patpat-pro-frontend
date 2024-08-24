<template>
  <NFlex justify="space-between" align="center" :wrap="false">
    <!-- 左侧 -->
    <div class="left">
      <!-- 左侧上部：标题和标签 -->
      <NFlex align="center" class="left-top">
        <NEllipsis :tooltip="titleEllipsis" style="max-width: calc(100% - 300px); min-width: 250px;">
          <span class="title">{{ discussion.title }}</span>
        </NEllipsis>
        <div class="discussion-type" :class="{
          'discussion-type-1': discussion.type === 1,
          'discussion-type-2': discussion.type === 2,
          'discussion-type-3': discussion.type === 3,
          'discussion-type-4': discussion.type === 4
        }">
          {{ discussionType[discussion.type] }}
        </div>
        <div class="star" v-if="discussion.starred">已加精</div>
        <div class="top" v-if="discussion.topped">已置顶</div>
        <NFlex align="center" class="like-count" v-if="discussion.likeCount > 0">
          <LikeIcon forShow />
          {{ discussion.likeCount }}
        </NFlex>
      </NFlex>
      <!-- 左侧下部：头像，用户名 -->
      <NFlex v-if="discussion.author" align="center" class="left-bottom">
        <div class="avatar" :style="{ 'backgroundImage': `url('${discussion.author.avatar}')` }"></div>
        <span>{{ discussion.author.name }}</span>
        <NEllipsis :tooltip="false" style="max-width: 80%" v-if="showContent">
          <span class="content">
            {{ discussion.content }}
          </span>
        </NEllipsis>
      </NFlex>
    </div>
    <!-- 右侧：时间数据 -->
    <div>
      <div class="time">
        创建于：{{ discussion.createdAt }}
      </div>
      <div class="time">
        更新于：{{ discussion.updatedAt }}
      </div>
    </div>
  </NFlex>
</template>

<script>
import LikeIcon from '../svg/LikeIcon.vue'
import { NFlex, NEllipsis } from 'naive-ui'

export default {
  name: 'DiscussionHeader',
  props: {
    // 是否展示标题详细内容
    titleEllipsis: {
      type: Boolean,
      default: false
    },
    // 是否展示内容缩略
    showContent: {
      type: Boolean,
      default: true
    },
    discussion: {
      type: Object,
      default: null
    }
  },
  components: {
    LikeIcon,
    NFlex,
    NEllipsis
  },
  data() {
    return {
      discussionType: {
        1: '问题求助',
        2: '交流分享',
        3: '学习打卡',
        4: '其他'
      }
    }
  },

}
</script>

<style scoped>
.left {
  width: 80%;
}

.left-top,
.left-bottom {
  margin-bottom: 5px;
}

span.title {
  font-size: 28px;
  font-weight: bold;
}

.discussion-type,
.star,
.top {
  color: #fbfbfc;
  font-weight: bold;
  font-size: 12px;
  border-radius: 3px;
  padding: 3px 5px;
}

.discussion-type-1 {
  background: var(--default-green);
}

.discussion-type-2 {
  background: var(--default-orange);
}

.discussion-type-3 {
  background: var(--default-purple);
}

.discussion-type-4 {
  background: var(--default-grey);
}

.star {
  background: var(--default-red);
}

.top {
  background: var(--default-blue);
}

.like-count {
  font-size: 14px;
  font-weight: bold;
  gap: 3px !important;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-size: cover;
}

span.content {
  font-size: 14px;
}

.time {
  font-size: 14px;
  margin-bottom: 5px;
  color: var(--default-grey);
}
</style>