import React, { useState } from 'react';
import { Linking, StyleSheet, Text, View, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRCodeScreen = () => {
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

    return (
        <View style={styles.container}>
            <QRCodeScanner
                onRead={onSuccess}
                flashMode={RNCamera.Constants.FlashMode.auto}
                reactivate={true} // Automatically reactivate after scanning
                reactivateTimeout={1000} // Delay before reactivation
                topContent={
                    <Text style={styles.centerText}>
                        Scan the QR code to show the link.
                    </Text>
                }
                bottomContent={
                    <Text style={styles.centerText}>Align the QR code within the frame</Text>
                }
            />
            {scannedUrl && (
                <View style={styles.urlContainer}>
                    <Text style={styles.urlText}>Scanned URL: {scannedUrl}</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Open URL" onPress={openUrl} />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    centerText: {
        fontSize: 16,
        padding: 20,
        textAlign: 'center',
    },
    urlContainer: {
        marginTop: 10, // Reduced margin to bring the URL closer to the QR code instruction
        padding: 10,
        alignItems: 'center',
    },
    urlText: {
        fontSize: 18, // Slightly larger font
        fontWeight: 'bold', // Make the text bold
        marginBottom: 10, // Reduced the space below the URL text
    },
    buttonContainer: {
        marginBottom: 30, // Move the button closer to the URL text
    },
});

export default QRCodeScreen;
