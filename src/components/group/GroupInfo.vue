<template>
  <!-- <template v-if="enabled === 'disabled' && !isAdmin">
    <div class="empty-hint">暂未开启组队</div>
  </template> -->
  <template v-if="isAdmin">
    <div class="config">组队作业</div>
    <NFlex justify="space-between" align="center" class="assignment">
      <NFlex align="center">
        <input type="text" v-model="assignmentComment" placeholder="组队作业信息" />
        <NFlex justify="flex-start" align="center" :wrap="false">
          <span class="time-text">开始时间</span>
          <DatePicker ref="start" v-model="assignmentStartTime" locale="zh-CN" format="yyyy-MM-dd HH:mm:ss"
            model-type="yyyy-MM-dd HH:mm:ss">
            <template #action-buttons>
              <button class="styled" @click="selectStartTime">选择</button>
            </template>
          </DatePicker>
        </NFlex>
        <NFlex justify="flex-start" align="center" :wrap="false">
          <span class="time-text">结束时间</span>
          <DatePicker ref="end" v-model="assignmentEndTime" locale="zh-CN" format="yyyy-MM-dd HH:mm:ss"
            model-type="yyyy-MM-dd HH:mm:ss">
            <template #action-buttons>
              <button class="styled" @click="selectEndTime">选择</button>
            </template>
          </DatePicker>
        </NFlex>
        <input type="radio" id="option1" value="invisible" v-model="assignmentVisibility" />
        <label for="option1">不可见</label>
        <input type="radio" id="option2" value="visible" v-model="assignmentVisibility" />
        <label for="option2">可见</label>
      </NFlex>
      <NFlex align="center">
        <button class="styled" @click="updateGroupAssigenment">确认修改</button>
      </NFlex>
    </NFlex>
  </template>
  <template v-if="!isAdmin">
    <div v-if="id !== ''">
      <h3 v-if="!isEditingName">
        <span @click="startEditingName">{{ groupName }}</span>
        <NFlex align="center" v-if="isLocked" title="解锁团队">
          <LockIcon @click="changeLockState" />
        </NFlex>
        <NFlex align="center" v-else title="锁定团队">
          <UnlockIcon @click="changeLockState" />
        </NFlex>
      </h3>
      <div class="name-editor" v-else>
        <input class="name-input" v-model="newGroupName" />
        <button @click="isEditingName = false">取消</button>
        <button class="styled" @click="changeGroupName">修改</button>
      </div>

      <ul>
        <li v-for="member in members" :key="member.accountId">
          <div class="avatar" :style="{ 'backgroundImage': `url('${member.avatar}')` }"></div>
          <div class="member-info">
            <NFlex justify="flex-start" align="center" class="member-name">
              {{ member.name }}
              <NPopconfirm positive-text="确认" negative-text="取消" :show-icon="false" @positive-click="kickMember(member)"
                v-if="!member.owner && isLeader" :disabled="isLocked">
                <template #trigger>
                  <PersonRemoveIcon smaller :class="{ 'disabled': isLocked }" />
                </template>
                确认移除团队成员？
              </NPopconfirm>
            </NFlex>
            <div class="member-id">学号：{{ member.buaaId }}</div>
          </div>
          <div class="leader" v-if="member.owner">组长</div>
          <div class="member" v-else>组员</div>
          <NFlex align="center" class="weight">
            权重
            <NInputNumber :min="minWeight" :max="maxWeight" v-model:value="member.weight"
              style="width: 60px; height: 20px" :bordered="false" :disabled="!isLeader" @blur="updateWeight(member)"
              @focus="prevWeight = member.weight" />
          </NFlex>
        </li>
      </ul>
      <NFlex justify="flex-end" align="center">
        <span v-if="assignmentComment !== '' && assignment !== ''">已提交：<a class="download-link" @click="downloadAssignment">{{ assignment
            }}</a></span>
        <button class="styled" v-if="assignmentComment !== '' && isLeader" @click="handleSubmit">{{ submitText }}</button>
        <input type="file" accept=".zip" ref="fileInput" @input="submitAssignment" v-if="isLeader"
          style="display: none" />
        <NPopconfirm positive-text="确认" negative-text="取消" :show-icon="false" @positive-click="dismissGroup"
          v-if="isLeader">
          <template #trigger>
            <button class="danger" :disabled="isLocked">解散团队</button>
          </template>
          确认解散团队？
        </NPopconfirm>
        <NPopconfirm positive-text="确认" negative-text="取消" :show-icon="false" @positive-click="quitGroup" v-else>
          <template #trigger>
            <button class="danger" :disabled="isLocked">退出团队</button>
          </template>
          确认退出团队？
        </NPopconfirm>
      </NFlex>
    </div>
    <template v-else>
      <div class="empty-hint">
        你暂未加入团队
      </div>
      <div class="create-btn" @click="isCreatingGroup = true" v-if="!isCreatingGroup">新建团队</div>
      <NFlex justify="center" align="center" v-else>
        <input type="text" v-model="groupNameToCreate" placeholder="团队名称" />
        <button @click="isCreatingGroup = false">取消</button>
        <button class="styled" @click="createGroup">确认</button>
      </NFlex>
    </template>
  </template>
  <template v-if="!isAdmin">
    <template v-if="assignmentComment !== ''">
      <div class="config">
        组队作业&nbsp;&nbsp;&nbsp;
        <span class="assignment-time">开始时间：{{ assignmentStartTime }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束时间：{{ assignmentEndTime }}</span>
      </div>
      {{ assignmentComment }}
    </template>
  </template>
  <template v-if="isAdmin">
    <div class="config">组队配置</div>
    <NFlex justify="space-between" align="center" class="group-config">
      <NFlex align="center">
        最大成员数 <input type="number" v-model="newMaxSize" />&nbsp;&nbsp;&nbsp;
        最低权重 <input type="number" v-model="newMinWeight" />&nbsp;&nbsp;&nbsp;
        最高权重 <input type="number" v-model="newMaxWeight" />&nbsp;&nbsp;&nbsp;
        是否开启组队
        <input type="radio" id="option1" value="disabled" v-model="enabled" />
        <label for="option1">关闭</label>
        <input type="radio" id="option2" value="enabled" v-model="enabled" />
        <label for="option2">开启</label>&nbsp;&nbsp;&nbsp;
      </NFlex>
      <NFlex align="center">
        <button class="styled" @click="changeGroupConfig">修改配置</button>
        <button @click="exportGroups">导出</button>
      </NFlex>
    </NFlex>
  </template>
</template>

<script>
import PersonRemoveIcon from '../svg/PersonRemoveIcon.vue'
import LockIcon from '../svg/LockIcon.vue'
import UnlockIcon from '../svg/UnlockIcon.vue'

import Group from '../../api/Group.js'

import download from '../utils/download.js'

import { mapGetters } from 'vuex'

import { NFlex, NInputNumber, NPopconfirm, useMessage } from 'naive-ui'

import DatePicker from '@vuepic/vue-datepicker'

export default {
  name: 'GroupInfo',
  components: {
    PersonRemoveIcon,
    LockIcon,
    UnlockIcon,
    NFlex,
    NInputNumber,
    NPopconfirm,
    DatePicker
  },
  data() {
    return {
      message: useMessage(),
      id: '',
      isLocked: false,
      // isLeader: false,
      groupName: '',
      members: [],
      maxWeight: null,
      minWeight: null,
      prevWeight: null,
      isEditingName: false,
      newGroupName: '',
      assignment: '',
      enabled: 'disabled',
      newMaxSize: null,
      newMaxWeight: null,
      newMinWeight: null,
      isCreatingGroup: false,
      groupNameToCreate: '',
      // >>> submit variables
      submitting: false,
      submitText: '提交组队作业', // Stupid vue binding
      progress: 0,    // 0 ~ 100
      loaded: 0,      // bytes
      speed: 0,       // MB/s
      // <<< submit variables
      // >>> assignment variables
      assignmentComment: '',
      assignmentVisibility: 'invisible',
      assignmentStartTime: null,
      assignmentEndTime: null,
      // <<< assignment variables
    }
  },
  computed: {
    ...mapGetters(['userBuaaId', 'isAdmin']),
    isLeader() {
      for (let i = 0; i < this.members.length; i++) {
        const member = this.members[i]
        if (member.owner) {
          if (member.buaaId === this.userBuaaId) {
            return true
          }
        }
      }
      return false
    }
  },
  mounted() {
    this.getCurrentGroup()
    this.getCurrentConfig()
    this.$bus.on('update-group-info', () => {
      this.getCurrentGroup()
    })
    this.getGroupAssignment()
  },
  methods: {
    getCurrentConfig() {
      Group.getGroupConfig().then(
        (response) => {
          const config = response.data.data
          this.maxWeight = config.maxWeight
          this.newMaxWeight = this.maxWeight
          this.minWeight = config.minWeight
          this.newMinWeight = this.minWeight
          this.newMaxSize = config.maxSize
          this.enabled = config.enabled ? 'enabled' : 'disabled'
        },
        (error) => {
          this.message.error('获取团队配置信息失败')
        }
      )
    },
    getCurrentGroup() {
      Group.getCurrentGroup().then(
        (response) => {
          if (response.data.data) {
            const group = response.data.data.group
            this.id = group.id
            this.groupName = group.name
            this.newGroupName = group.name
            this.members = group.members
            this.isLocked = group.locked
            if (response.data.data.submission) {
              this.assignment = response.data.data.submission.filename
            }
          } else {
            this.id = ''
          }
        },
        (error) => {
          this.message.error('获取当前团队失败')
        }
      )
    },
    updateWeight(member) {
      if (member.weight && this.prevWeight != member.weight) {
        Group.updateWeight(member.accountId, member.weight).then(
          (response) => {
            this.message.success('更新组员权重成功')
          },
          (error) => {
            this.message.error('更新组员权重失败')
          }
        )
      }
    },
    kickMember(member) {
      Group.kickMember(member.accountId).then(
        (response) => {
          this.message.success('移除团队成员成功')
          this.getCurrentGroup()
        },
        (error) => {
          this.message.error('移除团队成员失败')
        }
      )
    },
    dismissGroup() {
      Group.dismissGroup().then(
        (response) => {
          this.message.success('解散团队成功')
          this.getCurrentGroup()
          this.$bus.emit('update-group-list')
          this.$bus.emit('change-in-group')
        },
        (error) => {
          this.message.error('解散团队失败')
        }
      )
    },
    quitGroup() {
      Group.quitGroup().then(
        (response) => {
          this.message.success('退出团队成功')
          this.getCurrentGroup()
          this.$bus.emit('update-group-list')
          this.$bus.emit('change-in-group')
        },
        (error) => {
          this.message.error('退出团队失败')
        }
      )
    },
    startEditingName() {
      if (this.isLeader) {
        this.isEditingName = true
      }
    },
    changeGroupName() {
      if (this.newGroupName !== '' && this.newGroupName !== this.groupName) {
        Group.updateGroup(this.newGroupName, this.isLocked).then(
          (response) => {
            this.message.success('更新小组名称成功')
            this.isEditingName = false
            this.getCurrentGroup()
          },
          (error) => {
            this.message.error('更新小组名称失败')
          }
        )
      }
    },
    changeLockState() {
      if (this.isLeader) {
        Group.updateGroup(this.groupName, !this.isLocked).then(
          (response) => {
            this.message.success('更新小组锁定状态成功')
            this.getCurrentGroup()
          },
          (error) => {
            this.message.error('更新小组锁定状态失败')
          }
        )
      } else {
        this.message.error('无权限修改锁定状态')
      }
    },
    handleSubmit() {
      this.$refs.fileInput.click()
    },
    submitAssignment(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.submitting = true
        this.submitText = '准备上传...'
        this.progress = 0
        this.loaded = 0
        this.speed = 0

        const file = event.target.files[0]
        let data = new FormData()
        data.append('file', file)
        Group.submitAssignment(data, this.onProgressCallback).then(
          (response) => {
            this.message.success('提交组队作业成功：' + file.name)
            this.assignment = file.name
          },
          (error) => {
            this.message.error('提交组队作业失败')
          }
        ).finally(() => {
          this.submitting = false
          this.submitText = '提交组队作业'
        })
      }
    },
    downloadAssignment() {
      Group.downloadAssignment().then(
        (response) => {
          download(response, 'assignment.zip')
        },
        (error) => {
          this.message.error('下载作业文件失败')
        }
      )
    },
    changeGroupConfig() {
      const config = {
        maxSize: this.newMaxSize,
        minWeight: this.newMinWeight,
        maxWeight: this.newMaxWeight,
        enabled: this.enabled === 'enabled' ? true : false
      }
      Group.updateGroupConfig(config).then(
        (response) => {
          this.message.success('修改组队配置成功')
        },
        (error) => {
          this.message.error('修改组队配置失败')
        }
      )
    },
    createGroup() {
      if (this.groupNameToCreate === '') {
        this.message.error('团队名称不得为空')
      } else {
        Group.createGroup(this.groupNameToCreate).then(
          (response) => {
            this.message.success('创建团队成功')
            this.getCurrentGroup()
            this.$bus.emit('update-group-list')
            this.$bus.emit('change-in-group')
          },
          (error) => {
            this.message.error('创建团队失败')
          }
        )
      }
    },
    exportGroups() {
      Group.exportGroups().then(
        (response) => {
          download(response, '组队情况.xlsx')
        },
        (error) => {
          this.message.error('导出组队情况失败')
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
    },
    selectStartTime() {
      this.$refs.start.selectDate()
    },
    selectEndTime() {
      this.$refs.end.selectDate()
    },
    getGroupAssignment() {
      Group.getGroupAssignment().then(
        (response) => {
          const assignment = response.data.data
          if (assignment) {
            this.assignmentComment = assignment.comment
            this.assignmentStartTime = assignment.startTime
            this.assignmentEndTime = assignment.endTime
            this.assignmentVisibility = assignment.visible ? 'visible' : 'invisible'
          }
        },
        (error) => {
          this.message.error('获取组队作业失败')
        }
      )
    },
    updateGroupAssigenment() {
      if (this.assignmentComment === '') {
        this.message.error('组队作业内容不得为空')
        return
      }
      const start = new Date(this.assignmentStartTime)
      const end = new Date(this.assignmentEndTime)
      if (start.getTime() >= end.getTime()) {
        this.message.error('组队作业开始时间不得晚于结束时间')
        return
      }
      Group.updateGroupAssignment(this.assignmentComment, 
                                  this.assignmentVisibility === 'invisible' ? false : true,
                                  this.assignmentStartTime, this.assignmentEndTime
      ).then(
        (response) => {
          this.message.success('修改组队作业成功')
        },
        (error) => {
          this.message.error('修改组队作业失败')
        }
      )
    }
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

h3 span {
  font-size: 30px;
  font-weight: bold;
  color: var(--default-blue);
  margin-right: 10px;
}

div.name-editor {
  margin-bottom: 10px;
}

input.name-input {
  height: 45px;
}

div.name-editor button {
  margin-left: 10px;
}

ul {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

li {
  display: flex;
  align-items: center;
  margin: 10px;
  position: relative;
  width: 330px;
  margin-right: 80px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-clip: content-box;
  background-size: cover;
}

.member-info {
  margin-left: 10px;
}

.member-name {
  font-weight: bold;
}

.member-id {
  font-size: 14px;
  color: var(--default-grey);
}

.leader,
.member {
  position: absolute;
  right: 110px;
  padding: 5px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.leader {
  background: var(--default-blue);
}

.member {
  background: var(--default-green);
}

.weight {
  position: absolute;
  right: 0;
  font-size: 14px;
  gap: 3px;
  font-weight: bold;
}

a.download-link {
  cursor: pointer;
  text-decoration: underline;
}

a.download-link:hover {
  color: var(--default-blue);
}

.disabled {
  cursor: not-allowed;
}

div.config {
  font-size: 25px;
  font-weight: bold;
  color: var(--default-blue);
  margin-bottom: 10px;
}

input[type="number"] {
  width: 100px;
  height: 30px;
}

input[type="radio"] {
  width: 15px;
  height: 15px;
}

div.create-btn {
  text-align: center;
  color: var(--default-blue);
  cursor: pointer;
}

div.create-btn:hover {
  text-decoration: underline;
}

.assignment {
  margin-bottom: 10px;
}

.assignment input[type="text"] {
  width: 400px;
}

.time-text {
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
  width: 60px;
}

.group-config {
  margin-bottom: 10px;
}

.assignment-time {
  font-size: 14px;
  font-weight: bold;
  color: var(--default-grey);
}
</style>
