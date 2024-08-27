import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "./screens/Home";
import ProgramScreen from "./screens/Program";
import SpeakerScreen from "./screens/Speaker";
import OrganisersScreen from "./screens/Organisers";
import AnnouncementsScreen from "./screens/Announcements";
import ProgramStack from './Navigation/ProgramStack';


const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen}/>
                <Drawer.Screen name="Program" component={ProgramStack}/>
                <Drawer.Screen name="Speaker" component={SpeakerScreen}/>
                <Drawer.Screen name="Organisers" component={OrganisersScreen}/>
                <Drawer.Screen name="Announcements" component={AnnouncementsScreen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}
