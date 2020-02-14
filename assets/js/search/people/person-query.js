import gql from "graphql-tag";

const peopleQuery = gql`
  query($search: String!, $pageNumber: Int!, $filters: [FilterArgInput]) {
    people(
      facets: [
        { field: "type" },
        { field: "researchAreas" },
        { field: "positions" }
      ]
      filters: $filters
      paging: {
        pageSize: 100
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
