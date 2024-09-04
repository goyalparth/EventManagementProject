import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import HomeScreen from "./screens/Home";
import ProgramStack from './Navigation/ProgramStack';
import SpeakerScreen from "./screens/Speaker";
import OrganisersScreen from "./screens/Organisers";
import AnnouncementsScreen from "./screens/Announcements";
import EventDetailsScreen from './screens/EventDetails';
import AnnouncementsHeader from './Components/AnnouncementsHeader';
import { FavoriteProvider } from './context/FavoriteContext';
import { EventProvider } from './context/EventContext';
import CommitteeScreen from './screens/Committee'; 
import AddEventScreen from './screens/AddEvent'; // Import AddEvent Screen

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  // Function to handle navigation reset
  const handleNavigationReset = (navigation, routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  };

  // Options for screens, including the custom header right button
  const screenOptions = ({ navigation }) => ({
    headerRight: () => <AnnouncementsHeader navigation={navigation} />,
  });

  // Drawer Navigator including all screens
  const DrawerNavigator = () => (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Home');
          },
        })}
      />
      <Drawer.Screen
        name="Program"
        component={ProgramStack}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Program');
          },
        })}
      />
      <Drawer.Screen
        name="Speaker"
        component={SpeakerScreen}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Speaker');
          },
        })}
      />
      <Drawer.Screen 
        name="Committee" 
        component={CommitteeScreen} 
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Committee');
          },
        })}
      />
      <Drawer.Screen
        name="Organisers"
        component={OrganisersScreen}
        options={screenOptions}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Organisers');
          },
        })}
      />
    </Drawer.Navigator>
  );

  return (
    <EventProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Announcements"
            component={AnnouncementsScreen}
            options={screenOptions}
          />
          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
          />
          <Stack.Screen
            name="AddEvent" // Add the AddEvent screen to the stack navigator
            component={AddEventScreen}
            options={{ title: 'Add New Event' }}
          />
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </EventProvider>
  );
}
