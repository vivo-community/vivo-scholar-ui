import ApolloClient from 'apollo-boost'
import { onError } from "apollo-link-error";

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// message: Content type 'text/plain;charset=UTF-8' not supported
// TODO: get url from env
const client = new ApolloClient({
  uri: 'http://localhost:9000/graphql',
  /// NOTE: bug right now, doesn't actually send GET
  // https://github.com/apollographql/apollo-link/issues/236
  fetchOptions: {
    useGETForQueries: true
  }
});
export default client
