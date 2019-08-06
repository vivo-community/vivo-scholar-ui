import Vue from "vue";
import VueRouter from "router";
Vue.use(VueRouter);

import SearchPeople from "./people/search.vue";

// not sure about routes at the moment
const routes = [
  {
    path: "/search/people", 
    component: SearchPeople, 
    name: "searchPeople"
  }//,
  //{ path: '*', component: NotFoundComponent }
];

const router = new VueRouter({
    mode: "history",
    routes
});

// https://forum.vuejs.org/t/vue-js-router-how-to-change-or-update-url-query-on-click-event/22915
//
// not sure how to initialize with data already
// how to get url to change (in browser)
// ???
// router.push({ name: 'user', params: { userId }})
//a(@click.prevent="updateNav(item.key)") {{item.title}}
/*
updateNav(query) {
		var data = Object.assign({}, this.$route.query);
		data['scrollto'] = query;
		this.$router.push({name: 'home', query : data });
    ...
}
*/
const searchApp = new Vue({
  router,
  render: (h) => h(SearchPeople)
}).$mount("#search");
