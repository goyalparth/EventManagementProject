import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, onValue } from 'firebase/database'; // Import Firebase
import { database } from '../firebaseConfig'; // Your Firebase config

const AnnouncementsHeader = ({ navigation }) => {
  const [hasUnseen, setHasUnseen] = useState(false);
  const [latestAnnouncementKey, setLatestAnnouncementKey] = useState(null);

  useEffect(() => {
    const announcementRef = ref(database, 'Announcement');

    // Listen for changes in announcements
    const unsubscribe = onValue(announcementRef, async (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const announcements = Object.keys(data);
        const latestKey = announcements[announcements.length - 1]; // Get the key of the latest announcement
        setLatestAnnouncementKey(latestKey); // Store the latest announcement key

        try {
          const lastSeenAnnouncement = await AsyncStorage.getItem('lastSeenAnnouncement');
          // console.log('Last Seen Announcement Key:', lastSeenAnnouncement); // Debugging Log

          // If the latest announcement is different from what the user last saw, mark it as unseen
          if (lastSeenAnnouncement !== latestKey) {
            // console.log('New announcement available! Marking as unseen.'); // Debugging Log
            setHasUnseen(true); // Change the icon to unseen
          } else {
            // console.log('No new announcements.'); // Debugging Log
            setHasUnseen(false); // Keep the icon as seen
          }
        } catch (error) {
          console.error('Error fetching unseen status:', error);
        }
      }
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  const handleIconPress = async () => {
    // Update the last seen announcement to the latest one
    if (latestAnnouncementKey) {
      await AsyncStorage.setItem('lastSeenAnnouncement', latestAnnouncementKey);
      // console.log('Marked announcement as seen:', latestAnnouncementKey); // Debugging Log
      setHasUnseen(false); // Mark announcements as seen after user clicks
    }
    navigation.navigate('Announcements');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleIconPress}>
        <Image
          source={hasUnseen
            ? require('../images/announcement_unseen.png')  // Change to unseen icon
            : require('../images/announcement-icon.png')   // Default seen icon
          }
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
