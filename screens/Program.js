import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import EventsCard from '../Components/EventsCard';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue } from 'firebase/database'; // Firebase methods

const ProgramScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]); // Initialize as an empty array
  const [filteredEvents, setFilteredEvents] = useState([]); // For storing filtered events
  const [selectedDate, setSelectedDate] = useState(null); // To track selected date

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

  // Handle navigation to event details
  const handleNavigate = (id, paperName, sessionSpeaker, address, date, endTime) => {
    navigation.navigate('EventDetails', { id, paperName, sessionSpeaker, address, date, endTime });
  };

  const toggleFavorite = (id) => {
    setFilteredEvents(filteredEvents.map(event => 
      event.id === id 
        ? { ...event, isFavorite: !event.isFavorite } 
        : event
    ));
  };

  // Handle navigation to AddEvent screen
  const handleAddEvent = () => {
    navigation.navigate('AddEvent');
  };

  return (
    <View style={{ flex: 1 }}>
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
                <EventsCard style={styles.eventSubList}
                  key={event.id}
                  title={event.title} // Use paperName from the database
                  label={event.startTime + " - " + event.endTime} // Use startTime and endTime from the database
                  isFavorite={event.isFavorite}
                  onFavoriteToggle={() => toggleFavorite(event.id)}
                  onNavigate={() => handleNavigate(event.id, event.paperName, event.sessionSpeaker, event.address, event.date, event.endTime)} // Pass event details
                />
              ))
            ) : (
              <Text style={styles.noEventsText}>No events for this date</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddEvent}>
        <Image
          source={require('../images/add_event.png')}
          style={styles.icon}/>
        {/* <Text style={styles.fabText}>+</Text> Replace this with an image later */}
      </TouchableOpacity>
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
    backgroundColor: '#FCFAF8', // Card background
    flex: 1, // Match the parent height
    width: '100%', // Match the parent width
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
    color: '#FCFAF8', // Header text color
  },
  monthContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#304067', // Month text color
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
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#304067', // Floating button background color
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
  }
});

export default ProgramScreen;
