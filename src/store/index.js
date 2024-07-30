import { createStore } from 'vuex'

const store = createStore({
  state: {
    isAdmin: true,
  },
  getters: {
    isAdmin: (state) => state.isAdmin,
  },
  mutations: {
    setIsAdmin(state, newValue) {
      state.isAdmin = newValue
    }
  }
})

export default store
