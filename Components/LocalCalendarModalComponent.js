import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { listCalendars, fetchAllEvents } from '../services/LocalCalendarService';

const LocalCalendarModalComponent = (props) => {
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadCalendars = async () => {
      const calendarsTmp = await listCalendars();
      setCalendars(calendarsTmp);
    };

    const loadEvents = async () => {
      const startDate = new Date().toISOString(); // Example start date
      const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(); // Example end date
      const fetchedEvents = await fetchAllEvents(startDate, endDate);
      setEvents(fetchedEvents);
    };

    if (props.isVisible) {
      loadCalendars();
      loadEvents();
    }
  }, [props.isVisible]);

  return (
    <Modal
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.closeModal}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={props.closeModal}>
        <View style={styles.backdrop}>
          <View style={styles.agendaModalBody}>
            <Text style={styles.title}>{props.label} :</Text>
            <View style={styles.agendaList}>
              <ScrollView>
                {calendars.length > 0 ? (
                  calendars.map((calendar, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => props.handleCalendarSelected(calendar)}
                      style={[
                        styles.calendarOption,
                        { backgroundColor: calendar.allowsModifications ? calendar.color : '#d3d3d3' },
                      ]}
                      disabled={!calendar.allowsModifications}
                    >
                      <Text style={[styles.defaultText, { color: calendar.allowsModifications ? '#000' : '#888' }]}>
                        {calendar.title} {calendar.allowsModifications ? '' : '(Read-only)'}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.defaultText}>No calendars found</Text>
                )}
                {/* Optional: Displaying fetched events */}
                <Text style={styles.title}>Fetched Events:</Text>
                {events.length > 0 ? (
                  events.map((event, i) => (
                    <Text key={i} style={styles.defaultText}>{event.title}</Text>
                  ))
                ) : (
                  <Text style={styles.defaultText}>No events found</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

LocalCalendarModalComponent.propTypes = {
  isVisible: PropTypes.bool,
  closeModal: PropTypes.func,
  handleCalendarSelected: PropTypes.func,
  label: PropTypes.string,
};

LocalCalendarModalComponent.defaultProps = {
  isVisible: false,
  closeModal: () => {},
  handleCalendarSelected: () => {},
  label: 'Select a calendar',
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  agendaModalBody: {
    backgroundColor: '#fff',
    padding: 5,
  },
  agendaList: {
    marginTop: 10,
  },
  calendarOption: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  defaultText: {
    fontSize: 16,
    color: '#000',
  },
});

export default LocalCalendarModalComponent;
