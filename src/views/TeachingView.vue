<template>
  <NFlex justify="space-between" align="center" class="account-header">
    <NFlex align="center" class="filter">
      <input type="text" placeholder="学工号" v-model="filterBuaaId" />
      <input type="text" placeholder="姓名" v-model="filterName" />
      <NSelect v-model:value="filterRole" placeholder="身份" :options="selectOptions" />
      <button class="styled" @click="queryAccounts">筛选</button>
      <button @click="cancelFilter">取消</button>
    </NFlex>
    <NFlex align="center">
      <button class="styled" @click="startCreateAccount">创建账号</button>
    </NFlex>
  </NFlex>
  <NDataTable
    :columns="columns"
    :data="accounts"
    :pagination="false"
    :bordered="false"
    table-layout="fixed"
  />
  <NFlex justify="center" align="center" class="pagination">
    <NPagination v-model:page="page" :page-count="totalPages" @update:page="queryAccounts" />
  </NFlex>

  <NModal v-model:show="editAccountShouldShow" preset="card" :style="modalStyle">
    <h4 class="modal-title" v-if="isCreatingAccount">创建账号</h4>
    <h4 class="modal-title" v-else>修改账号信息</h4>
    <input class="modal-input" type="text" placeholder="学工号" v-model="newBuaaId" /><br />
    <input class="modal-input" type="text" placeholder="姓名" v-model="newName" /><br />
    <input class="modal-input" type="text" placeholder="学院" v-model="newSchool" /><br />

    <NFlex align="center" class="radio-wrapper">
      <span>性别</span>
      <NFlex align="center" class="radio">
        <input class="modal-radio" type="radio" id="option1" value="0" v-model="newGender" />
        <label for="option1">未知</label>
      </NFlex>
      <NFlex align="center" class="radio">
        <input class="modal-radio" type="radio" id="option2" value="1" v-model="newGender" />
        <label for="option2">男</label><br />
      </NFlex>
      <NFlex align="center" class="radio">
        <input class="modal-radio" type="radio" id="option3" value="2" v-model="newGender" />
        <label for="option3">女</label>
      </NFlex>
    </NFlex>
    <NFlex align="center" class="radio-wrapper">
      <span>身份</span>
      <NFlex align="center" class="radio">
        <input type="radio" id="option1" value="2" v-model="newRole" />
        <label for="option1">教师</label>
      </NFlex>
      <NFlex align="center" class="radio">
        <input type="radio" id="option2" value="1" v-model="newRole" />
        <label for="option2">助教</label><br />
      </NFlex>
      <NFlex align="center" class="radio" v-if="!isCreatingAccount">
        <input type="radio" id="option3" value="0" v-model="newRole" />
        <label for="option3">学生</label>
      </NFlex>
    </NFlex>
    
    <NFlex justify="space-between" align="center" class="modal-btn">
      <template v-if="isCreatingAccount">
        <button @click="cancelCreateAccount">取消</button>
        <button class="styled" @click="createAccount">确认</button>
      </template>
      <template v-else>
        <NPopconfirm positive-text="确认" negative-text="取消"
          :show-icon="false" @positive-click="resetPassword">
          <template #trigger>
            <button class="styled">重置密码</button>
          </template>
          确认重置密码？
        </NPopconfirm>
        <button class="styled" @click="editAccount">确认修改</button>
      </template>
    </NFlex>
  </NModal>
</template>

<script>
import SettingIcon from '../components/svg/SettingIcon.vue'
import Account from '../api/Account.js'

import { h } from 'vue'

import { NFlex, NDataTable, NPopconfirm, NPagination, NSelect, NModal, useMessage } from 'naive-ui'

export default {
  name: 'TeachingView',
  components: {
    SettingIcon,
    NFlex,
    NDataTable,
    NPopconfirm,
    NPagination,
    NSelect,
    NModal
  },
  data() {
    return {
      message: useMessage(),
      columns: [
        {
          title: '学工号',
          key: 'buaaId'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '性别',
          key: 'genderStr'
        },
        {
          title: '学院',
          key: 'school'
        },
        {
          title: '身份',
          key: 'role'
        }
      ],
      page: 1,
      pageSize: 20,
      totalItems: 0,
      accounts: [],
      filterBuaaId: '',
      filterName: '',
      filterRole: null,
      selectOptions: [
        {
          label: '教师',
          value: 2
        },
        {
          label: '助教',
          value: 1
        },
        {
          label: '学生',
          value: 0
        }
      ],
      modalStyle: {
        width: 'fit-content',
      },
      newBuaaId: '',
      newName: '',
      newSchool: '',
      newGender: '',
      newRole: '',
      editAccountShouldShow: false,
      rowEditing: null,
      isCreatingAccount: false
    }
  },
  created() {
    const func = this.startEditAccount
    this.columns.push(
      {
        title: '修改信息',
        key: 'reset',
        render(row) {
          return h(
            'button',
            {
              class: 'styled',
              onClick: () => func(row)
            },
            '修改信息'
          )
        }
      }
    )
  },
  mounted() {
    this.queryAccounts()
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    }
  },
  methods: {
    queryAccounts() {
      let query = null
      if (this.filterBuaaId.trim() !== '' || this.filterName.trim() !== '' || this.filterRole !== null) {
        query = {
          buaaId: this.filterBuaaId.trim() === '' ? null : this.filterBuaaId.trim(),
          name: this.filterName.trim() === '' ? null : this.filterName.trim(),
          role: this.filterRole
        }
      }
      Account.queryAccounts(this.page, this.pageSize, query).then(
        (response) => {
          this.accounts = response.data.data.items
          this.totalItems = response.data.data.total
          this.accounts.forEach((account) => {
            if (account.gender === 0) {
              account.genderStr = '未知'
            } else if (account.gender === 1) {
              account.genderStr = '男'
            } else if (account.gender === 2) {
              account.genderStr = '女'
            }
            if (account.teacher) {
              account.role = '教师'
            } else if (account.ta) {
              account.role = '助教'
            } else {
              account.role = '学生'
            }
          })
        },
        (error) => {
          this.message.error('获取账号列表失败')
        }
      )
    },
    startEditAccount(row) {
      this.newBuaaId = row.buaaId
      this.newName = row.name
      this.newSchool = row.school
      this.newGender = String(row.gender)
      this.newRole = row.teacher ? '2' : (row.ta ? '1' : '0')
      this.rowEditing  = row
      this.editAccountShouldShow = true
    },
    cancelFilter() {
      this.filterBuaaId = ''
      this.filterName = ''
      this.filterRole = null
      this.queryAccounts()
    },
    clearEditor() {
      this.newBuaaId = ''
      this.newName = ''
      this.newSchool = ''
      this.newGender = '0'
      this.newRole = '1'
    },
    editAccount() {
      Account.updateAccount(
        this.rowEditing.id,
        this.newBuaaId,
        this.newName,
        this.newSchool,
        parseInt(this.newGender),
        parseInt(this.newRole)
      ).then(
        (response) => {
          this.message.success('修改账号信息成功')
          this.queryAccounts()
          this.clearEditor()
          this.editAccountShouldShow = false
        },
        (error) => {
          this.message.error('修改账号信息失败')
        }
      )
    },
    resetPassword() {
      Account.resetPassword(this.rowEditing.id).then(
        (response) => {
          this.message.success('重置密码成功')
        },
        (error) => {
          this.message.error('重置密码失败')
        }
      )
    },
    startCreateAccount() {
      this.clearEditor()
      this.isCreatingAccount = true
      this.editAccountShouldShow = true
    },
    createAccount() {
      Account.createAccount(
        this.newBuaaId,
        this.newName,
        this.newSchool,
        parseInt(this.newGender),
        this.newRole === '2' ? true : false,
        this.newRole === '1' ? true : false
      ).then(
        (response) => {
          this.message.success('创建账号成功')
          this.editAccountShouldShow = false
          this.clearEditor()
          this.isCreatingAccount = false
          this.queryAccounts()
        },
        (error) => {
          this.message.error('创建账号失败')
        }
      )
    },
    cancelCreateAccount() {
      this.editAccountShouldShow = false
      this.clearEditor()
      this.isCreatingAccount = false
    }
  }
}
</script>

<style scoped>
.account-header {
  margin-bottom: 20px;
}

.filter input {
  width: 120px;
}

.pagination {
  margin-top: 20px;
  padding-bottom: 20px;
}

input[type="radio"] {
  height: 15px;
  width: 15px;
}

.radio-wrapper, input.modal-input:not(input[type="radio"]) {
  margin: 10px 60px;
}

.radio-wrapper>span {
  font-weight: bold;
}

.radio {
  gap: 3px !important;
  margin-right: 5px;
}


.modal-btn {
  margin: 20px auto;
  width: 60%;
}

h4.modal-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 60px;
}
</style>