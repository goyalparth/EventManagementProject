// LocalCalendarService.js

import RNCalendarEvents from 'react-native-calendar-events';

export const listCalendars = async () => {
  try {
    const calendars = await RNCalendarEvents.findCalendars();
    return calendars;
  } catch (error) {
    console.error(error);
  }
};

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
    console.error(error);
  }
};

// Function to remove an event from the calendar
export const removeCalendarEvent = async (eventId) => {
  try {
    await RNCalendarEvents.removeEvent(eventId);
  } catch (error) {
    console.error(error);
  }
};
