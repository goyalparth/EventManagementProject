import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import EventsCard from '../Components/EventsCard';
import { events as initialEvents } from '../data/EventData'; // Import the events data
import { useNavigation } from '@react-navigation/native';

const ProgramScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState(initialEvents);

  const handleNavigate = (title, label, description, startDate, endDate) => {
    navigation.navigate('EventDetails', { title, label, description, startDate, endDate });
  };

  const toggleFavorite = (id) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, isFavorite: !event.isFavorite } 
        : event
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.cardContainer}>
        {events.map((event) => (
          <EventsCard
            key={event.id}
            title={event.title}
            label={event.label}
            isFavorite={event.isFavorite}
            onFavoriteToggle={() => toggleFavorite(event.id)}
            onNavigate={() => handleNavigate(event.title, event.label, event.description, event.startDate, event.endDate)}
          />
        ))}
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
    justifyContent: 'flex-start',
  },
});

export default ProgramScreen;
