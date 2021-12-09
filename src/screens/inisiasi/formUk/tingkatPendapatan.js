import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, TextInput, ScrollView, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from './styles';
import { RadioButton } from 'react-native-paper';
import db from '../../../database/Database';
import { Picker } from '@react-native-picker/picker';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const dataPembiayaanLembagaLain = [
    { label: 'Keuangan Bank', value: '1' },
    { label: 'Keuangan Non Bank', value: '2' },
    { label: 'Lainnya', value: '3' }
];
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormUKTingkatPendapatan = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [valuePedapatanKotorPerhari, setValuePedapatanKotorPerhari] = useState('');
    const [valuePengeluaranKeluargaPerhari, setValuePengeluaranKeluargaPerhari] = useState('');
    const [valuePendapatanBersihPerhari, setValuePendapatanBersihPerhari] = useState('');
    const [valueJumlahHariUsahPerbulan, setValueJumlahHariUsahPerbulan] = useState('');
    const [valuePendapatanBersihPerbulan, setValuePendapatanBersihPerbulan] = useState('');
    const [valuePendapatanBersihPerminggu, setValuePendapatanBersihPerminggu] = useState('');
    const [openPembiayaanLembagaLain, setOpenPembiayaanLembagaLain] = useState(false);
    const [valuePembiayaanLembagaLain, setValuePembiayaanLembagaLain] = useState(null);
    const [valuePembiayaanLembagaLainFreetext, setIPembiayaanLembagaLainFreetext] = useState('');
    const [itemsPembiayaanLembagaLain, setItemsPembiayaanLembagaLain] = useState(dataPembiayaanLembagaLain);
    const [valueJumlahAngsuran, setValueJumlahAngsuran] = useState('');
    const [valuePedapatanKotorPerhariSuami, setValuePedapatanKotorPerhariSuami] = useState('');
    const [valuePengeluaranKeluargaPerhariSuami, setValuePengeluaranKeluargaPerhariSuami] = useState('');
    const [valuePendapatanBersihPerhariSuami, setValuePendapatanBersihPerhariSuami] = useState('');
    const [valueJumlahHariUsahPerbulanSuami, setValueJumlahHariUsahPerbulanSuami] = useState('');
    const [valuePendapatanBersihPerbulanSuami, setValuePendapatanBersihPerbulanSuami] = useState('');
    const [valuePendapatanBersihPermingguSuami, setValuePendapatanBersihPermingguSuami] = useState('');
    const [valuePembiayaanDariLembaga, setValuePembiayaanDariLembaga] = useState('1');
    const [submmitted, setSubmmitted] = useState(false);
    const [dataPembiayaanLain, setDataPembiayaanLain] = useState([]);

    useEffect(() => {
        setInfo();
        getStoragePembiayaanLain();
        getUKPendapatanNasabah();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal);
    }

    const getUKPendapatanNasabah = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_PendapatanNasabah WHERE nama_lengkap = '` + namaNasabah + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_PendapatanNasabah length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);
                        if (data.pendapatan_Kotor_perhari !== null && typeof data.pendapatan_Kotor_perhari !== 'undefined') setValuePedapatanKotorPerhari(data.pendapatan_Kotor_perhari);
                        if (data.pengeluaran_Keluarga_Perhari !== null && typeof data.pengeluaran_Keluarga_Perhari !== 'undefined') setValuePengeluaranKeluargaPerhari(data.pengeluaran_Keluarga_Perhari);
                        if (data.pendapatan_Bersih_Perhari !== null && typeof data.pendapatan_Bersih_Perhari !== 'undefined') setValuePendapatanBersihPerhari(data.pendapatan_Bersih_Perhari);
                        if (data.jumlah_Hari_Usaha_Perbulan !== null && typeof data.jumlah_Hari_Usaha_Perbulan !== 'undefined') setValueJumlahHariUsahPerbulan(data.jumlah_Hari_Usaha_Perbulan);
                        if (data.pendapatan_Bersih_Perbulan !== null && typeof data.pendapatan_Bersih_Perbulan !== 'undefined') setValuePendapatanBersihPerbulan(data.pendapatan_Bersih_Perbulan);
                        if (data.pendapatan_Bersih_Perminggu !== null && typeof data.pendapatan_Bersih_Perminggu !== 'undefined') setValuePendapatanBersihPerminggu(data.pendapatan_Bersih_Perminggu);
                        if (data.pembiayaan_Dari_Lembaga !== null && typeof data.pembiayaan_Dari_Lembaga !== 'undefined') setValuePembiayaanDariLembaga(data.pembiayaan_Dari_Lembaga);
                        if (data.Pembiayaan_Dari_LembagaLain !== null && typeof data.Pembiayaan_Dari_LembagaLain !== 'undefined') setValuePembiayaanLembagaLain(data.Pembiayaan_Dari_LembagaLain);
                        if (data.Pembiayaan_Dari_LembagaLainFreetext !== null && typeof data.Pembiayaan_Dari_LembagaLainFreetext !== 'undefined') setIPembiayaanLembagaLainFreetext(data.Pembiayaan_Dari_LembagaLainFreetext);
                        if (data.jumlah_Angsuran !== null && typeof data.jumlah_Angsuran !== 'undefined') setValueJumlahAngsuran(data.jumlah_Angsuran);
                        if (data.pendapatanSuami_Kotor_Perhari !== null && typeof data.pendapatanSuami_Kotor_Perhari !== 'undefined') setValuePedapatanKotorPerhariSuami(data.pendapatanSuami_Kotor_Perhari);
                        if (data.pendapatanSuami_Pengeluaran_Keluarga_Perhari !== null && typeof data.pendapatanSuami_Pengeluaran_Keluarga_Perhari !== 'undefined') setValuePengeluaranKeluargaPerhariSuami(data.pendapatanSuami_Pengeluaran_Keluarga_Perhari);
                        if (data.pendapatanSuami_Pendapatan_Bersih_Perhari !== null && typeof data.pendapatanSuami_Pendapatan_Bersih_Perhari !== 'undefined') setValuePendapatanBersihPerhariSuami(data.pendapatanSuami_Pendapatan_Bersih_Perhari);
                        if (data.pendapatanSuami_jumlah_Hari_Usaha_Perbulan !== null && typeof data.pendapatanSuami_jumlah_Hari_Usaha_Perbulan !== 'undefined') setValueJumlahHariUsahPerbulanSuami(data.pendapatanSuami_jumlah_Hari_Usaha_Perbulan);
                        if (data.pendapatanSuami_pendapatan_Bersih_Perbulan !== null && typeof data.pendapatanSuami_pendapatan_Bersih_Perbulan !== 'undefined') setValuePendapatanBersihPerbulanSuami(data.pendapatanSuami_pendapatan_Bersih_Perbulan);
                        if (data.pendapatanSuami_pendapatan_Bersih_Perminggu !== null && typeof data.pendapatanSuami_pendapatan_Bersih_Perminggu !== 'undefined') setValuePendapatanBersihPermingguSuami(data.pendapatanSuami_pendapatan_Bersih_Perminggu);
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_PendapatanNasabah error:', error.message);
                })
            }
        )
    }

    const getStoragePembiayaanLain = async () => {
        if (__DEV__) console.log('getStoragePembiayaanLain loaded');

        try {
            const response = await AsyncStorage.getItem('PembiayaanLain');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    setDataPembiayaanLain(responseJSON);
                    return;
                }
            }
            setDataPembiayaanLain([]);
        } catch (error) {
            setDataPembiayaanLain([]);
        }
    }

    const doSubmitDraft = () => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valuePedapatanKotorPerhari:', valuePedapatanKotorPerhari);
        if (__DEV__) console.log('doSubmitDraft valuePengeluaranKeluargaPerhari:', valuePengeluaranKeluargaPerhari);
        if (__DEV__) console.log('doSubmitDraft valuePendapatanBersihPerhari:', valuePendapatanBersihPerhari);
        if (__DEV__) console.log('doSubmitDraft valueJumlahHariUsahPerbulan:', valueJumlahHariUsahPerbulan);
        if (__DEV__) console.log('doSubmitDraft valuePendapatanBersihPerbulan:', valuePendapatanBersihPerbulan);
        if (__DEV__) console.log('doSubmitDraft valuePendapatanBersihPerminggu:', valuePendapatanBersihPerminggu);
        if (__DEV__) console.log('doSubmitDraft valuePembiayaanDariLembaga:', valuePembiayaanDariLembaga);
        if (__DEV__) console.log('doSubmitDraft valuePembiayaanLembagaLain:', valuePembiayaanLembagaLain);
        if (__DEV__) console.log('doSubmitDraft valuePembiayaanLembagaLainFreetext:', valuePembiayaanLembagaLainFreetext);
        if (__DEV__) console.log('doSubmitDraft valueJumlahAngsuran:', valueJumlahAngsuran);
        if (__DEV__) console.log('doSubmitDraft valuePedapatanKotorPerhariSuami:', valuePedapatanKotorPerhariSuami);
        if (__DEV__) console.log('doSubmitDraft valuePengeluaranKeluargaPerhariSuami:', valuePengeluaranKeluargaPerhariSuami);
        if (__DEV__) console.log('doSubmitDraft valuePendapatanBersihPerhariSuami:', valuePendapatanBersihPerhariSuami);
        if (__DEV__) console.log('doSubmitDraft valueJumlahHariUsahPerbulanSuami:', valueJumlahHariUsahPerbulanSuami);
        if (__DEV__) console.log('doSubmitDraft valuePendapatanBersihPerbulanSuami:', valuePendapatanBersihPerbulanSuami);
        if (__DEV__) console.log('doSubmitDraft valuePendapatanBersihPermingguSuami:', valuePendapatanBersihPermingguSuami);

        if (submmitted) return true;

        setSubmmitted(true);
        const find = 'SELECT * FROM Table_UK_PendapatanNasabah WHERE nama_lengkap = "'+ namaNasabah +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_PendapatanNasabah (nama_lengkap, pendapatan_Kotor_perhari, pengeluaran_Keluarga_Perhari, pendapatan_Bersih_Perhari, jumlah_Hari_Usaha_Perbulan, pendapatan_Bersih_Perbulan, pendapatan_Bersih_Perminggu, pembiayaan_Dari_Lembaga, Pembiayaan_Dari_LembagaLain, Pembiayaan_Dari_LembagaLainFreetext, jumlah_Angsuran, pendapatanSuami_Kotor_Perhari, pendapatanSuami_Pengeluaran_Keluarga_Perhari, pendapatanSuami_Pendapatan_Bersih_Perhari, pendapatanSuami_jumlah_Hari_Usaha_Perbulan, pendapatanSuami_pendapatan_Bersih_Perbulan, pendapatanSuami_pendapatan_Bersih_Perminggu) values ("' + namaNasabah + '","' + valuePedapatanKotorPerhari + '","' + valuePengeluaranKeluargaPerhari + '","' + valuePendapatanBersihPerhari + '","' + valueJumlahHariUsahPerbulan + '","' + valuePendapatanBersihPerbulan + '","' + valuePendapatanBersihPerminggu + '","' + valuePembiayaanDariLembaga + '","' + valuePembiayaanLembagaLain + '","' + valuePembiayaanLembagaLainFreetext + '","' + valueJumlahAngsuran + '","' + valuePedapatanKotorPerhariSuami + '","' + valuePengeluaranKeluargaPerhariSuami + '","' + valuePendapatanBersihPerhariSuami + '","' + valueJumlahHariUsahPerbulanSuami + '","' + valuePendapatanBersihPerbulanSuami + '","' + valuePendapatanBersihPermingguSuami + '")';
                    } else {
                        query = 'UPDATE Table_UK_PendapatanNasabah SET pendapatan_Kotor_perhari = "' + valuePedapatanKotorPerhari + '", pengeluaran_Keluarga_Perhari = "' + valuePengeluaranKeluargaPerhari + '", pendapatan_Bersih_Perhari = "' + valuePendapatanBersihPerhari + '", jumlah_Hari_Usaha_Perbulan = "' + valueJumlahHariUsahPerbulan + '", pendapatan_Bersih_Perbulan = "' + valuePendapatanBersihPerbulan + '", pendapatan_Bersih_Perminggu = "' + valuePendapatanBersihPerminggu + '", pembiayaan_Dari_Lembaga = "' + valuePembiayaanDariLembaga + '", Pembiayaan_Dari_LembagaLain = "' + valuePembiayaanLembagaLain + '", Pembiayaan_Dari_LembagaLainFreetext = "' + valuePembiayaanLembagaLainFreetext + '", jumlah_Angsuran = "' + valueJumlahAngsuran + '", pendapatanSuami_Kotor_Perhari = "' + valuePedapatanKotorPerhariSuami + '", pendapatanSuami_Pengeluaran_Keluarga_Perhari = "' + valuePengeluaranKeluargaPerhariSuami + '", pendapatanSuami_Pendapatan_Bersih_Perhari = "' + valuePendapatanBersihPerhariSuami + '", pendapatanSuami_jumlah_Hari_Usaha_Perbulan = "' + valueJumlahHariUsahPerbulanSuami + '", pendapatanSuami_pendapatan_Bersih_Perbulan = "' + valuePendapatanBersihPerbulanSuami + '", pendapatanSuami_pendapatan_Bersih_Perminggu = "' + valuePendapatanBersihPermingguSuami + '" WHERE nama_lengkap = "' + namaNasabah + '"';
                    }

                    if (__DEV__) console.log('doSubmitDraft db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update error:', error.message);
                            setSubmmitted(false);
                        },function() {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update success');
                            setSubmmitted(false);
                            ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_PendapatanNasabah", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_PendapatanNasabah RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_PendapatanNasabah ERROR:', error);
                                    }, function() {}
                                );
                            }
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDraft db.transaction find error:', error.message);
                    setSubmmitted(false);
                })
            }
        );
    }

    const doSubmitSave = () => {
        if (__DEV__) console.log('doSubmitSave loaded');

        if (submmitted) return true;

        setSubmmitted(true);
        const find = 'SELECT * FROM Table_UK_Master WHERE namaNasabah = "'+ namaNasabah +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        alert('UK Master not found');
                        navigation.goBack();
                        return;
                    }

                    query = 'UPDATE Table_UK_Master SET status = "5" WHERE namaNasabah = "' + namaNasabah + '"';

                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update error:', error.message);
                            setSubmmitted(false);
                        },function() {
                            if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update success');

                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_Master", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_Master RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_Master ERROR:', error);
                                    }, function() {}
                                );
                            }
                            setSubmmitted(false);
                            alert('Berhasil');
                            navigation.goBack();
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction find error:', error.message);
                    setSubmmitted(false);
                })
            }
        );
    }

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.replace('UjiKelayakan', { groupName: groupName })} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>UJI KELAYAKAN</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerBoxImageBackground}>
                <ImageBackground source={images.banner} style={styles.headerImageBackground} imageStyle={{ borderRadius: 20 }}>
                    <Text style={[styles.headerText, { fontSize: 30 }]}>Form Uji Kelayakan</Text>
                    <Text style={[styles.headerText, { fontSize: 20 }]}>{groupName}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{namaNasabah}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{currentDate}</Text>
                </ImageBackground>
            </View>
        </>
    )

    const renderFormPendapatanKotorPerhari = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Kotor Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePedapatanKotorPerhari} 
                        onChangeText={(text) => setValuePedapatanKotorPerhari(text)}
                        placeholder='30000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPengeluaranKeluargaPerhari = () => (
        <View style={styles.MT8}>
            <Text>Pengeluaran Keluarga Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePengeluaranKeluargaPerhari} 
                        onChangeText={(text) => setValuePengeluaranKeluargaPerhari(text)}
                        placeholder='10000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
            <Text style={styles.note}>Termasuk Jumlah angsuran dari Pembiayaan lain</Text>
        </View>
    )

    const renderFormPendapatanBersihPerhari = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerhari} 
                        onChangeText={(text) => setValuePendapatanBersihPerhari(text)}
                        placeholder='20000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJumlahHariUsahPerbulan = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Usaha Hari Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahHariUsahPerbulan} 
                        onChangeText={(text) => setValueJumlahHariUsahPerbulan(text)}
                        placeholder='30'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPerbulan = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerbulan} 
                        onChangeText={(text) => setValuePendapatanBersihPerbulan(text)}
                        placeholder='600000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPerminggu = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Minggu</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerminggu} 
                        onChangeText={(text) => setValuePendapatanBersihPerminggu(text)}
                        placeholder='150000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderPembiayaanDariLembaga = () => (
        <View style={styles.MT8}>
            <Text>Pembiayaan dari Lembaga</Text>
            <RadioButton.Group onValueChange={newValue => setValuePembiayaanDariLembaga(newValue)} value={valuePembiayaanDariLembaga}>
                <View style={[styles.FDRow]}>
                    <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                        <RadioButton value="1" />
                        <Text>Tidak Ada</Text>
                    </View>
                    <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                        <RadioButton value="2" />
                        <Text>{`<= 2 Lembaga`}</Text>
                    </View>
                    <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                        <RadioButton value="3" />
                        <Text>{`> 2 Lembaga`}</Text>
                    </View>
                </View>
            </RadioButton.Group>
        </View>
    )

    const renderFormJenisUsaha = () => (
        <View style={styles.MT16}>
            <Text>Pembiayaan Lembaga Lain</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valuePembiayaanLembagaLain}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValuePembiayaanLembagaLain(itemValue)}
                >
                    {dataPembiayaanLain.map((x, i) => <Picker.Item label={x.jenisPembiayaanDetail} value={x.id} />)}
                    <Picker.Item label={'Lainnya'} value={'3'} />
                    <Picker.Item label={'-- Pilih --'} value={null} />
                </Picker>
            </View>
            {['3'].includes(valuePembiayaanLembagaLain) && (
                <View style={[styles.textInputContainer, { width: withTextInput }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={valuePembiayaanLembagaLainFreetext} 
                            onChangeText={(text) => setIPembiayaanLembagaLainFreetext(text)}
                            placeholder='Lainnya'
                            style={styles.F1}
                        />
                    </View>
                    <View />
                </View>
            )}
        </View>
    )

    const renderFormJumlahAngsuran = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Angsuran</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahAngsuran} 
                        onChangeText={(text) => setValueJumlahAngsuran(text)}
                        placeholder='30'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanKotorPerhariSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Kotor Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePedapatanKotorPerhariSuami} 
                        onChangeText={(text) => setValuePedapatanKotorPerhariSuami(text)}
                        placeholder='30000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPengeluaranKeluargaPerhariSuami = () => (
        <View style={styles.MT8}>
            <Text>Pengeluaran Keluarga Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePengeluaranKeluargaPerhariSuami} 
                        onChangeText={(text) => setValuePengeluaranKeluargaPerhariSuami(text)}
                        placeholder='10000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
            <Text style={styles.note}>Termasuk Jumlah angsuran dari Pembiayaan lain</Text>
        </View>
    )

    const renderFormPendapatanBersihPerhariSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerhariSuami} 
                        onChangeText={(text) => setValuePendapatanBersihPerhariSuami(text)}
                        placeholder='20000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJumlahHariUsahPerbulanSuami = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Usaha Hari Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahHariUsahPerbulanSuami} 
                        onChangeText={(text) => setValueJumlahHariUsahPerbulanSuami(text)}
                        placeholder='30'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPerbulanSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerbulanSuami} 
                        onChangeText={(text) => setValuePendapatanBersihPerbulanSuami(text)}
                        placeholder='600000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPermingguSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Minggu</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPermingguSuami} 
                        onChangeText={(text) => setValuePendapatanBersihPermingguSuami(text)}
                        placeholder='150000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanSuami = () => (
        <View style={styles.MT8}>
            <Text style={[styles.FS18, styles.MB16]}>PENDAPATAN SUAMI</Text>
            {renderFormPendapatanKotorPerhariSuami()}
            {renderFormPengeluaranKeluargaPerhariSuami()}
            {renderFormPendapatanBersihPerhariSuami()}
            {renderFormJumlahHariUsahPerbulanSuami()}
            {renderFormPendapatanBersihPerbulanSuami()}
            {renderFormPendapatanBersihPermingguSuami()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormPendapatanKotorPerhari()}
            {renderFormPengeluaranKeluargaPerhari()}
            {renderFormPendapatanBersihPerhari()}
            {renderFormJumlahHariUsahPerbulan()}
            {renderFormPendapatanBersihPerbulan()}
            {renderFormPendapatanBersihPerminggu()}
            {renderPembiayaanDariLembaga()}
            {renderFormJenisUsaha()}
            {renderFormJumlahAngsuran()}
            {renderButtonSaveDraft()}
            {renderSpace()}
            {renderFormPendapatanSuami()}
        </View>
    )

    const renderButtonSaveDraft = () => (
        <View style={styles.buttonContainer}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => doSubmitDraft()}
            >
                <View style={styles.button}>
                    <Text>Save Draft</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderButtonSimpan = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => doSubmitSave()}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderSpace = () => (
        <View style={styles.spaceGray} />
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Pendapatan Nasabah</Text>
            <ScrollView>
                {renderForm()}
                {renderButtonSimpan()}
            </ScrollView>
        </View>
    )

    return(
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

export default InisiasiFormUKTingkatPendapatan;
