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
  const [events, setEvents] = useState([]); // Initialize state to hold all events
  const [filteredEvents, setFilteredEvents] = useState([]); // State for filtered events based on selected date
  const [selectedDate, setSelectedDate] = useState(null); // State for tracking the selected date

  // Fetch events from Firebase Realtime Database
  useEffect(() => {
    const eventsRef = ref(database, 'Session'); // Reference to the 'Session' node in Firebase

    // Listen for changes in the 'Session' node
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val(); // Retrieve data snapshot from Firebase
      if (data) {
        // Map fetched data to an array of events with their IDs
        const fetchedEvents = Object.keys(data).map((key) => ({
          id: key, // Store the ID of the event
          ...data[key],
        }));

        // Sort events by date, then start time, then end time
        const sortedEvents = fetchedEvents.sort((a, b) => {
          const dateA = moment(a.date, 'YYYY-MM-DD'); // Parse date for event A
          const dateB = moment(b.date, 'YYYY-MM-DD'); // Parse date for event B

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
        setFilteredEvents(filtered); // Set filtered events for the default date
      } else {
        setEvents([]); // If no data is found, reset events to an empty array
        setFilteredEvents([]); // Reset filtered events to an empty array
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Handle date click and filter events
  const handleDateClick = (date) => {
    setSelectedDate(date); // Update selected date

    // Format both the selected date and event date consistently using moment.js
    const filtered = events.filter(event => moment(event.date, 'YYYY-MM-DD').isSame(moment(date, 'YYYY-MM-DD')));
    
    setFilteredEvents(filtered); // Update filtered events state
  };

  // Get week dates starting from December 1st, 2024
  const getWeekDates = () => {
    const startOfWeek = moment('2024-12-01'); // Starting point for week dates
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')); // Add each day of the week to the array
    }

    return dates; // Return array of week dates
  };

  const weekDates = getWeekDates(); // Get the week dates

  // Handle navigation to event details, passing all necessary event information
  const handleNavigate = (event) => {
    navigation.navigate('EventDetails', {
      id: event.id, // Pass the event ID
      name: event.name, // Pass the event name
      track: event.track, // Pass the track of the event
      sessionSpeaker: event.description, // Pass the session speaker's description
      address: event.address, // Pass the address of the event
      location: event.location, // Pass the location of the event
      date: event.date, // Pass the event date
      startTime: event.startTime, // Pass the start time of the event
      endTime: event.endTime, // Pass the end time of the event
      papers: [ // Pass an array of associated papers
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
      'Delete Event', // Alert title
      'Are you sure you want to delete this event?', // Alert message
      [
        { text: 'Cancel', style: 'cancel' }, // Cancel button
        { text: 'Delete', onPress: async () => {
          const eventRef = ref(database, `Session/${id}`); // Reference to the specific event in Firebase
          await remove(eventRef); // Remove event from Firebase
          setFilteredEvents(filteredEvents.filter(event => event.id !== id)); // Update filtered events by removing the deleted event
        }, style: 'destructive' } // Delete button with destructive style
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
          {/* Header text for the conference program */}
        </View>

        {/* CardView that includes the month, date selector, and events */}
        <View style={styles.cardContainer}>
          {/* Month Header */}
          <View style={styles.monthContainer}>
            <Text style={styles.monthText}>December 2024</Text> 
            {/* Displaying the month for the event list */}
          </View>

          {/* Date Selector with Day Names */}
          <View style={styles.dateSelector}>
            {weekDates.map((date) => (
              <TouchableOpacity key={date} onPress={() => handleDateClick(date)}>
                <View style={styles.dateItem}>
                  <Text style={styles.dayText}>{moment(date).format('ddd').toUpperCase()}</Text> 
                  {/* Display day of the week */}
                  <Text style={[styles.dateText, selectedDate === date && styles.selectedDate]}>
                    {moment(date).format('D')} 
                    {/* Display date */}
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
                  renderRightActions={() => renderRightActions(event.id)} // Show delete button on swipe
                >
                  <TouchableOpacity
                    onPress={() => handleNavigate(event)} // Navigate to event details with the full event object
                  >
                    <EventsCard style={styles.eventSubList}
                      title={event.name} // Display event name on the card
                      label={`${event.startTime} - ${event.endTime}\nTrack: ${event.track}`} // Show time range and track information
                      isFavorite={event.isFavorite} // Show if the event is marked as favorite
                      onFavoriteToggle={() => toggleFavorite(event.id)} // Handle favorite toggle
                    />
                  </TouchableOpacity>
                </Swipeable>
              ))
            ) : (
              <Text style={styles.noEventsText}>No events for this date</Text> // Message when no events are available
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEvent')}>
        <Image source={require('../images/add_event.png')} style={styles.icon} /> 
        {/* Icon for adding a new event */}
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
    paddingTop: 30,
    height: '100%',
    backgroundColor: '#304067', // Background color of the scroll view
  },
  cardContainer: {
    backgroundColor: '#FCFAF8', // Background color of the card
    flex: 1,
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
    alignItems: 'center', // Center align header
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold', // Bold font for the header
    color: '#FCFAF8', // Color of the header text
  },
  monthContainer: {
    paddingVertical: 10,
    alignItems: 'center', // Center align month header
  },
  dateSelector: {
    flexDirection: 'row', // Arrange date items in a row
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderRadius: 10,
  },
  dateItem: {
    alignItems: 'center', // Center align date items
  },
  dayText: {
    fontSize: 16,
    color: '#888', // Color for day text
  },
  monthText:{
    color:'#000000', // Color for the month text
    fontSize: 20,
  },
  dateText: {
    fontSize: 20,
    color: '#304067', // Color for date text
    padding: 10,
  },
  selectedDate: {
    backgroundColor: '#304067', // Background color for the selected date
    height: 65,
    fontSize: 20,
    color: '#FCFAF8', // Text color for selected date
  },
  eventList: {
    borderRadius: 10,
  },
  eventSubList: {
    backgroundColor: '#F9F2E7', // Background color for event cards
    elevation: 5,
    marginTop: 15,
    width: '100%',
  },
  noEventsText: {
    textAlign: 'center', // Center align no events message
    color: '#304067', // Color for no events text
    fontSize: 16,
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    backgroundColor: '#FF0000', // Background color for delete button
    marginTop:15,
    borderRadius: 10,
    marginBottom: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF', // Text color for delete button
    fontWeight: 'bold', // Bold text for delete button
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#304067', // Background color for floating action button
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

export default ProgramScreen; // Export the ProgramScreen component
