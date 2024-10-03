import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler'; // Import Swipeable
import EventsCard from '../Components/EventsCard';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue, remove } from 'firebase/database'; // Firebase methods

const ProgramScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]); // Initialize as an empty array
  const [filteredEvents, setFilteredEvents] = useState([]); // For storing filtered events
  const [selectedDate, setSelectedDate] = useState(null); // To track selected date

  // Fetch events from Firebase Realtime Database
  useEffect(() => {
    const eventsRef = ref(database, 'Session'); // Reference to 'Session' node in Firebase

    // Listen for changes in the 'Session' node
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val(); // Get the data snapshot
      if (data) {
        const fetchedEvents = Object.keys(data).map((key) => ({
          id: key, // Store the ID of the event
          ...data[key],
        }));

        // Sort events by date, then startTime, and then endTime if startTime is the same
        const sortedEvents = fetchedEvents.sort((a, b) => {
          const dateA = moment(a.date, 'YYYY-MM-DD');
          const dateB = moment(b.date, 'YYYY-MM-DD');

          // Compare dates
          if (!dateA.isSame(dateB)) {
            return dateA - dateB;
          }

          // Compare start times
          const startTimeA = a.startTime || '';
          const startTimeB = b.startTime || '';
          const startTimeComparison = startTimeA.localeCompare(startTimeB);

          if (startTimeComparison !== 0) {
            return startTimeComparison;
          }

          // If start times are the same, compare end times
          const endTimeA = a.endTime || '';
          const endTimeB = b.endTime || '';
          return endTimeA.localeCompare(endTimeB);
        });

        setEvents(sortedEvents); // Update state with sorted events

        // Set default selected date to the first day of the week
        const defaultDate = moment('2024-12-01').format('YYYY-MM-DD');
        setSelectedDate(defaultDate);

        // Filter events based on the default selected date
        const filtered = sortedEvents.filter(event =>
          moment(event.date, 'YYYY-MM-DD').isSame(moment(defaultDate, 'YYYY-MM-DD'))
        );
        setFilteredEvents(filtered); // Set the filtered events for the default date
      } else {
        setEvents([]); // If no data is found, set events to an empty array
        setFilteredEvents([]);
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Handle date click and filter events
  const handleDateClick = (date) => {
    setSelectedDate(date); // Store the selected date

    // Format both the selected date and the event date consistently using moment.js
    const filtered = events.filter(event => moment(event.date, 'YYYY-MM-DD').isSame(moment(date, 'YYYY-MM-DD')));
    
    setFilteredEvents(filtered); // Update the filtered events state
  };

  // Get week dates starting from December 1st, 2024
  const getWeekDates = () => {
    const startOfWeek = moment('2024-12-01'); // Starting from December 1st, 2024
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
    }

    return dates;
  };

  const weekDates = getWeekDates();

  // Handle navigation to event details, passing all necessary event information
  const handleNavigate = (event) => {
    navigation.navigate('EventDetails', {
      id: event.id,
      name: event.name,
      track: event.track,
      sessionSpeaker: event.description,
      address: event.address,
      location: event.location,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      papers: [
        { name: event.paper1_name, url: event.paper1_url },
        { name: event.paper2_name, url: event.paper2_url },
        { name: event.paper3_name, url: event.paper3_url },
        { name: event.paper4_name, url: event.paper4_url },
      ],
    });
  };

  // Handle event deletion
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: async () => {
          const eventRef = ref(database, `Session/${id}`);
          await remove(eventRef); // Remove event from Firebase
          setFilteredEvents(filteredEvents.filter(event => event.id !== id)); // Remove from the filtered list
        }, style: 'destructive' }
      ]
    );
  };

  // Render delete action for Swipeable
  const renderRightActions = (id) => (
    <View style={styles.deleteButtonContainer}>
      <TouchableOpacity onPress={() => handleDelete(id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Conference Program Heading */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>CONFERENCE PROGRAM</Text>
        </View>

        {/* CardView that includes the month, date selector, and events */}
        <View style={styles.cardContainer}>
          {/* Month Header */}
          <View style={styles.monthContainer}>
            <Text style={styles.monthText}>December 2024</Text>
          </View>

          {/* Date Selector with Day Names */}
          <View style={styles.dateSelector}>
            {weekDates.map((date) => (
              <TouchableOpacity key={date} onPress={() => handleDateClick(date)}>
                <View style={styles.dateItem}>
                  <Text style={styles.dayText}>{moment(date).format('ddd').toUpperCase()}</Text>
                  <Text style={[styles.dateText, selectedDate === date && styles.selectedDate]}>
                    {moment(date).format('D')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Event Cards */}
          <View style={styles.eventList}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Swipeable
                  key={event.id}
                  renderRightActions={() => renderRightActions(event.id)} // Show delete on swipe
                >
                  <TouchableOpacity
                    onPress={() => handleNavigate(event)} // Navigate to event details with the full event object
                  >
                    <EventsCard style={styles.eventSubList}
                      title={event.name} // Use event name
                      label={`${event.startTime} - ${event.endTime}\nTrack: ${event.track}`} 
                      isFavorite={event.isFavorite}
                      onFavoriteToggle={() => toggleFavorite(event.id)}
                    />
                  </TouchableOpacity>
                </Swipeable>
              ))
            ) : (
              <Text style={styles.noEventsText}>No events for this date</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEvent')}>
        <Image source={require('../images/add_event.png')} style={styles.icon} />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
    paddingTop: 30,
    height: '100%',
    backgroundColor: '#304067', // Same color as your original design
  },
  cardContainer: {
    backgroundColor: '#FCFAF8',
    flex: 1,
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FCFAF8', // Same header text color
  },
  monthContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderRadius: 10,
  },
  dateItem: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#888',
  },
  monthText:{
    color:'#000000',
    fontSize: 20,
  },
  dateText: {
    fontSize: 20,
    color: '#304067',
    padding: 10,
  },
  selectedDate: {
    backgroundColor: '#304067',
    height: 65,
    fontSize: 20,
    color: '#FCFAF8',
  },
  eventList: {
    borderRadius: 10,
  },
  eventSubList: {
    backgroundColor: '#F9F2E7',
    elevation: 5,
    marginTop: 15,
    width: '100%',
  },
  noEventsText: {
    textAlign: 'center',
    color: '#304067',
    fontSize: 16,
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    marginTop:15,
    borderRadius: 10,
    marginBottom: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#304067', // Same color as your original design
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default ProgramScreen;
