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
      

  </form>

</div>
</template>

<script charset="utf-8">
export default {
  name: 'SearchForm',
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