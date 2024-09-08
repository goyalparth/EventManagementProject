import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEventContext } from '../context/EventContext';
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue } from 'firebase/database'; // Firebase methods for fetching data
import { ScrollView } from 'react-native-gesture-handler';

const EventDetailsScreen = ({ route }) => {
  const { id } = route.params; // Get the event id from the route params
  const { toggleFavorite, getEventStatus, setCalendarId } = useEventContext();
  const [event, setEvent] = useState(null); // Store the event details
  const [papers, setPapers] = useState([]); // Store the paper details

  useEffect(() => {
    // Fetch the event details from Firebase using the event ID
    const eventRef = ref(database, `events/${id}`);
    const unsubscribe = onValue(eventRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        setEvent(eventData); // Update the state with the event details
        // Filter out papers that have empty names or URLs
        const paperList = Object.entries(eventData)
          .filter(([key, value]) => key.startsWith('paper') && value.name && value.url)
          .map(([key, value]) => value);
        setPapers(paperList);
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

  const handlePaperDownload = (url) => {
    // Open the paper URL using Linking API
    Linking.openURL(url).catch(err => console.error('An error occurred while opening the URL:', err));
  };

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Image
              source={getEventStatus(id).isFavorite ? require('../images/heart-filled.png') : require('../images/heart-empty.png')}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Date and Time Section */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.iconLabelContainer}>
              <Image source={require('../images/calendar-icon.png')} style={styles.icon} />
              <View>
                <Text style={styles.label}> {event.date} </Text>
                <Text style={styles.subLabel}> {event.startTime} - {event.endTime} </Text>
              </View>
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.card}>
            <View style={styles.iconLabelContainer}>
              <Image source={require('../images/location-icon.png')} style={styles.icon} />
              <View>
                <Text style={styles.label}>{event.location}</Text>
                <Text style={styles.subLabel}>{event.address}</Text>
              </View>
            </View>
          </View>

          {/* Speaker Section */}
          <View style={styles.card}>
            <View style={styles.iconLabelContainer}>
              <Image source={require('../images/speaker-icon.png')} style={styles.icon} />
              <View>
                <Text style={styles.label}>{event.sessionSpeaker}</Text>
                <Text style={styles.subLabel}>Session Chair</Text>
              </View>
            </View>
          </View>

          {/* Paper Information Section */}
          {papers.length > 0 && (
            <View style={styles.infoContainer}>
              <Text style={styles.sectionHeader}>Description</Text>
              {papers.map((paper, index) => (
                <View key={index} style={styles.paperRow}>
                  <Text style={styles.paperText}>{paper.name}</Text>
                  <TouchableOpacity onPress={() => handlePaperDownload(paper.url)}>
                    <Image source={require('../images/download-icon.png')} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
    paddingTop: 30,
    height: '100%',
    backgroundColor: '#304067', // Main background color
  },

  cardContainer: {
    backgroundColor: '#F9F2E7', // Card background
    flex: 1, // Match the parent height
    width: '100%', // Match the parent width
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F9F2E7', // Same background color as the card in your design
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FCFAF8', // Header text color
    marginStart: 20,
  },
  card: {
    backgroundColor: 'white', // Light card background similar to the one in the design
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#000000', // Dark blue text color
    marginLeft: 10,
  },
  subLabel: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
  },
  infoContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  paperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  paperText: {
    fontSize: 16,
    color: '#000000',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  favoriteIcon: {
    width: 30,
    height: 30,
    marginEnd: 20,
  },
});

export default EventDetailsScreen;
