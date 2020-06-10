import ApolloClient from "apollo-boost";
import { onError } from "apollo-link-error";

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// NOTE: defined in .env and set in _theme_variables.html
//let endpoint = graphqlEndpoint;
let endpoint = '/api/graphql';
const client = new ApolloClient({
  uri: endpoint,
  /// NOTE: bug right now, doesn't actually send GET
  // https://github.com/apollographql/apollo-link/issues/236
  fetchOptions: {
    useGETForQueries: true
  }
});
export default client;
