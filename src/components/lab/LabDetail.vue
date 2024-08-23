<template>
<!-- 下面这个 lab-container 不能删去 -->
  <div class="lab-container">
    <NFlex justify="space-between">
      <h3>{{ title }}</h3>
      <NFlex align="center" class="lab-btn">
        <!-- 提交按钮 -->
        <UploadIcon @click="selectFile" />
        <template v-if="fileToSubmit">
          <span>已选择：
            <a :href="fileURL" :download="filename">
              {{ filename }}
            </a>
          </span>
          <CrossIcon v-if="fileToSubmit" @click="removeFile" />
        </template>
        <input ref="fileInput" style="display: none" type="file" 
          @change="handleFileChange" accept=".pdf, .zip"/>
        <!-- 编辑按钮 -->
        <EditIcon @click="startEditingLab"/>
        <!-- 删除按钮 -->
        <NPopconfirm
          positive-text="确认"
          negative-text="取消"
          :show-icon="false"
          @positive-click="deleteLab"
        >
          <template #trigger>
            <DeleteIcon />
          </template>
          确认删除实验？
        </NPopconfirm>
      </NFlex>
    </NFlex>
    <NFlex justify="space-between" class="times">
      <span>开始时间：{{ startTime }}</span>
      <span>结束时间：{{ ddlTime }}</span>
      <span>迟交截止：{{ endTime }}</span>
    </NFlex>
    <MarkdownDisplayer :content="content" />
  </div>
</template>

<script>
import MarkdownDisplayer from '../markdown/MarkdownDisplayer.vue'
import EditIcon from '../svg/EditIcon.vue'
import DeleteIcon from '../svg/DeleteIcon.vue'
import UploadIcon from '../svg/UploadIcon.vue'
import CrossIcon from '../svg/CrossIcon.vue'

import Lab from '../../api/Lab.js'

import { NFlex, NPopconfirm } from 'naive-ui'

export default {
  name: 'LabDetail',
  components: {
    MarkdownDisplayer,
    EditIcon,
    DeleteIcon,
    UploadIcon,
    CrossIcon,
    NFlex,
    NPopconfirm
  },
  data() {
    return {
      fileToSubmit: null,
      filename: '',
      fileURL: '',
      id: '',
      title: '',
      content: 'hhs',
      startTime: '',
      ddlTime: '',
      endTime: ''
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.id = to.params.id
        this.getLabDetail()
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getLabDetail()
  },
  methods: {
    getLabDetail() {
      Lab.getLabDetail(this.id).then(
        (response) => {
          const lab = response.data.data
          this.title = lab.title
          this.content = lab.content
          this.startTime = lab.startTime
          this.ddlTime = lab.deadlineTime
          this.endTime = lab.endTime
        },
        (error) => {
          alert('获取实验详情失败')
        }
      )
    },
    startEditingLab() {
      this.$router.push('/lab/' + this.id + '/edit')
    },
    deleteLab() {
      Lab.deleteLab(this.id).then(
        (response) => {
          alert('删除实验成功')
          this.$bus.emit('update-lab')
          this.$router.go(-1)
        },
        (error) => {
          alert('删除实验失败')
        }
      )
    },
    selectFile() {
      this.$refs.fileInput.click()
    },
    handleFileChange(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.fileToSubmit = event.target.files[0]
        this.filename = this.fileToSubmit.name
        this.fileURL = URL.createObjectURL(this.fileToSubmit)
        // todo： 提交
      }
    },
    removeFile() {
      this.fileToSubmit = null
      this.filename = ''
      this.fileURL = null
    }
  }
}
</script>

<style scoped>
h3 {
  font-size: 30px;
  font-weight: bold;
  color: var(--default-blue);
  margin-left: 25px;
}

.lab-btn {
  margin-right: 20px;
}

.times {
  margin-left: 25px;
  width: 60%;
}

.times span {
  font-size: 14px;
  color: var(--default-grey);
  font-weight: bold;
}

.lab-btn a {
  cursor: pointer;
}
.lab-btn a:hover {
  text-decoration: underline;
}
</style>