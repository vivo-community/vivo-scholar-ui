<template>
  <div class="row">
    <!-- people -->
    <div class="col-sm">
        <ul className="list-group">
          <li class="list-group-item" v-bind:key="person.id" v-for="person in people">
            <span class="person-name">
              <!-- how to make link? -->
                {{person.name}}
            </span>
          </li>
        </ul>
    </div>
    <!-- facets -->
    <div class="col-sm">
        <div v-bind:key="facet.field" v-for="facet in facets">
            <h3>{{ facet.field }}</h3>
                
            <ul class="list-group">                             
                <li class="list-group-item" 
                  v-bind:key="entry.value" v-for="entry in facet.entries.content">
                  <input type="checkbox" 
                      :name="facet.field"
                      :value="entry.value" 
                      @change="toggleOption($event, facet, entry)"
                      />
                  {{entry.value}} ({{entry.count}})
                </li>    
            </ul>
            
        </div><!-- end div/loop -->
    </div><!-- end div col -->
  </div><!-- end row -->
</template>

<script>
import _ from 'lodash';

export default {
  name: 'SearchResults',
  props: ['people', 'facets', 'page'],
  // send data back up to search ??
  data() {
    return {
      filters: []
    }
  },
  methods: {
   toggleOption(event, facet, entry) {
            if (event.target.checked) {
              console.log(`should ADD ${facet.field}:${entry.value}`);
              this.filters.push({field: facet.field, value: entry.value})
            } else {
              this.filters = _.without(this.filters, _.find(this.filters, {
                field: facet.field,
                value: `${entry.value}`
              }));
              console.log(`should REMOVE ${facet.field}:${entry.value}`);
            }
            this.$emit('filtered', this.filters);
        }
  }
};
</script>

