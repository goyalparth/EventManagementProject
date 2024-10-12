import React, { useState, useEffect } from 'react'; // Importing React and hooks
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Text, Linking } from 'react-native'; // Importing necessary components from React Native
import { useNavigation } from '@react-navigation/native'; // Importing navigation hook for navigating between screens
import { database } from '../firebaseConfig'; // Import Firebase configuration
import { ref, onValue } from 'firebase/database'; // Importing Firebase methods for accessing the database
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation(); // Initializing navigation
  const [events, setEvents] = useState([]); // Initialize state to hold events

  // Fetch sessions from Firebase Realtime Database
  useEffect(() => {
    const eventsRef = ref(database, 'Session'); // Reference to 'Session' node in Firebase

    // Listen for changes in the 'Session' node
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val(); // Get the data snapshot
      if (data) {
        // Convert fetched events to an array and parse the date and time
        let fetchedEvents = Object.keys(data).map((key) => ({
          id: key, // Unique identifier for the event
          title: data[key].name, // Event title
          track: data[key].track, // Track associated with the event
          date: data[key].date, // Date of the event
          startTime: data[key].startTime, // Start time of the event
          endTime: data[key].endTime, // End time of the event
          
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
    return () => unsubscribe(); // Unsubscribe from the database on unmount
  }, []);

  // Navigate to EventDetails screen with relevant data and the event ID
  const handleNavigate = (id, title, date, startTime, endTime) => {
    navigation.navigate('EventDetails', { id, title, date, startTime, endTime }); // Pass event details to the next screen
  };

  // Handle "Tracks" button to open external link
  const handleTracksPress = () => {
    Linking.openURL('https://acis.aaisnet.org/acis2024/tracks/'); // Open the URL for tracks
  
  };

  // Handle navigation to QR Code Screen
  const handleCheckInPress = () => {
    navigation.navigate('Check-in'); // Navigate to Check-in screen
  };

  const handleSitePress = () => {
    navigation.navigate('Site'); // Navigate to Site screen
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('userToken');
      navigation.replace('GoogleSignIn');
    } catch (error) {
      console.error(error);
    }
  };

  // Render each event card
  const renderItem = ({ item }) => (
    
    <View style={styles.cardWrapper}> 
    {/* Wrapper for each event card */}
      <TouchableOpacity onPress={() => handleNavigate(item.id, item.title, item.date, item.startTime, item.endTime)}>
        <View style={styles.eventCard}> 
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>Date: {item.date}</Text>
          <Text style={styles.details}>Duration: {item.startTime} - {item.endTime}</Text>
          <Text style={styles.details}>Track: {item.track}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    // Main container for the screen 
    <View style={styles.mainContainer}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image source={require('../images/user-icon.jpg')} style={styles.profileIcon} />
        <View>
          <Text style={styles.greetingText}>Hello, User!</Text>
          <Text style={styles.subText}>Welcome to the ACIS Event Mangagement App</Text>
        </View>
      </View>

      {/* Combined Card for Navigation, Upcoming Sessions, and Leaderboard */}
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

        {/* Upcoming Sessions Section */}
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
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#304067', // Background color of the main container
  },
  headerContainer: {
    backgroundColor: '#304067', // Background color for the header
    padding: 20, // Padding inside the header
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically
    marginBottom: 20, // Margin at the bottom of the header
  },
  profileIcon: {
    width: 50, // Width of the profile icon
    height: 50, // Height of the profile icon
    marginRight: 15, // Margin to the right of the profile icon
  },
  greetingText: {
    fontSize: 24, // Font size for greeting text
    fontWeight: 'bold', // Make the greeting text bold
    color: '#fff', // Color of the greeting text
  },
  subText: {
    fontSize: 16, // Font size for the subtitle
    color: '#fff', // Color of the subtitle
  },
  combinedCard: {
    flex: 1, // Take up available space
    backgroundColor: '#FCFAF8', // Background color for the combined card
    borderRadius: 15, // Rounded corners for the card
    paddingVertical: 30, // Vertical padding inside the card
    paddingHorizontal: 20, // Horizontal padding inside the card
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    elevation: 3, // Elevation for Android shadow effect
    marginHorizontal: 15, // Horizontal margin around the card
    marginBottom: 30, // Bottom margin
  },
  navContainer: {
    flexDirection: 'row', // Arrange navigation buttons in a row
    justifyContent: 'space-between', // Space out navigation buttons evenly
    marginBottom: 20, // Margin at the bottom of the navigation container
  },
  navButton: {
    backgroundColor: '#F9F2E7', // Background color for navigation buttons
    padding: 10, // Padding inside the navigation button
    borderRadius: 10, // Rounded corners for the button
    alignItems: 'center', // Center items inside the button
    width: '30%', // Width of the button
    elevation: 2, // Elevation for Android shadow effect
  },
  navIcon: {
    width: 40, // Width of the navigation icon
    height: 40, // Height of the navigation icon
    marginBottom: 5, // Margin at the bottom of the icon
  },
  navText: {
    fontSize: 16, // Font size for navigation button text
    color: '#000', // Color of the navigation text
  },
  sectionHeader: {
    fontSize: 20, // Font size for section headers
    fontWeight: 'bold', // Make section headers bold
    marginBottom: 10, // Margin at the bottom of the section header
    color: '#304067', // Color of the section header
  },
  flatList: {
    paddingHorizontal: 10, // Horizontal padding for FlatList
    marginBottom: 10, // Margin at the bottom of the FlatList
  },
  cardWrapper: {
    marginRight: 10, // Margin to the right of each card
  },
  eventCard: {
    backgroundColor: '#F9F2E7', // Background color for event cards
    borderRadius: 10, // Rounded corners for event cards
    padding: 20, // Padding inside the event card
    marginBottom: 10, // Margin at the bottom of the event card
    shadowColor: '#000', // Shadow color for the event card
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for the event card
    shadowOpacity: 0.1, // Shadow opacity for the event card
    shadowRadius: 5, // Shadow radius for the event card
    elevation: 3, // Elevation for Android shadow effect
    width: 190, // Fixed width for the event card
  },
  title: {
    fontSize: 19, // Font size for event title
    fontWeight: 'bold', // Make the title bold
    color: '#000', // Color of the title text
    marginBottom: 10, // Margin at the bottom of the title
    textAlign: 'center', // Center the title text
  },
  details: {
    fontSize: 14, // Font size for event details
    color: '#000', // Color of the detail text
  },
  leaderboardContainer: {
    flexDirection: 'column', // Display leaderboard cards in a column
    marginTop: 10, // Margin at the top of the leaderboard container
  },
  leaderboardCard: {
    backgroundColor: '#F9F2E7', // Background color for leaderboard cards
    flexDirection: 'row', // Arrange items in a row within leaderboard card
    alignItems: 'center', // Center items vertically in the card
    padding: 20, // Padding inside the leaderboard card
    borderRadius: 10, // Rounded corners for leaderboard cards
    marginBottom: 10, // Margin at the bottom of each leaderboard card
    shadowColor: '#000', // Shadow color for the leaderboard card
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for the leaderboard card
    shadowOpacity: 0.1, // Shadow opacity for the leaderboard card
    shadowRadius: 5, // Shadow radius for the leaderboard card
    elevation: 3, // Elevation for Android shadow effect
  },
  medalIcon: {
    width: 30, // Width of the medal icon
    height: 30, // Height of the medal icon
    marginRight: 10, // Margin to the right of the medal icon
  },
  leaderText: {
    fontSize: 16, // Font size for leader text
    color: '#000', // Color of the leader text
  },
  signOutButton: {
    backgroundColor: '#F9F2E7',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 30,
  },
  signOutText: {
    fontSize: 16,
    color: '#000',
  },
});