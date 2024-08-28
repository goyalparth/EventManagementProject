import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import EventsCard from '../Components/EventsCard';
import { useNavigation } from '@react-navigation/native';

const ProgramScreen = () => {
  const navigation = useNavigation();

  const handleNavigate = (title, label, description) => {
    navigation.navigate('EventDetails', { title, label, description });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <EventsCard
        title="Event1"
        label="0810 hours"
        onNavigate={() => handleNavigate('Event1', '0810 hours',"Event 1 description")}
      />
      <EventsCard
        title="Event2"
        label="1000 hours"
        onNavigate={() => handleNavigate('Event2', '1000 hours',"Event 2 description")}
      />
      <EventsCard
        title="Event3"
        label="1100 hours"
        onNavigate={() => handleNavigate('Event3', '1100 hours',"Event 3 description")}
      />
      <EventsCard
        title="Event1"
        label="0810 hours"
        onNavigate={() => handleNavigate('Event1', '0810 hours',"Event 1 description")}
      />
      <EventsCard
        title="Event2"
        label="1000 hours"
        onNavigate={() => handleNavigate('Event2', '1000 hours',"Event 2 description")}
      />
      <EventsCard
        title="Event3"
        label="1100 hours"
        onNavigate={() => handleNavigate('Event3', '1100 hours',"Event 3 description")}
      />
      <EventsCard
        title="Event1"
        label="0810 hours"
        onNavigate={() => handleNavigate('Event1', '0810 hours',"Event 1 description")}
      />
      <EventsCard
        title="Event2"
        label="1000 hours"
        onNavigate={() => handleNavigate('Event2', '1000 hours',"Event 2 description")}
      />
      <EventsCard
        title="Event3"
        label="1100 hours"
        onNavigate={() => handleNavigate('Event3', '1100 hours',"Event 3 description")}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
});

export default ProgramScreen;
