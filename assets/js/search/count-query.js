import gql from "graphql-tag";

const countQuery = gql`
    query($search: String!) {
        peopleCount: people(query: $search) { page { totalElements } }
        pubCount: documents(query: $search) { page { totalElements } }
    }
`;

export default countQuery;