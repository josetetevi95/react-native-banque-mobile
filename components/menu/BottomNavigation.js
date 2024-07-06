import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomNavigation = ({ navigation, activeTab }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={[styles.footerButton, activeTab === 'Home' && styles.activeFooterButton]}
                onPress={() => navigation.navigate('Home')}
            >
                <Icon name="home" size={24} color={activeTab === 'Home' ? '#50c878fa' : '#aaa'} />
                <Text style={[styles.footerButtonText, activeTab === 'Home' && styles.activeFooterButtonText]}>
                    Accueil
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.footerButton, activeTab === 'Invest' && styles.activeFooterButton]}
                onPress={() => navigation.navigate('Invest')}
            >
                <Icon name="trending-up" size={24} color={activeTab === 'Invest' ? '#50c878fa' : '#aaa'} />
                <Text style={[styles.footerButtonText, activeTab === 'Invest' && styles.activeFooterButtonText]}>
                    Investir
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.footerButton, activeTab === 'Payments' && styles.activeFooterButton]}
                onPress={() => navigation.navigate('Payments')}
            >
                <Icon name="card" size={24} color={activeTab === 'Payments' ? '#50c878fa' : '#aaa'} />
                <Text style={[styles.footerButtonText, activeTab === 'Payments' && styles.activeFooterButtonText]}>
                    Paiements
                </Text>
            </TouchableOpacity>
        </View>
    );
};

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

export default BottomNavigation;
