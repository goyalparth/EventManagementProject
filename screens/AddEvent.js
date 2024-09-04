// AddEvent.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { database } from '../firebaseConfig'; // Import database
import { ref, push } from 'firebase/database';

const AddEvent = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sessionSpeaker, setSessionSpeaker] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [paperName, setPaperName] = useState('');
  const [paperUrl, setPaperUrl] = useState('');

  const addEvent = () => {
    const eventRef = ref(database, 'events');
    const newEvent = {
      title,
      date,
      startTime,
      endTime,
      sessionSpeaker,
      location,
      address,
      paperName,
      paperUrl
    };
    
    push(eventRef, newEvent)
      .then(() => {
        alert('Event added successfully!');
        navigation.goBack(); // Navigate back to ProgramScreen
      })
      .catch((error) => {
        alert('Error adding event: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Event Title"
        placeholderTextColor="#000000"
        value={title} 
        onChangeText={setTitle} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Date"
        placeholderTextColor="#000000"
        value={date} 
        onChangeText={setDate} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Start Time" 
        placeholderTextColor="#000000"
        value={startTime} 
        onChangeText={setStartTime} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="End Time" 
        placeholderTextColor="#000000"
        value={endTime} 
        onChangeText={setEndTime} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Session Speaker" 
        placeholderTextColor="#000000"
        value={sessionSpeaker} 
        onChangeText={setSessionSpeaker} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Location" 
        placeholderTextColor="#000000"
        value={location} 
        onChangeText={setLocation} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Address" 
        placeholderTextColor="#000000"
        value={address} 
        onChangeText={setAddress} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Paper Name" 
        placeholderTextColor="#000000"
        value={paperName} 
        onChangeText={setPaperName} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Paper URL" 
        placeholderTextColor="#000000"
        value={paperUrl} 
        onChangeText={setPaperUrl} 
        style={styles.input} 
      />
      <Button title="Add Event" onPress={addEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color:'#000000'
  },
});

export default AddEvent;
