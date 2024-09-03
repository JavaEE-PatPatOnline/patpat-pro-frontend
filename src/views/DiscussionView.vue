<template>
  <div v-if="!isEditingDiscussion" class="search-box">
    <input v-model="searchQuery" @input="handleSearch" placeholder="搜索讨论..." />
  </div>

  <button v-if="!isEditingDiscussion" class="styled add-btn" @click="newDiscussion">+</button>
  <DiscussionEditor v-else :id="editingDiscussionId" />
  <template v-if="!isEditingDiscussion">
    <DiscussionList v-if="discussions.length > 0" :discussions="discussions" />
    <NFlex justify="center" class="pagination" v-if="discussions.length > 0">
      <NPagination v-model:page="page" :page-count="totalPages" @update:page="fetchDiscussions" />
    </NFlex>
    <div class="empty-hint" v-if="discussions.length === 0">暂无讨论帖</div>
  </template>
</template>

<script>
import DiscussionList from '../components/discussion/DiscussionList.vue'
import Discussion from '../api/Discussion.js'
import DiscussionEditor from '../components/discussion/DiscussionEditor.vue'
import { NFlex, NPagination, useMessage } from 'naive-ui'

export default {
  name: 'DiscussionView',
  components: {
    DiscussionList,
    NFlex,
    NPagination,
    DiscussionEditor
  },
  data() {
    return {
      message: useMessage(),
      discussions: [],
      isEditingDiscussion: false,
      editingDiscussionId: null,
      page: 1,
      pageSize: 6,
      totalItems: 0,
      searchQuery: '',
      searchTimeout: null,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    }
  },
  mounted() {
    this.$bus.on('startDiscussionEditing', (id) => {
      this.editingDiscussionId = id
      this.isEditingDiscussion = true
    })
    this.$bus.on('endDiscussionEditing', () => {
      this.editingDiscussionId = null
      this.isEditingDiscussion = false
      this.fetchDiscussions()
    })
    this.fetchDiscussions()
    this.$bus.on('discussion-change', () => {
      this.fetchDiscussions()
    })
  },
  methods: {
    newDiscussion() {
      this.editingDiscussionId = ''
      this.isEditingDiscussion = true
    },
    fetchDiscussions() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
      }
      if (this.searchQuery) {
        params.query = this.searchQuery
      }
      Discussion.getDiscussionList(params).then(
        (response) => {
          this.discussions = response.data.data.items
          this.totalItems = response.data.data.total
        },
        (error) => {
          this.message.error('获取讨论列表失败')
        }
      )
    },
    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.page = 1
        this.fetchDiscussions()
      }, 300)
    }
  }
}
</script>

<style scoped>
.pagination {
  padding: 20px 0;
}

.styled.add-btn {
  font-size: 30px;
  font-weight: normal;
  height: fit-content;
  padding: 0 30px;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 50%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>