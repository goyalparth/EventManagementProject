// LinkedInSignIn.js

import React, { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { Linking } from 'react-native';

const LINKEDIN_CLIENT_ID = '86p07gmy2sewyy'; // Replace with your LinkedIn Client ID
const LINKEDIN_CLIENT_SECRET = 'PUZV8VOdJkWREdHu'; // Replace with your LinkedIn Client Secret
const SCOPE = 'openid profile w_member_social email';
const STATE = `linkedin${new Date().getTime()}`; // Unique state parameter
const REDIRECT_URI = 'https://capstone-project-432506-default-rtdb.firebaseio.com/linkedin/callback'; // Must match the redirect URI in LinkedIn app settings
const AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&scope=${SCOPE}&state=${STATE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const USER_INFO_URL = 'https://api.linkedin.com/v2/userinfo';

const LinkedInSignIn = () => {
  useEffect(() => {
    const handleURL = (url) => {
      const { path, queryParams } = Linking.parse(url);
      console.log("hellow 2");
      
      // Check if the URL is the redirect URI and if it contains a code
      if (path === REDIRECT_URI && queryParams.code) {
        const { code } = queryParams;
        
        fetchAccessToken(code);
      }
    };

    

    const linkingListener = Linking.addEventListener('url', ({ url }) => handleURL(url));

    return () => {
      linkingListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    try {
        console.log("Hello")
      // Open LinkedIn login page
      await Linking.openURL(AUTH_URL);
      console.log("Hello2")
    } catch (error) {
      Alert.alert('Error', 'Failed to open LinkedIn login page');
      console.error(error);
    }
  };

  const fetchAccessToken = async (code) => {
    try {
        console.log("Hello")
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        }),
      });

      const data = await response.body.json();
      if (data.error) {
        Alert.alert('Error', `Error fetching access token: ${data.error_description}`);
        return;
      }
      console.log('Access Token:', data.access_token);
      
      
      // Fetch user details using the access token
      fetchUserDetails(data.access_token);
      
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const fetchUserDetails = async (accessToken) => {
    try {
      const userInfoResponse = await fetch(USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const userInfo = await userInfoResponse.json();
      console.log('User Info:', userInfo);
      
      // Handle user information as needed
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Sign in with LinkedIn" onPress={handleLogin} />
    </View>
  );
};

export default LinkedInSignIn;
