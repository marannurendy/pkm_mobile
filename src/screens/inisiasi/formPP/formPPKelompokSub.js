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

const InisiasiFormPPKelompokSub = ({ route }) => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [inputList, setInputList] = useState([{ value: "Kelinci 1" }, { value: "Kelinci 2" }]);

    const handleRemove = (index) => {
        Alert.alert(
            'Konfirmasi',
            `Hapus sub kelompok no. ${index + 1}?`,
            [
                {
                    text: "Cancel",
                    onPress: () => __DEV__ && console.log("cancel pressed"),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: () => {
                        const list = [...inputList];
                        list.splice(index, 1);
                        setInputList(list);
                    }
                }
            ]
        )
        
    } 

    const handleAdd = () => navigation.navigate('InisiasiFormPPKelompokSubForm')

    const renderFormNamaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Nama Kelompok (*)</Text>
            <View style={[styles.textInputContainer, { width: withTextInput, backgroundColor: 'whitesmoke' }]}>
                <View style={styles.F1}>
                    <Text>Gang Kelinci</Text>
                </View>
                <View />
            </View>
        </View>
    )

    const renderSubListRemove = (i) => {
        if (i > 0) {
            return (
                <View style={styles.FDRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('InisiasiFormPPKelompokSubForm')}>
                        <FontAwesome5 name="edit" size={16} color={colors.OREN} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRemove(i)} style={styles.ML8}>
                        <FontAwesome5 name="trash" size={16} color={colors.MERAH} />
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={() => navigation.navigate('InisiasiFormPPKelompokSubForm')}>
                <FontAwesome5 name="edit" size={16} color={colors.OREN} />
            </TouchableOpacity>
        )
    }

    const renderSubList = () => inputList.map((x, i) => (
        <View
            key={i}
            style={[styles.textInputContainer, { width: withTextInput - 32, marginBottom: i === inputList.length - 1 ? 0 : 12, borderColor: 'gray' }]}
        >
            <Text>{i+1}. </Text>
            <Text style={styles.F1} onPress={() => alert(i)}>{x.value}</Text>
            {renderSubListRemove(i)}
        </View>
    ))

    const renderSub = () => (
        <View
            style={[styles.P16, styles.MT16, { borderWidth: 1, borderRadius: 16, borderStyle: 'dashed' }]}
        >
            <View style={[styles.FDRow, styles.MB16, { alignItems: 'center' }]}>
                <Text style={styles.F1}>List Sub Kelompok ({inputList.length})</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAdd()}
                >
                    <Text style={[styles.PH8, { color: colors.PUTIH }]}>Tambah (+)</Text>
                </TouchableOpacity>
            </View>
            {renderSubList()}
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            <Text style={[styles.bodyTitle, { margin: 0, marginBottom: 16 }]}>Sub Kelompok List</Text>
            <ScrollView>
                {renderFormNamaKelompok()}
                {renderSub()}
            </ScrollView>
        </View>
    )

    const renderButton = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => null}
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
            {/* {renderButton()} */}
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

export default InisiasiFormPPKelompokSub;
