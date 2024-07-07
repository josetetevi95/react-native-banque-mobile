import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { API_URL } from '@env';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const RegistrationScreen = ({ navigation }) => {
    const translateY = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            translateY.value = event.translationY;
        },
        onEnd: (event) => {
            if (event.translationY > 100) {
                navigation.navigate('Se connecter');
            } else {
                translateY.value = withSpring(0);
            }
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }]
        };
    });

    const handleRegister = async (values, { resetForm }) => {
        const user = {
            nom: values.nom,
            prenom: values.prenom,
            email: values.email,
            password: values.password
        };

        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Succès', 'Inscription réussie');
                resetForm();
                navigation.navigate('Se connecter');
            } else {
                Alert.alert('Erreur', data.message || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur:', error);
            Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const validationSchema = Yup.object().shape({
        nom: Yup.string()
            .required('Nom est requis'),
        prenom: Yup.string()
            .required('Prénom est requis'),
        email: Yup.string()
            .email('Adresse e-mail invalide')
            .required('Email est requis'),
        password: Yup.string()
            .required('Mot de passe est requis'),
    });

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <View style={styles.header}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />
                    <Text style={styles.welcomeText}>Bienvenue, inscrivez-vous ci-dessous</Text>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.registerText}>S'inscrire</Text>
                    <Formik
                        initialValues={{ nom: '', prenom: '', email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleRegister}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nom"
                                    placeholderTextColor="#aaa"
                                    onChangeText={handleChange('nom')}
                                    onBlur={handleBlur('nom')}
                                    value={values.nom}
                                />
                                {touched.nom && errors.nom && (
                                    <Text style={styles.errorText}>{errors.nom}</Text>
                                )}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Prénom"
                                    placeholderTextColor="#aaa"
                                    onChangeText={handleChange('prenom')}
                                    onBlur={handleBlur('prenom')}
                                    value={values.prenom}
                                />
                                {touched.prenom && errors.prenom && (
                                    <Text style={styles.errorText}>{errors.prenom}</Text>
                                )}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#aaa"
                                    keyboardType="email-address"
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
                                    <Text style={styles.submitButtonText}>S'enregistrer</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </View>
                <View style={styles.footer}>
                    <View style={styles.swipeIndicator}></View>
                    <Text style={styles.loginText}>Faites-moi glisser vers le bas pour vous connecter</Text>
                </View>
            </Animated.View>
        </PanGestureHandler>
    );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 150,
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
    registerText: {
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
    loginText: {
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
        width: 100,
        height: 100,
    },
});
