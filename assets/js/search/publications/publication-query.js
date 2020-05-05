import gql from "graphql-tag";

const publicationQuery = gql`
  query($search: String!, $pageNumber: Int!, $pageSize: Int!,
    $filters: [FilterArgInput], $orders: [OrderInput], $boosts: [BoostArgInput]) {
    documents(
      boosts: $boosts,
      facets: [
        { field: "type", exclusionTag: "type", minCount: 0 }, 
        { field: "authors", exclusionTag: "authors", minCount: 0 },
        { field: "publisher", exclusionTag: "publisher", minCount: 0 },
        { field: "publicationDate", exclusionTag: "publicationDate", minCount: 0 },
      ]
      filters: $filters
      paging: {
        pageSize: $pageSize
        pageNumber: $pageNumber
        sort: { orders: $orders }
      }
      query: {
        q: $search
      }
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
