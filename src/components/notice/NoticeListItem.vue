<template>
  <div class="notice-wrapper">
    <NCollapseItem display-directive="show" :title="notice.title" :name="String(index)">
      <template #header-extra>
        <div>
          <!-- 功能按钮 -->
          <NFlex justify="flex-end" align="center">
            <!-- 是否置顶 -->
            <span class="top-state" :class="{ 'clickable': isAdmin }" v-if="notice.isTopped" @click="handleTop">
              已置顶
            </span>
            <span class="top-state clickable" v-else-if="!notice.isTopped && isAdmin" @click="handleTop">
              置顶
            </span>
            <!-- 编辑按钮 -->
            <EditIcon @click="jumpToEdit" v-if="isAdmin" />
            <!-- 删除按钮 -->
            <NPopconfirm positive-text="确认" negative-text="取消" :show-icon="false" @positive-click="deleteNotice"
              v-if="isAdmin">
              <template #trigger>
                <DeleteIcon />
              </template>
              确认删除公告？
            </NPopconfirm>
          </NFlex>
          <!-- 公告时间 -->
          <div class="time">
            {{ notice.time }}
          </div>
        </div>
      </template>
      <MarkdownDisplayer :content="notice.content" />
    </NCollapseItem>
  </div>
</template>

<script>
import MarkdownDisplayer from '../markdown/MarkdownDisplayer.vue'
import DeleteIcon from '../svg/DeleteIcon.vue'
import EditIcon from '../svg/EditIcon.vue'
import { NFlex, NCollapseItem, NPopconfirm, useMessage } from 'naive-ui'
import { mapState } from 'vuex'
import Notice from '../../api/Notice.js'
export default {
  name: 'NoticeListItem',
  props: {
    notice: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      message: useMessage()
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
    ...mapState(['isAdmin'])
  },
  methods: {
    handleTop() {
      if (this.isAdmin) {
        const newTopState = !this.notice.isTopped
        Notice.updateNotice(this.notice.id,
          this.notice.title,
          this.notice.content,
          !this.notice.isTopped).then(
            (response) => {
              this.$bus.emit('updateState')
              this.message.success(newTopState ? '置顶成功' : '取消置顶成功')
            },
            (error) => {
              this.message.error('操作失败')
            }
          )
      }
    },
    jumpToEdit() {
      this.$bus.emit('startNoticeEditing', this.notice.id)
    },
    deleteNotice() {
      Notice.deleteNotice(this.notice.id).then(
        (response) => {
          this.$bus.emit('updateState')
        },
        (error) => {
          this.message.error('删除公告失败')
        }
      )
    }
  }
}
</script>

<style scoped>
.notice-wrapper {
  padding: 10px;
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