import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import EventsCard from '../Components/EventsCard';
import { useNavigation } from '@react-navigation/native';

const ProgramScreen = () => {
  const navigation = useNavigation();

  const handleNavigate = (title, label, description) => {
    navigation.navigate('EventDetails', { title, label, description });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.cardContainer}>
        <EventsCard
          title="Event1"
          label="0810 hours"
          onNavigate={() => handleNavigate('Event1', '0810 hours', "Event 1 description")}
        />
        <EventsCard
          title="Event2"
          label="1000 hours"
          onNavigate={() => handleNavigate('Event2', '1000 hours', "Event 2 description")}
        />
        {/* Add more EventsCard components as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align cards to the start
  },
});

export default ProgramScreen;
