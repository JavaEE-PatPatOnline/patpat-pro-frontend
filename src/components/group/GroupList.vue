<template>
  <div class="list-title" v-if="groups.length > 0">团队列表</div>
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
      </NFlex>
    </li>
  </ul>
  <div v-else class="empty-hint">
    暂无团队
  </div>
</template>

<script>
import PersonAddIcon from '../svg/PersonAddIcon.vue'

import Group from '../../api/Group.js'

import { mapGetters } from 'vuex'

import { NFlex, NEllipsis, NPopconfirm, useMessage } from 'naive-ui'

export default {
  name: 'GroupList',
  components: {
    PersonAddIcon,
    NFlex,
    NEllipsis,
    NPopconfirm
  },
  data() {
    return {
      message: useMessage(),
      groups: [],
      inGroup: false
    }
  },
  computed: {
    ...mapGetters(['isAdmin'])
  },
  mounted() {
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
          console.log(this.groups)
        },
        (error) => {
          this.message.error('获取团队列表失败')
        }
      )
    },
    joinGroup(id) {
      Group.joinGroup(id).then(
        (response) => {
          this.message.success('加入团队成功')
          this.$bus.emit('update-group-info')
        },
        (error) => {
          this.message.error('加入团队失败')
        }
      )
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
</style>