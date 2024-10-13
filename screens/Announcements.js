import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../firebaseConfig'; // Import database
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnnouncementsScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isAdminUser,setIsAdminUser] = useState(false);

  useEffect(() => {
    const announcementRef = ref(database, 'Announcement');
    onValue(announcementRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAnnouncements = [];

      for (const key in data) {
        loadedAnnouncements.push({
          key,
          ...data[key],
        });
      }

      // Sort by date and time
      loadedAnnouncements.sort((a, b) => {
        const dateA = new Date(a.dateTime); // Convert dateTime string into Date object
        const dateB = new Date(b.dateTime); // Convert dateTime string into Date object
        return dateB - dateA; // Sort in descending order, newest first
      });

      setAnnouncements(loadedAnnouncements);
    });
  }, []);
  // check for admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdmin = await AsyncStorage.getItem('isAdmin');
      setIsAdminUser(JSON.parse(isAdmin));
    };
    checkAdminStatus();
  }, []);

  const handleDelete = (key) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this announcement?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(key), // Proceed with deletion if confirmed
        },
      ],
      { cancelable: false } // Ensure the dialog cannot be dismissed by tapping outside
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#304067' }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>ANNOUNCEMENTS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {announcements.map((item) => (
          <View key={item.key} style={styles.announcement}>
            <View style={styles.announcementContent}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              {isAdminUser && (         // only show delete icon if user is admin
              <TouchableOpacity onPress={() => handleDelete(item.key)} style={styles.deleteIcon}>
                <Image source={require('../images/delete_icon.png')} style={styles.iconImage} />
              </TouchableOpacity>
            )}
            </View>
            <Text style={styles.dateTime}>{item.dateTime}</Text>
          </View>
        ))}

        {isAdminUser && (
          <TouchableOpacity onPress={() => navigation.navigate('AddAnnouncement')} style={styles.addButton}>
            <Image source={require('../images/add_icon.png')} style={styles.addIconImage} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
    paddingTop: 30,
    height: '100%',
    backgroundColor: '#304067', // Main background color
  },
  headerContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#FCFAF8', // Same header text color
  },
  container: {
    backgroundColor: '#F9F2E7',
    flex: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  announcement: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#FDFDFD',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  announcementContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10, // Add space between text and delete icon
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
  },
  deleteIcon: {
    padding: 5,
    marginTop: -20,
  },
  dateTime: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: '#da5e5a',
  },
  addButton: {
    backgroundColor: '#304067',
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addIconImage: {
    width: 20,
    height: 20,
    tintColor: '#fff', // Optional: tint the image color to white
  },
});

export default AnnouncementsScreen;
