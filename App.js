import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import HomeScreen from './screens/Home';
import ProgramStack from './Navigation/ProgramStack';
import SpeakerScreen from './screens/Speaker';
import OrganisersScreen from './screens/Organisers';
import AnnouncementsScreen from './screens/Announcements';
import EventDetailsScreen from './screens/EventDetails';
import AnnouncementsHeader from './Components/AnnouncementsHeader';
import {FavoriteProvider} from './context/FavoriteContext';
import {EventProvider} from './context/EventContext';
import CommitteeScreen from './screens/Committee';
import AddEventScreen from './screens/AddEvent'; // Import AddEvent Screen
import Signin from './screens/Signin';
import Splash from './screens/Splash';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  // Function to handle navigation reset
  const handleNavigationReset = (navigation, routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: routeName}],
      }),
    );
  };

  // Options for screens, including the custom header right button
  const screenOptions = ({navigation}) => ({
    headerRight: () => <AnnouncementsHeader navigation={navigation} />,
    headerStyle: {
      backgroundColor: '#304067', // Set the background color of the top bar (toolbar)
    },
    headerTintColor: '#FCFAF8', // Set the color of the icons and buttons in the toolbar
    headerTitle: 'ACIS', // Optionally remove the title
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 24, // Increase header title font size
      fontWeight: 'bold', // Make the header title bold
    },
  });

  // Drawer Navigator including all screens
  const DrawerNavigator = () => (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={screenOptions}
        listeners={({navigation}) => ({
          drawerItemPress: e => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Home');
          },
        })}
      />
      <Drawer.Screen
        name="Program"
        component={ProgramStack}
        options={screenOptions}
        listeners={({navigation}) => ({
          drawerItemPress: e => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Program');
          },
        })}
      />
      <Drawer.Screen
        name="Speaker"
        component={SpeakerScreen}
        options={screenOptions}
        listeners={({navigation}) => ({
          drawerItemPress: e => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Speaker');
          },
        })}
      />
      <Drawer.Screen
        name="Committee"
        component={CommitteeScreen}
        listeners={({navigation}) => ({
          drawerItemPress: e => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Committee');
          },
        })}
      />
      <Drawer.Screen
        name="Organisers"
        component={OrganisersScreen}
        options={screenOptions}
        listeners={({navigation}) => ({
          drawerItemPress: e => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Organisers');
          },
        })}
      />
      {/* <Drawer.Screen
        name="AddEvent" // Add the AddEvent screen to the drawer
        component={AddEventScreen}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'AddEvent');
          },
        })}
      /> */}
    </Drawer.Navigator>
  );

  return (
    <EventProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{headerShown: false}} // Hide the header for the drawer screen
          />
          <Stack.Screen
            name="Announcements"
            component={AnnouncementsScreen}
            options={screenOptions} // Apply the global toolbar styling here
          />
          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
            options={screenOptions} // Apply the same global screen options here
          />
          <Stack.Screen
            name="AddEvent"
            component={AddEventScreen}
            options={{
              headerStyle: {
                backgroundColor: '#304067', // Set the toolbar background color
              },
              headerTintColor: '#FCFAF8', // Set the icon color
              headerTitle: '', // Optionally remove the title for AddEvent screen
            }}
          />
        </Stack.Navigator>
        {/* <Toast ref={ref => Toast.setRef(ref)} /> */}
      </NavigationContainer>
    </EventProvider>
  );
}
