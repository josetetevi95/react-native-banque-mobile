import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const TransferScreen = ({ navigation }) => {
    const [transfer, setTransfer] = useState({
        sender_iban: '',
        receiver_iban: '',
        amount: ''
    });

    const handleChange = (name, value) => {
        setTransfer({ ...transfer, [name]: value });
    };

    const handleTransfer = () => {
        console.log("test", transfer.sender_iban, transfer.receiver_iban, transfer.amount);
        // Validation des champs
        if (!transfer.sender_iban || !transfer.receiver_iban || !transfer.amount) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        // Effectuer la requête de transfert
        fetch('http://localhost:7000/api/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transfer),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Alert.alert('Succès', 'Virement réussi');
                    // Réinitialiser les champs après un succès
                    setTransfer({
                        sender_iban: '',

                        receiver_iban: '',
                        amount: ''
                    });
                } else {
                    Alert.alert('Erreur', 'Erreur lors du virement');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                Alert.alert('Erreur', 'Erreur lors du virement');
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Effectuer un virement</Text>
            <TextInput
                style={styles.input}
                placeholder="Votre IBAN"
                onChangeText={(value) => handleChange('sender_iban', value)}
                value={transfer.sender_iban}
            />

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
