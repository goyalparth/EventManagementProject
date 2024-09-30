import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const About = () => {
  return (
    <View style={styles.main}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>ABOUT US</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to ACIS 2024</Text>
          <Text style={styles.description}>
            The Australasian Conference on Information Systems (ACIS 2024) will be hosted at Canberra, the capital of Australia, from 4 December to 6 December 2024. Canberra, meaning "the meeting place" in the local Ngunnawal language, is one of the world's most sustainable cities.
            Let us come together to Canberra and share our research insights and perspectives about how digital technologies can promote sustainability and facilitate a resilient economy that works for the common good.
          </Text>
          <Image 
            source={require('../images/ACIS_2024.jpg')}
            style={styles.image}
            resizeMode="stretch"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main:{
    backgroundColor:'#304067',
    flex: 1,
  },
  
  scrollView: {
    paddingHorizontal: 10,
    paddingTop: 30,
    height: '100%',
    backgroundColor: '#304067', // Main background color
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FCFAF8', // Header text color
    marginTop:10,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#F9F2E7',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    margin: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#304067',
    marginBottom: 20,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'justify',
  },
  image: {
    width: 260,
    height: 200,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default About;
