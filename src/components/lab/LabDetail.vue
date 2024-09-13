<template>
  <!-- 下面这个 lab-container 不能删去 -->
  <div class="lab-container">
    <NFlex justify="space-between">
      <h3>{{ title }}</h3>
      <NFlex align="center" class="lab-btn">
        <!-- 提交按钮 -->
        <!-- <UploadIcon @click="selectFile" /> -->
        <button class="styled" @click="selectFile">{{ submitText === '' ? (filename === '' ? '提交报告' : '重新提交') :
          submitText }}</button>
        <template v-if="filename !== ''">
          <span>已提交：
            <a @click="downloadReport">
              {{ filename }}
            </a>
          </span>
          <!-- <CrossIcon v-if="fileToSubmit" @click="removeFile" /> -->
        </template>
        <input ref="fileInput" style="display: none" type="file" @input="handleFileChange" accept=".pdf, .zip" />
        <!-- 编辑按钮 -->
        <NFlex align="center" title="编辑实验">
          <EditIcon @click="startEditingLab" v-if="isAdmin" />
        </NFlex>
        <!-- 删除按钮 -->
        <NPopconfirm positive-text="确认" negative-text="取消" :show-icon="false" @positive-click="deleteLab"
          v-if="isAdmin">
          <template #trigger>
            <NFlex align="center" title="删除实验">
              <DeleteIcon />
            </NFlex>
          </template>
          确认删除实验？
        </NPopconfirm>
      </NFlex>
    </NFlex>
    <NFlex justify="space-between" class="times">
      <span>开始时间：{{ startTime }}</span>
      <span>结束时间：{{ ddlTime }}</span>
      <span>补交截止：{{ endTime }}</span>
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

import download from '../utils/download.js'

import { NFlex, NPopconfirm, useMessage } from 'naive-ui'

import { mapState } from 'vuex'

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
      message: useMessage(),
      fileToSubmit: null,
      filename: '',
      fileURL: '',
      id: '',
      title: '',
      content: 'hhs',
      startTime: '',
      ddlTime: '',
      endTime: '',
      // >>> submit variables
      submitting: false,
      submitText: '', // Stupid vue binding
      progress: 0,    // 0 ~ 100
      loaded: 0,      // bytes
      speed: 0,       // MB/s
      // <<< submit variables
    }
  },
  computed: {
    ...mapState(['isAdmin'])
  },
  watch: {
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.id = to.params.id
        this.getLabDetail()
        this.getScore()
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getLabDetail()
    this.getScore()
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
          this.message.error('获取实验详情失败')
        }
      )
    },
    getScore() {
      this.filename = ''
      Lab.getScore(this.id).then(
        (response) => {
          if (response.data.data) {
            this.filename = response.data.data.filename
          }
        },
        (error) => {
          this.message.error('获取实验报告提交情况失败')
        }
      )
    },
    startEditingLab() {
      this.$router.push('/lab/' + this.id + '/edit')
    },
    deleteLab() {
      Lab.deleteLab(this.id).then(
        (response) => {
          this.message.success('删除实验成功')
          this.$bus.emit('update-lab')
          this.$router.go(-1)
        },
        (error) => {
          this.message.error('删除实验失败')
        }
      )
    },
    selectFile() {
      this.$refs.fileInput.click()
    },
    handleFileChange(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.fileToSubmit = event.target.files[0]
        // this.fileURL = URL.createObjectURL(this.fileToSubmit)
        // check if file size is larger than 32 MB
        if (this.fileToSubmit.size > 32 * 1024 * 1024) {
          this.message.error('文件大小不能超过 32 MB')
          // clear file input
          this.$refs.fileInput.value = ''
          return;
        }
        this.submitting = true
        this.submitText = '准备中...'
        this.progress = 0
        this.loaded = 0
        this.speed = 0

        Lab.submitReport(this.id, this.fileToSubmit, this.onProgressCallback).then(
          (response) => {
            this.filename = this.fileToSubmit.name
            this.message.success('提交实验报告成功')
          },
          (error) => {
            if (error.response.data.message) {
              this.message.error(error.response.data.message)
            } else {
              this.message.error('提交实验报告失败')
            }
          }
        ).finally(() => {
          this.submitText = ''
          // clear file input
          this.$refs.fileInput.value = ''
        })
      }
    },
    removeFile() {
      this.fileToSubmit = null
      this.filename = ''
      this.fileURL = null
    },
    downloadReport() {
      Lab.getReport(this.id).then(
        (response) => {
          download(response, this.filename)
        },
        (error) => {
          this.message.error('下载实验报告失败')
        }
      )
    },
    onProgressCallback(progressEvent) {
      if (progressEvent.lengthComputable) {
        this.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.speed = (progressEvent.loaded - this.loaded) / 1024 / 1024
        this.loaded = progressEvent.loaded
        this.submitText = `上传中... ${this.progress}% (${this.speed.toFixed(2)} MB/s)`
      }
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
  margin-bottom: 20px;
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