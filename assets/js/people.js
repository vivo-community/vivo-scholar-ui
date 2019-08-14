import Vue from "vue";
import VueRouter from "router";
Vue.use(VueRouter);

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import SearchPeople from "./people/search.vue";
import qs from "qs";

// not sure about routes at the moment
const routes = [
  {
    path: "/search/people", 
    component: SearchPeople, 
    name: "searchPeople"
  }
];

//https://stackoverflow.com/questions/51901983/vue-router-query-parameter-as-array-with-keys
const router = new VueRouter({
    mode: "history",
    routes,
    parseQuery: (query) => {
      return qs.parse(query);
    },
    stringifyQuery(query) {
      let result = qs.stringify(query, {encode: false});
      return result ? ('?' + result) : '';
    }
});

const searchApp = new Vue({
  router,
  render: (h) => h(SearchPeople)
}).$mount("#search");
