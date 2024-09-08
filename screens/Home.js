import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue } from 'firebase/database'; // Firebase methods

const HomeScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]); // Initialize state to hold events

  // Fetch events from Firebase Realtime Database
  useEffect(() => {
    const eventsRef = ref(database, 'events'); // Reference to 'events' node in Firebase

    // Listen for changes in the 'events' node
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val(); // Get the data snapshot
      if (data) {
        const fetchedEvents = Object.keys(data).map((key) => ({
          id: key, // Store the ID of the event
          title: data[key].title, // Get the event title
          date: data[key].date,
          startTime: data[key].startTime, // Get the event start date
          endTime: data[key].endTime, // Get the event end date
        }));
        setEvents(fetchedEvents); // Update state with fetched events
      } else {
        setEvents([]); // If no data is found, set events to an empty array
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Navigate to EventDetails screen with relevant data and the event ID
  const handleNavigate = (id, title, date, startTime, endTime) => {
    navigation.navigate('EventDetails', { id, title, date, startTime, endTime });
  };

  // Render each event card
  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={() => handleNavigate(item.id, item.title, item.date, item.startTime, item.endTime)}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.startTime}>Start Time: {item.startTime}</Text>
          <Text style={styles.endTime}>End Time: {item.endTime}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50, // Adjust based on header height
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  flatList: {
    paddingHorizontal: 10,
  },
  cardWrapper: {
    marginRight: 10,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#000000",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#555',
    color: "#000000"
  },
  startTime: {
    fontSize: 14,
    color: '#555',
    color: "#000000"
  },
  endTime: {
    fontSize: 14,
    color: '#555',
    color: "#000000"
  },
});
