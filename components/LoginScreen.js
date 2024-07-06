// components/LoginScreen.js

import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { API_URL } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginScreen = ({ navigation }) => {
    const translateY = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = event => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationY < -100) {
                navigation.navigate('register');
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        const user = {
            email: values.email,
            password: values.password
        };

        console.log(`${API_URL}/api/users/login`);

        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Login successful');
                resetForm();
                // Navigate to the next screen or perform other actions
            } else {
                Alert.alert('Error', data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                <View style={styles.header}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />
                    <Text style={styles.welcomeText}>Hello There, Welcome Back</Text>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.loginText}>Login</Text>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#aaa"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </View>
                <View style={styles.footer}>
                    <View style={styles.swipeIndicator}></View>
                    <Text style={styles.registerText}>Swipe me up to register</Text>
                </View>
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 300,
        backgroundColor: '#50C878',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingBottom: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    welcomeText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 10,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 20,
        color: '#50C878',
        marginBottom: 20,
        alignItems: 'flex-end',
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        color: '#000',
    },
    submitButton: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
        marginVertical: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: -10,
        marginBottom: 10,
    },
    footer: {
        height: 60,
        backgroundColor: '#50C878',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
    },
    swipeIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#fff',
        borderRadius: 2.5,
        marginBottom: 5,
    },
    logo: {
        width: 150,
        height: 150,
    },
});

export default LoginScreen;
