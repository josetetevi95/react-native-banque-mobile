import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import NotificationModal from '../components/NotificationModal';
import { API_URL } from '@env';

const TestRessourceScreen = () => {
    const { setUser } = useContext(UserContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    const fetchTestData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/test`);
            const data = await response.json();
            if (data.status == "success") {
                showSuccess('Test éffectuer avec succès')
            } else {
                showError('Erreur lors du Test');
            }
        } catch (error) {
            showError('Erreur lors de la récupération de l\'IBAN');
        }
    };

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

    const handleTestAPI = () => {
        fetchTestData();
    };

    return (
        <View style={styles.container}>
            <NotificationModal
                visible={modalVisible}
                onClose={handleModalClose}
                message={modalMessage}
                isSuccess={isSuccess}
            />
            <TouchableOpacity onPress={() => handleTestAPI()} style={styles.testApiButton}>
                <Text style={styles.testApiButtonText}>Faire un Test</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TestRessourceScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    testApiButton: {
        backgroundColor: '#85a16a',
        padding: 10,
        borderRadius: 5,
    },
    testApiButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
