import 'react-native-gesture-handler';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./screens/Home";
import ProgramStack from './Navigation/ProgramStack';
import SpeakerScreen from "./screens/Speaker";
import OrganisersScreen from "./screens/Organisers";
import AnnouncementsScreen from "./screens/Announcements"; // Import this

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const handleNavigationReset = (navigation, routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  };

  const DrawerNavigator = () => (
    <Drawer.Navigator>
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            handleNavigationReset(navigation, 'Home');
          },
        })}
      />
      <Drawer.Screen 
        name="Program" 
        component={ProgramStack} 
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Program');
          },
        })}
      />
      <Drawer.Screen 
        name="Speaker" 
        component={SpeakerScreen} 
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Speaker');
          },
        })}
      />
      <Drawer.Screen 
        name="Organisers" 
        component={OrganisersScreen} 
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            handleNavigationReset(navigation, 'Organisers');
          },
        })}
      />
      {/* AnnouncementsScreen is removed from the Drawer */}
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
