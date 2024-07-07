import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { UserProvider, UserContext } from './context/UserContext';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import TransferScreen from './components/TransferScreen';
import LogoutButton from './components/LogoutButton';
import CheckbookRequestScreen from './components/CheckbookRequestScreen';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        {user ? (
          <>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Transfer" component={TransferScreen} />
            <Drawer.Screen name="RequestCheckbook" component={CheckbookRequestScreen} />
            <Drawer.Screen name="Logout" component={LogoutButton} />
          </>
        ) : (
          <>
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
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
