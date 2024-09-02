// EventContext.js
import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({}); // { eventId: { isFavorite: true/false, calendarId: string} }

  const toggleFavorite = (eventId) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites[eventId]?.isFavorite || false;
      return {
        ...prevFavorites,
        [eventId]: {
          isFavorite: !isFavorite,
          calendarId: isFavorite ? prevFavorites[eventId]?.calendarId : null,
        },
      };
    });
  };

  const setCalendarId = (eventId, calendarId) => {
    setFavorites(prevFavorites => ({
      ...prevFavorites,
      [eventId]: {
        ...prevFavorites[eventId],
        calendarId,
      },
    }));
  };

  const getEventStatus = (eventId) => {
    return favorites[eventId] || { isFavorite: false, calendarId: null };
  };

  return (
    <EventContext.Provider value={{ toggleFavorite, getEventStatus, setCalendarId }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
