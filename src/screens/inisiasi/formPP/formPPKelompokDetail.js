import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator, ScrollView } from 'react-native';
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

const InisiasiFormPPKelompokDetail = ({ route }) => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([1,2,3,4,5])

    const renderList = () => data.map((x, i) => (
        <TouchableOpacity key={i}>
            <View 
                style={[styles.textInputContainer, { width: withTextInput, marginBottom: i === data.length - 1 ? 0 : 8, borderColor: 'gray' }]}
            >
                <View style={styles.checkbox}>
                    <FontAwesome5 name="check" size={16} color={colors.DEFAULT} />
                </View>
                <Text>Nama {x}</Text>
            </View>
        </TouchableOpacity>
    ))

    const renderMain = () => (
        <View style={[styles.F1, styles.P16]}>
            {/* <Text style={[styles.headerTitle, { paddingLeft: 0, marginBottom: 8 }]}>GANG KELINCI</Text> */}
            <Text style={[styles.headerTitle, { paddingLeft: 0, marginBottom: 8 }]}>KELINCI 1 (5)</Text>
            {renderList()}
        </View>
    )

    const renderButton = () => (
        <View style={[styles.FDRow, styles.P16]}>
            <TouchableOpacity
                onPress={() => null}
                style={[styles.F1, styles.MR16]}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('InisiasiFormPPKelompokSub')}
            >
                <View style={[styles.buttonSubmitContainer, { backgroundColor: colors.MEDIUM_SEA_GREEN, padding: 8 }]}>
                    <FontAwesome5 name="plus" size={35} color={colors.PUTIH} />
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            {renderMain()}
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

export default InisiasiFormPPKelompokDetail;
