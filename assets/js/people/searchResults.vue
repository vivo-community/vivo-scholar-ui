<template>
  <div>
      <div v-bind:key="person.id" v-for="person in people">
        {{ person.name }}
      </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  props: ['people']
};
</script>

