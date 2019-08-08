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

//search=Conlon&filters[keywords]=Informatics&filters[keywords]=biostatistics
//https://stackoverflow.com/questions/50692081/vue-js-router-query-array

/*
submitForm () {
  this.$router.push({
    name: 'AuctionResult',
    query: {
      'models[]': this.selectedModels.map(e => e.value)
      models: this.selectedModels.map(e => e.value)
    }
  })
},
*/

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
    //this.search(this.$route.query.search);
    // might need to read filters from url too
    // page number etc...
    const qry = this.$route.query.search;
    const pageNumber = this.$route.query.pageNumber || 1;

    const filters = this.$route.query.filter; // as array?
    this.search(qry, pageNumber);
  },
  watch: {
    '$route' (to, from) {
      const qry = to.query.search;
      const page = to.query.pageNumber;
      this.search(qry, page);
    }
  },
  data() {
    return {
      people: [],
      facets: [],
      //filters: [],
      page: {
        number: 0,
        size: 100,
        totalElements: 0,
        totalPages: 0
      },
      api: {
        baseUrl: '/search_api/people',
        //search: '',
      }
    };
  },
  methods: {
    search(query, pageNumber) {
      console.log(`getting query: ${query}`)
      console.log(`getting page:${pageNumber}`)
      console.debug(query)
      console.debug(pageNumber)
      const { baseUrl } = this.api;
      // paging in api is 0 based
      const apiUrl = `${baseUrl}?search=${query}&pageNumber=${pageNumber-1}`;  
      //const apiUrl = `${baseUrl}?search=${query}`;  
      this.getData(apiUrl);
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