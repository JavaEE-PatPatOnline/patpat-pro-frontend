<template>
  <div class="notice-wrapper">
    <NCollapseItem 
    :title="title">
      <template #header-extra>
        <div>
          <!-- 功能按钮 -->
          <NFlex justify="flex-end" align="center">
            <!-- 是否置顶 -->
            <span 
              class="top-state" 
              :class="{ 'clickable': isAdmin }" 
              v-if="isTopped"
              @click="handleTop"
            >
              已置顶
            </span>
            <span 
              class="top-state clickable" 
              v-else-if="!isTopped && isAdmin"
              @click="handleTop"
            >
              置顶
            </span>
            <!-- 编辑按钮 -->
            <EditIcon @click="jumpToEdit" />
            <!-- 删除按钮 -->
            <NPopconfirm
              positive-text="确认"
              negative-text="取消"
              :show-icon="false"
              @positive-click="deleteNotice"
            >
              <template #trigger>
                <DeleteIcon />
              </template>
              确认删除公告？
            </NPopconfirm>
          </NFlex>
          <!-- 公告时间 -->
          <div class="time">
            {{ time }}
          </div>
        </div>
      </template>
      <MarkdownDisplayer :content="content" />
    </NCollapseItem>
  </div>
</template>

<script>
import MarkdownDisplayer from '../markdown/MarkdownDisplayer.vue'
import DeleteIcon from '../svg/DeleteIcon.vue'
import EditIcon from '../svg/EditIcon.vue'
import { NFlex, NCollapseItem, NPopconfirm } from 'naive-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'NoticeListItem',
  props: {
    id: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: '标题'
    },
    content: {
      type: String,
      default: '内容'
    },
    time: {
      type: String,
      default: '2024-07-29 18:21:34'
    },
    isTopped: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MarkdownDisplayer,
    DeleteIcon,
    EditIcon,
    NFlex,
    NCollapseItem,
    NPopconfirm
  },
  computed: {
    ...mapGetters(['isAdmin'])
  },
  methods: {
    handleTop() {
      // todo
    },
    jumpToEdit() {
      this.$bus.emit('startNoticeEditing', this.id)
    },
    deleteNotice() {
      // todo
    }
  }
}
</script>

<style scoped>
.notice-wrapper {
  padding: 10px;
  border-radius: 5px;
  position: relative;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition: .5s cubic-bezier(0.075, 0.82, 0.165, 1);
  border-bottom: 1px solid var(--bg-grey);
}

.notice-wrapper:hover {
  transform: scale(1.01);
} 

.time {
  font-size: 14px;
  font-weight: bold;
  color: var(--default-grey);
}

.top-state {
  color: var(--default-blue);
  font-weight: bold;
} 

.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
</style>