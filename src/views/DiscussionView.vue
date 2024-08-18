<template>
  <DiscussionList :discussions="discussions" />
</template>

<script>
import DiscussionList from '../components/discussion/DiscussionList.vue'
import Discussion from '../api/Discussion.js'
export default {
  name: 'DiscussionView',
  components: {
    DiscussionList
  },
  data() {
    return {
      discussions: [
        {
          id: '1',
          title: '关于封装思想的再探讨如果标题就是非常非常非常非常非常非常非常非常非常长怎么办',
          type: 2,
          userAvatar: 'http://8.130.103.241/public/boy.svg',
          username: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: true,
          likeCount: 10,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27'
        },
        {
          id: '4',
          title: '关于封装思想的再探讨',
          type: 1,
          userAvatar: 'http://8.130.103.241/public/boy.svg',
          username: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: false,
          isStarred: true,
          likeCount: 10,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27'
        },
        {
          id: '2',
          title: '关于封装思想的再探讨',
          type: 3,
          userAvatar: 'http://8.130.103.241/public/boy.svg',
          username: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: true,
          isStarred: false,
          likeCount: 0,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27'
        },
        {
          id: '3',
          title: '关于封装思想的再探讨',
          type: 4,
          userAvatar: 'http://8.130.103.241/public/boy.svg',
          username: '柳政尧',
          content: '封装是面向对象编程（OOP）的三大基本特征之一，它指的是将数据（属性）和操作这些数据的方法组合在一起的过程。封装有助于隐藏内部的实现细节，只暴露出一个可以被外界访问的接口。',
          isTopped: false,
          isStarred: false,
          likeCount: 10,
          createdAt: '2024.07.31 12:09:26',
          updatedAt: '2024.07.31 12:09:27'
        },
      ]
    }
  },
  mounted() {
    Discussion.getDiscussionList().then(
      (response) => {
        this.discussions = response.data.data.items
      },
      (error) => {
        console.log('获取讨论组失败:' + error)
      }
    )
  }
}
</script>