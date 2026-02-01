import './global.css';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddWord from './screens/AddWord';
import List from './screens/List';
import Quiz from './screens/Quiz';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#111827' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: '#111827' },
            cardStyle: { backgroundColor: '#111827' }
          }}
        >
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="AddWord" component={AddWord} options={{ title: 'Add Word' }} />
          <Stack.Screen name="List" component={List} options={{ title: 'My List' }} />
          <Stack.Screen name="Quiz" component={Quiz} options={{ title: 'Quiz' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
