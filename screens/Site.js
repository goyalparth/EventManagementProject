import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const SiteScreen = () => {
  // Function to open the URL when the image or hyperlink is clicked
  const handleOpenLink = () => {
    Linking.openURL('https://www.canberra.edu.au/maps');
  };

  return (
    <View style={styles.main}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SITE MAP - UNIVERSITY OF CANBERRA</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.textContainer}>
          
          {/* Make the image clickable using TouchableOpacity */}
          <TouchableOpacity onPress={handleOpenLink}>
            <Image 
              source={{ uri: 'https://www.canberra.edu.au/__data/assets/image/0005/1613948/UCEM0093_UCMapsUpdate2020_Safety-Security_201207.png' }} 
              style={styles.image}
              resizeMode="stretch" 
            />
          </TouchableOpacity>

          {/* Add clickable hyperlink below the image */}
          <TouchableOpacity onPress={handleOpenLink}>
            <Text style={styles.hyperlink}>Click here to view the full map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#304067',
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
    width:'match_parent',
    margin:5,
    textAlign: 'center',
    marginTop:15,
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
    width: '100%',
    height: 300,
    marginTop: 20,
    alignSelf: 'center',
  },
  hyperlink: {
    fontSize: 12,
    color: '#007bff', // Blue color for hyperlink
    textAlign: 'left',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default SiteScreen;
