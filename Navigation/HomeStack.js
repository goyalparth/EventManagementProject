import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import AnnouncementsScreen from '../screens/Announcements';
import GoogleSignIn from '../screens/GoogleSignIn';
import DrawerNavigator from '../screens/DrawerNavigator';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="GoogleSignIn">
      <Stack.Screen
        name="GoogleSignIn"
        component={GoogleSignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
