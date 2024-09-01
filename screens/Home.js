import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import EventsCard from '../Components/EventsCard';
import { events } from '../data/EventData'; // Import the events data

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

  const handleNavigate = (title, label, description, startDate, endDate) => {
    navigation.navigate('EventDetails', { title, label, description, startDate, endDate });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={() => handleNavigate(item.title, item.label, item.description, item.startDate, item.endDate)}>
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
  },
});
