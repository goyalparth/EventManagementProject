import { createStackNavigator } from '@react-navigation/stack';
import ProgramScreen from '../screens/Program';
import EventDetailsScreen from '../screens/EventDetails';


const Stack = createStackNavigator();
const ProgramStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Program" component={ProgramScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );

export default ProgramStack;