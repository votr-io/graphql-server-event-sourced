import { ClientFactoryOptions } from './client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
const fetch = require('node-fetch');

const fetchWithToken = (token?: string) => {
  return (uri, options) => {
    if (token) {
      options.headers['x-token'] = token;
    }
    return fetch(uri, options);
  };
};

export interface ClientFactoryOptions {
  uri: string;
  token?: string;
}

export function createClient({ uri, token }: ClientFactoryOptions) {
  return new ApolloClient({
    link: createHttpLink({
      uri,
      fetch: fetchWithToken(token),
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  });
}
