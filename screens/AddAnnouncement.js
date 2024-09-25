import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ref, push } from 'firebase/database';
import { database } from '../firebaseConfig'; // Adjust the import path to your firebase config

const AddAnnouncement = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Function to get the current date and time in 'YYYY-MM-DD HH:MM' format
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const validateForm = () => {
    return title && description;
  };

  const addAnnouncement = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill out all fields before adding the announcement.');
      return;
    }

    const announcementRef = ref(database, 'Announcement');
    const newAnnouncement = {
      title,
      description,
      dateTime: getCurrentDateTime(), // Automatically adds current date and time in the correct format
    };

    push(announcementRef, newAnnouncement)
      .then(() => {
        Alert.alert('Success', 'Announcement added successfully!');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Error', `Error adding announcement: ${error.message}`);
      });
  };

  return (
    <View style={styles.main}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Add New Announcement</Text>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Enter the title"
            placeholderTextColor="#888888"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Enter the description"
            placeholderTextColor="#888888"
            value={description}
            onChangeText={setDescription}
            style={styles.description_input}
            multiline={true}
          />

          <TouchableOpacity onPress={addAnnouncement} style={styles.addButton}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigation.goBack} style={styles.cancelButton}>
            <Text style={styles.addButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#304067',
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FCFAF8',
  },
  scrollView: {
    paddingBottom: 20,
  },
  container: {
    backgroundColor: '#F9F2E7',
    flex: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    margin: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#304067',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  description_input: {
    height: 100,
    textAlignVertical: 'top',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#304067',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  addButton: {
    backgroundColor: '#304067',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
    width: 200,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#da5e5a',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
    width: 200,
    alignSelf: 'center',
  },
});

export default AddAnnouncement;