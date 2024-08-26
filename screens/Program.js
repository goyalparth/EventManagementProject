import { View, Text, Button, StyleSheet } from 'react-native';



// Define the Home Screen Component
const ProgramScreen = () => {


    return (
        <View style={styles.container}>
            <Text style={styles.text}>ProgramScreen</Text>
        </View>
    );
};

export default ProgramScreen;

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
