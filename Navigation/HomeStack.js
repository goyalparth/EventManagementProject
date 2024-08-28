import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import AnnouncementsScreen from '../screens/Announcements';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
