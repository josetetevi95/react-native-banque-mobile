import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { UserProvider, UserContext } from './context/UserContext';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import TransferScreen from './components/TransferScreen';
import LogoutButton from './components/LogoutButton';
import CheckbookRequestScreen from './components/CheckbookRequestScreen';
import TestRessourceScreen from './components/TestRessourceScreen';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        {user ? (
          <>
            <Drawer.Screen name="Acceuil" component={HomeScreen} />
            <Drawer.Screen name="Transfert" component={TransferScreen} />
            <Drawer.Screen name="Demander un chéquier" component={CheckbookRequestScreen} />
            <Drawer.Screen name="Test" component={TestRessourceScreen} />
            <Drawer.Screen name="Se déconnecter" component={LogoutButton} />
          </>
        ) : (
          <>
            <Drawer.Screen name="Se connecter" component={LoginScreen} />
            <Drawer.Screen name="S'inscrire" component={RegisterScreen} />
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
