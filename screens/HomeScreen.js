import React, { useState } from 'react';
import { View, Text, Image, Alert, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const HomeScreenn = (props) => {
    const { FName, LName, EmailId, ImageUri } = props.route.params;
    const [isLoggedOut, setIsLoggedOut] = useState(false);
  
    const logoutFun = async () => {
        // Set logged out state and update AsyncStorage
        setIsLoggedOut(true);
        await AsyncStorage.setItem('ISLOGGEDIN', 'false');
        // Navigate back to the login screen
        props.navigation.replace('LoginWithLinkedIn');
    };
  
    return (
        <View style={styles.container}>
            {/* Display user profile image */}
            <Image style={styles.image} source={{ uri: ImageUri }} />
            {/* Display user's full name */}
            <Text style={styles.text}>{`${FName} ${LName}`}</Text>
            {/* Display user's email */}
            <Text style={styles.text}>{EmailId}</Text>
            
            {/* Logout button */}
            <Button title="Logout" onPress={logoutFun} />

            {/* Conditional rendering for WebView logout */}
            {isLoggedOut && (
                <View style={{ width: 0, height: 0 }}> {/* Adjusted size for invisible WebView */}
                    <WebView
                        source={{ uri: 'https://www.linkedin.com/m/logout' }}
                        javaScriptEnabled
                        domStorageEnabled
                        sharedCookiesEnabled
                    />
                </View>
            )}
        </View>
    );
};

// Styles for the HomeScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    image: {
        width: 100, // Adjust the width of the profile image
        height: 100, // Adjust the height of the profile image
        borderRadius: 50, // Make it circular
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default HomeScreenn;
