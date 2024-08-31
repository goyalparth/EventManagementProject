import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import EventsCard from '../Components/EventsCard';

const HomeScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
          <Image
            source={require('../images/announcement-icon.jpg')}
            style={styles.icon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const events = [
    { id: '1', title: 'Event1', label: '0810 hours', description: 'Event 1 description' },
    { id: '2', title: 'Event2', label: '1000 hours', description: 'Event 2 description' },
    { id: '3', title: 'Event3', label: '1100 hours', description: 'Event 3 description' },
    { id: '4', title: 'Event4', label: '1200 hours', description: 'Event 4 description' },
    { id: '5', title: 'Event5', label: '1400 hours', description: 'Event 5 description' },
  ];

  const handleNavigate = (title, label, description) => {
    navigation.navigate('EventDetails', { title, label, description });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={() => handleNavigate(item.title, item.label, item.description)}>
        <EventsCard
          title={item.title}
          label={item.label}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50, // Adjust based on header height
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  flatList: {
    paddingHorizontal: 10,
  },
  cardWrapper: {
    marginRight: 10,
    // Ensure cardWrapper does not cause overflow issues
  },
});
