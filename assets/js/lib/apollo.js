/*
import { withData } from 'next-apollo'
import { HttpLink } from 'apollo-link-http'
*/
/*
const config = {
  link: new HttpLink({
    uri: 'http://localhost:9000/graphql',
  })
}
*/
//export default withData(config)

import ApolloClient from 'apollo-boost'

import { onError } from "apollo-link-error";

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// message: Content type 'text/plain;charset=UTF-8' not supported
// TODO: get url from env
const client = new ApolloClient({
  uri: 'http://localhost:9000/graphql'
});
export default client
