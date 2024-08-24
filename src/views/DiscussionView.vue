<template>
  <button v-if="!isEditingDiscussion" class="styled add-btn" @click="newDiscussion">+</button>
  <DiscussionList v-if="!isEditingDiscussion" :discussions="discussions" />
  <DiscussionEditor v-else :id="editingDiscussionId" />
</template>

<script>
import DiscussionList from '../components/discussion/DiscussionList.vue'
import Discussion from '../api/Discussion.js'
import DiscussionEditor from '../components/discussion/DiscussionEditor.vue'
export default {
  name: 'DiscussionView',
  components: {
    DiscussionList,
    DiscussionEditor
  },
  data() {
    return {
      discussions: [],
      isEditingDiscussion: false,
      editingDiscussionId: null,
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
.button.add-btn {
  font-size: 30px;
  font-weight: normal;
  height: fit-content;
  padding: 0 30px;
}
</style>