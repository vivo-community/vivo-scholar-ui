<template>
  <div id="search-form">
    <SearchForm v-on:search="search"/>
    <SearchResults
      v-if="people.length > 0"
      v-bind:people="people"
      v-bind:facets="facets"
      v-bind:page="page"
    />
  </div>
</template>

<script>
import SearchForm from './searchForm.vue';
import SearchResults from './searchResults.vue';
import axios from 'axios';

export default {
  name: 'SearchPeople',
  components: {
    SearchForm,
    SearchResults
  },
  created () {
    this.search({})
  },
  watch: {
    '$route': 'search'
  },  
  data() {
    return {
      people: [],
      facets: [],
      page: {},
      api: {
        baseUrl: '/search_api/people?',
        search: '',
      }
    };
  },
  methods: {
    search(query) {
      this.api.search = query;
      const { baseUrl, search } = this.api;
      const apiUrl = `${baseUrl}search=${search}`;  
      this.getData(apiUrl);

      console.debug(this.$route);
      // not getting query here (for changing URL)
		  //this.$router.push({name: 'searchPeople', query : this.$route.query });
    },
    getData(apiUrl) {
      axios
        .get(apiUrl)
        .then(res => {
          this.people = res.data.personsFacetedSearch.content;
          this.facets = res.data.personsFacetedSearch.facets;
          this.page = res.data.personsFacetedSearch.page;
        })
        .catch(error => console.log(error));
    }
  }
};
</script>