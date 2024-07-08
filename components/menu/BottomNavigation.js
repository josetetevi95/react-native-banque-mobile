import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomNavigation = ({ navigation, activeTab }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={[styles.footerButton, activeTab === 'Acceuil' && styles.activeFooterButton]}
                onPress={() => navigation.navigate('Acceuil')}
            >
                <Icon name="home" size={24} color={activeTab === 'Acceuil' ? '#50c878fa' : '#aaa'} />
                <Text style={[styles.footerButtonText, activeTab === 'Acceuil' && styles.activeFooterButtonText]}>
                    Accueil
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.footerButton, activeTab === 'Transfert' && styles.activeFooterButton]}
                onPress={() => navigation.navigate('Transfert')}
            >
                <Icon name="trending-up" size={24} color={activeTab === 'Transfert' ? '#50c878fa' : '#aaa'} />
                <Text style={[styles.footerButtonText, activeTab === 'Transfert' && styles.activeFooterButtonText]}>
                    Transfert
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.footerButton, activeTab === 'Demander un chéquier' && styles.activeFooterButton]}
                onPress={() => navigation.navigate('Demander un chéquier')}
            >
                <Icon name="book" size={24} color={activeTab === 'Demander un chéquier' ? '#50c878fa' : '#aaa'} />
                <Text style={[styles.footerButtonText, activeTab === 'Demander un chéquier' && styles.activeFooterButtonText]}>
                    Chequier
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        color: '#aaa',
        marginTop: 5,
    },
    activeFooterButton: {
        borderTopWidth: 2,
        borderTopColor: '#50c878fa',
    },
    activeFooterButtonText: {
        color: '#50c878fa',
    },
});
