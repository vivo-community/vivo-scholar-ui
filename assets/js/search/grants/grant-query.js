import gql from "graphql-tag";

const grantQuery = gql`
  query($search: String!, $pageNumber: Int!, $pageSize: Int!,
    $filters: [FilterArgInput], $orders: [OrderInput], $boosts: [BoostArgInput]) {
    relationships(
      boosts: $boosts,
      facets: [
        { field: "awardedBy", exclusionTag: "awardedBy", minCount: 0 },
        { field: "contributors", exclusionTag: "contributors", minCount: 0 }
      ]
      filters: $filters,
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
