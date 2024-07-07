import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionItem = ({ transaction }) => {
    return (
        <View style={styles.transaction}>
            <Text style={styles.transactionText}>{transaction.nom} {transaction.prenom_initial}</Text>
            <Text style={styles.transactionDate}>{transaction.transaction_date}</Text>
            <Text style={transaction.amount < 0 ? styles.transactionAmountNegative : styles.transactionAmountPositive}>
                {transaction.amount} €
            </Text>
        </View>
    );
};

export default TransactionItem;

const styles = StyleSheet.create({
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
