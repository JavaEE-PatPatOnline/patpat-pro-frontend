<template>
  <!-- <span style="display: none;">{{ debugShowState }} 111</span> -->
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
          'discussion-type-4': discussion.type === 4,
          'discussion-type-5': discussion.type === 5
        }">
          {{ discussionType[discussion.type] }}
        </div>

        <div class="star starred" :class="{ 'clickable': isAdmin }" v-if="discussion.starred" @click.stop="handleStar">
          已加精
        </div>
        <div class="star" v-else-if="!discussion.starred && showState" :class="{ 'clickable': isAdmin }"
          @click.stop="handleStar">
          未加精
        </div>

        <div class="top topped" :class="{ 'clickable': isAdmin }" v-if="discussion.topped" @click.stop="handleTop">
          已置顶
        </div>
        <div class="top" :class="{ 'clickable': isAdmin }" v-else-if="!discussion.topped && showState"
          @click.stop="handleTop">
          未置顶
        </div>

        <NFlex align="center" class="like-wrapper" :class="{ 'liked-wrapper': discussion.liked, 'clickable': editable }"
          @click.stop="handleLike">
          <LikeIcon v-if="!discussion.liked" />
          <LikedIcon v-else />
          点赞
          <template v-if="discussion.likeCount > 0">{{ discussion.likeCount }}</template>
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
import LikedIcon from '../svg/LikedIcon.vue'
import { mapGetters } from 'vuex'
import { NFlex, NEllipsis } from 'naive-ui'
import Discussion from '../../api/Discussion.js'


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
    },
    // 是否能执行加精、置顶操作
    editable: {
      type: Boolean,
      default: false
    },
    // 是否展示“未加精”、“未置顶”
    showState: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LikeIcon,
    LikedIcon,
    NFlex,
    NEllipsis
  },
  computed: {
    ...mapGetters(['isAdmin']),
    // debugShowState() {
    //   console.log('showState:', this.showState)
    //   return this.showState
    // }
  },
  data() {
    return {
      discussionType: {
        1: '问题求助',
        2: '交流分享',
        3: '学习打卡',
        4: '课程反馈',
        5: '其他方面'
      }
    }
  },

  methods: {
    handleStar() {
      if (this.editable) {
        const newStarredState = !this.discussion.starred
        Discussion.setStarState(this.discussion.id, newStarredState)
          .then(() => {
            this.discussion.starred = newStarredState
            this.$bus.emit('discussion-change')
          })
          .catch(error => {
            alert('加精操作失败')
          })
      }
    },

    handleTop() {
      if (this.editable) {
        const newToppedState = !this.discussion.topped
        Discussion.setTopState(this.discussion.id, newToppedState)
          .then(() => {
            this.discussion.topped = newToppedState
            this.$bus.emit('discussion-change')
          })
          .catch(error => {
            alert('置顶操作失败')
          })
      }
    },

    handleLike() {
      // if (this.editable) {
      //都能点赞吧
      console.log(this.discussion)
      const newLikedState = !this.discussion.liked
      Discussion.likeDiscussion(this.discussion.id, newLikedState)
        .then(response => {
          this.$bus.emit('discussion-change')
        })
        .catch(error => {
          alert('点赞操作失败')
        })
    }
  }
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

.clickable {
  cursor: pointer;
  transition: .5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.clickable:hover {
  scale: 1.02;
}

.discussion-type,
.top,
.star {
  font-weight: bold;
  font-size: 12px;
  border-radius: 3px;
  padding: 5px;
}

.top {
  color: var(--default-blue);
  border: 1px solid var(--default-blue);
}

.star {
  color: var(--default-red);
  border: 1px solid var(--default-red);
}

.discussion-type,
.starred,
.topped {
  color: #fafafc;
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
  background: var(--default-cyan)
}

.discussion-type-5 {
  background: var(--default-grey);
}

.starred {
  background: var(--default-red);
}

.topped {
  background: var(--default-blue);
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