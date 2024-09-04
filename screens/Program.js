import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import EventsCard from '../Components/EventsCard';
import { useNavigation } from '@react-navigation/native';
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue } from 'firebase/database'; // Firebase methods

const ProgramScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]); // Initialize as an empty array

  // Fetch events from Firebase Realtime Database
  useEffect(() => {
    const eventsRef = ref(database, 'events'); // Reference to 'events' node in Firebase

    // Listen for changes in the 'events' node
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val(); // Get the data snapshot
      if (data) {
        const fetchedEvents = Object.keys(data).map((key) => ({
          id: key, // Store the ID of the event
          ...data[key],
        }));
        setEvents(fetchedEvents); // Update state with the fetched events
      } else {
        setEvents([]); // If no data is found, set events to an empty array
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Update the navigation function to pass the event id
  const handleNavigate = (id, title, label, description, startDate, endDate) => {
    navigation.navigate('EventDetails', { id, title, label, description, startDate, endDate });
  };

  const toggleFavorite = (id) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, isFavorite: !event.isFavorite } 
        : event
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {/* Program Heading and Add Event Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Program</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEvent')} // Navigate to AddEvent screen
        >
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      </View>
      
      {/* Event Cards */}
      <View style={styles.cardContainer}>
        {events.map((event) => (
          <EventsCard
            key={event.id}
            title={event.title}
            label={event.label}
            isFavorite={event.isFavorite}
            onFavoriteToggle={() => toggleFavorite(event.id)}
            onNavigate={() => handleNavigate(event.id, event.title, event.label, event.description, event.startDate, event.endDate)} // Pass the event ID along with other details
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000'
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
});

export default ProgramScreen;
