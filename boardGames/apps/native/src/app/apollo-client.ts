import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

// Define the HTTP link to the GraphQL server
const httpLink = new HttpLink({
  uri: "http://localhost:8080/graphql", // Replace with your GraphQL server URL
});

// Add the authLink to attach authorization headers
const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("auth-token"); // Retrieve the token from AsyncStorage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Attach the token if it exists
    },
  };
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]), // Combine authLink and httpLink
  cache: new InMemoryCache(),
});
