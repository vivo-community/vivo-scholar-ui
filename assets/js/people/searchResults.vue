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
                <li className="list-group-item" 
                  v-bind:key="entry.value" v-for="entry in facet.entries.content">
                        {{entry.value}} ({{entry.count}})
                </li>
                    
            </ul>
        </div><!-- end div/loop -->
    </div><!-- end div col -->
  </div><!-- end row -->
</template>

<script>
export default {
  name: 'SearchResults',
  props: ['people', 'facets', 'page']
};
</script>

