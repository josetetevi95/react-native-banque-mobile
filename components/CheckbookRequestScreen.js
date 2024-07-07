import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserProvider, UserContext } from '../context/UserContext';

const CheckbookRequestScreen = ({ navigation }) => {

    const { user, setUser } = useContext(UserContext);
    console.log(user);

    const validationSchema = Yup.object().shape({
        checkbookType: Yup.string().required('Type de chéquier est requis'),
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Demander un chéquier</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <Text style={styles.acountInfo}>Compte émetteur</Text>
            <View style={styles.card}>
                <Icon name="book-outline" size={50} color="#000" style={styles.icon} />
                <View>
                    <Text style={styles.acountTitle}>COMPTE CHEQUE</Text>
                    <Text style={styles.acountInfo}>{user.iban} </Text>
                    <Text style={styles.acountInfo}>COMPTE PRINCIPAL </Text>
                    <Text style={styles.acountInfo}>{user.solde} €</Text>
                </View>
            </View>

            <Formik
                initialValues={{ checkbookType: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(values);
                    // Handle form submission
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <View style={styles.form}>
                        <Text style={styles.label}>Type de chéquier*</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={values.checkbookType}
                                onValueChange={(itemValue) => setFieldValue('checkbookType', itemValue)}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="CHEQUE A 25 PAGES" value="25" />
                                <Picker.Item label="CHEQUES A 50 PAGES" value="50" />
                                <Picker.Item label="CHEQUE A 75 PAGES" value="75" />
                                <Picker.Item label="CHEQUE A 100 PAGES" value="100" />
                            </Picker>
                        </View>
                        {touched.checkbookType && errors.checkbookType && (
                            <Text style={styles.errorText}>{errors.checkbookType}</Text>
                        )}

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 50,
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 20,
    },
    acountTitle: {
        fontSize: 18,
        padding: 4,
        fontWeight: 'bold',
    },
    acountInfo: {
        fontSize: 13,
        padding: 4,
        color: '#666',
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: '100%',
    },
    pickerItem: {
        fontSize: 16,
        height: 44,
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

export default CheckbookRequestScreen;
