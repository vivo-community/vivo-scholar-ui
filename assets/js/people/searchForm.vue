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
      <!-- use this?
        import { PaginationNavPlugin } from 'bootstrap-vue'
        Vue.use(PaginationNavPlugin)
      -->
      <ul class="pagination">
        <!-- NOTE: would have to rebuild link here -->
        <li :key="index" class="page-item" 
        :class="{ 'active': index === page.number }"
        v-for="(n, index) in page.totalPages">
          <a :href="`?search=${searchString}&pageNumber=${n-1}`" class="page-link">{{ n }}</a>
        </li>
      </ul>
    
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
      pageNumber: 0
    };
  },
  methods: {
    parseSearchString() {
      // Trim search string
      const trimmedSearchString = this.searchString.trim();
      // filters = this.filters ?
      if (trimmedSearchString !== '') {
        const query = trimmedSearchString;
        this.$emit('search', query, this.pageNumber);
      }
    },
    onFilter (value) {
      console.log("onFilter:SearchForm")
      console.log(value) // someValue
    },
    // TODO: make paging work (like filters?)
    onPage (value) {
      console.log(value)
    }
  }
};
</script>