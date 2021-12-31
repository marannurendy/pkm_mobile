import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import { showMessage } from "react-native-flash-message"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import db from '../../../database/Database';


const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 16;

const InisiasiFormPPKelompok = ({ route }) => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [namaKelompok, setNamaKelompok] = useState('');
    const [valueGroupProduk, setValueGroupProduk] = useState(null);
    const [itemsGroupProduk, setItemsGroupProduk] = useState([
        {
            label: 'Mingguan',
            value: 'W'
        }
    ]);
    const [tanggalPKMPertama, setTanggalPKMPertama] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [valueHariPertemuan, setValueHariPertemuan] = useState(null);
    const [itemsHariPertemuan, setItemsHariPertemuan] = useState([
        {
            label: 'Senin',
            value: '2'
        },
        {
            label: 'Selasa',
            value: '3'
        },
        {
            label: 'Rabu',
            value: '4'
        },
        {
            label: 'Kamis',
            value: '5'
        },
        {
            label: "Jum'at",
            value: '6'
        }
    ]);
    const [valueWaktuPertemuan, setValueWaktuPertemuan] = useState(null);
    const [itemsWaktuPertemuan, setItemsWaktuPertemuan] = useState([
        {
            label: '10:00',
            value: '1'
        },
        {
            label: '11:00',
            value: '2'
        },
        {
            label: '12:00',
            value: '3'
        }
    ]);
    const [lokasiPertemuan, setLokasiPertemuan] = useState('');

    let [branchid, setBranchid] = useState();
    let [currentDate, setCurrentDate] = useState();
    let [userName, setUserName] = useState();

    useEffect(() => {
        GetInfo();
    }, [])

    const GetInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');

        const detailBranch = await AsyncStorage.getItem('userData')
        let branchid = JSON.parse(detailBranch).kodeCabang
        let uname = JSON.parse(detailBranch).userName
        
        setBranchid(branchid)
        setCurrentDate(tanggal)
        setUserName(uname)
    }

    const tanggalPKMPertamaDatePickerHandler = (event, date) => {
        let dateValue = moment(date).format('YYYY-MM-DD');
        setShowCalendar(false);
        setTanggalPKMPertama(dateValue);
    }

    const renderFormNamaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Nama Kelompok (*)</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={namaKelompok} 
                        onChangeText={(text) => setNamaKelompok(text)}
                        placeholder='Gang Kelinci'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormGroupProduk = () => (
        <View style={styles.MT8}>
            <Text>Group Produk (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueGroupProduk}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => {
                        setValueGroupProduk(itemValue);
                    }}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsGroupProduk.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormTanggalPKMPertama = () => (
        <View style={styles.MT8}>
            <Text>Tanggal PKM Pertama (*)</Text>
            <TouchableOpacity
                onPress={() => setShowCalendar(true)}
            >
                <View style={[styles.textInputContainer, { width: withTextInput }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={tanggalPKMPertama}
                            editable={false}
                            style={styles.F1}
                        />
                    </View>
                    <View>
                        <FontAwesome5 name={'calendar'} size={18} />
                    </View>
                </View>
            </TouchableOpacity>
            {showCalendar && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={tanggalPKMPertamaDatePickerHandler}
                    minimumDate={date}
                    // minimumDate={new Date()}
                />
            )}
        </View>
    )

    const renderFormHariPertemuan = () => (
        <View style={styles.MT8}>
            <Text>Hari Pertemuan (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueHariPertemuan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => {
                        setValueHariPertemuan(itemValue);
                    }}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsHariPertemuan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormWaktuPertemuan = () => (
        <View style={styles.MT8}>
            <Text>Waktu Pertemuan (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueWaktuPertemuan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => {
                        setValueWaktuPertemuan(itemValue);
                    }}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsWaktuPertemuan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormLokasiPertemuan = () => (
        <View style={styles.MT8}>
            <Text>Lokasi Pertemuan (*)</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={lokasiPertemuan} 
                        onChangeText={(text) => setLokasiPertemuan(text)}
                        placeholder='Gang Kelinci'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormSubKelompok = () => (
        <View style={styles.MT8}>
            <Text
                onPress={() => alert('+ Sub Kelompok')}
                style={{ color: colors.DEFAULT, textDecorationLine: 'underline' }}
            >
                + Sub Kelompok
            </Text>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            <Text style={[styles.bodyTitle, { margin: 0, marginBottom: 16 }]}>Kelompok Baru</Text>
            <ScrollView>
                {renderFormNamaKelompok()}
                {renderFormGroupProduk()}
                {renderFormTanggalPKMPertama()}
                {renderFormHariPertemuan()}
                {renderFormWaktuPertemuan()}
                {renderFormLokasiPertemuan()}
                {/* {renderFormSubKelompok()} */}
            </ScrollView>
        </View>
    )

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

    const SubmitHandler = async () => {
        if (!namaKelompok || typeof namaKelompok === 'undefined' || namaKelompok === '' || namaKelompok === 'null') return flashNotification("Alert", "Nama kelompok tidak boleh kosong", "#ff6347", "#fff");
        if (!valueGroupProduk || typeof valueGroupProduk === 'undefined' || valueGroupProduk === '' || valueGroupProduk === 'null') return flashNotification("Alert", "Silahkan pilih group product", "#ff6347", "#fff");
        if (!tanggalPKMPertama || typeof tanggalPKMPertama === 'undefined' || tanggalPKMPertama === '' || tanggalPKMPertama === 'null') return flashNotification("Alert", "Tanggal PKM pertama tidak boleh kosong", "#ff6347", "#fff");
        if (!valueHariPertemuan || typeof valueHariPertemuan === 'undefined' || valueHariPertemuan === '' || valueHariPertemuan === 'null') return flashNotification("Alert", "Silahkan pilih hari pertemuan", "#ff6347", "#fff");
        if (!valueWaktuPertemuan || typeof valueWaktuPertemuan === 'undefined' || valueWaktuPertemuan === '' || valueWaktuPertemuan === 'null') return flashNotification("Alert", "Silahkan pilih waktu pertemuan", "#ff6347", "#fff");
        if (!lokasiPertemuan || typeof lokasiPertemuan === 'undefined' || lokasiPertemuan === '' || lokasiPertemuan === 'null') return flashNotification("Alert", "Lokasi pertemuan tidak boleh kosong", "#ff6347", "#fff");

        let timestamp = new Date()

        // console.log(timestamp)

        let idTemp = branchid + "_" + userName + "_" + timestamp

        // console.log(idTemp)

        const encrypt = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            idTemp
          );

        console.log(encrypt)

        let queryInsertKelompokBaru = "INSERT INTO Table_PP_Kelompok ( kelompok_Id, kelompok, group_Produk, tanggal_Pertama, hari_Pertemuan, waktu_Pertemuan, lokasi_Pertemuan, branchid, input_Date, status ) VALUES "
            + "( '"
            + encrypt
            + "', '"
            + namaKelompok
            + "', '"
            + valueGroupProduk
            + "', '"
            + tanggalPKMPertama
            + "', '"
            + valueHariPertemuan
            + "', '"
            + valueWaktuPertemuan
            + "', '"
            + lokasiPertemuan
            + "', '"
            + branchid
            + "', '"
            + currentDate
            + "', '"
            + "0"
            + "' );"

        let queryInsertSubKelompokBaru = "INSERT INTO Table_PP_SubKelompok ( kelompok_Id, subKelompok_Id, kelompok, subKelompok, num, branchid, status ) VALUES "
            + "( '"
            + ""
            + "', '"
            + ""
            + "', '"
            + namaKelompok
            + "', '"
            + namaKelompok
            + "', '"
            + 1
            + "', '"
            + branchid
            + "', '"
            + 0
            + "' );"
        
        try {
            db.transaction(
                tx => {
                    tx.executeSql(queryInsertKelompokBaru)
                }, function(error) {
                    flashNotification("Error", error, "#ff6347", "#fff")
                    return
                }, function() {
                    try{
                        db.transaction(
                            tx => {
                                tx.executeSql(queryInsertSubKelompokBaru)
                            }, function(error) {
                                flashNotification("Error", error, "#ff6347", "#fff")
                                return
                            }, function() {
                                flashNotification("Success", 'Kelompok berhasil ditambahkan', "#1F8327", "#fff")
                                navigation.goBack()
                            }
                        )
                    }catch(error){
                        flashNotification("Error", error, "#ff6347", "#fff")
                        return
                    }
                }
            )
        }catch(error){
            flashNotification("Error", error, "#ff6347", "#fff")
            return
        }
        
    }

    const renderButton = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => SubmitHandler()}
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
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>INISIASI</Text>
                    </View>
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

export default InisiasiFormPPKelompok;
