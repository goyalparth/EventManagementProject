import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/HomeScreen';



const GoogleSignIn = ({ navigation }) => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
    checkPreviousSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: '893356202916-ioiti40f08rvt5ppch3cigi4rfn06hej.apps.googleusercontent.com', // Get this from your Google Cloud Console
      offlineAccess: true,
    });
  };

  const checkPreviousSignIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      navigation.navigate('HomeScreen');
    }
  };

  const signIn = async () => {
    if (isSigninInProgress) return;

    setIsSigninInProgress(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      if (userInfo.data && userInfo.data.idToken) {
        await AsyncStorage.setItem('userToken', userInfo.data.idToken);
        navigation.navigate('HomeScreen');
      } else {
        console.log('No ID token available. Full user info:', JSON.stringify(userInfo, null, 2));
        // Handle the case when no ID token is available
        Alert.alert(
          'Sign-In Error',
          'Unable to sign in. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log('Some other error happened:', error.toString());
      }
    } finally {
      setIsSigninInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ACIS Event Management</Text>
      <TouchableOpacity style={styles.googleButton} onPress={signIn}>
        <Image
          source={require('../images/google-logo.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#304067',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FCFAF8',
    marginBottom: 30,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFAF8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#304067',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleSignIn;
