import gql from "graphql-tag";

const peopleQuery = gql`
  query($search: String!, $pageNumber: Int!, $filters: [FilterArgInput]) {
    people(
      facets: [
        { field: "type", exclusionTag: "type" },
        { field: "organizations", exclusionTag: "organizations"},
        { field: "schools", exclusionTag: "schools"},
        { field: "name", exclusionTag: "name"},
      ]
      filters: $filters
      paging: {
        pageSize: 5
        pageNumber: $pageNumber
        sort: { orders: [{ direction: ASC, property: "name" }] }
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
