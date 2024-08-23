<template>
  <IterEditor v-if="$route.path.includes('create') || $route.path.includes('edit')" />
  <IterDetail v-else />
</template>

<script>
import IterEditor from '../components/iter/IterEditor.vue'
import IterDetail from '../components/iter/IterDetail.vue'

export default {
  name: 'IterView',
  components: {
    IterEditor,
    IterDetail
  }
}
</script>
