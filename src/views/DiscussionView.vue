<template>
  <button v-if="!isEditingDiscussion" class="styled add-btn" @click="newDiscussion">+</button>
  <DiscussionList v-if="!isEditingDiscussion" :discussions="currentDiscussions" />
  <NFlex justify="center" class="pagination">
    <NPagination v-model:page="page" :page-count="total"/>
  </NFlex>
  <DiscussionEditor v-else :id="editingDiscussionId" />
</template>

<script>
import DiscussionList from '../components/discussion/DiscussionList.vue'
import Discussion from '../api/Discussion.js'
import DiscussionEditor from '../components/discussion/DiscussionEditor.vue'import { NFlex, NPagination } from 'naive-ui'


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
      discussions: [],
      isEditingDiscussion: false,
      editingDiscussionId: null,
      page: 1,
      total: 1,
      pageSize: 6 // 确定的值
    }
  },
  mounted() {
    // 此处计算总页数
    this.total = Math.ceil(this.discussions.length / this.pageSize)
  },
  computed: {
    currentDiscussions() {
      // 这是一次请求了全部讨论帖的写法
      // 实际上应该通过调用接口获取对应的页
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.discussions.slice(startIndex, endIndex);
    },
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
    })
    Discussion.getDiscussionList().then(
      (response) => {
        this.discussions = response.data.data.items
      },
      (error) => {
        console.log('获取讨论组失败:' + error)
      }
    )
  },
  methods: {
    newDiscussion() {
      this.editingDiscussionId = ''
      this.isEditingDiscussion = true
    }
  }
}
</script>

<style scoped>
.pagination {
  padding: 20px 0;
}
</style>
<style scoped>
.button.add-btn {
  font-size: 30px;
  font-weight: normal;
  height: fit-content;
  padding: 0 30px;
}
</style>