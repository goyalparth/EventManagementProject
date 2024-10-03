import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Text, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue } from 'firebase/database'; // Firebase methods

const HomeScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]); // Initialize state to hold events

  // Fetch events from Firebase Realtime Database
  useEffect(() => {
    const eventsRef = ref(database, 'Session'); // Reference to 'events' node in Firebase

    // Listen for changes in the 'events' node
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val(); // Get the data snapshot
      if (data) {
        // Convert fetched events to an array and parse the date and time
        let fetchedEvents = Object.keys(data).map((key) => ({
          id: key,
          title: data[key].name,
          date: data[key].date,
          startTime: data[key].startTime,
          endTime: data[key].endTime,
          // dateTime: new Date(`${data[key].date}T${data[key].startTime}`), // Combine date and time for sorting
          dateTime: new Date(`${data[key].date}T${data[key].startTime}`), // Combine date and time for sorting
          endDateTime: new Date(`${data[key].date}T${data[key].endTime}`), // Combined date and end time for filtering
        }));

        // Sort events by date and time (earliest first)
        fetchedEvents.sort((a, b) => a.dateTime - b.dateTime);

        // Filter out events that have already ended
        const now = new Date(); // Get the current date and time
        const upcomingEvents = fetchedEvents.filter(event => event.endDateTime > now); // Only include upcoming events

        // Limit to 4 events
        const limitedEvents = upcomingEvents.slice(0, 4);

        setEvents(limitedEvents); // Update state with sorted and limited events
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

  // Handle "Tracks" button to open external link
  const handleTracksPress = () => {
    Linking.openURL('https://acis.aaisnet.org/acis2024/tracks/');
  };

  // Handle navigation to QR Code Screen
  const handleCheckInPress = () => {
    navigation.navigate('QRCode');
  };

  const handleSitePress = () => {
    navigation.navigate('Site');
  };

  // Render each event card
  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={() => handleNavigate(item.id, item.title, item.date, item.startTime, item.endTime)}>
        <View style={styles.eventCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>Date: {item.date}</Text>
          <Text style={styles.details}>Duration: {item.startTime} - {item.endTime}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image source={require('../images/user-icon.jpg')} style={styles.profileIcon} />
        <View>
          <Text style={styles.greetingText}>Hello, User!</Text>
          <Text style={styles.subText}>Welcome to the ACIS Event Mangagement App</Text>
        </View>
      </View>

      {/* Combined Card for Navigation, Upcoming Conferences, and Leaderboard */}
      <View style={styles.combinedCard}>
        {/* Navigation Section */}
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.navButton} onPress={handleTracksPress}>
            <Image source={require('../images/tracks-icon.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Tracks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleCheckInPress}>
            <Image source={require('../images/checkin-icon.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Check-In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleSitePress}>
            <Image source={require('../images/sitemap-icon.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Site Map</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Conferences Section */}
        <Text style={styles.sectionHeader}>UPCOMING SESSIONS</Text>
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
        />

        {/* Leaderboard Section */}
        <Text style={styles.sectionHeader}>LEADERBOARD</Text>
        <View style={styles.leaderboardContainer}>
          <View style={styles.leaderboardCard}>
            <Image source={require('../images/gold-medal.png')} style={styles.medalIcon} />
            <Text style={styles.leaderText}>Person 1</Text>
          </View>
          <View style={styles.leaderboardCard}>
            <Image source={require('../images/silver-medal.png')} style={styles.medalIcon} />
            <Text style={styles.leaderText}>Person 2</Text>
          </View>
          <View style={styles.leaderboardCard}>
            <Image source={require('../images/bronze-medal.png')} style={styles.medalIcon} />
            <Text style={styles.leaderText}>Person 3</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#304067',
  },
  headerContainer: {
    backgroundColor: '#304067',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    fontSize: 16,
    color: '#fff',
  },
  combinedCard: {
    flex: 1,
    backgroundColor: '#FCFAF8',
    borderRadius: 15, 
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#F9F2E7',
    padding: 10,
    borderRadius: 10, 
    alignItems: 'center',
    width: '30%',
    elevation: 2, 
  },
  navIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  navText: {
    fontSize: 16,
    color: '#000',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#304067',
  },
  flatList: {
    paddingHorizontal: 10,
    marginBottom: 10, 
  },
  cardWrapper: {
    marginRight: 10,
  },
  eventCard: {
    backgroundColor: '#F9F2E7',
    borderRadius: 10, 
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width:190,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold', // Make the title bold
    color: '#000',
    marginBottom: 10,
    textAlign: 'center', // Center the title
  },
  details: {
    fontSize: 14,
    color: '#000',
  },
  leaderboardContainer: {
    flexDirection: 'column', // Display leaderboard cards in column
    marginTop: 10,
  },
  leaderboardCard: {
    backgroundColor: '#F9F2E7', // White background for leaderboard cards
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  medalIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  leaderText: {
    fontSize: 16,
    color: '#000',
  },
});
