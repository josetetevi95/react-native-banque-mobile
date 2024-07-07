// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import TransferScreen from './components/TransferScreen';

const Stack = createStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Transfer" component={TransferScreen} />
        </Stack.Navigator>
    );
};

export default AppStack;
