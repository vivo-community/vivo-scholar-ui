<template>
  <div id="search-form">
    <SearchForm v-on:search="search"
      v-if="people.length > 0"
      v-bind:people="people"
      v-bind:facets="facets"
      v-bind:page="page"
    />

  </div>
</template>

<script>
import SearchForm from './searchForm.vue';
import axios from 'axios';
import qs from 'qs';

//https://stackoverflow.com/questions/50692081/vue-js-router-query-array

export default {
  name: 'SearchPeople',
  components: {
    SearchForm
  },
  created () {
    this.search(this.$route.query);
  },
  watch: {
    '$route' (to, from) {
      this.search(to.query);
    }
  },
  data() {
    return {
      people: [],
      facets: [],
      page: {
        number: 0,
        size: 100,
        totalElements: 0,
        totalPages: 0
      },
      api: {
        baseUrl: '/search_api/people'
      }
    };
  },
  methods: {
    search(query) {
      console.log(query)
      const { baseUrl } = this.api;
      // paging api is 0 based
      let {pageNumber, ...newQuery } = query
      pageNumber = pageNumber ? pageNumber - 1 : 0
      newQuery['pageNumber'] = pageNumber
      // NOTE: kind of redundant, since we override
      // router with same function
      const result = qs.stringify(newQuery, {encode: false});
      const queryString = result ? ('?' + result) : '';
      const apiUrl = `${baseUrl}${queryString}`;  
      this.getData(apiUrl);
    },
    getData(apiUrl) {
      axios
        .get(apiUrl, {
          headers: {
            // need so we can parse form data
            Accept: 'application/html'
          }
        }).then(res => {
          this.people = res.data.personsFacetedSearch.content;
          this.facets = res.data.personsFacetedSearch.facets;
          this.page = res.data.personsFacetedSearch.page;
        })
        .catch(error => console.log(error));
    }
  }
};
</script>