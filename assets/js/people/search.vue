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
page:
number
size
totalElements
totalPages


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
    const pageNumber = this.$route.query.pageNumber || 0;

    //const page = { pageNumber: pageNumber }
    const filters = this.$route.query.filter; // as array?
    
    /*
    if (isNaN(pageNumber)) {
      this.search(qry, 0)
    } else {
      this.search(qry, pageNumber);
    }  
    */
    this.search(qry, pageNumber);
    // const pageSize = this.$route.query.pageSize;

  },
  watch: {
    '$route': 'search'
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
      //this.api.search = query;
      const { baseUrl } = this.api;
      const apiUrl = `${baseUrl}?search=${query}&pageNumber=${pageNumber}`;  
      //const apiUrl = `${baseUrl}?search=${query}`;  
      this.getData(apiUrl);
      //console.debug(this.$route);
      // not getting query here (for changing URL)
      console.debug(`SEARCH=${query}`);
      //console.log(query);
      this.page.number = pageNumber;
      console.log(this.page);

      // can't get anything to work here even though
      // above prints correct search
      if (query != undefined) {
        console.debug(`should add ${query} to query`);
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