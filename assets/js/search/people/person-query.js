import gql from "graphql-tag";

const peopleQuery = gql`
  query($search: String!, $pageNumber: Int!, $pageSize: Int!,
    $filters: [FilterArgInput], $orders: [OrderInput], $boosts: [BoostArgInput]) {
    people(
      boosts: $boosts,
      facets: [
        { field: "type", exclusionTag: "type" },
        { field: "organizations", exclusionTag: "organizations"},
        { field: "schools", exclusionTag: "schools"}
      ]
      filters: $filters
      paging: {
        pageSize: $pageSize
        pageNumber: $pageNumber
        sort: { orders: $orders }
      }
      query: $search
    ) {
      content {
        id
        name
        keywords
        thumbnail
        preferredTitle
        overview
        positions {
          title
        }
        publications {
          title
        }
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

export default peopleQuery;
