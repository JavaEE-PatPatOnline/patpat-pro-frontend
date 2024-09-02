
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import mitt from 'mitt'
import VueCookies from 'vue-cookies'

const app = createApp(App)

app.config.globalProperties.$bus = new mitt()
app.config.globalProperties.$cookies = VueCookies
app.use(mavonEditor)


// function handler(err, vm, info) {
//   // 检查是否是401错误
//   console.error('err', err)
//   // if (err.response && err.response.data.status === 401) {
//   //   router.replace('/login')
//   // }
// }

// app.config.errorHandler = handler

app.use(router)
app.use(store)

app.mount('#app')
