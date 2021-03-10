import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const APOLLO_URI = serverRuntimeConfig.APOLLO_URI || publicRuntimeConfig.APOLLO_URI;

const httpLink = createHttpLink({
  uri: `${APOLLO_URI}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
