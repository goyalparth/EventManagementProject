// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createAppContainer } from '@react-navigation/native';
// import 'react-native-gesture-handler';


// // Define the Home Screen Component
// const HomeScreen = ({ navigation }) => {
//   const [count, setCount] = useState(0);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Hello, World!</Text>
//       <Button onPress={() => setCount(count + 1)} title="Click me!" />
//       <Text>You clicked {count} times</Text>
//     </View>
//   );
// };

// // Define the Settings Screen Component
// const SettingsScreen = () => (
//   <View style={styles.container}>
//     <Text style={styles.text}>Settings Screen</Text>
//   </View>
// );

// // Create a Drawer Navigator
// const Drawer = createDrawerNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator>
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Settings" component={SettingsScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// // Define styles for the components
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//   },
// });

// export default App;


import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "./screens/Home";
import ProgramScreen from "./screens/Program";
import SpeakerScreen from "./screens/Speaker";
import OrganisersScreen from "./screens/Organisers";
import AnnouncementsScreen from "./screens/Announcements";


const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen}/>
                <Drawer.Screen name="Program" component={ProgramScreen}/>
                <Drawer.Screen name="Speaker" component={SpeakerScreen}/>
                <Drawer.Screen name="Organisers" component={OrganisersScreen}/>
                <Drawer.Screen name="Announcements" component={AnnouncementsScreen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}
