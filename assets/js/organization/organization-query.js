import gql from "graphql-tag";

const organizationSubOrgQuery = gql`
query GetSubOrgs($id: String = "n6236") {
  organization(
    id: $id
) {
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
  `

export default organizationSubOrgQuery
