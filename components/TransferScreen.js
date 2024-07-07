import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import { API_URL } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NotificationModal from '../components/NotificationModal';

const TransferScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [userIban, setUserIban] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = user.id;
                const response = await fetch(`${API_URL}/api/users/${userId}`);
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                    setUserIban(data.user.iban);
                } else {
                    showError('Erreur lors de la récupération de l\'IBAN');
                }
            } catch (error) {
                showError('Erreur lors de la récupération de l\'IBAN');
            }
        };

        fetchUserData();
    }, []);

    const showError = (message) => {
        setIsSuccess(false);
        setModalMessage(message);
        setModalVisible(true);
    };

    const showSuccess = (message) => {
        setIsSuccess(true);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (isSuccess) {
            navigation.goBack();
        }
    };

    const handleTransfer = async (values) => {
        const transferData = { ...values, sender_iban: userIban };
        try {
            const response = await fetch(`${API_URL}/api/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferData),
            });

            const data = await response.json();
            if (data.success) {
                showSuccess('Virement réussi');
            } else {
                showError('Erreur lors du virement');
            }
        } catch (error) {
            showError('Erreur lors du virement');
        }
    };

    const validationSchema = Yup.object().shape({
        receiver_iban: Yup.string().required('IBAN du destinataire est requis'),
        amount: Yup.number().required('Montant est requis').positive('Le montant doit être positif')
    });

    return (
        <View style={styles.container}>
            <NotificationModal
                visible={modalVisible}
                onClose={handleModalClose}
                message={modalMessage}
                isSuccess={isSuccess}
            />
            <Text style={styles.header}>Effectuer un virement</Text>
            <Formik
                initialValues={{ receiver_iban: '', amount: '' }}
                validationSchema={validationSchema}
                onSubmit={handleTransfer}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="IBAN du destinataire"
                            onChangeText={handleChange('receiver_iban')}
                            onBlur={handleBlur('receiver_iban')}
                            value={values.receiver_iban}
                        />
                        {touched.receiver_iban && errors.receiver_iban && (
                            <Text style={styles.errorText}>{errors.receiver_iban}</Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Montant"
                            keyboardType="numeric"
                            onChangeText={handleChange('amount')}
                            onBlur={handleBlur('amount')}
                            value={values.amount}
                        />
                        {touched.amount && errors.amount && (
                            <Text style={styles.errorText}>{errors.amount}</Text>
                        )}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Transférer</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </View>
    );
};

export default TransferScreen;

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
    submitButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
});
