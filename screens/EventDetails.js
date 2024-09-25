import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Platform, PermissionsAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEventContext } from '../context/EventContext';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { ScrollView } from 'react-native-gesture-handler';
import LocalCalendarModalComponent from '../Components/LocalCalendarModalComponent';
import RNCalendarEvents from 'react-native-calendar-events';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const { toggleFavorite, getEventStatus, setCalendarId } = useEventContext();
  const [event, setEvent] = useState(null);
  const [papers, setPapers] = useState([]);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [isEventInCalendar, setIsEventInCalendar] = useState(false); // Track if event is in user's calendar

  useEffect(() => {
    const fetchCalendarPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
            {
              title: 'Calendar Permission',
              message: 'This app needs access to your calendar to add events.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Calendar permission granted');
          } else {
            console.log('Calendar permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    fetchCalendarPermissions();

    const eventRef = ref(database, `events/${id}`);
    const unsubscribe = onValue(eventRef, async (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        const startDate = eventData.startDate || `${eventData.date} ${eventData.startTime}`;
        const endDate = eventData.endDate || `${eventData.date} ${eventData.endTime}`;
        
        setEvent({ ...eventData, startDate, endDate });

        const paperList = Object.entries(eventData)
          .filter(([key, value]) => key.startsWith('paper') && value.name && value.url)
          .map(([key, value]) => value);
        setPapers(paperList);

        // Check if event already exists in calendar
        await checkIfEventExistsInCalendar(eventData.title, startDate, endDate);
      } else {
        console.log('No event found for ID:', id);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const checkIfEventExistsInCalendar = async (title, startDate, endDate) => {
    try {
      const events = await RNCalendarEvents.fetchAllEvents(new Date(startDate).getTime(), new Date(endDate).getTime());
      const eventExists = events.some(event => event.title === title);
      setIsEventInCalendar(eventExists); // Update state based on existence
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const handleFavoritePress = async () => {
    const { isFavorite, calendarId } = getEventStatus(id);
    
    if (isEventInCalendar) {
      // Remove from favorites and calendar
      toggleFavorite(id); // Mark as not favorite
      if (calendarId) {
        await removeCalendarEvent(calendarId);
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
      // Add to favorites
      toggleFavorite(id);
  
      if (event) { // Ensure event exists
        const eventObj = {
          title: event.title,
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
  
    try {
      const calendarId = await RNCalendarEvents.saveEvent(event.title, {
        startDate,
        endDate,
        notes: event.description,
        calendarId: calendar.id,
      });
  
      setCalendarId(id, calendarId);
      setCalendarModalVisible(false);
      setIsEventInCalendar(true); // Mark the event as existing in the calendar
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
      const eventToRemove = await RNCalendarEvents.findEventById(calendarId);
      if (eventToRemove) {
        await RNCalendarEvents.removeEvent(eventToRemove.id);
      } else {
        console.warn('Event to remove not found:', calendarId);
      }
    } catch (error) {
      console.error('Error removing event from calendar:', error);
    }
  };

  const handlePaperDownload = (url) => {
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
              source={isEventInCalendar ? require('../images/heart-filled.png') : require('../images/heart-empty.png')}
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
          {papers && papers.length > 0 && (
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
        </View>

        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ScrollView>

      {/* Calendar Selection Modal */}
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
