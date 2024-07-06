import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { API_URL } from '@env';

export default function RegistrationScreen({ navigation }) {


    const handleRegister = (values) => {

        // Envoyer les données à l'API pour l'inscription
        fetch(`http://127.0.0.1:7000/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    Alert.alert('Succès', 'Inscription réussie');
                    navigation.navigate('login');
                } else {
                    Alert.alert('Erreur', 'Erreur lors de l\'inscription');
                }
            })
            .catch((error) => {
                console.error('Erreur:', error);
                Alert.alert('Erreur', 'Erreur lors de l\'inscription');
            });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Enregistrement</Text>
            <Formik
                initialValues={{ nom: '', prenom: '', email: '', password: '' }}
                onSubmit={(values) => handleRegister(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom"
                            onChangeText={handleChange('nom')}
                            onBlur={handleBlur('nom')}
                            value={values.nom}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Prénom"
                            onChangeText={handleChange('prenom')}
                            onBlur={handleBlur('prenom')}
                            value={values.prenom}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            secureTextEntry
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        <Button onPress={handleSubmit} title="S'enregistrer" />
                    </View>
                )}
            </Formik>
            <Button
                title="Déjà un compte ? Connectez-vous"
                onPress={() => navigation.navigate('login')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});
