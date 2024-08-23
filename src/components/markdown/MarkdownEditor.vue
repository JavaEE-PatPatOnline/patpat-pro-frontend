<template>
  <mavon-editor 
    codeStyle="atom-one-dark" 
    @imgAdd="imageAdd" 
    ref="editor" 
    v-model="content" 
    :toolbars="toolbars"
  />
</template>

<script>
export default {
  name: 'MarkdownEditor',
  props: ['value'],
  emits: ['update:value'],
  data () {
    return {
      content: this.value,
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        imagelink: true,
        code: true,
        table: true,
        undo: true,
        redo: true,
        trash: true,
        save: false,
        alignleft: true,
        aligncenter: true,
        alignright: true,
      }
    }
  },
  watch: {
    value(updated) {
      this.content = updated
    },
    content(updated) {
      this.$emit('update:value', updated)
    }
  },
  methods: {
    async imageAdd(pos, file) {
      let formData = new FormData()
      formData.append('files', file)
      // Moment.addImage(formData).then(
      //   (response) => {
          this.$refs.editor.$img2Url(pos, response.data.files[0])
        // },
        // (error) => {
          // console.log(error.message)
        // }
      // )
    },
  }
}
</script>

<style scoped></style>
