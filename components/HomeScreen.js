import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavigation from './menu/BottomNavigation';
import { UserProvider, UserContext } from '../context/UserContext';

const HomeScreen = ({ navigation }) => {

    const { user, setUser } = useContext(UserContext);
    console.log(user);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <View style={styles.profileIcon}>
                        <Text style={styles.profileInitials}>RJ</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon name="card" size={20} color="#fff" style={styles.icon} />
                    </View>
                </View>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceText}>Principal · EUR</Text>
                    <Text style={styles.balanceAmount}>{user.solde} €</Text>
                    <TouchableOpacity style={styles.balanceButton}>
                        <Text style={styles.balanceButtonText}>Comptes</Text>
                    </TouchableOpacity>
                    <View style={styles.balanceActions}>
                        <TouchableOpacity style={styles.balanceActionButton}>
                            <Icon name="add-circle" size={24} color="#000" />
                            <Text style={styles.balanceActionText}>Ajouter de l'argent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.balanceActionButton}>
                            <Icon name="information-circle" size={24} color="#000" />
                            <Text style={styles.balanceActionText}>Informations sur comptes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="add-circle" size={40} color="#50c878fa" />
                        <Text style={styles.actionButtonText}>Ajouter de l'argent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="swap-horizontal" size={40} color="#50c878fa" />
                        <Text style={styles.actionButtonText}>Changer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="information-circle" size={40} color="#50c878fa" />
                        <Text style={styles.actionButtonText}>Informations</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.notification}>
                    <Text style={styles.notificationText}>Limite de paiements sans contact presque atteinte</Text>
                    <Text style={styles.notificationSubText}>Réinitialisez la limite de paiements sans contact pour éviter les refus de transactions.</Text>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationButtonText}>Réinitialiser la limite</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.transaction}>
                    <Text style={styles.transactionText}>José Rodolphe TETEVI</Text>
                    <Text style={styles.transactionDate}>4 juil., 13:44</Text>
                    <Text style={styles.transactionAmountNegative}>-222 €</Text>
                </View>
                <View style={styles.transaction}>
                    <Text style={styles.transactionText}>Argent ajouté via --9097</Text>
                    <Text style={styles.transactionDate}>4 juil., 13:41</Text>
                    <Text style={styles.transactionAmountPositive}>+223 €</Text>
                </View>
            </ScrollView>
            <BottomNavigation navigation={navigation} activeTab="Home" /> {/* Utiliser le composant */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f5f0', // Couleur de fond clair
    },
    header: {
        backgroundColor: '#50c878fa',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileIcon: {
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitials: {
        color: '#50c878fa',
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
    balanceContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    balanceText: {
        color: '#fff',
        fontSize: 18,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    balanceButton: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    balanceButtonText: {
        color: '#50c878fa',
        fontWeight: 'bold',
    },
    balanceActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        width: '100%',
    },
    balanceActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        flex: 1,
    },
    balanceActionText: {
        color: '#000',
        marginLeft: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#50c878fa',
        marginTop: 5,
    },
    contentContainer: {
        padding: 20,
    },
    notification: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
    },
    notificationText: {
        color: '#50c878fa',
        fontWeight: 'bold',
    },
    notificationSubText: {
        color: '#555',
        marginTop: 10,
    },
    notificationButton: {
        marginTop: 10,
        backgroundColor: '#50c878fa',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
    },
    notificationButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    transaction: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionText: {
        color: '#333',
    },
    transactionDate: {
        color: '#aaa',
    },
    transactionAmountNegative: {
        color: '#e74c3c',
    },
    transactionAmountPositive: {
        color: '#2ecc71',
    },
});

export default HomeScreen;
