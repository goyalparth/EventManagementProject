import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const EventsCard = ({ title, label, onNavigate, style }) => {
  return (
    <View style={[styles.cardBody, style]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      
      {onNavigate ? (
        <TouchableOpacity onPress={onNavigate} style={styles.iconContainer}>
          <Image source={require('../images/navigate-next.png')} style={styles.icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardBody: {
    paddingHorizontal: 12,
    marginBottom: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
    position: 'relative',
    width: 200, // Ensure cards have a defined width
    paddingRight: 50, // Add padding to ensure space for the icon
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
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 32,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default EventsCard;
