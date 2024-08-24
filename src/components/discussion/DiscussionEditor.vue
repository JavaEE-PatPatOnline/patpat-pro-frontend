<template>
    <NFlex justify='space-between' align='center' class='editor-top'>
        <input type='text' placeholder='讨论标题' v-model='title' />
        <select class='select-type' v-model='discussionType'>
            <option value='' disabled selected hidden>讨论帖类型</option>
            <option value='1'>问题求助</option>
            <option value='2'>交流分享</option>
            <option value='3'>学习打卡</option>
        </select>
        <NFlex justify='flex-end' align='center'>
            <button @click='goBack'>取消</button>
            <button class='styled' @click='publishDiscussion'>发布</button>
        </NFlex>
    </NFlex>
    <MarkdownEditor v-model:value='content' />
</template>

<script>
import MarkdownEditor from '../markdown/MarkdownEditor.vue'
import { NFlex } from 'naive-ui'
import Discussion from '../../api/Discussion.js'

export default {
    name: 'DiscussionEditor',
    components: {
        MarkdownEditor,
        NFlex
    },
    data() {
        return {
            title: '',
            content: '',
            discussionType: ''
        }
    },
    methods: {
        goBack() {
            this.$bus.emit('endDiscussionEditing')
        },
        publishDiscussion() {
            if (this.title === '') {
                alert('讨论标题不得为空')
                return
            }
            if (this.content === '') {
                alert('讨论内容不得为空')
                return
            }
            if (this.discussionType === '') {
                alert('请选择讨论帖类型')
                return
            }

            Discussion.createDiscussion(this.title, this.content, this.discussionType).then(
                (response) => {
                    this.$bus.emit('message', { title: '发布讨论成功', ok: true })
                    this.title = ''
                    this.content = ''
                    this.discussionType = ''
                    this.goBack()
                },
                (error) => {
                    this.$bus.emit('message', { title: '发布讨论失败', ok: false })
                    console.error(error)
                }
            )
        }
    }
}
</script>

<style scoped>
.editor-top {
    margin-bottom: 20px;
}

.select-type {
    margin-left: 10px;
    padding: 5px;
}
</style>