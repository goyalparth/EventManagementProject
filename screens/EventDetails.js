import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Platform, PermissionsAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEventContext } from '../context/EventContext';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { ScrollView } from 'react-native-gesture-handler';
import LocalCalendarModalComponent from '../Components/LocalCalendarModalComponent';
import RNCalendarEvents from 'react-native-calendar-events';

const EventDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const { toggleFavorite, getEventStatus, setCalendarId } = useEventContext();
  const [event, setEvent] = useState(null);
  const [papers, setPapers] = useState([]);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [isEventInCalendar, setIsEventInCalendar] = useState(false);
  const [calendarId, setLocalCalendarId] = useState(null);

  useEffect(() => {
    const fetchCalendarPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          // Request both read and write permissions
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
            PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
          ]);

          // Check the granted permissions
          if (
            granted[PermissionsAndroid.PERMISSIONS.READ_CALENDAR] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR] === PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Calendar permissions granted');
          } else {
            console.log('Calendar permissions denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    fetchCalendarPermissions();


    const eventRef = ref(database, `Session/${id}`);
    const unsubscribe = onValue(eventRef, async (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        console.log('Fetched event data:', eventData); // Log data for debugging
        const startDate = eventData.startDate || `${eventData.date} ${eventData.startTime}`;
        const endDate = eventData.endDate || `${eventData.date} ${eventData.endTime}`;

        setEvent({ ...eventData, startDate, endDate });

        // Extracting papers
        const papers = [];
        for (let i = 1; i <= 4; i++) {
          const name = eventData[`paper${i}_name`];
          const url = eventData[`paper${i}_url`];
          if (name && url) {
            papers.push({ name, url });
          }
        }
        setPapers(papers);

        await checkIfEventExistsInCalendar(eventData.name, startDate, endDate);
      } else {
        console.log('No event found for ID:', id);
      }
    });



    return () => unsubscribe();
  }, [id]);

  const checkIfEventExistsInCalendar = async (name, startDate, endDate) => {
    try {
      const events = await RNCalendarEvents.fetchAllEvents(new Date(startDate).getTime(), new Date(endDate).getTime());
      const eventExists = events.some(event => event.title === name);
      setIsEventInCalendar(eventExists);
      if (eventExists) {
        const existingEvent = events.find(event => event.title === name);
        setLocalCalendarId(existingEvent.id); // Store the calendar ID for future reference
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const handleFavoritePress = async () => {
    const { isFavorite } = getEventStatus(id);

    if (isEventInCalendar) {
      // Remove from favorites and calendar
      toggleFavorite(id); // Mark as not favorite
      if (calendarId) {
        await removeCalendarEvent(calendarId); // Call to remove the event
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: 'Removed from favorites and calendar',
          visibilityTime: 2000,
        });
        setCalendarId(id, null); // Clear the calendar ID
        setIsEventInCalendar(false); // Update state
      }
    } else {
      // Add to favorites and calendar
      toggleFavorite(id);
      if (event) { // Ensure event exists
        const eventObj = {
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate,
          description: `Location: ${event.location}\nAddress: ${event.address}`,
        };

        setCalendarModalVisible(true); // Open the calendar modal to save the event
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Added to favorites',
          visibilityTime: 2000,
        });
      } else {
        console.error('Event data is missing when trying to add to favorites');
      }
    }
  };

  const saveEvent = async (calendar) => {
    if (!event || !event.startDate || !event.endDate) {
      console.error('Event is missing or dates are invalid:', event);
      return;
    }

    const startDate = new Date(event.startDate).toISOString();
    const endDate = new Date(event.endDate).toISOString();

    // Create the description for the calendar event
    const descriptionParts = [
      `Track: ${event.track || 'N/A'}`,
      `Session Chair: ${event.sessionChair || 'N/A'}`,
      `Location: ${event.location || 'N/A'}`,
      `Address: ${event.address || 'N/A'}`,

    ];

    // Add paper details to the description
    for (let i = 1; i <= 4; i++) {
      const paperName = event[`paper${i}_name`];
      const paperUrl = event[`paper${i}_url`];

      if (paperName) {
        descriptionParts.push(`Paper ${i}: ${paperName}`);
        if (paperUrl) {
          descriptionParts.push(`URL: ${paperUrl}`);
        }
      }
    }

    const description = descriptionParts.join('\n'); // Combine all parts into a single string

    try {
      const calendarId = await RNCalendarEvents.saveEvent(event.name, {
        startDate,
        endDate,
        description, // Use the structured description
        calendarId: calendar.id,
      });

      setCalendarId(id, calendarId);
      setLocalCalendarId(calendarId); // Store the new calendar ID
      setCalendarModalVisible(false);
      setIsEventInCalendar(true);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Added to favorites and calendar',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to add event to calendar',
        visibilityTime: 2000,
      });
    }
  };

  const removeCalendarEvent = async (calendarId) => {
    try {
      await RNCalendarEvents.removeEvent(calendarId);
      console.log(`Event removed successfully: ${calendarId}`); // Log successful removal
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Event removed from calendar',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error removing event from calendar:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to remove event from calendar',
        visibilityTime: 2000,
      });
    }
  };

  const handlePaperDownload = (url) => {
    Linking.openURL(url).catch((err) => {
      const errorMessage = 'An error occurred while opening the URL.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage, // Display the error message in the toast
        position: 'bottom',
        visibilityTime: 3000, // Toast duration (3 seconds)
      });
      console.error(errorMessage, err); // Optionally log the error for debugging
    });
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
          <Text style={styles.title}>{event.name}</Text>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Image
              source={isEventInCalendar ? require('../images/heart-filled.png') : require('../images/heart-empty.png')}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>

        <View style={styles.card}>
            <View style={styles.iconLabelContainer}>
              <Image source={require('../images/tracks-icon.png')} style={styles.icon} />
              <View>
                <Text style={styles.label}>{event.track}</Text>
                <Text style={styles.subLabel}>Track</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.iconLabelContainer}>
              <Image source={require('../images/calendar-icon.png')} style={styles.icon} />
              <View>
                <Text style={styles.label}>{event.date}</Text>
                <Text style={styles.subLabel}>{event.startTime} - {event.endTime}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.iconLabelContainer}>
              <Image source={require('../images/location-icon.png')} style={styles.icon} />
              <View>
                <Text style={styles.label}>{event.location}</Text>
                <Text style={styles.subLabel}>{event.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.iconLabelContainer}>
              <Image source={require('../images/speaker-icon.png')} style={styles.icon} />
              <View>
                <Text style={styles.label}>{event.sessionChair}</Text>
                <Text style={styles.subLabel}>Session Chair</Text>
              </View>
            </View>
          </View>

          

          {papers && papers.length > 0 && (
            <View style={styles.infoContainer}>
              <Text style={styles.sectionHeader}>Papers:</Text>
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
        </View>
        

        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ScrollView>

      <LocalCalendarModalComponent
        isVisible={isCalendarModalVisible}
        closeModal={() => setCalendarModalVisible(false)}
        handleCalendarSelected={saveEvent}
        label="Select a calendar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
    paddingTop: 30,
    height: '100%',
    backgroundColor: '#304067',
  },
  cardContainer: {
    backgroundColor: '#F9F2E7',
    flex: 1,
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
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
    color: '#FCFAF8',
    marginStart: 20,
  },
  card: {
    backgroundColor: 'white',
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
    color: '#000000',
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
