<template>
  <LabEditor v-if="$route.path.includes('create') || $route.path.includes('edit')" />
  <LabDetail v-else />
</template>

<script>
import LabDetail from '../components/lab/LabDetail.vue'
import LabEditor from '../components/lab/LabEditor.vue'

export default {
  name: 'LabView',
  components: {
    LabDetail,
    LabEditor
  }
}
</script>
