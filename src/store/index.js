import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		router: [],
		userInof:{}
	},
	mutations: {
		initRoutes(state, data) {
			state.routes = data
		},
		initUserInfo(state,data){
			state.userInof = data;
		}
	},
	actions: {},
	modules: {},
})
