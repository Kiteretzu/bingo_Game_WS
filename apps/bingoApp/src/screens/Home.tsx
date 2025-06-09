import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React from 'react';
import {useGetLeaderboardPlayersQuery} from '@repo/graphql/types/client';

const Home = () => {
  const {data, loading} = useGetLeaderboardPlayersQuery({
    variables: {limit: 10},
  });

  console.log({data, loading});
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Welcome to the Home Screen!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#555',
  },
});
