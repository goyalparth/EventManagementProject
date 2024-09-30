import RNCalendarEvents from 'react-native-calendar-events';
import { PermissionsAndroid, Platform } from 'react-native';

// Function to request calendar permissions
const requestCalendarPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
      PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
    ]);
    return (
      granted[PermissionsAndroid.PERMISSIONS.READ_CALENDAR] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR] === PermissionsAndroid.RESULTS.GRANTED
    );
  } else {
    // For iOS, permissions are handled via Info.plist
    return true; // Assuming permission granted for demonstration
  }
};

// Function to list calendars
export const listCalendars = async () => {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      console.log('Calendar permission denied');
      return [];
    }
    const calendars = await RNCalendarEvents.findCalendars();
    return calendars;
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return [];
  }
};

// Function to add a calendar event
export const addCalendarEvent = async (event, calendar) => {
  try {
    const eventId = await RNCalendarEvents.saveEvent(event.title, {
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
      calendarId: calendar.id, // Make sure calendar.id is passed correctly
    });
    return eventId; // Return the event ID
  } catch (error) {
    console.error('Error adding calendar event:', error);
  }
};

// Function to remove an event from the calendar
export const removeCalendarEvent = async (eventId) => {
  try {
    await RNCalendarEvents.removeEvent(eventId);
  } catch (error) {
    console.error('Error removing calendar event:', error);
  }
};

// Function to fetch all events from the calendar
export const fetchAllEvents = async (startDate, endDate) => {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      console.log('Calendar permission denied');
      return [];
    }
    const events = await RNCalendarEvents.fetchAllEvents(startDate, endDate);
    return events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
  }
};
