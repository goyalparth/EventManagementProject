import 'react-native-gesture-handler'; // Required for handling gestures in the app
import React from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native'; // Provides navigation capabilities and common actions like reset
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'; // Handles drawer navigation
import { createStackNavigator } from '@react-navigation/stack'; // Used for creating stacks within navigation
import { Image, StyleSheet, View } from 'react-native'; // Basic React Native components for UI
import Toast from 'react-native-toast-message'; // A library for displaying toast messages across the app
import HomeScreen from "./screens/Home"; // Import the Home screen
import ProgramStack from './Navigation/ProgramStack'; // Import for the program stack, which handles session navigation
import AnnouncementsScreen from "./screens/Announcements"; // Import the Announcements screen
import EventDetailsScreen from './screens/EventDetails'; // Import the EventDetails screen
import AnnouncementsHeader from './Components/AnnouncementsHeader'; // Import the custom header for Announcements
import { FavoriteProvider } from './context/FavoriteContext'; // Provide favorite events context to the app
import { EventProvider } from './context/EventContext'; // Provide event management context to the app
import AddEventScreen from './screens/AddEvent'; // Import screen for adding new events
import AddAnnouncement from './screens/AddAnnouncement'; // Import screen for adding announcements
import QRCodeScreen from './screens/QRCodeScanner'; // Import screen for QR code scanner
import About from './screens/About'; // Import About screen
import OrganisersScreen from './screens/Organisers'; // Import screen for the organizing committee
import Site from './screens/Site'; // Import site information screen
import LinkedInSignIn from './screens/LinkedInSignIn';

// Initialize the drawer and stack navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Custom drawer content component to include the ACIS logo at the top
const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    {/* Logo at the top of the drawer */}
    <View style={styles.logoContainer}>
      <Image
        source={require('./images/acis-logo.png')}
        style={styles.logo}
      />
    </View>
    {/* List of drawer items */}
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

export default function App() {
  // Function to reset the navigation stack to ensure only one route is in the history
  const handleNavigationReset = (navigation, routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // Set the index to 0 so it's the only screen
        routes: [{ name: routeName }], // The new route to navigate to
      })
    );
  };

  // Global options applied to all screens in the stack, such as header styling and button configuration
  const screenOptions = ({ navigation }) => ({
    // Custom header component with Announcements button
    headerRight: () => <AnnouncementsHeader navigation={navigation} />,
    headerStyle: {
      backgroundColor: '#304067', // Set the top bar background color
    },
    headerTintColor: '#FCFAF8', // Set color for icons and text in the header
    headerTitle: 'ACIS', // Title for the header bar
    headerTitleAlign: 'center', // Align title to the center
    headerTitleStyle: {
      fontSize: 24, // Font size for the title text
      fontWeight: 'bold', // Make the title text bold
    },
  });

  // Drawer navigation structure, including key app sections like Home, Sessions, and Check-in
  const DrawerNavigator = () => (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      {/* Home screen */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={screenOptions} // Apply global screen options
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            handleNavigationReset(navigation, 'Home'); // Reset stack and navigate to Home
          },
        })}
      />
      {/* Site screen */}
      <Drawer.Screen
        name="Site"
        component={Site}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Site');
          },
        })}
      />
      {/* Sessions screen (program stack) */}
      <Drawer.Screen
        name="Sessions"
        component={ProgramStack}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Sessions');
          },
        })}
      />
      {/* QR Code Check-in screen */}
      <Drawer.Screen
        name="Check-in"
        component={QRCodeScreen}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Check-in');
          },
        })}
      />
      {/* Committee screen */}
      <Drawer.Screen
        name="Committee"
        component={OrganisersScreen}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Committee');
          },
        })}
      />
      {/* About screen */}
      <Drawer.Screen
        name="About"
        component={About}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'About');
          },
        })}
      />
    </Drawer.Navigator>
  );

  return (
    // Wrap app in event context provider to manage event data
    <EventProvider>
      <NavigationContainer>
        {/* Stack Navigator to handle navigation between screens */}
        <Stack.Navigator>
        <Stack.Screen
              name="LinkedInSignIn"
              component={LinkedInSignIn} // Show LinkedIn sign-in screen first
              options={{ headerShown: false }}
            />
          {/* Main drawer navigation screen */}
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{ headerShown: false }} // Hide the header for the drawer
          />
          {/* Announcements screen */}
          <Stack.Screen
            name="Announcements"
            component={AnnouncementsScreen}
            options={screenOptions} // Apply global styling here
          />
          {/* Event details screen */}
          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
            options={screenOptions} // Use the same global options
          />
          {/* Add new event screen */}
          <Stack.Screen
            name="AddEvent"
            component={AddEventScreen}
            options={{
              headerStyle: {
                backgroundColor: '#304067', // Same color for the toolbar
              },
              headerTintColor: '#FCFAF8', // Set icon/text color in header
              headerTitle: '', // Remove title for this screen
            }}
          />
          {/* Add new announcement screen */}
          <Stack.Screen
            name="AddAnnouncement"
            component={AddAnnouncement}
            options={{
              headerStyle: {
                backgroundColor: '#304067', // Toolbar background color
              },
              headerTintColor: '#FCFAF8', // Set toolbar icon color
              headerTitle: '', // Remove title from the header for this screen
            }}
          />
        </Stack.Navigator>
        {/* Toast messages across the app */}
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </EventProvider>
  );
}

// Styles for the custom drawer logo container and logo itself
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20, // Space above and below the logo
  },
  logo: {
    width: 150, // Set width of the logo
    height: 150, // Set height of the logo
    resizeMode: 'contain', // Ensure the image doesn't stretch
  },
});
