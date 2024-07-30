<template>
  <mavon-editor
    codeStyle="atom-one-dark"
    ref="md"
    :toolbars-flag="false"
    :navigation="false"
    :editable="false"
    :subfield="false"
    :scroll-style="true"
    box-shadow-style="2"
    default-open="preview"
    style="min-height: 0"
    v-model="value"
  />
</template>

<script>
export default {
  name: 'MarkdownDisplayer',
  props: {
    content: {
      required: true
    }
  },
  data() {
    return {
      value: this.content,
    }
  },
  watch: {
    value: function (updated) {
      this.value = updated
    },
    value: function (old, updated) {
      if (old !== updated) {
        this.$emit('input', this.value)
      }
    }
  }
}
</script>