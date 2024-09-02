// EventDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import LocalCalendarModalComponent from '../Components/LocalCalendarModalComponent';
import { addCalendarEvent, removeCalendarEvent } from '../services/LocalCalendarService';
import { useEventContext } from '../context/EventContext'; // Import the context

const EventDetailsScreen = ({ route }) => {
  const { title, label, description, speaker, startDate, endDate, id } = route.params;
  const { toggleFavorite, getEventStatus, setCalendarId } = useEventContext();
  const [isVisibleCalendars, setIsVisibleCalendars] = useState(false);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    requestCalendarPermission();
  }, []);

  const requestCalendarPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
          {
            title: 'Calendar Permission',
            message: 'This app needs access to your calendar to add events.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Calendar permission granted');
        } else {
          console.log('Calendar permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const openLocalCalendarModal = () => setIsVisibleCalendars(true);
  const closeLocalCalendarModal = () => setIsVisibleCalendars(false);

  const validateDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const saveEvent = async (calendar) => {
    if (!event.startDate || !event.endDate) {
      console.error('Event dates are missing');
      return;
    }

    const calendarId = await addCalendarEvent(event, calendar);
    setCalendarId(id, calendarId);
    closeLocalCalendarModal();
  };

  const handleFavoritePress = async () => {
    const { isFavorite, calendarId } = getEventStatus(id);

    if (isFavorite) {
      toggleFavorite(id);
      if (calendarId) {
        await removeCalendarEvent(calendarId);
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: 'Removed from favorites and calendar',
          visibilityTime: 2000,
        });
        setCalendarId(id, null);
      }
    } else {
      toggleFavorite(id);
      const eventObj = {
        title,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        description,
      };
      setEvent(eventObj);
      openLocalCalendarModal();
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Added to favorites',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <LocalCalendarModalComponent
        isVisible={isVisibleCalendars}
        closeModal={closeLocalCalendarModal}
        handleCalendarSelected={saveEvent}
        label={'Select a calendar'}
      />
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Image
              source={getEventStatus(id).isFavorite ? require('../images/added-favorite.jpg') : require('../images/favorite.png')}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.speaker}>{speaker}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#000',
  },
  label: {
    fontSize: 18,
    color: 'gray',
  },
  speaker: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: "center",
  },
  favoriteIcon: {
    width: 30,
    height: 30,
  },
});

export default EventDetailsScreen;
