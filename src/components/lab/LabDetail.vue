<template>
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
import { NFlex, NPopconfirm } from 'naive-ui'

export default {
  name: 'LabDetail',
  props: {
    id: {
      type: String,
      default: '1'
    },
    title: {
      type: String,
      default: '这是 Lab 标题｜Lab01：面向对象程序设计'
    },
    content: {
      type: String,
      default: '# 测试一下 lab 详情\n### 三级标题\n各种格式： **加粗** 、 *斜体* 、 ~~删除线~~ 。\n- 列表1\n- 列表2\n- 列表3\n1. 数字1\n2. 数字2\n3. 数字3\n4. 数字4\n'
    },
    startTime: {
      type: String,
      default: '2024.07.30 15:49:23'
    },
    ddlTime: {
      type: String,
      default: '2024.07.30 15:49:24'
    },
    endTime: {
      type: String,
      default: '2024.07.30 15:49:25'
    }
  },
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
      fileURL: ''
    }
  },
  methods: {
    startEditingLab() {
      this.$router.push('/lab/' + this.id + '/edit')
    },
    deleteLab() {
      // todo
    },
    selectFile() {
      this.$refs.fileInput.click()
    },
    handleFileChange(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.fileToSubmit = event.target.files[0]
        this.filename = this.fileToSubmit.name
        this.fileURL = URL.createObjectURL(this.fileToSubmit)
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