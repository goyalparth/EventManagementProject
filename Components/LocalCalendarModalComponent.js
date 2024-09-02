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
import { listCalendars } from '../services/LocalCalendarService';

const LocalCalendarModalComponent = (props) => {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    const loadCalendars = async () => {
      const calendarsTmp = await listCalendars();
      setCalendars(calendarsTmp);
    };
    if (props.isVisible) {
      loadCalendars();
    }
  }, [props.isVisible]);

  return (
    <Modal
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.closeModal}
      animationType="slide">
      <TouchableWithoutFeedback onPress={props.closeModal}>
        <View style={styles.backdrop}>
          <View style={styles.agendaModalBody}>
            <Text style={styles.title}>{props.label} :</Text>
            <View style={styles.agendaList}>
              <ScrollView>
                {calendars.map((calendar, i) =>
                  calendar.allowsModifications ? (
                    <TouchableOpacity
                      key={i}
                      onPress={() => props.handleCalendarSelected(calendar)}
                      style={[
                        styles.calendarOption,
                        {backgroundColor: calendar.color},
                      ]}>
                      <Text key={i} style={[styles.defaultText]}>
                        {calendar.title}
                      </Text>
                    </TouchableOpacity>
                  ) : null
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
