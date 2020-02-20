import gql from "graphql-tag";

const publicationQuery = gql`
  query($search: String!, $pageNumber: Int!, $filters: [FilterArgInput]) {
    documents(
      facets: [
        { field: "type" }, 
        { field: "authors"},
        { field: "publisher"},
        { field: "publicationDate"},
      ]
      filters: $filters
      paging: {
        pageSize: 10
        pageNumber: $pageNumber
        sort: { orders: [{ direction: ASC, property: "title" }] }
      }
      query: $search
    ) {
      content {
        id
        title
        publicationDate
        authors {
          id
          label
        }
        publisher {
          label
        }
        abstractText
      }
      page {
        totalPages
        number
        size
        totalElements
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

export default publicationQuery;
