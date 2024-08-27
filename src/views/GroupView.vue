<template>
  <GroupInfo />
  <GroupList />
</template>

<script>
import GroupAdmin from '../components/group/GroupAdmin.vue'
import GroupInfo from '../components/group/GroupInfo.vue'
import GroupList from '../components/group/GroupList.vue'

export default {
  name: 'GroupView',
  components: {
    GroupAdmin,
    GroupInfo,
    GroupList
  }
}
</script>
