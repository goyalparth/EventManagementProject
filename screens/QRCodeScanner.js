import React, { useState, useEffect } from 'react';
import { Linking, StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useFocusEffect } from '@react-navigation/native';

const QRCodeScreen = ({ navigation }) => {
    const [scannedUrl, setScannedUrl] = useState(null); // State to store the scanned URL

    const onSuccess = e => {
        const url = e.data;
        setScannedUrl(url); // Store the scanned URL in state
    };

    const openUrl = () => {
        if (scannedUrl) {
            Linking.openURL(scannedUrl).catch(err =>
                console.error("Couldn't load page", err)
            );
        }
    };

    // Reset scanned URL when the screen gains focus
    useFocusEffect(
        React.useCallback(() => {
            const resetScannedUrl = () => setScannedUrl(null);

            // Listen for navigation events when leaving the screen
            const unsubscribe = navigation.addListener('beforeRemove', resetScannedUrl);

            // Reset scanned URL when the screen is focused
            resetScannedUrl();

            // Cleanup function to remove the listener
            return () => {
                unsubscribe();
            };
        }, [navigation])
    );

    return (
        <View style={styles.mainContainer}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.greetingText}>QR Code Scanner</Text>
                <Text style={styles.subText}>Scan a QR code to retrieve the link.</Text>
            </View>

            {/* QR Code Scanner Card */}
            <View style={styles.combinedCard}>
                <View style={styles.qrScannerContainer}>
                    <QRCodeScanner
                        onRead={onSuccess}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        reactivate={true} // Automatically reactivate after scanning
                        reactivateTimeout={1000} // Delay before reactivation
                        topContent={
                            <Text style={styles.centerText}>
                                Align the QR code within the frame
                            </Text>
                        }
                    />
                </View>
                {scannedUrl && (
                    <View style={styles.urlContainer}>
                        <Text style={styles.urlText}>Scanned URL: {scannedUrl}</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Open URL" onPress={openUrl} />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#304067',
        padding: 20,
    },
    headerContainer: {
        backgroundColor: '#304067',
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    combinedCard: {
        flex: 1,
        backgroundColor: '#FCFAF8',
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 30,
    },
    qrScannerContainer: {
        width: '100%', // Use full width of the card
        height: Dimensions.get('window').width * 1, // Set height relative to the screen width
        overflow: 'hidden', // Ensure overflow is hidden
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF', // Optional: to visually distinguish the scanner area
    },
    centerText: {
        fontSize: 16,
        padding: 20,
        textAlign: 'center',
    },
    urlContainer: {
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    urlText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        marginBottom: 30,
    },
});

export default QRCodeScreen;
