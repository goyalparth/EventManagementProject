import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { database } from '../firebaseConfig'; // Import database
import { ref, push } from 'firebase/database';

const AddEvent = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [date, setDate] = useState(null); // Set initial state to null for placeholders
  const [startTime, setStartTime] = useState(null); // Set initial state to null for placeholders
  const [endTime, setEndTime] = useState(null); // Set initial state to null for placeholders
  const [sessionChair, setSessionChair] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [paperCount, setPaperCount] = useState(1); // State for the number of papers
  const [paperDetails, setPaperDetails] = useState({
    paper1: { name: '', url: '' },
    paper2: { name: '', url: '' },
    paper3: { name: '', url: '' },
    paper4: { name: '', url: '' },
  });

  

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

  // Validation function to check if any field is empty
  const validateForm = () => {
    if (!title || !selectedTrack || !date || !startTime || !endTime || !sessionChair || !location || !address) {
      return false;
    }

    for (let i = 1; i <= paperCount; i++) {
      if (!paperDetails[`paper${i}`].name || !paperDetails[`paper${i}`].url) {
        return false;
      }
    }
    return true;
  };


  const addEvent = () => {
    // Check if the form is valid
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill out all fields before adding the session.');
      return;
    }

    const eventRef = ref(database, 'Session');
    const newEvent = {
      track: selectedTrack,
      name: title, // Use 'name' as the title
      sessionChair: sessionChair, // Use 'description' for the session speaker
      date: date ? formatDate(date) : '', // Event date
      startTime: startTime ? formatTime(startTime) : '', // Event start time
      endTime: endTime ? formatTime(endTime) : '', // Event end time
      location, // Event location
      address, // Event address
      paper1_name: paperDetails.paper1.name, // Paper 1 name
      paper1_url: paperDetails.paper1.url, // Paper 1 URL
      paper2_name: paperDetails.paper2.name, // Paper 2 name
      paper2_url: paperDetails.paper2.url, // Paper 2 URL
      paper3_name: paperDetails.paper3.name, // Paper 3 name
      paper3_url: paperDetails.paper3.url, // Paper 3 URL
      paper4_name: paperDetails.paper4.name, // Paper 4 name
      paper4_url: paperDetails.paper4.url, // Paper 4 URL
      
    };

    push(eventRef, newEvent)
      .then(() => {
        Alert.alert('Success', 'Session created successfully!');
        navigation.goBack(); // Navigate back to ProgramScreen
      })
      .catch((error) => {
        Alert.alert('Error', `Error creating session: ${error.message}`);
      });
  };


  const handlePaperDetailsChange = (paperNumber, field, value) => {
    setPaperDetails((prevDetails) => ({
      ...prevDetails,
      [`paper${paperNumber}`]: {
        ...prevDetails[`paper${paperNumber}`],
        [field]: value,
      },
    }));
  };

  const handlePaperCountChange = (value) => {
    setPaperCount(value);

    // Discard details of papers exceeding the selected paper count
    setPaperDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails };
      for (let i = value + 1; i <= 4; i++) {
        updatedDetails[`paper${i}`] = { name: '', url: '' };
      }
      return updatedDetails;
    });
  };


  return (
    <View style={styles.main}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Create New Session</Text>
      </View>
  
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Track Picker */}
          <Text style={styles.label}>Track</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedTrack}
              onValueChange={(itemValue) => setSelectedTrack(itemValue)}
              
            >
              <Picker.Item label="Select Track" value="" /> 
              <Picker.Item label="General Track" value="General Track" />
              <Picker.Item label="Emerging Technologies in IS" value="Emerging Technologies in IS" />
              <Picker.Item label="Strategy, Governance, and Leadership" value="Strategy, Governance, and Leadership" />
              <Picker.Item label="Digital Innovation, Transformation, Business Models and Future of Work" value="Digital Innovation, Transformation, Business Models and Future of Work" />
              <Picker.Item label="Information Security Management, Privacy, Ethics and the Dark Side of Information Systems" value="Information Security Management, Privacy, Ethics and the Dark Side of Information Systems" />
              <Picker.Item label="Data Analytics, Artificial Intelligence, and Strategic Decision Making" value="Data Analytics, Artificial Intelligence, and Strategic Decision Making" />
              <Picker.Item label="Digital Health Care" value="Digital Health Care" />
              <Picker.Item label="Information Systems Education in a Disruptive World" value="Information Systems Education in a Disruptive World" />
              <Picker.Item label="Crowds, Social Media, Digital Collaboration, and Fake News" value="Crowds, Social Media, Digital Collaboration, and Fake News" />
              <Picker.Item label="Digital Innovation for the Common Good" value="Digital Innovation for the Common Good" />
              <Picker.Item label="Digital Government and Sustainable Technology" value="Digital Government and Sustainable Technology" />
              <Picker.Item label="Digital Ecosystems and Technologies Evolving in the Fast Changing Ecological World" value="Digital Ecosystems and Technologies Evolving in the Fast Changing Ecological World" />
              <Picker.Item label="Digital Inequality and its Implication to Society and the Community" value="Digital Inequality and its Implication to Society and the Community" />
              <Picker.Item label="IS Research in Marginalized and Indigenous Contexts" value="IS Research in Marginalized and Indigenous Contexts" />
              <Picker.Item label="Decolonizing Information Systems Research" value="Decolonizing Information Systems Research" />
              <Picker.Item label="The Role of Open Source in the Digital Future (Sponsored)" value="The Role of Open Source in the Digital Future (Sponsored)" />
              <Picker.Item label="Poster SLAM" value="Poster SLAM" />
            </Picker>
          </View>
          
            <Text style={styles.label}>Session Name</Text>
            <TextInput
              placeholder="Enter Session Name"
              placeholderTextColor="#888888"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              placeholder="Enter Session Location"
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
              <Text style={[styles.pickerText, !date && styles.placeholderText]}>
                {date ? formatDate(date) : 'Enter Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()} // Set initial value to current date
                mode="date"
                display="spinner" // Alert dialog style for Android
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.datePicker}>
              <Text style={[styles.pickerText, !startTime && styles.placeholderText]}>
                {startTime ? formatTime(startTime) : 'Enter Start Time'}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime || new Date()} // Set initial value to current time
                mode="time"
                display="spinner"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.datePicker}>
              <Text style={[styles.pickerText, !endTime && styles.placeholderText]}>
                {endTime ? formatTime(endTime) : 'Enter End Time'}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime || new Date()} // Set initial value to current time
                mode="time"
                display="spinner"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>Session Chair</Text>
            <TextInput
              placeholder="Enter the Session Chair's Name"
              placeholderTextColor="#888888"
              value={sessionChair}
              onChangeText={setSessionChair}
              style={styles.input}
            />

            {/* Paper Count Picker */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>Number of Papers</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={paperCount}
                  onValueChange={(itemValue) => handlePaperCountChange(itemValue)}
                  style={{ height: 50, width: 120, color: '#000' }} // Adjust the size
                >
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                  <Picker.Item label="3" value={3} />
                  <Picker.Item label="4" value={4} />
                </Picker>

              </View>
            </View>

            {/* Render Paper Details based on paperCount */}
            {Array.from({ length: paperCount }).map((_, index) => (
              <View key={index}>
                <Text style={styles.label}>Paper {index + 1} Details</Text>
                <TextInput
                  placeholder="Enter Paper Name"
                  placeholderTextColor="#888888"
                  value={paperDetails[`paper${index + 1}`].name}
                  onChangeText={(value) => handlePaperDetailsChange(index + 1, 'name', value)}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Enter Paper URL"
                  placeholderTextColor="#888888"
                  value={paperDetails[`paper${index + 1}`].url}
                  onChangeText={(value) => handlePaperDetailsChange(index + 1, 'url', value)}
                  style={styles.input}
                />
              </View>
            ))}

            <TouchableOpacity onPress={addEvent} style={styles.addButton}>
              <Text style={styles.addButtonText}>CREATE</Text>
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
    backgroundColor: '#F9F2E7', // Card background
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    backgroundColor: 'white', // Light card background
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
    backgroundColor: 'white', // Light card background
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
  placeholderText: {
    color: '#888888', // Placeholder text color
  },
  addButton: {
    backgroundColor: '#304067', // Dark blue button background
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
    backgroundColor: '#da5e5a', // Cancel button background
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
    width: 200,
    alignSelf: 'center',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    borderColor: '#E8E8E8',
    borderWidth: 1,
  },
});

export default AddEvent;
