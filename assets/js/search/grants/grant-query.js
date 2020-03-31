import gql from "graphql-tag";

const grantQuery = gql`
  query($search: String!, $pageNumber: Int!, $pageSize: Int!,
    $filters: [FilterArgInput], $orders: [OrderInput], $boosts: [BoostArgInput]) {
    relationships(
      boosts: $boosts,
      facets: [
        { field: "awardedBy", exclusionTag: "awardedBy" },
        { field: "contributors", exclusionTag: "contributors" }
      ]
      filters: $filters,
      paging: {
        pageSize: $pageSize
        pageNumber: $pageNumber
        sort: { orders: $orders }
      }
      query: $search
    ) {
      content {
        id
        title
        dateTimeIntervalStart
        dateTimeIntervalEnd
        principalInvestigators {
          id
          label
        }
        coPrincipalInvestigators {
          id
          label
        }
        contributors{
           id
           label
           role
        }
        administeredBy {
          id
          label
          type
        }   
        awardedBy {
          id
          label
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

export default grantQuery;
