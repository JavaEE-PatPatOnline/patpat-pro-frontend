
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import mitt from 'mitt'

const app = createApp(App)

app.config.globalProperties.$bus = new mitt()
app.use(mavonEditor)
app.use(router)
app.use(store)

app.mount('#app')
