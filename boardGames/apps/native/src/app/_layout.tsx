import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloProvider } from "@apollo/client";
import { client } from './apollo-client';
import { useGetLeaderboardPlayersQuery } from "@repo/graphql/types/client";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        {/* <Test /> */}
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  );
}


const Test = () => {
  const { data, loading } = useGetLeaderboardPlayersQuery({
    variables: {
      limit: 10
    }
  })


  console.log('this is the data ', data, loading)
  return (
    <Text>
      Hello
    </Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
