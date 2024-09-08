import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AnnouncementsHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
        <Image
          source={require('../images/announcement-icon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15,
    height: 60,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default AnnouncementsHeader;
