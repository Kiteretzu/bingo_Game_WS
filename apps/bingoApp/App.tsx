import {View, Text} from 'react-native';
import React from 'react';
import {ApolloProvider} from '@apollo/client';
import {client} from './ApolloClient';
import Home from './src/screens/Home';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
};

export default App;
