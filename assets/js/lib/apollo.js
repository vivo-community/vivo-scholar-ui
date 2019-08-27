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

console.log(`GRAPHQL_ENDPOINT (env)=${process.env.GRAPHQL_ENDPOINT}`,)
// message: Content type 'text/plain;charset=UTF-8' not supported
// TODO: get url from env
// `${process.env.GRAPHQL_ENDPOINT}` || 
let endpoint = "https://scholars-discovery-scholars.cloud.duke.edu/graphql"
if (process.env.GRAPHQL_ENDPOINT != undefined) {
  endpoint = `${process.env.GRAPHQL_ENDPOINT}`
}
console.log(`GRAPHQL_ENDPOINT (set)=${endpoint}`)

const client = new ApolloClient({
  //uri: 'http://localhost:9000/graphql',
  uri: endpoint,
  /// NOTE: bug right now, doesn't actually send GET
  // https://github.com/apollographql/apollo-link/issues/236
  fetchOptions: {
    useGETForQueries: true
  }
});
export default client
