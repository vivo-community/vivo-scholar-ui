<template>
<div>
  <h1 class="page-header">Search</h1>

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
      
    <SearchResults
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
  props: ['people', 'facets', 'page', 'filters'],
  data() {
    return {
      searchString: '*'
    };
  },
  methods: {
    parseSearchString() {
      // Trim search string
      const trimmedSearchString = this.searchString.trim();
      if (trimmedSearchString !== '') {
        const query = trimmedSearchString;
        this.$emit('search', query);
      }
    }
  }
};
</script>