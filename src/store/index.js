import { createStore } from 'vuex'

const store = createStore({
  state: {
    isAdmin: true,
    userAvatar: '',
    userBuaaId: ''
  },
  getters: {
    isAdmin: (state) => state.isAdmin,
    userAvatar: (state) => state.userAvatar,
    userBuaaId: (state) => state.userBuaaId
  },
  mutations: {
    setIsAdmin(state, newValue) {
      state.isAdmin = newValue
    },
    setUserAvatar(state, avatar) {
      state.userAvatar = avatar
    },
    setUserBuaaId(state, id) {
      state.userBuaaId = id
    } 
  }
})

export default store
