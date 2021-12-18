import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { showMessage } from "react-native-flash-message"
import db from '../../../database/Database';

const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 16;

const InisiasiFormPPKelompokSubForm = ({ route }) => {
    const { groupName } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [namaSubKelompok, setNamaSubKelompok] = useState('');

    let [branchid, setBranchid] = useState()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getInfo()
        })

        return unsubscribe
    }, [])

    const getInfo = async () => {
        const detailBranch = await AsyncStorage.getItem('userData')
        let branchid = JSON.parse(detailBranch).kodeCabang

        setBranchid(branchid)
    }

    const flashNotification = (title, message, backgroundColor, color) => {
        showMessage({
            message: title,
            description: message,
            type: "info",
            duration: 3500,
            statusBarHeight: 20,
            backgroundColor: backgroundColor,
            color: color
        });
      }

    const submitHandler = () => {
        if (!namaSubKelompok || typeof namaSubKelompok === 'undefined' || namaSubKelompok === '' || namaSubKelompok === 'null') return flashNotification("Alert", "Nama sub-kelompok tidak boleh kosong", "#ff6347", "#fff");

        let queryInsertSub = "INSERT INTO Table_PP_SubKelompok (kelompok_Id, subKelompok_Id, kelompok, subKelompok, branchid, status) VALUES "
            + "( '"
            + ""
            + "', '"
            + ""
            + "', '"
            + groupName
            + "', '"
            + namaSubKelompok
            + "', '"
            + branchid
            + "', '"
            + "0"
            + "' )"

        console.log(queryInsertSub)

        try{
            db.transaction(
                tx => {
                    tx.executeSql(queryInsertSub)
                }, function(error) {
                    flashNotification("Error", "Error : " + error, "#ff6347", "#fff")
                }, function() {
                    flashNotification("Success", 'Sub-kelompok berhasil ditambahkan', "#1F8327", "#fff")
                    navigation.goBack()
                }
            )
        }catch(error){
            flashNotification("Alert", "Nama sub-kelompok tidak boleh kosong", "#ff6347", "#fff")
            return false
        }

    }

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
                onPress={() => submitHandler()}
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
        <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>BACK</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

export default InisiasiFormPPKelompokSubForm;
