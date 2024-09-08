import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { database } from '../firebaseConfig'; // Import database
import { ref, push } from 'firebase/database';
import ProgramScreen from './Program';

const AddEvent = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [sessionSpeaker, setSessionSpeaker] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [paperName1, setPaperName1] = useState('');
  const [paperUrl1, setPaperUrl1] = useState('');
  const [paperName2, setPaperName2] = useState('');
  const [paperUrl2, setPaperUrl2] = useState('');

  // State to show or hide the Date/Time picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) setStartTime(selectedTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) setEndTime(selectedTime);
  };

  const addEvent = () => {
    const eventRef = ref(database, 'events');
    const newEvent = {
      title,
      date: formatDate(date),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      sessionSpeaker,
      location,
      address,
      paper1: {
        name: paperName1,
        url: paperUrl1
      },
      paper2: {
        name: paperName2,
        url: paperUrl2
      }
    };
    
    // const cancelButton = () => {
    //   navigation.goBack();
    // }
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
    <View style={styles.main}>
      <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Create New Conference</Text>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.label}>Track Name</Text>
          <TextInput 
            placeholder="Enter the name of the Track"
            placeholderTextColor="#888888"
            value={title} 
            onChangeText={setTitle} 
            style={styles.input} 
          />

        <Text style={styles.label}>Location</Text>
        <TextInput 
          placeholder="Select Event Location"
          placeholderTextColor="#888888"
          value={location} 
          onChangeText={setLocation} 
          style={styles.input} 
        />

        <Text style={styles.label}>Address</Text>
        <TextInput 
          placeholder="eg: Building 8, Room 10"
          placeholderTextColor="#888888"
          value={address} 
          onChangeText={setAddress} 
          style={styles.input} 
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.pickerText}>
            {formatDate(date)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.datePicker}>
          <Text style={styles.pickerText}>
            {formatTime(startTime)}
          </Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={onChangeStartTime}
          />
        )}

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.datePicker}>
          <Text style={styles.pickerText}>
            {formatTime(endTime)}
          </Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={onChangeEndTime}
          />
        )}

        <Text style={styles.label}>Session Chair</Text>
        <TextInput 
          placeholder="Enter the Session Chair's Name"
          placeholderTextColor="#888888"
          value={sessionSpeaker} 
          onChangeText={setSessionSpeaker} 
          style={styles.input} 
        />

        <Text style={styles.label}>Paper 1 Details</Text>
        <TextInput 
          placeholder="Enter Paper Name"
          placeholderTextColor="#888888"
          value={paperName1} 
          onChangeText={setPaperName1} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Enter Paper URL"
          placeholderTextColor="#888888"
          value={paperUrl1} 
          onChangeText={setPaperUrl1} 
          style={styles.input} 
        />

        <Text style={styles.label}>Paper 2 Details</Text>
        <TextInput 
          placeholder="Enter Paper Name"
          placeholderTextColor="#888888"
          value={paperName2} 
          onChangeText={setPaperName2} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Enter Paper URL"
          placeholderTextColor="#888888"
          value={paperUrl2} 
          onChangeText={setPaperUrl2} 
          style={styles.input} 
        />

        <TouchableOpacity onPress={addEvent} style={styles.addButton}>
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
    backgroundColor:'#304067',
  },
  headerContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FCFAF8', // Header text color
  },
  scrollView: {
    paddingBottom: 20, // Ensure there's space at the bottom to scroll
  },
  container: {
    backgroundColor: '#FCFAF8', // Card background
    // flex: 1, // Match the parent height
    width: '100%', // Match the parent width
    borderRadius: 20,
    padding: 20,
    marginBottom: 130,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black color for the headings
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    backgroundColor: '#F9F2E7', // Light card background
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#304067',
    elevation: 3, // Android elevation for card effect
    shadowColor: '#000', // iOS shadow settings
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  datePicker: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#F9F2E7', // Light card background
    borderRadius: 10,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    elevation: 3, // Android elevation for card effect
    shadowColor: '#000', // iOS shadow settings
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  pickerText: {
    color: '#304067',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#304067', // Dark blue button background
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#da5e5a', // Dark blue button background
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  }, 
});

export default AddEvent;
