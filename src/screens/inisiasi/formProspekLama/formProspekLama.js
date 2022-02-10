import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, TextInput, ScrollView, Image, Button, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import db from '../../../database/Database'
import { Picker } from '@react-native-picker/picker';
import { ApiSyncInisiasi } from '../../../../dataconfig/index';
import moment from 'moment';
import 'moment/locale/id';
import { capitalize, digits_only } from '../../../utils/Functions';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;
const pilihanYaTidak = [{ label: 'Ya', value: '1' }, { label: 'Tidak', value: '0' }];
const MAX_PEMBIAYAAN_BERTAHAP = 10;

const InisiasiFormProspekLama = ({ route }) => {
    const { name, clientId } = route.params
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [valuePembiayaanDiajukan, setValuePembiayaanDiajukan] = useState(null);
    const [itemsPembiayaanDiajukan, setItemsPembiayaanDiajukan] = useState([]);
    const [valueTempatTinggalNasabah, setValueTempatTinggalNasabah] = useState(null);
    const [itemsTempatTinggalNasabah, setItemsTempatTinggalNasabah] = useState([]);
    const [valuePerubahanStatusPernikahan, setValuePerubahanStatusPernikahan] = useState(null);
    const [itemsPerubahanStatusPernikahan, setItemsPerubahanStatusPernikahan] = useState(pilihanYaTidak);
    const [valuePerubahanStatusTanggungan, setValuePerubahanStatusTanggungan] = useState(null);
    const [itemsPerubahanStatusTanggungan, setItemsPerubahanStatusTanggungan] = useState(pilihanYaTidak);
    const [valueKehadiranPKM, setValueKehadiranPKM] = useState(null);
    const [itemsKehadiranPKM, setItemsKehadiranPKM] = useState([{ label: '100% H', value: '1' },{ label: '1-5x TH', value: '2' }, { label: '6-10x TH', value: '3' }, { label: '11-15x TH', value: '4' }, { label: '>16x TH', value: '5' }]);
    const [valuePembayaran, setValuePembayaran] = useState(null);
    const [itemsPembayaran, setItemsPembayaran] = useState([{ label: '100% B', value: '1' }, { label: '1x TR', value: '2' }, { label: '2x TR', value: '3' }, { label: '3x TR', value: '4' }, { label: '>=4x TR', value: '5' }]);
    const [valuePerubahanUsaha, setValuePerubahanUsaha] = useState(null);
    const [itemsPerubahanUsaha, setItemsPerubahanUsaha] = useState(pilihanYaTidak);
    const [valueTandaTanganKetuaSubKelompok, setValueTandaTanganKetuaSubKelompok] = useState(null);
    const [valueTandaTanganKetuaKelompok, setValueTandaTanganKetuaKelompok] = useState(null);
    const [valueTandaTanganAO, setValueTandaTanganAO] = useState(null);
    const [valueAddress, setValueAddress] = useState('Jakarta');
    const [dataDetail, setDataDetail] = useState(null);
    const [selectedPembiayaanDiajukan, setSelectedPembiayaanDiajukan] = useState(null);
    const [valueNamaTandaTanganKetuaSubKelompok, setValueNamaTandaTanganKetuaSubKelompok] = useState('');
    const [valueNamaTandaTanganKetuaKelompok, setValueNamaTandaTanganKetuaKelompok] = useState('');
    const [valueNamaTandaTanganAO, setValueNamaTandaTanganAO] = useState('');
    const [valuePerubahanUsahaKeterangan, setValuePerubahanUsahaKeterangan] = useState('');
    const [valuePerubahanStatusTanggunganKeterangan, setValuePerubahanStatusTanggunganKeterangan] = useState('');
    const [valuePerubahanStatusPernikahanKeterangan, setValuePerubahanStatusPernikahanKeterangan] = useState('');
    const [key_tandaTanganKetuaSubKelompok, setKey_tandaTanganKetuaSubKelompok] = useState(`formProspekLama_tandaTanganKetuaSubKelompok_${clientId}`);
    const [key_tandaTanganKetuaKelompok, setKey_tandaTanganKetuaKelompok] = useState(`formProspekLama_tandaTanganKetuaKelompok_${clientId}`);
    const [key_tandaTanganAO, setKey_tandaTanganAO] = useState(`formProspekLama_tandaTanganAO_${clientId}`);
    const [aoName, setAoName] = useState('');
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        setInfo();
        getUserData();
        getStorageRumahTinggal();
        init();
    }, []);

    const getUserData = () => {
        AsyncStorage.getItem('userData', (error, result) => {
            if (error) __DEV__ && console.log('userData error:', error);
            if (__DEV__) console.log('userData response:', result);

            let data = JSON.parse(result);
            setAoName(data.AOname);
            setValueNamaTandaTanganAO(data.AOname);
        });
    }

    const getProspekLama = () => {
        let queryUKDataDiri = `SELECT * FROM Table_Prospek_Lama_PP WHERE clientId = '` + clientId + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], async (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_Prospek_Lama_PP length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);

                        setKey_tandaTanganAO(data.inputTandaTanganAO);
                        setKey_tandaTanganKetuaKelompok(data.inputTandaTanganKetuaKelompok);
                        setKey_tandaTanganKetuaSubKelompok(data.inputTandaTanganKetuaSubKelompok);

                        const tandaTanganAO = await AsyncStorage.getItem(data.inputTandaTanganAO);
                        const tandaTanganKetuaKelompok = await AsyncStorage.getItem(data.inputTandaTanganKetuaKelompok);
                        const tandaTanganKetuaSubKelompok = await AsyncStorage.getItem(data.inputTandaTanganKetuaSubKelompok);

                        if (__DEV__) console.log('tandaTanganAO :', data.inputTandaTanganAO, tandaTanganAO);
                        if (__DEV__) console.log('tandaTanganKetuaKelompok :', data.inputTandaTanganKetuaKelompok, tandaTanganKetuaKelompok);
                        if (__DEV__) console.log('tandaTanganKetuaSubKelompok :', data.inputTandaTanganKetuaSubKelompok, tandaTanganKetuaSubKelompok);

                        const getProdukPembiayaan = () => {
                            if (__DEV__) console.log('getProdukPembiayaan loaded');
                            return new Promise((resolve, reject) => {
                                if (data.inputPembiayaanDiajukan !== null && typeof data.inputPembiayaanDiajukan !== 'undefined') {
                                    setTimeout(() => {
                                        setValuePembiayaanDiajukan(data.inputPembiayaanDiajukan);
                                        AsyncStorage.getItem('Product').then((response) => {
                                            if (response !== null) {
                                                const responseJSON = JSON.parse(response);
                                                if (responseJSON.length > 0 ?? false) {
                                                    let value = data.inputPembiayaanDiajukan;
                                                    setSelectedPembiayaanDiajukan(responseJSON.filter(data => data.id === value)[0] || null);
                                                }
                                            }
                                        });
                                        return resolve('next');
                                    }, 1200);
                                }
                                return resolve('next');
                            });
                        }

                        Promise.all([getProdukPembiayaan()]).then((response) => {
                            if (data.inputTempatTinggalNasabah !== null && typeof data.inputTempatTinggalNasabah !== 'undefined') setValueTempatTinggalNasabah(data.inputTempatTinggalNasabah);
                            if (data.inputPerubahanStatusPernikahan !== null && typeof data.inputPerubahanStatusPernikahan !== 'undefined') setValuePerubahanStatusPernikahan(data.inputPerubahanStatusPernikahan);
                            if (data.inputPerubahanStatusPernikahanKeterangan !== null && typeof data.inputPerubahanStatusPernikahanKeterangan !== 'undefined') setValuePerubahanStatusPernikahanKeterangan(data.inputPerubahanStatusPernikahanKeterangan);
                            if (data.inputPerubahanStatusTanggungan !== null && typeof data.inputPerubahanStatusTanggungan !== 'undefined') setValuePerubahanStatusTanggungan(data.inputPerubahanStatusTanggungan);
                            if (data.inputPerubahanStatusTanggunganKeterangan !== null && typeof data.inputPerubahanStatusTanggunganKeterangan !== 'undefined') setValuePerubahanStatusTanggunganKeterangan(data.inputPerubahanStatusTanggunganKeterangan);
                            if (data.inputKehadiranPKM !== null && typeof data.inputKehadiranPKM !== 'undefined') setValueKehadiranPKM(data.inputKehadiranPKM);
                            if (data.inputPembayaran !== null && typeof data.inputPembayaran !== 'undefined') setValuePembayaran(data.inputPembayaran);
                            if (data.inputPerubahanUsaha !== null && typeof data.inputPerubahanUsaha !== 'undefined') setValuePerubahanUsaha(data.inputPerubahanUsaha);
                            if (data.inputPerubahanUsahaKeterangan !== null && typeof data.inputPerubahanUsahaKeterangan !== 'undefined') setValuePerubahanUsahaKeterangan(data.inputPerubahanUsahaKeterangan);
                            if (data.inputAddress !== null && typeof data.inputAddress !== 'undefined') setValueAddress(data.inputAddress);
                            if (data.inputNamaTandaTanganAO !== null && typeof data.inputNamaTandaTanganAO !== 'undefined') setValueNamaTandaTanganAO(data.inputNamaTandaTanganAO);
                            if (data.inputNamaTandaTanganKetuaKelompok !== null && typeof data.inputNamaTandaTanganKetuaKelompok !== 'undefined') setValueNamaTandaTanganKetuaKelompok(data.inputNamaTandaTanganKetuaKelompok);
                            if (data.inputNamaTandaTanganKetuaSubKelompok !== null && typeof data.inputNamaTandaTanganKetuaSubKelompok !== 'undefined') setValueNamaTandaTanganKetuaSubKelompok(data.inputNamaTandaTanganKetuaSubKelompok);

                            if (data.inputTandaTanganAO !== null && typeof data.inputTandaTanganAO !== 'undefined') setValueTandaTanganAO(tandaTanganAO);
                            if (data.inputTandaTanganKetuaKelompok !== null && typeof data.inputTandaTanganKetuaKelompok !== 'undefined') setValueTandaTanganKetuaKelompok(tandaTanganKetuaKelompok);
                            if (data.inputTandaTanganKetuaSubKelompok !== null && typeof data.inputTandaTanganKetuaSubKelompok !== 'undefined') setValueTandaTanganKetuaSubKelompok(tandaTanganKetuaSubKelompok);
                        });

                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_Prospek_Lama_PP error:', error.message);
                })
            }
        )
    }

    const fetchDetail = async () => {
        if (__DEV__) console.log('fetchDetail loaded');

        const token = await AsyncStorage.getItem('token');
        if (__DEV__) console.log('ACTIONS TOKEN', token);

        const body = {
            "ClientID": [clientId]
        };

        setFetching(true);
        try {
            fetch(`${ApiSyncInisiasi}GetSiklusNasabahBrnet`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (__DEV__) console.log('fetchData $post /inisiasi/GetSiklusNasabahBrnet success:', responseJson);
                setFetching(false);
                if (responseJson.data.length > 0) {
                    setDataDetail(responseJson.data[0]);
                    getStorageProduk(responseJson.data[0]);
                }
                else setDataDetail(null);
            })
        } catch(error) {
            if (__DEV__) console.log('fetchData $post /inisiasi/GetSiklusNasabahBrnet error:', error);
            setFetching(false);
        }
    }

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal);
    }

    const getStorageRumahTinggal = async () => {
        if (__DEV__) console.log('getStorageRumahTinggal loaded');

        try {
            const response = await AsyncStorage.getItem('HomeStatus');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    var responseFiltered = responseJSON.map((data, i) => {
                        return { label: data.homeStatusDetail, value: data.id };
                    }) ?? [];
                    if (__DEV__) console.log('getStorageRumahTinggal responseFiltered:', responseFiltered);
                    setItemsTempatTinggalNasabah(responseFiltered);
                    return;
                }
            }
            setItemsTempatTinggalNasabah([]);
        } catch (error) {
            setItemsTempatTinggalNasabah([]);
        }
    }

    const getStorageProduk = async (rw) => {
        if (__DEV__) console.log('getStorageProduk loaded');
        if (__DEV__) console.log('getStorageProduk dataDetail:', rw);

        try {
            const response = await AsyncStorage.getItem('Product');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (__DEV__) console.log('getStorageProduk responseJSON.length:', responseJSON.length);
                if (responseJSON.length > 0) {
                    var responseFiltered = await responseJSON.filter((x) => 
                        x.productName.trim().substring(0, 2) === `${parseInt(rw.LoanSeries)+1}M` || 
                        x.productName.trim().substring(0, 2) === `${parseInt(rw.LoanSeries)+1}S` || 
                        x.productName.trim().substring(0, 2) === `${parseInt(rw.LoanSeries)+1}Y` || 
                        x.productName.trim().substring(0, 3) === 'HMR' || 
                        x.productName.trim().substring(0, 3) === 'HMS' ||
                        x.productName.trim().substring(0, 4) === 'HPMP' ||
                        x.productName.trim().substring(0, 4) === 'HSMP' ||
                        x.productName.trim().substring(0, 2) === 'MK' ||
                        x.productName.trim().substring(0, 2) === 'MP' ||
                        x.productName.trim().substring(0, 2) === 'MS' ||
                        x.productName.trim().substring(0, 3) === 'REK' ||
                        x.productName.trim().substring(0, 2) === 'RP' ||
                        x.productName.trim().substring(0, 4) === 'WaMP' ||
                        x.productName.trim().substring(0, 4) === 'Wash' ||
                        x.productName.trim().substring(0, 4) === 'WaSy'
                    ).map((data, i) => {
                        return { 
                            label: data.productName.trim(),
                            value: data.id,
                            interest: data.interest,
                            isReguler: data.isReguler,
                            isSyariah: data.isSyariah,
                            maxPlafond: data.maxPlafond,
                            minPlafond: data.minPlafond,
                            paymentTerm: data.paymentTerm 
                        };
                    }) ?? [];
                    if (__DEV__) console.log('getStorageProduk responseFiltered:', responseFiltered);
                    setItemsPembiayaanDiajukan(responseFiltered);
                    return;
                }
            }
            setItemsPembiayaanDiajukan([]);
        } catch (error) {
            setItemsPembiayaanDiajukan([]);
        }
    }

    const onSelectSign = (key, data) => {
        if (__DEV__) console.log('onSelectSign loaded');
        if (__DEV__) console.log('onSelectSign key:', key);
        if (__DEV__) console.log('onSelectSign data:', data);

        if (key === 'tandaTanganKetuaSubKelompok') setValueTandaTanganKetuaSubKelompok(data);
        if (key === 'tandaTanganKetuaKelompok') setValueTandaTanganKetuaKelompok(data);
        if (key === 'tandaTanganAO') setValueTandaTanganAO(data);
    };

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft selectedPembiayaanDiajukan:', selectedPembiayaanDiajukan);

        AsyncStorage.setItem(key_tandaTanganKetuaSubKelompok, valueTandaTanganKetuaSubKelompok);
        AsyncStorage.setItem(key_tandaTanganKetuaKelompok, valueTandaTanganKetuaKelompok);
        AsyncStorage.setItem(key_tandaTanganAO, valueTandaTanganAO);

        let identityNumber = dataDetail?.IdentityNumber ?? '';
        if (!digits_only(identityNumber)) identityNumber = '';

        const find = 'SELECT * FROM Table_Prospek_Lama_PP WHERE clientId = "'+ clientId +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let inputPembiayaanTahap = `${parseInt(dataDetail?.LoanSeries ?? '0') + 1}`;
                    let inputJangkaWaktuPembiayaanDiajukan = `${selectedPembiayaanDiajukan?.paymentTerm ?? '0'}`;
                    let maxPlafond = selectedPembiayaanDiajukan?.maxPlafond ?? 0;

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_Prospek_Lama_PP (clientId, clientName, identityNumber, groupId, subGroup, groupName, loanSeries, inputPembiayaanTahap, inputPembiayaanDiajukan, inputJangkaWaktuPembiayaanDiajukan, inputTempatTinggalNasabah, inputPerubahanStatusPernikahan, inputPerubahanStatusPernikahanKeterangan, inputPerubahanStatusTanggungan, inputPerubahanStatusTanggunganKeterangan, inputKehadiranPKM, inputPembayaran, inputPerubahanUsaha, inputPerubahanUsahaKeterangan, inputAddress, inputDate, inputNamaTandaTanganAO, inputTandaTanganAO, inputNamaTandaTanganKetuaKelompok, inputTandaTanganKetuaKelompok, inputNamaTandaTanganKetuaSubKelompok, inputTandaTanganKetuaSubKelompok) values ("' + dataDetail?.ClientID + '","' + dataDetail?.ClientName + '","' + identityNumber + '","' + dataDetail?.GroupID + '","' + dataDetail?.SubGroup + '","' + dataDetail?.GroupName + '","' + dataDetail?.LoanSeries + '","' + inputPembiayaanTahap + '","' + maxPlafond + '","' + inputJangkaWaktuPembiayaanDiajukan + '","' + valueTempatTinggalNasabah + '","' + valuePerubahanStatusPernikahan + '","' + valuePerubahanStatusPernikahanKeterangan + '","' + valuePerubahanStatusTanggungan + '","' + valuePerubahanStatusTanggunganKeterangan + '","' + valueKehadiranPKM + '","' + valuePembayaran + '","' + valuePerubahanUsaha + '","' + valuePerubahanUsahaKeterangan + '","' + valueAddress + '","' + moment().format('YYYY-MM-DD') + '","' + valueNamaTandaTanganAO + '","' + key_tandaTanganAO + '","' + valueNamaTandaTanganKetuaKelompok + '","' + key_tandaTanganKetuaKelompok + '","' + valueNamaTandaTanganKetuaSubKelompok + '","' + key_tandaTanganKetuaSubKelompok + '")';
                    } else {
                        query = 'UPDATE Table_Prospek_Lama_PP SET clientName = "' + dataDetail?.ClientName + '", identityNumber = "' + identityNumber + '", groupId = "' + dataDetail?.GroupID + '", subGroup = "' + dataDetail?.SubGroup + '", groupName = "' + dataDetail?.GroupName + '", loanSeries = "' + dataDetail?.LoanSeries + '", inputPembiayaanTahap = "' + inputPembiayaanTahap + '", inputPembiayaanDiajukan = "' + maxPlafond + '", inputJangkaWaktuPembiayaanDiajukan = "' + inputJangkaWaktuPembiayaanDiajukan + '", inputTempatTinggalNasabah = "' + valueTempatTinggalNasabah + '", inputPerubahanStatusPernikahan = "' + valuePerubahanStatusPernikahan + '", inputPerubahanStatusPernikahanKeterangan = "' + valuePerubahanStatusPernikahanKeterangan + '", inputPerubahanStatusTanggungan = "' + valuePerubahanStatusTanggungan + '", inputPerubahanStatusTanggunganKeterangan = "' + valuePerubahanStatusTanggunganKeterangan + '", inputKehadiranPKM = "' + valueKehadiranPKM + '", inputPembayaran = "' + valuePembayaran + '", inputPerubahanUsaha = "' + valuePerubahanUsaha + '", inputPerubahanUsahaKeterangan = "' + valuePerubahanUsahaKeterangan + '", inputAddress = "' + valueAddress + '", inputDate = "' + moment().format('YYYY-MM-DD') + '", inputNamaTandaTanganAO = "' + valueNamaTandaTanganAO + '", inputTandaTanganAO = "' + key_tandaTanganAO + '", inputNamaTandaTanganKetuaKelompok = "' + valueNamaTandaTanganKetuaKelompok + '", inputTandaTanganKetuaKelompok = "' + key_tandaTanganKetuaKelompok + '", inputNamaTandaTanganKetuaSubKelompok = "' + valueNamaTandaTanganKetuaSubKelompok + '", inputTandaTanganKetuaSubKelompok = "' + key_tandaTanganKetuaSubKelompok + '" WHERE clientId = "' + dataDetail?.ClientID + '"';
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
                                        tx.executeSql("SELECT * FROM Table_Prospek_Lama_PP", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_Prospek_Lama_PP RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_Prospek_Lama_PP ERROR:', error);
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

    const init = () => {
        if (__DEV__) console.log('doSubmit loaded');
        const find = 'SELECT * FROM Sosialisasi_Database WHERE clientId = "'+ clientId +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    if (dataLengthFind > 0) {
                        Alert.alert('Info', 'Nasabah ini sudah dimasukan ke UK');
                        navigation.goBack();
                        return;
                    } 

                    fetchDetail();
                    getProspekLama();
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDraft db.transaction find error:', error.message);
                    Alert.alert('Error', JSON.stringify(error));
                    navigation.goBack();
                    return;
                })
            }
        );
    }

    const doSubmit = async () => {
        if (__DEV__) console.log('doSubmit loaded');
        if (__DEV__) console.log('doSubmit dataDetail:', dataDetail);

        if (!valueTandaTanganAO || typeof valueTandaTanganAO === 'undefined' || valueTandaTanganAO === '' || valueTandaTanganAO === 'null') return alert('Tanda Tangan AO (*) tidak boleh kosong');
        if (!valueNamaTandaTanganAO || typeof valueNamaTandaTanganAO === 'undefined' || valueNamaTandaTanganAO === '' || valueNamaTandaTanganAO === 'null') return alert('Nama Tanda Tangan AO (*) tidak boleh kosong');
        if (!valueTandaTanganKetuaKelompok || typeof valueTandaTanganKetuaKelompok === 'undefined' || valueTandaTanganKetuaKelompok === '' || valueTandaTanganKetuaKelompok === 'null') return alert('Tanda Tangan Kelompok (*) tidak boleh kosong');
        if (!valueNamaTandaTanganKetuaKelompok || typeof valueNamaTandaTanganKetuaKelompok === 'undefined' || valueNamaTandaTanganKetuaKelompok === '' || valueNamaTandaTanganKetuaKelompok === 'null') return alert('Nama Tanda Tangan Kelompok (*) tidak boleh kosong');
        if (!valueTandaTanganKetuaSubKelompok || typeof valueTandaTanganKetuaSubKelompok === 'undefined' || valueTandaTanganKetuaSubKelompok === '' || valueTandaTanganKetuaSubKelompok === 'null') return alert('Tanda Tangan Sub Kelompok (*) tidak boleh kosong');
        if (!valueNamaTandaTanganKetuaSubKelompok || typeof valueNamaTandaTanganKetuaSubKelompok === 'undefined' || valueNamaTandaTanganKetuaSubKelompok === '' || valueNamaTandaTanganKetuaSubKelompok === 'null') return alert('Nama Tanda Tangan Sub Kelompok (*) tidak boleh kosong');

        await doSubmitDraft('submit');

        let uniqueNumber = (new Date().getTime()).toString(36);
        let inputPembiayaanTahap = `${parseInt(dataDetail?.LoanSeries ?? '0') + 1}`;
        let groupId = dataDetail?.GroupID ?? '';
        let groupName = dataDetail?.GroupName ?? '';
        let subGroup = dataDetail?.SubGroup ?? '';
        let identityNumber = dataDetail?.IdentityNumber ?? '';
        let getNamaLengkap = name.toLowerCase().split('binti')[0] || '';
        let getNamaOrangtua = name.toLowerCase().split('binti')[1] || '';
        let namaLengkap = capitalize(getNamaLengkap.trim());
        let namaOrangtua = capitalize(getNamaOrangtua.trim());
        let inputJangkaWaktuPembiayaanDiajukan = `${selectedPembiayaanDiajukan?.paymentTerm ?? '0'}`;
        let maxPlafond = selectedPembiayaanDiajukan?.maxPlafond ?? 0;

        if (!digits_only(identityNumber)) identityNumber = '';

        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama inputPembiayaanTahap:', inputPembiayaanTahap);
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama namaLengkap:', namaLengkap);
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama namaOrangtua:', namaOrangtua);
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama uniqueNumber:', uniqueNumber);
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama groupId:', groupId);
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama groupName:', groupName);
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama subGroup:', subGroup);
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama identityNumber:', identityNumber);

        let query = 'INSERT INTO Sosialisasi_Database (id, tanggalInput, sumberId, namaCalonNasabah, nomorHandphone, status, tanggalSosialisas, lokasiSosialisasi, type, clientId, kelompokID, namaKelompok, subKelompok, siklus) values ("' + uniqueNumber + '","' + moment().format('YYYY-MM-DD') + '", "4", "' + name + '","", "3", "' + moment().format('YYYY-MM-DD') + '", "' + groupName + '", "1", "' + clientId + '", "' + groupId + '", "' + groupName + '", "' + subGroup + '", "' + inputPembiayaanTahap + '")';
        if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama query:', query);
        db.transaction(
            tx => {
                tx.executeSql(query)
            }, function(error) {
                if (__DEV__) console.log('insert into Sosialisasi_Database transaction error: ', error);
                Alert.alert('Error', JSON.stringify(error));
            }, function() {

                let queryUKDataDiri = 'INSERT INTO Table_UK_DataDiri (jenis_Kartu_Identitas, nomor_Identitas, nama_lengkap, nama_ayah, status_rumah_tinggal, idSosialisasiDatabase) values ("1","' + identityNumber + '","' + namaLengkap + '","' + namaOrangtua + '","' + valueTempatTinggalNasabah + '", "' + uniqueNumber + '")';
                let queryUKProdukPembiayaan = 'INSERT INTO Table_UK_ProdukPembiayaan (nama_lengkap, jenis_Pembiayaan, nama_Produk, produk_Pembiayaan, jumlah_Pinjaman, term_Pembiayaan, idSosialisasiDatabase) values ("' + namaLengkap + '","1","1","' + valuePembiayaanDiajukan + '","' + maxPlafond + '","' + inputJangkaWaktuPembiayaanDiajukan + '","' + uniqueNumber + '")';
                let queryUKDisiplinNasabah = 'INSERT INTO Table_UK_DisipinNasabah (nama_lengkap, kehadiran_pkm, angsuran_pada_saat_pkm, idSosialisasiDatabase) values ("' + namaLengkap + '","' + valueKehadiranPKM + '","", "' + uniqueNumber + '")';

                if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama queryUKDataDiri:', queryUKDataDiri);
                if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama queryUKProdukPembiayaan:', queryUKProdukPembiayaan);
                if (__DEV__) console.error('$post /post_inisiasi/post_prospek_lama queryUKDisiplinNasabah:', queryUKDisiplinNasabah);
                
                db.transaction(
                    tx => {
                        tx.executeSql(queryUKDataDiri)
                    }, function(error) {
                        if (__DEV__) console.log('insert into Table_UK_DataDiri transaction error: ', error);
                    }, function() {
                    }
                )
                db.transaction(
                    tx => {
                        tx.executeSql(queryUKProdukPembiayaan)
                    }, function(error) {
                        if (__DEV__) console.log('insert into Table_UK_ProdukPembiayaan transaction error: ', error);
                    }, function() {
                    }
                )
                db.transaction(
                    tx => {
                        tx.executeSql(queryUKDisiplinNasabah)
                    }, function(error) {
                        if (__DEV__) console.log('insert into Table_UK_DisipinNasabah transaction error: ', error);
                    }, function() {
                    }
                )

                if (__DEV__) {
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Sosialisasi_Database", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_DataDiri", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK DATA DIRI RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK DATA DIRI ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_ProdukPembiayaan", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_DisipinNasabah", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK DISIPLIN NASABAH RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK DISIPLIN NASABAH ERROR:', error);
                        }, function() {}
                    );
                }

                Alert.alert('Berhasil', 'Data berhasil masuk UK');
                navigation.goBack();
                return;
            }
        )
    }

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
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.PUTIH }}>PERSETUJUAN KELOMPOK</Text>
                </View>
            </View>
        </ImageBackground>
    )

    const renderInformasiNama = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>{name}</Text>
        </View>
    )

    const renderInformasiIdentitas = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <View style={{ width: 100 }}>
                <Text>No. Identitas</Text>
                <Text style={{ color: 'gray' }}>KTP/KK</Text>
            </View>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>{dataDetail?.IdentityNumber ?? ''}</Text>
        </View>
    )

    const renderInformasiKelompok = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <Text style={{ width: 100 }}>Kelompok</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>{dataDetail?.GroupName ?? ''}</Text>
        </View>
    )

    const renderFormPembiayaanTahap = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Pembiayaan Tahap</Text>
            <View style={[styles.F1, styles.P16, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Text style={{ fontSize: 16 }}>{`${parseInt(dataDetail?.LoanSeries ?? '0') + 1}`}</Text>
            </View>
        </View>
    )

    const renderFormPembiayaanDiajukan = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Pembiayaan Diajukan</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePembiayaanDiajukan}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedPembiayaanDiajukan(itemsPembiayaanDiajukan[itemIndex - 1]);
                        setValuePembiayaanDiajukan(itemValue);
                    }}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPembiayaanDiajukan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )
    
    const renderFormJangkaWaktuPembiayaanDiajukan = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Jangka Waktu Pembiayaan Diajukan</Text>
            <View style={[styles.F1, styles.P16, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Text style={{ fontSize: 16 }}>{selectedPembiayaanDiajukan?.paymentTerm ?? '-'}</Text>
            </View>
        </View>
    )

    const renderFormTempatTinggalNasabah = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Tempat Tinggal Nasabah</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valueTempatTinggalNasabah}
                    onValueChange={(itemValue, itemIndex) => setValueTempatTinggalNasabah(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsTempatTinggalNasabah.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPerubahanStatusPernikahan = () => (
        <View style={[styles.FDRow, styles.MV4, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Perubahan Status Pernikahan</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePerubahanStatusPernikahan}
                    onValueChange={(itemValue, itemIndex) => setValuePerubahanStatusPernikahan(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPerubahanStatusPernikahan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPerubahanStatusTanggungan = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Perubahan Status Tanggungan</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePerubahanStatusTanggungan}
                    onValueChange={(itemValue, itemIndex) => setValuePerubahanStatusTanggungan(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPerubahanStatusTanggungan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKehadiranPKM = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Kehadiran PKM</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valueKehadiranPKM}
                    onValueChange={(itemValue, itemIndex) => setValueKehadiranPKM(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKehadiranPKM.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPerubahanStatusPernikahanKeterangan = () => (
        <View style={styles.MV16}>
            <Text>Keterangan :</Text>
            <View style={[styles.MT8]}>
                <TextInput
                    value={valuePerubahanStatusPernikahanKeterangan} 
                    onChangeText={(text) => setValuePerubahanStatusPernikahanKeterangan(text)}
                    multiline={true}
                    numberOfLines={4}
                    style={{
                        borderWidth:1,
                        borderRadius:5,
                        height: 100,
                        padding: 8
                    }}
                    textAlignVertical="top"
                />
            </View>
        </View>
    )

    const renderFormPerubahanStatusTanggunganKeterangan = () => (
        <View style={styles.MV16}>
            <Text>Keterangan :</Text>
            <View style={[styles.MT8]}>
                <TextInput
                    value={valuePerubahanStatusTanggunganKeterangan} 
                    onChangeText={(text) => setValuePerubahanStatusTanggunganKeterangan(text)}
                    multiline={true}
                    numberOfLines={4}
                    style={{
                        borderWidth:1,
                        borderRadius:5,
                        height: 100,
                        padding: 8
                    }}
                    textAlignVertical="top"
                />
            </View>
        </View>
    )

    const renderFormPerubahanUsahaKeterangan = () => (
        <View style={styles.MV16}>
            <Text>Keterangan :</Text>
            <View style={[styles.MT8]}>
                <TextInput
                    value={valuePerubahanUsahaKeterangan} 
                    onChangeText={(text) => setValuePerubahanUsahaKeterangan(text)}
                    multiline={true}
                    numberOfLines={4}
                    style={{
                        borderWidth:1,
                        borderRadius:5,
                        height: 100,
                        padding: 8
                    }}
                    textAlignVertical="top"
                />
            </View>
        </View>
    )

    const renderFormPembayaran = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Pembayaran</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePembayaran}
                    onValueChange={(itemValue, itemIndex) => setValuePembayaran(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPembayaran.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPerubahanUsaha = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Perubahan Usaha</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePerubahanUsaha}
                    onValueChange={(itemValue, itemIndex) => setValuePerubahanUsaha(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPerubahanUsaha.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormAggrement = () => (
        <Text style={[styles.MV16, { fontStyle: 'italic' }]}>Dengan ini kelompok kami MENYETUJUI nasabah tersebut untuk diajukan menerima pembiayaan Mekaar Tahap Lanjutan, dan kami bersedia bertanggung jawab Bersama apabila nasabah tersebut diatas tidak memenuhi kewajiban.</Text>
    )

    const renderFormDate = () => (
        <View style={[styles.FDRow,  styles.MV16, { alignItems: 'center' }]}>
            <TextInput
                value={valueAddress} 
                onChangeText={(text) => setValueAddress(text)}
                placeholder='Jakarta'
                style={[styles.F1, styles.MR16, styles.P8, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}
            />
            <Text>, {moment().format('LL')}</Text>
        </View>
    )

    const renderFormTandaTanganKetuaSubKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Sub Kelompok</Text>
            <View style={[stylesheet.boxTTD, styles.MT8]}>
                {valueTandaTanganKetuaSubKelompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaSubKelompok }}
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
                <Text style={[styles.note, { color: 'red', marginBottom: 8 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaSubKelompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganKetuaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Kelompok</Text>
            <View style={[stylesheet.boxTTD, styles.MT8]}>
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
                <Text style={[styles.note, { color: 'red', marginBottom: 8 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaKelompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganAO = () => (
        <View style={styles.MT8}>
            <Text>Account Officer</Text>
            <View style={[stylesheet.boxTTD, styles.MT8]}>
                {valueTandaTanganAO && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganAO }}
                    />
                )}
                <View style={[styles.textInputContainer, { width: withTextInput - 32, marginHorizontal: 16, marginVertical: 8 }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={valueNamaTandaTanganAO} 
                            onChangeText={(text) => setValueNamaTandaTanganAO(text)}
                            placeholder='Nama Lengkap (*)'
                            style={styles.F1}
                        />
                    </View>
                    <View />
                </View>
                <Text style={[styles.note, { color: 'red', marginBottom: 8 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganAO', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTTD = () => (
        <View style={styles.MV16}>
            <Text style={styles.MB16}>Disetujui atas nama Kelompok {dataDetail?.GroupName ?? ''}</Text>
            {renderFormTandaTanganKetuaSubKelompok()}
            {renderFormTandaTanganKetuaKelompok()}
            {renderFormTandaTanganAO()}
        </View>
    )

    const renderFormOne = () => (
        <View style={[styles.MV16]}>
            {/* <Text>{JSON.stringify(dataDetail)}</Text> */}
            {renderFormPembiayaanTahap()}
            {renderFormPembiayaanDiajukan()}
            {renderFormJangkaWaktuPembiayaanDiajukan()}
            {renderFormTempatTinggalNasabah()}
            {renderFormPerubahanStatusPernikahan()}
            {renderFormPerubahanStatusPernikahanKeterangan()}
            {renderFormPerubahanStatusTanggungan()}
            {renderFormPerubahanStatusTanggunganKeterangan()}
            {renderFormKehadiranPKM()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderFormTwo = () => (
        <View style={[styles.MV16]}>
            {renderFormPembayaran()}
            {renderFormPerubahanUsaha()}
            {renderFormPerubahanUsahaKeterangan()}
            {renderButtonSaveDraft()}
            {renderFormAggrement()}
            {renderFormDate()}
            {renderSpace()}
            {renderFormTTD()}
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
        <View style={styles.MT16}>
            <TouchableOpacity
                onPress={() => doSubmit()}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SUBMIT</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderSpace = () => (
        <View style={styles.spaceGray} />
    )

    const renderLoading = () => fetching && (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.DEFAULT} />
        </View>
    )

    const renderBody = () => (
        <View style={[styles.bodyContainer, styles.P16]}>
            <ScrollView>
                <Text style={[styles.MB16]}>Dengan data nasabah sebagai berikut:</Text>
                {renderInformasiNama()}
                {renderInformasiIdentitas()}
                {renderInformasiKelompok()}
                {renderFormOne()}
                {renderSpace()}
                {renderFormTwo()}
                {renderSpace()}
                {renderButtonSimpan()}
            </ScrollView>
        </View>
    )

    return(
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
            {renderLoading()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
    boxTTD: {
        borderRadius: 6,
        borderWidth: 1
    }
})

export default InisiasiFormProspekLama;
