import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const EventDetailsScreen = ({ route }) => {
  const { title, label, description, speaker } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      visibilityTime: 2000,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Image
              source={isFavorite ? require('../images/added_favourite.jpg') : require('../images/favourite.png')}
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
    padding: 0,
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
    width: 24,
    height: 24,
  },
});

export default EventDetailsScreen;
