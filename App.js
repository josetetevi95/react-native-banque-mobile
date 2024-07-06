import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import TransferScreen from './components/TransferScreen';


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="login" component={LoginScreen} />
        <Drawer.Screen name="register" component={RegisterScreen} />
        <Drawer.Screen name="home" component={HomeScreen} />
        <Drawer.Screen name="transfer" component={TransferScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
