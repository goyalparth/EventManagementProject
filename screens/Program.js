import { View, ScrollView, Text, Button, StyleSheet } from 'react-native';
import EventsCard from '../Components/EventsCard';




// Define the Home Screen Component
const ProgramScreen = () => {


    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <EventsCard
                title="Event1"
                label="0810 hours"
                
            />
            <EventsCard
                title="Event2"
                label="1000 hours"
                
            />

            <EventsCard
                title="Event3"
                label="1000 hours"
                
            />

            <EventsCard
                title="Event1"
                label="0810 hours"
                
            />
            <EventsCard
                title="Event2"
                label="1000 hours"
                
            />

            <EventsCard
                title="Event3"
                label="1000 hours"
                
            />
            <EventsCard
                title="Event3"
                label="1000 hours"
                
            />
            </ScrollView>
        
    );
};

// const onSearh = {text}

export default ProgramScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#fff'
    },
    // text: {
    //     fontSize: 24,
    //     fontWeight: "bold",
    //     marginBottom: 16,
    // }

});
