import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// EventCard Component
const EventsCard = ({ title, label, description }) => {
  return (
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
};

export default EventsCard;

const styles = StyleSheet.create({
  cardBody: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 12,
    marginBottom: 5,  // Optional: Add some space between cards
    backgroundColor: '#f8f8f8',  // Optional: Background color for the card
    borderRadius: 10,  // Optional: Rounded corners for the card
    padding: 16,  // Optional: Padding inside the card
  },
  cardTitle: {
    color: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardLabel: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 6,
  },
  cardDescription: {
    color: '#000000',
    fontSize: 12,
    flexShrink: 1,
    paddingBottom: 12,
  },
});
