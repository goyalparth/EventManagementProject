import { View, Text, Button, StyleSheet } from 'react-native';



// Define the Home Screen Component
const HomeScreen = () => {


    return (
        <View style={styles.container}>
            <Text style={styles.text}>HomeScreen</Text>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize:24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    
});
