import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavigation from './menu/BottomNavigation';
import { UserContext } from '../context/UserContext';
import TransactionItem from './TransactionItem';
import NotificationModal from '../components/NotificationModal';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';

const HomeScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);
    const [isFetched, setIsFetched] = useState(false);

    const fetchTransaction = useCallback(() => {
        if (!user) return;

        const user_transaction = {
            sender_iban: user.iban,
        };

        fetch(`${API_URL}/api/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user_transaction),
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data?.transactions)) {
                    setTransactions(data.transactions);
                } else {
                    setIsSuccess(false);
                    setModalMessage('Erreur lors de la récupération des transactions.');
                    setModalVisible(true);
                }
            })
            .catch(error => {
                setIsSuccess(false);
                setModalMessage('Impossible de se connecter au serveur.');
                setModalVisible(true);
            });
    }, [user]);

    const fetchUserData = useCallback(() => {
        if (!user || !user.id) return;

        fetch(`${API_URL}/api/users/${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                setUser(data.user);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données utilisateur:', error);
            });
    }, [user?.id, setUser]);

    useFocusEffect(
        useCallback(() => {
            if (!isFetched) {
                fetchTransaction();
                fetchUserData();
                setIsFetched(true);
            }

            return () => {
                setIsFetched(false); // Reset isFetched when the screen loses focus
            };
        }, [fetchTransaction, fetchUserData, isFetched])
    );

    useEffect(() => {
        if (!isFetched && user) {
            fetchTransaction();
            fetchUserData();
            setIsFetched(true);
        }
    }, [fetchTransaction, fetchUserData, isFetched, user]);

    const handleModalClose = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <NotificationModal
                visible={modalVisible}
                onClose={handleModalClose}
                message={modalMessage}
                isSuccess={isSuccess}
            />
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
                    <Text style={styles.balanceAmount}>{user?.solde ?? ''} €</Text>
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
                {transactions.map((transaction, index) => (
                    <TransactionItem key={index} transaction={transaction} />
                ))}
            </ScrollView>
            <BottomNavigation navigation={navigation} activeTab="Home" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f5f0',
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
});

export default HomeScreen;
