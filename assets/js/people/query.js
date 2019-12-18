import gql from "graphql-tag";

const peopleQuery = gql`
  query($search: String!, $pageNumber: Int!, $filters: [FilterArgInput]) {
    personsFacetedSearch(
      facets: [
        { field: "keywords" }
        { field: "researchAreas" }
        { field: "selectedPublicationVenue" }
        { field: "selectedPublicationPublisher" }
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
