import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; // Import setContext

// Define the HTTP link to the GraphQL server
const httpLink = new HttpLink({
    uri: 'http://localhost:8080/graphql', // Replace with your GraphQL server URL
});

// Add the authLink to attach authorization headers
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth-token'); // Retrieve the token from localStorage or another source
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '', // Attach the token if it exists
        },
    };
});

// Create the Apollo client with the combined link and cache
export const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]), // Combine authLink and httpLink
    cache: new InMemoryCache(),
});