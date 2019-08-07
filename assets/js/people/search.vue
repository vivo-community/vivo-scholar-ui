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
import SearchResults from './searchResults.vue';
import axios from 'axios';

export default {
  name: 'SearchPeople',
  components: {
    SearchForm,
    //SearchResults
  },
  created () {
    // this seems to initialize page right
    // e.g. 
    // http://localhost:3000/search/people?search=Conlon
    this.search(this.$route.query.search);
  },
  watch: {
    '$route': 'search'
  },  
  data() {
    return {
      people: [],
      facets: [],
      page: {
        pageNumber: 0,
        pageSize: 100
      },
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
      //console.debug(this.$route);
      // not getting query here (for changing URL)
      console.debug(`SEARCH=${search}`);
      console.log(search);
      // can't get anything to work here even though
      // above prints correct search
      if (search != undefined) {
        console.debug(`should add ${search} to query`);
        console.debug(`route=${this.$route.query.search}`)
        //this.$router.replace({ name: "searchPeople", query: {query: search} })
        //const qry = { search: search };
		    //this.$router.replace({name: 'searchPeople', query : qry});
        //console.debug(`route=${this.$route.query.search}`)
        //this.$route.query = {...this.$route.query, query: search};
        //this.$router.push({ name: "searchPeople", query: { search: 'Conlon' }});
      }
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