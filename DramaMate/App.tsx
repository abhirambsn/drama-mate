import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthMain from './screens/auth/AuthMain';
import HomeMain from './screens/main/HomeMain';
import { StatusBar } from 'expo-status-bar';
import DramaDetail from './screens/main/DramaDetail';

const StackNavigator = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <StackNavigator.Navigator screenOptions={{headerShown: false}}>
          <StackNavigator.Screen name="Auth" component={AuthMain} />
          <StackNavigator.Screen name="HomeMain" component={HomeMain} />
          <StackNavigator.Screen name="DramaDetail" component={DramaDetail} />
        </StackNavigator.Navigator>
        <StatusBar style='auto' />
    </NavigationContainer>
  );
}