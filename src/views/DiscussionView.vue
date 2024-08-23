<template>
  <DiscussionList :discussions="currentDiscussions" />
  <NFlex justify="center" class="pagination">
    <NPagination v-model:page="page" :page-count="total"/>
  </NFlex>
</template>

<script>
import DiscussionList from '../components/discussion/DiscussionList.vue'
import { NFlex, NPagination } from 'naive-ui'


export default {
  name: 'DiscussionView',
  components: {
    DiscussionList,
    NFlex,
    NPagination
  },
  data() {
    return {
      discussions: [
        {
          id: '1',
          title: '关于封装思想的再探讨如果标题就是非常非常非常非常非常非常非常非常非常长怎么办',
          type: 2,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: true,
          likeCount: 10,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: true
        },
        {
          id: '4',
          title: '关于封装思想的再探讨',
          type: 1,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: false,
          isStarred: true,
          likeCount: 10,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: false
        },
        {
          id: '2',
          title: '关于封装思想的再探讨',
          type: 3,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: false,
          likeCount: 0,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: false
        },
        {
          id: '3',
          title: '关于封装思想的再探讨',
          type: 4,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: false,
          isStarred: false,
          likeCount: 10,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: true
        },
        {
          id: '10',
          title: '关于封装思想的再探讨',
          type: 5,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: true,
          likeCount: 5,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: true
        },
        {
          id: '11',
          title: '关于封装思想的再探讨',
          type: 5,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: true,
          likeCount: 5,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: true
        },
        {
          id: '12',
          title: '关于封装思想的再探讨',
          type: 5,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: true,
          likeCount: 5,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: true
        },
        {
          id: '13',
          title: '关于封装思想的再探讨',
          type: 5,
          authorAvatar: 'http://8.130.103.241/public/boy.svg',
          authorName: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: true,
          likeCount: 5,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27',
          isLiked: true
        }
      ],
      page: 1,
      total: 1,
      pageSize: 6 // 确定的值
    }
  },
  mounted() {
    // 此处计算总页数
    this.total = Math.ceil(this.discussions.length / this.pageSize)
  },
  computed: {
    currentDiscussions() {
      // 这是一次请求了全部讨论帖的写法
      // 实际上应该通过调用接口获取对应的页
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.discussions.slice(startIndex, endIndex);
    },
  }
}
</script>

<style scoped>
.pagination {
  padding: 20px 0;
}
</style>