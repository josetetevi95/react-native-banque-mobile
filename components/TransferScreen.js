import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';


const TransferScreen = ({ navigation }) => {
    const [transfer, setTransfer] = useState({
        receiver_iban: '',
        amount: ''
    });

    const [userIban, setUserIban] = useState('');

    useEffect(() => {
        // Fonction pour récupérer les informations de l'utilisateur connecté
        const fetchUserData = async () => {
            try {
                const userId = 1; // Remplacez par l'ID de l'utilisateur connecté
                const response = await fetch(`http://localhost:7000/api/users/${userId}`);
                const data = await response.json();
                console.log('Données utilisateur:', data);
                if (data.success) {
                    setUserIban(data.user.iban);
                } else {
                    Alert.alert('Erreur', 'Erreur lors de la récupération de l\'IBAN');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'IBAN:', error);
                Alert.alert('Erreur', 'Erreur lors de la récupération de l\'IBAN');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (name, value) => {
        setTransfer({ ...transfer, [name]: value });
    };

    const handleTransfer = () => {
        if (!transfer.receiver_iban || !transfer.amount) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        const transferData = { ...transfer, sender_iban: userIban };

        fetch('http://localhost:7000/api/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transferData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Données de transfert:', data);
                if (data.success) {
                    Alert.alert('Succès', 'Virement réussi');
                    setTransfer({
                        receiver_iban: '',
                        amount: ''
                    });
                } else {
                    Alert.alert('Erreur', 'Erreur lors du virement');
                }
            })
            .catch(error => {
                console.error('Erreur lors du virement:', error);
                Alert.alert('Erreur', 'Erreur lors du virement');
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Effectuer un virement</Text>
            <TextInput
                style={styles.input}
                placeholder="IBAN du destinataire"
                onChangeText={(value) => handleChange('receiver_iban', value)}
                value={transfer.receiver_iban}
            />
            <TextInput
                style={styles.input}
                placeholder="Montant"
                keyboardType="numeric"
                onChangeText={(value) => handleChange('amount', value)}
                value={transfer.amount}
            />
            <Button onPress={handleTransfer} title="Transférer" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default TransferScreen;
