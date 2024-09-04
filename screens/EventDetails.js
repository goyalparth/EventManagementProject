import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEventContext } from '../context/EventContext';
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue } from 'firebase/database'; // Firebase methods for fetching data

const EventDetailsScreen = ({ route }) => {
  const { id } = route.params; // Get the event id from the route params
  const { toggleFavorite, getEventStatus, setCalendarId } = useEventContext();
  const [event, setEvent] = useState(null); // Store the event details

  useEffect(() => {
    console.log('Event ID:', id); // Print the event ID to the console for debugging

    // Fetch the event details from Firebase using the event ID
    const eventRef = ref(database, `events/${id}`);
    const unsubscribe = onValue(eventRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        setEvent(eventData); // Update the state with the event details
      } else {
        console.log('No event found for ID:', id);
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [id]);

  const handleFavoritePress = async () => {
    const { isFavorite, calendarId } = getEventStatus(id);
    toggleFavorite(id);
    if (isFavorite && calendarId) {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Removed from favorites and calendar',
        visibilityTime: 2000,
      });
      setCalendarId(id, null);
    } else {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Added to favorites',
        visibilityTime: 2000,
      });
    }
  };

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Image
              source={getEventStatus(id).isFavorite ? require('../images/added-favorite.jpg') : require('../images/favorite.png')}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Session Speaker: {event.sessionSpeaker}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Location: {event.location}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Address: {event.address}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Date: {event.date}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Start Time: {event.startTime}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>End Time: {event.endTime}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Paper Name: {event.paperName}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Paper URL: {event.paperUrl}</Text>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#000',
  },
  label: {
    fontSize: 18,
    color: 'gray',
  },
  favoriteIcon: {
    width: 30,
    height: 30,
  },
});

export default EventDetailsScreen;
