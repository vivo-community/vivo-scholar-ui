import gql from "graphql-tag";

const peopleQuery = gql`
  query($search: String!, $pageNumber: Int!, $pageSize: Int!,
    $filters: [FilterArgInput], $orders: [OrderInput], $boosts: [BoostArgInput]) {
    people(
      boosts: $boosts,
      facets: [
        { field: "type", exclusionTag: "type", minCount: 0 },
        { field: "organizations", exclusionTag: "organizations", minCount: 0 },
        { field: "schools", exclusionTag: "schools", minCount: 0 }
      ]
      filters: $filters
      paging: {
        pageSize: $pageSize
        pageNumber: $pageNumber
        sort: { orders: $orders }
      }
      query: {
        q: $search,
        bq: "type:(*FacultyMember)^2.0"
      }
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
