import gql from "graphql-tag";

const peopleQuery = gql`
  query($search: String!, $pageNumber: Int!, $filters: [FilterArgInput], $orders: [OrderInput]) {
    people(
      facets: [
        { field: "type", exclusionTag: "type" },
        { field: "organizations", exclusionTag: "organizations"},
        { field: "schools", exclusionTag: "schools"},
        { field: "researchAreas", exclusionTag: "ra" },
      ]
      filters: $filters
      paging: {
        pageSize: 5
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
