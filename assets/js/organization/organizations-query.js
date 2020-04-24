
import gql from "graphql-tag";

const organizationsRootsQuery = gql`
query GetRootOrgs {
  organizations (filters: [
    {field: "organizationWithin", value: null}
  ])  {
    content {
      id
      name
      hasSubOrganizations {
        id
        label
      }
      organizationWithin {
        id
        label
      }
    }
  }
}
  `
export default organizationsRootsQuery
