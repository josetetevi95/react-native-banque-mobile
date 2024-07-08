import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import LogoutModal from './LogoutModal';

const LogoutButton = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { setUser } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
            <LogoutModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onConfirm={handleLogout}
            />
        </View>
    );
};

export default LogoutButton;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
