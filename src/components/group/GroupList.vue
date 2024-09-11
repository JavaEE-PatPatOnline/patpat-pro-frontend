<template>
  <NFlex justify="space-between" align="center">
    <NFlex align="center" class="list-title">团队列表</NFlex>
    <NFlex align="center">
      <button class="styled" @click="exportAssignments" v-if="isAdmin">
        {{ exportText }}
      </button>
    </NFlex>
  </NFlex>
  <ul v-if="groups.length > 0">
    <li v-for="group in groups" :key="group.id">
      <div class="left-info">
        <div class="name">
          <NEllipsis style="max-width: 240px">
            {{ group.name }}
          </NEllipsis>
          ({{ group.memberCount }}/{{ group.maxSize }})
        </div>
        <div class="members">
          <span v-for="member in group.members" :key="member.accountId">
            {{ member.name }} ({{ member.buaaId }})
            <span v-if="isAdmin">(权重：{{ member.weight }})</span>
          </span>
        </div>
      </div>
      <NFlex justify="center">
        <NPopconfirm positive-text="确认" negative-text="取消" :show-icon="false" @positive-click="joinGroup(group.id)">
          <template #trigger>
            <PersonAddIcon small v-show="!isAdmin && !inGroup" />
          </template>
          确认加入该团队？
        </NPopconfirm>
        <template v-if="isAdmin">
          <NFlex align="center" v-if="group.score !== -2">
            <NFlex align="center" title="下载提交">
              <DownloadIcon @click="downloadProject(group)" />
            </NFlex>
            <input type="number" v-model="group.realScore" placeholder="未评分" />
            <button class="styled" @click="scoreAssignment(group)">评分</button>
          </NFlex>
          <NFlex align="center" v-else>
            暂未提交大作业
          </NFlex>
        </template>
      </NFlex>
    </li>
  </ul>
  <div v-else class="empty-hint">
    暂无团队
  </div>
  <div v-if="isAdmin" class="rogue">
    <h3>未组队学生</h3>
    <NDataTable :columns="columns" :data="rogueStudents" :pagination="false" :bordered="false" table-layout="fixed"
      v-if="rogueStudents.length > 0" />
    <div class="empty-hint" v-else>无未组队学生</div>
  </div>
</template>

<script>
import PersonAddIcon from '../svg/PersonAddIcon.vue'
import DownloadIcon from '../svg/DownloadIcon.vue'

import Group from '../../api/Group.js'
import Grade from '../../api/Grade.js'
import Account from '../../api/Account.js'

import download from '../utils/download.js'

import { mapGetters } from 'vuex'

import { NFlex, NEllipsis, NPopconfirm, NDataTable, useMessage } from 'naive-ui'

export default {
  name: 'GroupList',
  components: {
    PersonAddIcon,
    DownloadIcon,
    NFlex,
    NEllipsis,
    NPopconfirm,
    NDataTable
  },
  data() {
    return {
      message: useMessage(),
      groups: [],
      inGroup: false,
      enabled: false,
      groupScores: [],
      rogueStudents: [],
      // >>> download variables
      exporting: false,
      exportText: '导出大作业', // Stupid vue binding
      progress: 0,    // 0 ~ 100
      loaded: 0,      // bytes
      speed: 0,       // MB/s
      // <<< download variables
      columns: [
        {
          title: '学号',
          key: 'buaaId'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '教师',
          key: 'teacherName'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isAdmin'])
  },
  watch: {
    isAdmin(newValue) {
      if (newValue) {
        this.getAllGroups()
      }
    }
  },
  mounted() {
    Group.getGroupConfig().then(
      (response) => {
        this.enabled = response.data.data.enabled
      },
      (error) => {
        this.message.error('获取团队配置信息失败')
      }
    )
    this.getAllGroups()
    Group.getCurrentGroup().then(
      (response) => {
        if (response.data.data) {
          this.inGroup = true
        }

      },
      (error) => {
        this.message.error('获取团队信息失败')
      }
    )
    this.$bus.on('update-group-list', () => {
      this.getAllGroups()
    })
    this.$bus.on('change-in-group', () => {
      this.inGroup = false
    })
  },
  methods: {
    getAllGroups() {
      Group.getAllGroups().then(
        (response) => {
          this.groups = response.data.data
          this.getGroupScores()
        },
        (error) => {
          this.message.error('获取团队列表失败')
        }
      )
      if (this.isAdmin) {
        Account.getAllTeachers().then(
          (response) => {
            let teachers = response.data.data
            Group.getRogueStudents().then(
              (response) => {
                this.rogueStudents = response.data.data
                this.rogueStudents.forEach((student) => {
                  teachers.forEach((teacher) => {
                    if (teacher.id === student.teacherId) {
                      student.teacherName = teacher.name
                    }
                  })
                })
              },
              (error) => {
                this.message.error('获取未组队学生失败')
              }
            )
          },
          (error) => {
            this.message.error('获取教师列表失败')
          }
        )

      }
    },
    joinGroup(id) {
      Group.joinGroup(id).then(
        (response) => {
          this.message.success('加入团队成功')
          this.$bus.emit('update-group-info')
        },
        (error) => {
          this.message.error(error.response.data.message)
        }
      )
    },
    getGroupScores() {
      if (this.isAdmin) {
        Grade.getGroupScores().then(
          (response) => {
            this.groupScores = response.data.data
            this.groups.forEach((group) => {
              let score_ = null
              this.groupScores.forEach((score) => {
                if (score.groupId === group.id) {
                  score_ = score.score
                }
              })
              group.score = score_ === null ? -2 : score_
              group.realScore = group.score >= 0 ? group.score : null
            })
          },
          (error) => {
            this.message.error('获取大作业提交情况失败')
          }
        )
      }
    },
    downloadProject(group) {
      Grade.downloadGroupAssignment(group.id).then(
        (response) => {
          download(response, group.name + '.zip')
        },
        (error) => {
          this.message.error('下载小组作业失败')
        }
      )
    },
    scoreAssignment(group) {
      Grade.scoreGroup(group.id, group.realScore).then(
        (response) => {
          this.message.success('打分成功')
          this.getAllGroups()
        },
        (error) => {
          this.message.error('打分失败')
        }
      )
    },
    exportAssignments() {
      if (this.exporting) {
        this.message.error('正在导出中，请稍后再试')
        return
      }
      this.exporting = true
      this.exportText = '打包中...'
      this.progress = -1
      this.loaded = 0
      this.speed = 0
      Grade.getAllAssignments(this.onProgressCallback).then(
        (response) => {
          download(response, '大作业汇总.zip')
        },
        (error) => {
          this.message.error('导出大作业失败')
        }
      ).finally(() => {
        this.exporting = false
        this.exportText = '导出大作业'
      })
    },
    onProgressCallback(progressEvent) {
      if (progressEvent.lengthComputable) {
        this.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.speed = (progressEvent.loaded - this.loaded) / 1024 / 1024
        this.loaded = progressEvent.loaded
        this.exportText = `导出中... ${this.progress}% (${this.speed.toFixed(2)} MB/s)`
      }
    }
  }
}
</script>

<style scoped>
div.list-title {
  margin-top: 10px;
  font-size: 25px;
  font-weight: bold;
  color: var(--default-blue);
}

/* ul {
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
} */

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 0 3px var(--shadow-color);
  box-sizing: border-box;
  margin: 10px 0;
  /* margin-right: 40px; */
  padding: 20px;
  /* width: 320px; */
}

li:last-child {
  border: 0;
}

.left-info {
  margin-right: 20px;
}

.name,
.name * {
  font-size: 18px;
  font-weight: bold;
  color: var(--default-blue);
}

.members span {
  font-size: 14px;
  color: var(--default-grey);
  margin-right: 10px;
  /* margin-bottom: 10px; */
}

.members span:first-child {
  font-weight: bold;
}

input[type="number"] {
  width: 120px;
}

.rogue {
  margin-top: 20px;
}

.rogue h3 {
  font-size: 25px;
  font-weight: bold;
  color: var(--default-blue);
  margin-bottom: 10px;
}
</style>