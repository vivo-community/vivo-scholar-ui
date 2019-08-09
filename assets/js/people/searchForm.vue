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
      
    <!-- pages NOTE: page.number is 0 based -->
    <!-- limit should be configurable or something -->
    <b-pagination-nav 
      base-url="/search/people"
      :link-gen="linkGen" 
      :number-of-pages="page.totalPages" 
      limit="10"
      :current-page="pageNumber"
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

import qs from 'qs';

export default {
  name: 'SearchForm',
  components: {
    SearchResults
  },
  props: ['people', 'facets', 'page'],
  data() {
    return {
      searchString: '*',
      filters: []
    };
  },
  computed: {
    pageNumber: function () {
      return this.page.number + 1
    }
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
            pageNumber: 1
          }
        })
        // since router is watch(ed) - it effectively
        // is a listener for state change and emiter already
        //this.$emit('search', this.$router.query);
      }
    },
    onFilter (value) {
       this.$router.push({
          name: 'searchPeople',
          query: {
            search: this.searchString,
            pageNumber: 1,
            filters: value
          }
        })
        this.filters = value
        //console.log(qs.stringify(value2, {encode: false}))
    },
    linkGen(pageNum) {
        const newQuery = {
             search: this.searchString,
             pageNumber: pageNum,
             filters: this.filters,
        }
        const result = qs.stringify(newQuery, {encode: false});
        const queryString = result ? ('?' + result) : '';
        return queryString
    }
  }
};
</script>