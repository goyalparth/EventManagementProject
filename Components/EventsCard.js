import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// EventCard Component
const EventsCard = ({ title, label, onNavigate }) => {
  return (
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      
      {/* Image for the navigate-next icon */}
      <TouchableOpacity onPress={onNavigate} style={styles.iconContainer}>
        <Image source={require('../images/navigate-next.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBody: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 12,
    marginBottom: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    position: 'relative'  // To position the icon on the right side
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
    top: 10,
  },
  icon: {
    marginTop:10,
    width: 40,
    height: 40,
    marginRight:20
  },
});

export default EventsCard;
