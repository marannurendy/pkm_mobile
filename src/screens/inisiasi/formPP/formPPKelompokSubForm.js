import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import db from '../../../database/Database';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';

const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 16;

const InisiasiFormPPKelompokSubForm = ({ route }) => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [namaSubKelompok, setNamaSubKelompok] = useState('');

    const renderFormNamaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Nama Sub Kelompok (*)</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={namaSubKelompok} 
                        onChangeText={(text) => setNamaSubKelompok(text)}
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            <Text style={[styles.bodyTitle, { margin: 0, marginBottom: 16 }]}>Sub Kelompok Form</Text>
            <ScrollView>
                {renderFormNamaKelompok()}
            </ScrollView>
        </View>
    )

    const renderButton = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            {renderForm()}
            {renderButton()}
        </View>
    )

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>BACK</Text>
                </TouchableOpacity>
            </View>
        </>
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

export default InisiasiFormPPKelompokSubForm;
