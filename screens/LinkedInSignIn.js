// src/LinkedInSignIn.js
import React, { useState } from 'react';
import { View, Button, Alert, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const CLIENT_ID = '86p07gmy2sewyy';
const CLIENT_SECRET = 'PUZV8VOdJkWREdHu';
const REDIRECT_URI = 'https://www.linkedin.com/developers/tools/oauth/redirect'; 

const LinkedInSignIn = () => {
  const [email, setEmail] = useState(null);
  const [payload, setPayload] = useState(null);
  const [authUrl, setAuthUrl] = useState('');

  // Function to initiate LinkedIn login
  const initiateLinkedInLogin = () => {
    console.log("hell");    
    // Console.log("helLLLl");    

    const scope = 'openid profile w_member_social email';
    const state = `linkedin${new Date().getTime()}`;
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&state=${state}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    // handleNavigationStateChange();
    setAuthUrl(url);
    
  };

  const getUser = async (data) => {
    
    // data = 'AQWGGq3Byf2cdQ-Yq1D26sCOT-Fjkszmx74KyS-uZThanG2GDCTIxEGl-slMCjRkJN51IYom4MUMPnb_9FfcxOSOqrM7s3sILo6vQ6Z4wmwB5z4HEAD_bMhMaW94uNa1xndxGQFIEp_QQ1AA--OYPJ55e9f_jhHd2d_Cm9W3tlp9D1lVh7oy87NCGLwzE-g-rET9WPYgoZqz_b35rYORBm1qc-gNFT3nwyyx7rykWbfAWa51ljVsK5IvaWj3_5F9r5EmVhc_9JoSmUURXbJA2aJOBLrdUjATiUEhZkPOd2FEgTWXO0YtVN7l9iElQixw6-3jHHiEP-ySmCS2swiKhw8DosKQ';
    // const { access_token } = data;
    console.log("************"+data);
    const response = await fetch(
      'https://api.linkedin.com/v2/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.toString()}`,
        },
      }
    );
    console.log("Response Status:", response.status);
    const responseBody = await response.body(); // Get the response body as text
    console.log("Response Body:", responseBody);
  //   if (!response.ok) {
  //     console.error("Failed to fetch user data", response.statusText);
  //     return;
  // }

    console.log(response.body());
    const userData = await response.json();
    // Extracting specific details to log
    const firstName = userData.firstName.localized.en_US;
    const lastName = userData.lastName.localized.en_US;
    // const profilePicture = userData.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier || 'No Profile Picture';
    
    // Log specific details
    console.log("First Name:", firstName.toString());
    console.log("Last Name:", lastName);
    // console.log("Profile Picture URL:", profilePicture);
    setPayload(userData); // Store the user data in state
  };

  const getUserEmailId = async (data) => {
    // console.log("tokenData");
    // const { access_token } = data;
    const response = await fetch(
      'https://api.linkedin.com/v2/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data}`,
        },
      }
    );
    console.log("Response Status:", response.status);
    const responseBody = await response.body(); // Get the response body as text
    console.log("Response Body:", responseBody);

    
    const emailData = await response.json();
    setEmail(emailData.elements[0]['handle~'].emailAddress); // Store email in state
    handleGetUser();
  };

  const handleNavigationStateChange = async (navState) => {
    // console.log("Current URL: ", navState.url);

    // Ensure the URL starts with the expected REDIRECT_URI
    if (navState.url.startsWith(REDIRECT_URI)) {
        try {
          // console.log(navState.url);

          const startStr = "code="; // Start string
          const endStr = "&state="; // End string

          // Find the index of the start and end strings
          const startIndex = navState.url.indexOf(startStr);
          const endIndex = navState.url.indexOf(endStr);
          // Adjust startIndex to the character after the start string
          const code = navState.url.substring(startIndex + startStr.length, endIndex).trim(); // Extract substring and trim spaces

            // Create a URL object to parse the navState.url
            // const code = new URL(navState.url).searchParams.get('?code');

            // Extract the authorization code from the URL parameters
            // const code = url.searchParams.get('code');

            // console.log('Authorization Code:');
            // console.log(`Authorization Code: ${code ? code : 'No code found'}`);

            // Proceed only if the code is valid
            if (code) {
                // Use the extracted code for token request
                const body = new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                }).toString();

                // console.log("Request Body: ", body);

                const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body,
                });

                // console.log("Token Response Status: ", tokenResponse.status); // Log status code
                const tokenData = await tokenResponse.json();
                // console.log("Token Data Response:", tokenData); // Log the entire response

                if (tokenData) {
                    // console.log("Access Token Received: ", tokenData.access_token);
                    // console.log(tokenData);
                    // getUser(tokenData.access_token.toString());
                    getUserEmailId(tokenData.access_token.toString());
                } 
                // else {
                //     console.log("No access token found. Check the response for errors.");
                //     if (tokenData.error) {
                //         console.error("Error obtaining access token:", tokenData.error);
                //         console.error("Error description:", tokenData.error_description);
                //     }
                // }
            }
        } catch (error) {
            // console.error("Error parsing the URL: ", error);
        }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Login with LinkedIn" onPress={initiateLinkedInLogin} />
      {authUrl ? (
        <WebView
          source={{ uri: authUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          style={{ flex: 1 }}
        />
      ) : null}
    </View>
  );
};

export default LinkedInSignIn;
