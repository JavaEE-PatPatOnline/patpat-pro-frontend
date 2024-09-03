<template>
    <NFlex justify='space-between' align='center' class='editor-top'>
        <input type='text' placeholder='讨论标题' v-model='title' />
        <NFlex align="center">
            讨论帖类型：<NSelect v-model:value="discussionType" :options="selectOptions" />
        </NFlex>
        <!-- <select class='select-type' v-model='discussionType'>
            <option value='' disabled selected hidden>讨论帖类型</option>
            <option value='1'>问题求助</option>
            <option value='2'>交流分享</option>
            <option value='3'>学习打卡</option>
        </select> -->
        <NFlex justify='flex-end' align='center'>
            <button @click='goBack'>取消</button>
            <button class='styled' @click='publishDiscussion'>发布</button>
        </NFlex>
    </NFlex>
    <MarkdownEditor v-model:value='content' />
</template>

<script>
import MarkdownEditor from '../markdown/MarkdownEditor.vue'
import { NFlex, NSelect, useMessage } from 'naive-ui'
import Discussion from '../../api/Discussion.js'

export default {
    name: 'DiscussionEditor',
    components: {
        MarkdownEditor,
        NFlex,
        NSelect
    },
    data() {
        return {
            message: useMessage(),
            title: '',
            content: '',
            discussionType: '',
            selectOptions: [
                {
                    label: '问题求助',
                    value: '1'
                },
                {
                    label: '交流分享',
                    value: '2',
                },
                {
                    label: '学习打卡',
                    value: '3'
                },
                {
                    label: '课程反馈',
                    value: '4'
                },
                {
                    label: '其他方面',
                    value: '5'
                }
            ]
        }
    },
    methods: {
        goBack() {
            this.$bus.emit('endDiscussionEditing')
        },
        publishDiscussion() {
            if (this.title === '') {
                this.message.error('讨论标题不得为空')
                return
            }
            if (this.content === '') {
                this.message.error('讨论内容不得为空')
                return
            }
            if (this.discussionType === '') {
                this.message.error('未选择讨论帖类型')
                return
            }
            Discussion.createDiscussion(this.title, this.content, this.discussionType).then(
                (response) => {
                    const id = response.data.data.id
                    this.title = ''
                    this.content = ''
                    this.discussionType = ''
                    this.message.success('讨论发布成功')
                    this.$router.push(`/discussion/${id}`)
                },
                (error) => {
                    this.message.error('发布讨论失败')
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
    background: transparent;
    margin-left: 10px;
    padding: 5px;
}
</style>