<template>
  <GroupInfo />
  <GroupList />
</template>

<script>
import GroupInfo from '../components/group/GroupInfo.vue'
import GroupList from '../components/group/GroupList.vue'

export default {
  name: 'GroupView',
  components: {
    GroupInfo,
    GroupList
  }
}
</script>
