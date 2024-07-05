import { API_URL, API_KEY } from '@env';
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


export default function LoginScreen({ navigation }) {


    useEffect(() => {
        console.log(API_URL);
    }, []);

    return (
        <View >
            <Text >List of Books</Text>
        </View>

    );
}