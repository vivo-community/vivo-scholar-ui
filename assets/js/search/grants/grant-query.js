import gql from "graphql-tag";

const grantQuery = gql`
  query($search: String!, $pageNumber: Int!, $filters: [FilterArgInput], 
    $orders: [OrderInput], $boosts: [BoostArgInput]) {
    relationships(
      boosts: $boosts,
      facets: [
        { field: "administeredBy", exclusionTag: "ab" },
      ]
      #filters: [{field: "type", value: "Grant"}],
      filters: $filters,
      paging: {
        pageSize: 5
        pageNumber: $pageNumber
        sort: { orders: $orders }
      }
      query: $search
    ) {
      content {
        id
        title
      }
      page {
        totalElements
        totalPages
        number
        size
      }
      facets {
        field
        entries {
          content {
            value
            count
          }
        }
      }
    }
  }
  `;

export default grantQuery;
