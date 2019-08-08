<template>
<div>
  <h1 class="page-header">Search</h1>

  <h2>Page {{ page.number + 1 }} of {{ page.totalPages }}</h2>

  <form id="people-search">
        <input
          v-model="searchString"
          @keydown.13.prevent="parseSearchString"
          type="text"
          class="form-control"
          placeholder="Search ..."
        >
        <div class="input-group-append">
          <button @click="parseSearchString" class="btn btn-outline-secondary" type="button">
            <i class="fas fa-search"></i>
          </button>
        </div>
      
      <!-- pages -->
      <b-pagination-nav 
        base-url="/search/people"
        :link-gen="linkGen" 
        :number-of-pages="page.totalPages" 
        limit="10"
        hide-goto-end-buttons
        use-router>
      </b-pagination-nav>
    
    <SearchResults
      v-on:filtered="onFilter"
      v-if="people.length > 0"
      v-bind:people="people"
      v-bind:facets="facets"
      v-bind:page="page"/>
  </form>

</div>
</template>

<script charset="utf-8">
import SearchResults from './searchResults.vue';

export default {
  name: 'SearchForm',
  components: {
    SearchResults
  },
  props: ['people', 'facets', 'page'],
  data() {
    return {
      searchString: '*',
      filters: [],
      pageNumber: 1
    };
  },
  methods: {
    parseSearchString() {
      const trimmedSearchString = this.searchString.trim();
      if (trimmedSearchString !== '') {
        const query = trimmedSearchString;
        this.$router.push({
          name: 'searchPeople',
          query: {
            search: trimmedSearchString,
            pageNumber: 1,
            //filters: value
          }
        })
        // since router is watch - it effectively
        // is a listener for state change and emiter
        //this.$emit('search', this.$router.query);
      }
    },
    onFilter (value) {
      console.log("onFilter:SearchForm")
      console.log(value) // should be array of objects

      if (Array.isArray(value) && value.length > 0) {
        console.log("adding filters to router...")
        console.debug(value)
        /// NOTE: wanted this:
        //filters[keywords]=biostatistics
        // getting this:
        //filters[0][field]=keywords&filters[0][value]=management
        this.$router.push({
          name: 'searchPeople',
          query: {
            search: this.searchString,
            pageNumber: 1,
            filters: value
          }
        })
      }
      // NOTE: add to router?
      // (then that might trigger search)
    },
    linkGen(pageNum) {
        // add filters??
        return `?search=${this.searchString}&pageNumber=${pageNum}`
    }
  }
};
</script>