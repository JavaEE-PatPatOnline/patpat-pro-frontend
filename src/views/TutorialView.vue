<template>
  <!-- 如果是助教，只需要操作文件列表 -->
  <template v-if="isAdmin">
    <button class="styled full-btn" @click="uploadShouldShow = true">+</button>
    <NFlex v-if="uploadShouldShow">
      <input type="file" @input="getFile" />
      <input type="text" v-model="comment" placeholder="备注" />
      <button @click="cancelUpload">取消</button>
      <button @click="uploadMaterial" class="styled">上传</button>
    </NFlex>
    <ul>
      <li v-for="material in materials" :key="material.id">
        <NFlex justify="space-between" align="center" :wrap="false">
          <div>
            <span class="filename" @click="jumpToDetail(material.url)">{{ material.filename }}</span>
            <span class="comment">{{ material.comment }}</span>
            <div class="url">{{ material.url }}</div>
          </div>
          <NPopconfirm positive-text="确认" negative-text="取消"
            :show-icon="false" @positive-click="deleteMaterial(material.id)">
            <template #trigger>
              <DeleteIcon />
            </template>
            确认删除该资料？
          </NPopconfirm>
        </NFlex>
        
      </li>
    </ul>
  </template>
  <!-- 如果是学生，就查看博客 -->
  <iframe v-else src="http://8.130.103.241/tutorial/" width="100%" height="100%" style="border: 0"></iframe>

</template>

<script>
import DeleteIcon from '../components/svg/DeleteIcon.vue'
import Material from '../api/Material.js'

import { mapState } from 'vuex'

import { NFlex, NPopconfirm, useMessage } from 'naive-ui'

export default {
  name: 'TutorialView',
  components: {
    DeleteIcon,
    NFlex,
    NPopconfirm
  },
  data() {
    return {
      message: useMessage(),
      materials: [],
      uploadShouldShow: false,
      fileToUpload: null,
      comment: ''
    }
  },
  computed: {
    ...mapState(['isAdmin'])
  },
  mounted() {
    this.getAllMaterials()
  },
  methods: {
    getAllMaterials() {
      Material.getAllMaterials().then(
        (response) => {
          this.materials = response.data.data
        },
        (error) => {
          this.message.error('获取课程资料列表失败')
        }
      )
    },
    uploadMaterial() {
      let flag = false
      let i = 0
      for (i = 0; i < this.materials.length; i++) {
        if (this.materials[i].filename === this.fileToUpload.name) {
          flag = true
          break
        }
      }
      if (flag) {
        // 应该调用 update
        Material.updateMaterial(this.materials[i].id, this.fileToUpload, this.comment).then(
          (response) => {
            this.message.success('成功上传：', this.fileToUpload.name)
            this.getAllMaterials()
            this.fileToUpload = null
            this.comment = ''
            this.uploadShouldShow = false
          },
          (error) => {
            this.message.error('上传课程资料失败')
          }
        )
      } else {
        // 常规 upload
        Material.uploadMaterial(this.fileToUpload, this.comment).then(
          (response) => {
            this.message.success('成功上传：' + this.fileToUpload.name)
            this.getAllMaterials()
            this.fileToUpload = null
            this.comment = ''
            this.uploadShouldShow = false
          },
          (error) => {
            this.message.error('上传课程资料失败')
          }
        )
      }
    },
    deleteMaterial(id) {
      Material.deleteMaterial(id).then(
        (response) => {
          this.message.success('删除课程资料成功')
          this.getAllMaterials()
        },
        (error) => {
          this.message.error('删除课程资料失败')
        }
      )
    },
    getFile(event) {
      this.fileToUpload = event.target.files[0]
    },
    cancelUpload() {
      this.fileToUpload = null
      this.comment = ''
      this.uploadShouldShow = false
    },
    jumpToDetail(url) {
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
</script>

<style scoped>
.full-btn {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  font-size: 20px;
}

li {
  padding: 10px 0;
  border-bottom: 1px solid var(--default-grey-transparent);
}

li:last-child {
  border: 0;
}

.full-btn:hover {
  transform: scale(1);
}

span.filename {
  font-size: 18px;
  font-weight: bold;
  color: var(--default-blue);
  cursor: pointer;
}

span.filename:hover {
  text-decoration: underline;
}

span.comment {
  margin-left: 10px;
  font-size: 14px;
}

div.url {
  font-size: 12px;
  color: var(--default-grey);
}
</style>
