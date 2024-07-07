import React, { useRef, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { API_URL } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../context/UserContext';

const LoginScreen = ({ navigation }) => {
    const { setUser } = useContext(UserContext);
    const translateY = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = event => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationY < -100) {
                navigation.navigate('S\'inscrire');
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
            password: values.password,
        };

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
                setUser(data);  // Enregistrer les informations de l'utilisateur dans le contexte
                resetForm();
                navigation.navigate('Home');
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
            .email('Adresse e-mail invalide')
            .required('L\'e - mail est requis'),
        password: Yup.string()
            .required('Mot de passe requis'),
    });

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                <View style={styles.header}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />
                    <Text style={styles.welcomeText}>Bonjour, bon retour</Text>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.loginText}>Se connecter</Text>
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
                                    placeholder="Mot de passe"
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
                                    <Text style={styles.submitButtonText}>Soumettre</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </View>
                <View style={styles.footer}>
                    <View style={styles.swipeIndicator}></View>
                    <Text style={styles.registerText}>Faites-moi glisser vers le haut pour vous inscrire</Text>
                </View>
            </Animated.View>
        </PanGestureHandler>
    );
};

export default LoginScreen;

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
