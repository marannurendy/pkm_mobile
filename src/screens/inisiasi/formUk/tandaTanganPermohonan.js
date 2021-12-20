import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView, StyleSheet, Dimensions, Button, Image, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import db from '../../../database/Database';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const dataPilihan = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' }
];
const withTextInput = dimension.width - (20 * 4) + 8;
var uniqueNumber = (new Date().getTime()).toString(36);

const InisiasiFormUKTandaTanganPermohonan = ({ route }) => {
    const { id, groupName, namaNasabah, screenState } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [valueProdukPembiayaan, setValueProdukPembiayaan] = useState('');
    const [valueJumlahPembiayaanYangDiajukan, setValueJumlahPembiayaanYangDiajukan] = useState('');
    const [valueJangkaWaktu, setValueJangkaWaktu] = useState('');
    const [valueFrekuensiPembiayaan, setValueFrekuensiPembiayaan] = useState('');
    const [valueTandaTanganAOSAO, setValueTandaTanganAOSAO] = useState(null);
    const [valueTandaTanganNasabah, setValueTandaTanganNasabah] = useState(null);
    const [valueTandaTanganSuamiPenjamin, setValueTandaTanganSuamiPenjamin] = useState(null);
    const [valueTandaTanganKetuaSubKemlompok, setValueTandaTanganKetuaSubKemlompok] = useState(null);
    const [valueTandaTanganKetuaKelompok, setValueTandaTanganKetuaKemlompok] = useState(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [submmitted, setSubmmitted] = useState(false);
    const [valueNamaTandaTanganNasabah, setValueNamaTandaTanganNasabah] = useState(namaNasabah);
    const [valueNamaTandaTanganSuamiPenjamin, setValueNamaTandaTanganSuamiPenjamin] = useState('');
    const [valueNamaTandaTanganKetuaSubKelompok, setValueNamaTandaTanganKetuaSubKelompok] = useState('');
    const [valueNamaTandaTanganKetuaKelompok, setValueNamaTandaTanganKetuaKelompok] = useState('');
    const [aoName, setAoName] = useState('');
    const [key_tandaTanganAOSAO, setKey_tandaTanganAOSAO] = useState(`formUK_tandaTanganAOSAO_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_tandaTanganNasabah, setKey_tandaTanganNasabah] = useState(`formUK_tandaTanganNasabah_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_tandaTanganSuamiPenjamin, setKey_tandaTanganSuamiPenjamin] = useState(`formUK_tandaTanganSuamiPenjamin_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_tandaTanganKetuaSubKemlompok, setKey_tandaTanganKetuaSubKemlompok] = useState(`formUK_tandaTanganKetuaSubKemlompok_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_tandaTanganKetuaKelompok, setKey_tandaTanganKetuaKelompok] = useState(`formUK_tandaTanganKetuaKelompok_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);

    useEffect(() => {
        getUserData();
        setInfo();
        getUKDataDiri();
        getUKPermohonanPembiayaan();
        getUKProdukPembiayaan();
    }, []);

    const getUserData = () => {
        AsyncStorage.getItem('userData', (error, result) => {
            if (error) __DEV__ && console.log('userData error:', error);

            let data = JSON.parse(result);
            setAoName(data.AOname);
        });
    }

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKPermohonanPembiayaan = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_PermohonanPembiayaan WHERE idSosialisasiDatabase = '` + id + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], async (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);

                        setKey_tandaTanganAOSAO(data.tanda_Tangan_AOSAO);
                        setKey_tandaTanganNasabah(data.tanda_Tangan_Nasabah);
                        setKey_tandaTanganSuamiPenjamin(data.tanda_Tangan_SuamiPenjamin);
                        setKey_tandaTanganKetuaSubKemlompok(data.tanda_Tangan_Ketua_SubKelompok);
                        setKey_tandaTanganKetuaKelompok(data.tanda_Tangan_Ketua_Kelompok);

                        const tandaTanganAOSAO = await AsyncStorage.getItem(data.tanda_Tangan_AOSAO);
                        const tandaTanganNasabah = await AsyncStorage.getItem(data.tanda_Tangan_Nasabah);
                        const tandaTanganSuamiPenjamin = await AsyncStorage.getItem(data.tanda_Tangan_SuamiPenjamin);
                        const tandaTanganKetuaSubKemlompok = await AsyncStorage.getItem(data.tanda_Tangan_Ketua_SubKelompok);
                        const tandaTanganKetuaKelompok = await AsyncStorage.getItem(data.tanda_Tangan_Ketua_Kelompok);

                        if (__DEV__) console.log('tandaTanganAOSAO :', data.tanda_Tangan_AOSAO, tandaTanganAOSAO);
                        if (__DEV__) console.log('tandaTanganNasabah :', data.tanda_Tangan_Nasabah, tandaTanganNasabah);
                        if (__DEV__) console.log('tandaTanganSuamiPenjamin :', data.tanda_Tangan_SuamiPenjamin, tandaTanganSuamiPenjamin);
                        if (__DEV__) console.log('tandaTanganKetuaSubKemlompok :', data.tanda_Tangan_Ketua_SubKelompok, tandaTanganKetuaSubKemlompok);
                        if (__DEV__) console.log('tandaTanganKetuaKelompok :', data.tanda_Tangan_Ketua_Kelompok, tandaTanganKetuaKelompok);

                        if (data.produk_Pembiayaan !== null && typeof data.produk_Pembiayaan !== 'undefined') setValueProdukPembiayaan(data.produk_Pembiayaan);
                        if (data.frekuensi_Pembiayaan !== null && typeof data.frekuensi_Pembiayaan !== 'undefined') setValueFrekuensiPembiayaan(data.frekuensi_Pembiayaan);
                        if (data.tanda_Tangan_AOSAO !== null && typeof data.tanda_Tangan_AOSAO !== 'undefined') setValueTandaTanganAOSAO(tandaTanganAOSAO);
                        if (data.tanda_Tangan_Nasabah !== null && typeof data.tanda_Tangan_Nasabah !== 'undefined') setValueTandaTanganNasabah(tandaTanganNasabah);
                        if (data.tanda_Tangan_SuamiPenjamin !== null && typeof data.tanda_Tangan_SuamiPenjamin !== 'undefined') setValueTandaTanganSuamiPenjamin(tandaTanganSuamiPenjamin);
                        if (data.tanda_Tangan_Ketua_SubKelompok !== null && typeof data.tanda_Tangan_Ketua_SubKelompok !== 'undefined') setValueTandaTanganKetuaSubKemlompok(tandaTanganKetuaSubKemlompok);
                        if (data.tanda_Tangan_Ketua_Kelompok !== null && typeof data.tanda_Tangan_Ketua_Kelompok !== 'undefined') setValueTandaTanganKetuaKemlompok(tandaTanganKetuaKelompok);
                        if (data.nama_tanda_Tangan_Nasabah !== null && typeof data.nama_tanda_Tangan_Nasabah !== 'undefined') setValueNamaTandaTanganNasabah(data.nama_tanda_Tangan_Nasabah);
                        if (data.nama_tanda_Tangan_SuamiPenjamin !== null && typeof data.nama_tanda_Tangan_SuamiPenjamin !== 'undefined') setValueNamaTandaTanganSuamiPenjamin(data.nama_tanda_Tangan_SuamiPenjamin);
                        if (data.nama_tanda_Tangan_Ketua_SubKelompok !== null && typeof data.nama_tanda_Tangan_Ketua_SubKelompok !== 'undefined') setValueNamaTandaTanganKetuaSubKelompok(data.nama_tanda_Tangan_Ketua_SubKelompok);
                        if (data.nama_tanda_Tangan_Ketua_Kelompok !== null && typeof data.nama_tanda_Tangan_Ketua_Kelompok !== 'undefined') setValueNamaTandaTanganKetuaKelompok(data.nama_tanda_Tangan_Ketua_Kelompok);
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan error:', error.message);
                })
            }
        )
    }

    const getUKProdukPembiayaan = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_ProdukPembiayaan WHERE idSosialisasiDatabase = '` + id + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], async (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_ProdukPembiayaan length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);
                        if (data.produk_Pembiayaan !== null && typeof data.produk_Pembiayaan !== 'undefined') {
                            const response = await AsyncStorage.getItem('Product');
                            if (response !== null) {
                                const responseJSON = JSON.parse(response);
                                if (__DEV__) console.log('AsyncStorage Product responseJSON:', responseJSON);
                                if (responseJSON.length > 0 ?? false) {
                                    let value = data.produk_Pembiayaan;
                                    setValueProdukPembiayaan(responseJSON.filter(data => data.id === value)[0].productName.trim() || '');
                                }
                            }
                        }
                        if (data.jumlah_Pinjaman !== null && typeof data.jumlah_Pinjaman !== 'undefined') setValueJumlahPembiayaanYangDiajukan(data.jumlah_Pinjaman);
                        if (data.term_Pembiayaan !== null && typeof data.term_Pembiayaan !== 'undefined') setValueJangkaWaktu(data.term_Pembiayaan);
                        if (data.frekuensi_Pembayaran !== null && typeof data.frekuensi_Pembayaran !== 'undefined') {
                            const response = await AsyncStorage.getItem('Frekuensi');
                            if (response !== null) {
                                const responseJSON = JSON.parse(response);
                                if (__DEV__) console.log('AsyncStorage Frekuensi responseJSON:', responseJSON);
                                if (responseJSON.length > 0 ?? false) {
                                    let value = data.frekuensi_Pembayaran;
                                    setValueFrekuensiPembiayaan(responseJSON.filter(data => data.id === value)[0].namafrekuensi.trim() || '');
                                }
                            }
                        }
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_ProdukPembiayaan error:', error.message);
                })
            }
        )
    }

    const getUKDataDiri = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_DataDiri WHERE idSosialisasiDatabase = '` + id + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], async (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);

                        if (data.nama_penjamin !== null && typeof data.nama_penjamin !== 'undefined') setValueNamaTandaTanganSuamiPenjamin(data.nama_penjamin);
                    }
                    return true;
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri error 3:', error.message);
                })
            }
        )
    }

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueProdukPembiayaan:', valueProdukPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueJumlahPembiayaanYangDiajukan:', valueJumlahPembiayaanYangDiajukan);
        if (__DEV__) console.log('doSubmitDraft valueJangkaWaktu:', valueJangkaWaktu);
        if (__DEV__) console.log('doSubmitDraft valueFrekuensiPembiayaan:', valueFrekuensiPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganAOSAO:', valueTandaTanganAOSAO);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganNasabah:', valueTandaTanganNasabah);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganSuamiPenjamin:', valueTandaTanganSuamiPenjamin);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganKetuaSubKemlompok:', valueTandaTanganKetuaSubKemlompok);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganKetuaKelompok:', valueTandaTanganKetuaKelompok);
        
        if (__DEV__) console.log('doSubmitDraft valueNamaTandaTanganNasabah:', valueNamaTandaTanganNasabah);
        if (__DEV__) console.log('doSubmitDraft valueNamaTandaTanganSuamiPenjamin:', valueNamaTandaTanganSuamiPenjamin);
        if (__DEV__) console.log('doSubmitDraft valueNamaTandaTanganKetuaSubKelompok:', valueNamaTandaTanganKetuaSubKelompok);
        if (__DEV__) console.log('doSubmitDraft valueNamaTandaTanganKetuaKelompok:', valueNamaTandaTanganKetuaKelompok);

        AsyncStorage.setItem(key_tandaTanganAOSAO, valueTandaTanganAOSAO);
        AsyncStorage.setItem(key_tandaTanganNasabah, valueTandaTanganNasabah);
        AsyncStorage.setItem(key_tandaTanganSuamiPenjamin, valueTandaTanganSuamiPenjamin);
        AsyncStorage.setItem(key_tandaTanganKetuaSubKemlompok, valueTandaTanganKetuaSubKemlompok);
        AsyncStorage.setItem(key_tandaTanganKetuaKelompok, valueTandaTanganKetuaKelompok);

        const find = 'SELECT * FROM Table_UK_PermohonanPembiayaan WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_PermohonanPembiayaan (nama_lengkap, produk_Pembiayaan, jumlah_Pembiayaan_Diajukan, jangka_Waktu, frekuensi_Pembiayaan, tanda_Tangan_AOSAO, tanda_Tangan_Nasabah, tanda_Tangan_SuamiPenjamin, tanda_Tangan_Ketua_SubKelompok, tanda_Tangan_Ketua_Kelompok, nama_tanda_Tangan_Nasabah, nama_tanda_Tangan_SuamiPenjamin, nama_tanda_Tangan_Ketua_SubKelompok, nama_tanda_Tangan_Ketua_Kelompok, idSosialisasiDatabase) values ("' + namaNasabah + '","' + valueProdukPembiayaan + '","' + valueJumlahPembiayaanYangDiajukan + '","' + valueJangkaWaktu + '","' + valueFrekuensiPembiayaan + '","' + key_tandaTanganAOSAO + '","' + key_tandaTanganNasabah + '","' + key_tandaTanganSuamiPenjamin + '","' + key_tandaTanganKetuaSubKemlompok + '","' + key_tandaTanganKetuaKelompok + '","' + valueNamaTandaTanganNasabah + '","' + valueNamaTandaTanganSuamiPenjamin + '","' + valueNamaTandaTanganKetuaSubKelompok + '","' + valueNamaTandaTanganKetuaKelompok + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_PermohonanPembiayaan SET produk_Pembiayaan = "' + valueProdukPembiayaan + '", jumlah_Pembiayaan_Diajukan = "' + valueJumlahPembiayaanYangDiajukan + '", jangka_Waktu = "' + valueJangkaWaktu + '", frekuensi_Pembiayaan = "' + valueFrekuensiPembiayaan + '", tanda_Tangan_AOSAO = "' + key_tandaTanganAOSAO + '", tanda_Tangan_Nasabah = "' + key_tandaTanganNasabah + '", tanda_Tangan_SuamiPenjamin = "' + key_tandaTanganSuamiPenjamin + '", tanda_Tangan_Ketua_SubKelompok = "' + key_tandaTanganKetuaSubKemlompok + '", tanda_Tangan_Ketua_Kelompok = "' + key_tandaTanganKetuaKelompok + '", nama_tanda_Tangan_Nasabah = "' + valueNamaTandaTanganNasabah + '", nama_tanda_Tangan_SuamiPenjamin = "' + valueNamaTandaTanganSuamiPenjamin + '", nama_tanda_Tangan_Ketua_SubKelompok = "' + valueNamaTandaTanganKetuaSubKelompok + '", nama_tanda_Tangan_Ketua_Kelompok = "' + valueNamaTandaTanganKetuaKelompok + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitDraft db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update error:', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update success');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_PermohonanPembiayaan", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan ERROR:', error);
                                    }, function() {}
                                );
                            }
                            return resolve(true);
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDraft db.transaction find error:', error.message);
                    return resolve(true);
                })
            }
        );
    })

    const doSubmitSave = async () => {
        if (__DEV__) console.log('doSubmitSave loaded');

        if (!valueTandaTanganAOSAO || typeof valueTandaTanganAOSAO === 'undefined' || valueTandaTanganAOSAO === '' || valueTandaTanganAOSAO === 'null') return alert('Tanda Tangan AO/SAO (*) tidak boleh kosong');
        if (!valueTandaTanganNasabah || typeof valueTandaTanganNasabah === 'undefined' || valueTandaTanganNasabah === '' || valueTandaTanganNasabah === 'null') return alert('Tanda Tangan Nasabah (*) tidak boleh kosong');
        if (!valueTandaTanganSuamiPenjamin || typeof valueTandaTanganSuamiPenjamin === 'undefined' || valueTandaTanganSuamiPenjamin === '' || valueTandaTanganSuamiPenjamin === 'null') return alert('Tanda Tangan Suami/Penjamin (*) tidak boleh kosong');
        if (!valueTandaTanganKetuaSubKemlompok || typeof valueTandaTanganKetuaSubKemlompok === 'undefined' || valueTandaTanganKetuaSubKemlompok === '' || valueTandaTanganKetuaSubKemlompok === 'null') return alert('Tanda Tangan Ketua Sub Kelompok (*) tidak boleh kosong');
        if (!valueTandaTanganKetuaKelompok || typeof valueTandaTanganKetuaKelompok === 'undefined' || valueTandaTanganKetuaKelompok === '' || valueTandaTanganKetuaKelompok === 'null') return alert('Tanda Tangan Ketua Kelompok (*) tidak boleh kosong');

        if (!valueNamaTandaTanganNasabah || typeof valueNamaTandaTanganNasabah === 'undefined' || valueNamaTandaTanganNasabah === '' || valueNamaTandaTanganNasabah === 'null') return alert('Nama Lengkap - Tanda Tangan Nasabah (*) tidak boleh kosong');
        if (!valueNamaTandaTanganSuamiPenjamin || typeof valueNamaTandaTanganSuamiPenjamin === 'undefined' || valueNamaTandaTanganSuamiPenjamin === '' || valueNamaTandaTanganSuamiPenjamin === 'null') return alert('Nama Lengkap - Tanda Tangan Suami/Penjamin (*) tidak boleh kosong');
        if (!valueNamaTandaTanganKetuaSubKelompok || typeof valueNamaTandaTanganKetuaSubKelompok === 'undefined' || valueNamaTandaTanganKetuaSubKelompok === '' || valueNamaTandaTanganKetuaSubKelompok === 'null') return alert('Nama Lengkap - Tanda Tangan Ketua Sub Kelompok (*) tidak boleh kosong');
        if (!valueNamaTandaTanganKetuaKelompok || typeof valueNamaTandaTanganKetuaKelompok === 'undefined' || valueNamaTandaTanganKetuaKelompok === '' || valueNamaTandaTanganKetuaKelompok === 'null') return alert('Nama Lengkap - Tanda Tangan Kelompok (*) tidak boleh kosong');

        if (submmitted) return true;

        setSubmmitted(true);

        await doSubmitDraft('submit');

        const find = 'SELECT * FROM Table_UK_Master WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    if (dataLengthFind === 0) {
                        alert('UK Master not found');
                        navigation.goBack();
                        return;
                    }

                    if (screenState === 5) {
                        let query = 'UPDATE Table_UK_Master SET status = "6" WHERE idSosialisasiDatabase = "' + id + '"';
                        if (__DEV__) console.log('doSubmitSave db.transaction insert/update query:', query);

                        db.transaction(
                            tx => {
                                tx.executeSql(query);
                            }, function(error) {
                                if (__DEV__) console.log('doSubmitSave db.transaction insert/update error:', error.message);
                                setSubmmitted(false);
                            },function() {
                                if (__DEV__) console.log('doSubmitSave db.transaction insert/update success');

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
                            }
                        );
                    }

                    setSubmmitted(false);
                    alert('Berhasil');
                    navigation.goBack();
                    
                }, function(error) {
                    if (__DEV__) console.log('doSubmitSave db.transaction find error:', error.message);
                    setSubmmitted(false);
                })
            }
        );
    }

    const onSelectSign = (key, data) => {
        if (__DEV__) console.log('onSelectSign loaded');
        if (__DEV__) console.log('onSelectSign key:', key);
        if (__DEV__) console.log('onSelectSign data:', data);

        if (key === 'tandaTanganNasabah') return setValueTandaTanganNasabah(data);
        if (key === 'tandaTanganSuamiPenjamin') return setValueTandaTanganSuamiPenjamin(data);
        if (key === 'tandaTanganKetuaSubKemlompok') return setValueTandaTanganKetuaSubKemlompok(data);
        if (key === 'tandaTanganKetuaKemlompok') return setValueTandaTanganKetuaKemlompok(data);
        if (key === 'tandaTanganAOSAO') return setValueTandaTanganAOSAO(data);
    };

    const formatter = (price, sign = 'Rp. ') => {
        const pieces = parseFloat(price).toFixed(2).split('');
        let ii = pieces.length - 3
        while ((ii-=3) > 0) {
            pieces.splice(ii, 0, ',')
        }
        return sign + pieces.join('')
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
                    {/* <Text style={[styles.headerText, { fontSize: 15 }]}>{id}</Text> */}
                </ImageBackground>
            </View>
        </>
    )

    const renderFormSiklusPembiayaan = () => (
        <View style={stylesheet.siklusContainer}>
            <Text style={styles.FS18}>SIKLUS PEMBIAYAAN</Text>
            <Text style={styles.FWBold}>Pertama</Text>
        </View>
    )

    const renderFormProdukPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Produk Pembiayaan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <Text style={styles.P4}>{valueProdukPembiayaan}</Text>
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJumlahPembiayaanYangDiajukan = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Pembiayaan Yang Diajukan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <Text style={styles.P4}>{formatter(valueJumlahPembiayaanYangDiajukan || 0)}</Text>
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJangkaWaktu = () => (
        <View style={styles.MT8}>
            <Text>Jangka Waktu</Text>
            <View style={[styles.textInputContainer]}>
                <View style={styles.F1}>
                    <Text style={styles.P4}>{valueJangkaWaktu}</Text>
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormFrekuensiPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Frekuensi Pembiayaan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <Text style={styles.P4}>{valueFrekuensiPembiayaan}</Text>
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormTandaTanganAOSAO = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan AO/SAO (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganAOSAO && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganAOSAO }}
                    />
                )}
                <View style={[styles.textInputContainer, { width: withTextInput - 32, marginHorizontal: 16, marginVertical: 8 }]}>
                    <View style={styles.F1}>
                        <Text style={styles.P4}>{aoName}</Text>
                    </View>
                    <View />
                </View>
                <Text style={[styles.note, { color: 'red', marginBottom: 16 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganAOSAO', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganNasabah = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Nasabah (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganNasabah && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganNasabah }}
                    />
                )}
                <View style={[styles.textInputContainer, { width: withTextInput - 32, marginHorizontal: 16, marginVertical: 8 }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={valueNamaTandaTanganNasabah} 
                            onChangeText={(text) => setValueNamaTandaTanganNasabah(text)}
                            placeholder='Nama Lengkap (*)'
                            style={styles.F1}
                        />
                    </View>
                    <View />
                </View>
                <Text style={[styles.note, { color: 'red', marginBottom: 16 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganNasabah', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganSuamiPenjamin = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Suami/Penjamin (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganSuamiPenjamin && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganSuamiPenjamin }}
                    />
                )}
                <View style={[styles.textInputContainer, { width: withTextInput - 32, marginHorizontal: 16, marginVertical: 8 }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={valueNamaTandaTanganSuamiPenjamin} 
                            onChangeText={(text) => setValueNamaTandaTanganSuamiPenjamin(text)}
                            placeholder='Nama Lengkap (*)'
                            style={styles.F1}
                        />
                    </View>
                    <View />
                </View>
                <Text style={[styles.note, { color: 'red', marginBottom: 16 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganSuamiPenjamin', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganKetuaSubKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Sub Kelompok (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganKetuaSubKemlompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaSubKemlompok }}
                    />
                )}
                <View style={[styles.textInputContainer, { width: withTextInput - 32, marginHorizontal: 16, marginVertical: 8 }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={valueNamaTandaTanganKetuaSubKelompok} 
                            onChangeText={(text) => setValueNamaTandaTanganKetuaSubKelompok(text)}
                            placeholder='Nama Lengkap (*)'
                            style={styles.F1}
                        />
                    </View>
                    <View />
                </View>
                <Text style={[styles.note, { color: 'red', marginBottom: 16 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaSubKemlompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganKetuaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Kelompok (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganKetuaKelompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaKelompok }}
                    />
                )}
                <View style={[styles.textInputContainer, { width: withTextInput - 32, marginHorizontal: 16, marginVertical: 8 }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={valueNamaTandaTanganKetuaKelompok} 
                            onChangeText={(text) => setValueNamaTandaTanganKetuaKelompok(text)}
                            placeholder='Nama Lengkap (*)'
                            style={styles.F1}
                        />
                    </View>
                    <View />
                </View>
                <Text style={[styles.note, { color: 'red', marginBottom: 16 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaKemlompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormSiklusPembiayaan()}
            {renderFormProdukPembiayaan()}
            {renderFormJumlahPembiayaanYangDiajukan()}
            {renderFormJangkaWaktu()}
            {renderFormFrekuensiPembiayaan()}
            {renderFormTandaTanganAOSAO()}
            {renderFormTandaTanganNasabah()}
            {renderFormTandaTanganSuamiPenjamin()}
            {renderFormTandaTanganKetuaSubKelompok()}
            {renderFormTandaTanganKetuaKelompok()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderButtonSaveDraft = () => (
        <View style={styles.buttonContainer}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => doSubmitDraft()}
            >
                <View style={styles.button}>
                    <Text style={{ color: 'white' }}>Save Draft</Text>
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
                    <Text style={styles.buttonSubmitText}>SUBMIT</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Permohonan Pembiayaan</Text>
            <ScrollView scrollEnabled={scrollEnabled}>
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

const stylesheet = StyleSheet.create({
    siklusContainer: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        width: 200
    },
    boxTTD: {
        borderRadius: 6,
        borderWidth: 1
    }
});

export default InisiasiFormUKTandaTanganPermohonan;
