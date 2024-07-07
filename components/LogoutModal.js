import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LogoutModal = ({ visible, onCancel, onConfirm }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Icon name="exit-outline" size={50} color="#ff6347" style={styles.icon} />
                    <Text style={styles.modalText}>Oh non! Vous partez... Vous êtes sûr ?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonText}>Non</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonConfirm]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonText}>Oui, Déconnecte moi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    icon: {
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginHorizontal: 5,
    },
    buttonCancel: {
        backgroundColor: '#d3d3d3',
    },
    buttonConfirm: {
        backgroundColor: '#ff6347',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default LogoutModal;
