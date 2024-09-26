import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRCodeScreen = () => {
    const onSuccess = e => {
        const scannedUrl = e.data;
        // Open the scanned URL in the default browser
        Linking.openURL(scannedUrl).catch(err =>
            console.error("Couldn't load page", err)
        );
    };

    return (
        <View style={styles.container}>
            <QRCodeScanner
                onRead={onSuccess}
                flashMode={RNCamera.Constants.FlashMode.auto}
                reactivate={true} // Automatically reactivate after scanning
                reactivateTimeout={1000} // Optional: Delay before scanner reactivates (milliseconds)
                topContent={
                    <Text style={styles.centerText}>
                        Scan the QR code to open the link in the browser.
                    </Text>
                }
                bottomContent={
                    <Text style={styles.centerText}>Align the QR code within the frame</Text>
                }
            />
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
});

export default QRCodeScreen;
