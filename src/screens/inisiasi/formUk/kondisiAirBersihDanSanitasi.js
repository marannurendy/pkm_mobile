import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView, ToastAndroid, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import db from '../../../database/Database';
import { Picker } from '@react-native-picker/picker';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormUKKondisiAirBersihDanSanitasi = ({ route }) => {
    const { id, groupName, namaNasabah, screenState } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [valueKepemilikanKamarMandi, setValueKepemilikanKamarMandi] = useState(null);
    const [itemsKepemilikanKamarMandi, setItemsKepemilikanKamarMandi] = useState([]);
    const [valueKamarMandiDanToiletTerpisah, setValueKamarMandiDanToiletTerpisah] = useState(null);
    const [itemsKamarMandiDanToiletTerpisah, setItemsKamarMandiDanToiletTerpisah] = useState([]);
    const [valueKepemilikanToilet, setValueKepemilikanToilet] = useState(null);
    const [itemsKepemilikanToilet, setItemsKepemilikanToilet] = useState([]);
    const [valueSumberAirUntukMandiDanCuci, setValueSumberAirUntukMandiDanCuci] = useState(null);
    const [itemsSumberAirUntukMandiDanCuci, setItemsSumberAirUntukMandiDanCuci] = useState([]);
    const [valueSumberAirUntukMinum, setValueSumberAirUntukMinum] = useState(null);
    const [itemsSumberAirUntukMinum, setItemsSumberAirUntukMinum] = useState([]);
    const [valueKuantitasSumberAir, setValueKuantitasSumberAir] = useState(null);
    const [itemsKuantitasSumberAir, setItemsKuantitasSumberAir] = useState([]);
    const [valueKualitasSumberAir, setValueKualitasSumberAir] = useState(null);
    const [itemsKualitasSumberAir, setItemsKualitasSumberAir] = useState([]);
    const [valueKondisiAtapKamarMandiMilikSendiri, setValueKondisiAtapKamarMandiMilikSendiri] = useState(null);
    const [itemsKondisiAtapKamarMandiMilikSendiri, setItemsKondisiAtapKamarMandiMilikSendiri] = useState([]);
    const [valueKondisiLantaiKamarMandiMilikSendiri, setValueKondisiLantaiKamarMandiMilikSendiri] = useState(null);
    const [itemsKondisiLantaiKamarMandiMilikSendiri, setItemsKondisiLantaiKamarMandiMilikSendiri] = useState([]);
    const [valueKondisiDindingKamarMandiMilikSendiri, setValueKondisiDindingKamarMandiMilikSendiri] = useState(null);
    const [itemsKondisiDindingKamarMandiMilikSendiri, setItemsKondisiDindingKamarMandiMilikSendiri] = useState([]);
    const [valueKondisiBakAirKamarMandiMilikSendiri, setValueKondisiBakAirKamarMandiMilikSendiri] = useState(null);
    const [itemsKondisiBakAirKamarMandiMilikSendiri, setItemsKondisiBakAirKamarMandiMilikSendiri] = useState([]);
    const [valueKondisiSaluranPembuanganKamarMandiMilikSendiri, setValueKondisiSaluranPembuanganKamarMandiMilikSendiri] = useState(null);
    const [itemsKondisiSaluranPembuanganKamarMandiMilikSendiri, setItemsKondisiSaluranPembuanganKamarMandiMilikSendiri] = useState([]);
    const [valueKondisiWCKamarMandiMilikSendiri, setValueKondisiWCKamarMandiMilikSendiri] = useState(null);
    const [itemsKondisiWCKamarMandiMilikSendiri, setItemsKondisiWCKamarMandiMilikSendiri] = useState([]);
    const [valueKondisiAtapToiletMilikSendiri, setValueKondisiAtapToiletMilikSendiri] = useState(null);
    const [itemsKondisiAtapToiletMilikSendiri, setItemsKondisiAtapToiletMilikSendiri] = useState([]);
    const [valueKondisiLantaiToiletMilikSendiri, setValueKondisiLantaiToiletMilikSendiri] = useState(null);
    const [itemsKondisiLantaiToiletMilikSendiri, setItemsKondisiLantaiToiletMilikSendiri] = useState([]);
    const [valueKondisiDindingToiletMilikSendiri, setValueKondisiDindingToiletMilikSendiri] = useState(null);
    const [itemsKondisiDindingToiletMilikSendiri, setItemsKondisiDindingToiletMilikSendiri] = useState([]);
    const [valueKondisiBakAirToiletMilikSendiri, setValueKondisiBakAirToiletMilikSendiri] = useState(null);
    const [itemsKondisiBakAirToiletMilikSendiri, setItemsKondisiBakAirToiletMilikSendiri] = useState([]);
    const [valueSaluranPembuanganToiletMilikSendiri, setValueSaluranPembuanganToiletMilikSendiri] = useState(null);
    const [itemsSaluranPembuanganToiletMilikSendiri, setItemsSaluranPembuanganToiletMilikSendiri] = useState([]);
    const [valueKondisiWCToiletMilikSendiri, setValueKondisiWCToiletMilikSendiri] = useState(null);
    const [itemsKondisiWCToiletMilikSendiri, setItemsKondisiWCToiletMilikSendiri] = useState([]);
    const [submmitted, setSubmmitted] = useState(false);
    
    useEffect(() => {
        setInfo();
        getUKDisiplinNasabah();
        getStorageAirSanitasi();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        const token = await AsyncStorage.getItem('token')
        setCurrentDate(tanggal)
    }

    const getUKDisiplinNasabah = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_AirSanitasi WHERE idSosialisasiDatabase = '` + id + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_AirSanitasi length:', dataLength);
                    if (dataLength > 0) {
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data Table_UK_AirSanitasi:', data);
                        if (data.kamarMandiDanToiletTerpisah !== null && typeof data.kamarMandiDanToiletTerpisah !== 'undefined') setValueKamarMandiDanToiletTerpisah(data.kamarMandiDanToiletTerpisah);
                        if (data.kepemilikanKamarMandi !== null && typeof data.kepemilikanKamarMandi !== 'undefined') setValueKepemilikanKamarMandi(data.kepemilikanKamarMandi);
                        if (data.kepemilikanToilet !== null && typeof data.kepemilikanToilet !== 'undefined') setValueKepemilikanToilet(data.kepemilikanToilet);
                        if (data.sumberAirUntukMandiDanCuci !== null && typeof data.sumberAirUntukMandiDanCuci !== 'undefined') setValueSumberAirUntukMandiDanCuci(data.sumberAirUntukMandiDanCuci);
                        if (data.sumberAirUntukMinum !== null && typeof data.sumberAirUntukMinum !== 'undefined') setValueSumberAirUntukMinum(data.sumberAirUntukMinum);
                        if (data.kuantitasSumberAir !== null && typeof data.kuantitasSumberAir !== 'undefined') setValueKuantitasSumberAir(data.kuantitasSumberAir);
                        if (data.KondisiAtapKamarMandiMilikSendiri !== null && typeof data.KondisiAtapKamarMandiMilikSendiri !== 'undefined') setValueKondisiAtapKamarMandiMilikSendiri(data.KondisiAtapKamarMandiMilikSendiri);
                        if (data.KondisiLantaiKamarMandiMilikSendiri !== null && typeof data.KondisiLantaiKamarMandiMilikSendiri !== 'undefined') setValueKondisiLantaiKamarMandiMilikSendiri(data.KondisiLantaiKamarMandiMilikSendiri);
                        if (data.KondisiDindingKamarMandiMilikSendiri !== null && typeof data.KondisiDindingKamarMandiMilikSendiri !== 'undefined') setValueKondisiDindingKamarMandiMilikSendiri(data.KondisiDindingKamarMandiMilikSendiri);
                        if (data.KondisiBakAirKamarMandiMilikSendiri !== null && typeof data.KondisiBakAirKamarMandiMilikSendiri !== 'undefined') setValueKondisiBakAirKamarMandiMilikSendiri(data.KondisiBakAirKamarMandiMilikSendiri);
                        if (data.KondisiSaluranPembuanganKamarMandiMilikSendiri !== null && typeof data.KondisiSaluranPembuanganKamarMandiMilikSendiri !== 'undefined') setValueKondisiSaluranPembuanganKamarMandiMilikSendiri(data.KondisiSaluranPembuanganKamarMandiMilikSendiri);
                        if (data.KondisiWCKamarMandiMilikSendiri !== null && typeof data.KondisiWCKamarMandiMilikSendiri !== 'undefined') setValueKondisiWCKamarMandiMilikSendiri(data.KondisiWCKamarMandiMilikSendiri);
                        if (data.KondisiAtapToiletMilikSendiri !== null && typeof data.KondisiAtapToiletMilikSendiri !== 'undefined') setValueKondisiAtapToiletMilikSendiri(data.KondisiAtapToiletMilikSendiri);
                        if (data.KondisiLantaiToiletMilikSendiri !== null && typeof data.KondisiLantaiToiletMilikSendiri !== 'undefined') setValueKondisiLantaiToiletMilikSendiri(data.KondisiLantaiToiletMilikSendiri);
                        if (data.KondisiBakAirToiletMilikSendiri !== null && typeof data.KondisiBakAirToiletMilikSendiri !== 'undefined') setValueKondisiBakAirToiletMilikSendiri(data.KondisiBakAirToiletMilikSendiri);
                        if (data.KondisiWCToiletMilikSendiri !== null && typeof data.KondisiWCToiletMilikSendiri !== 'undefined') setValueKondisiWCToiletMilikSendiri(data.KondisiWCToiletMilikSendiri); 
                        if (data.KualitasSumberAir !== null && typeof data.KualitasSumberAir !== 'undefined') setValueKualitasSumberAir(data.KualitasSumberAir); 
                        if (data.KondisiDindingToiletMilikSendiri !== null && typeof data.KondisiDindingToiletMilikSendiri !== 'undefined') setValueKondisiDindingToiletMilikSendiri(data.KondisiDindingToiletMilikSendiri);   
                        if (data.SaluranPembuanganToiletMilikSendiri !== null && typeof data.SaluranPembuanganToiletMilikSendiri !== 'undefined') setValueSaluranPembuanganToiletMilikSendiri(data.SaluranPembuanganToiletMilikSendiri);                     
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DisipinNasabah error:', error.message);
                })
            }
        )
    }
    
    const getStorageAirSanitasi = async () => {
        if (__DEV__) console.log('getStorageWash loaded');

        try {
            const response = await AsyncStorage.getItem('MasterProdukPendamping');
            if (response !== null ) {
                const responseJSON = JSON.parse(response);
                setItemsKamarMandiDanToiletTerpisah(responseJSON.kamarMandiDanToiletTerpisah)
                setItemsKepemilikanKamarMandi(responseJSON.kepemilikanKamarMandi)
                setItemsKepemilikanToilet(responseJSON.kepemilikanToilet)
                setItemsSumberAirUntukMandiDanCuci(responseJSON.sumberAirUntukMandiDanCuci)
                setItemsSumberAirUntukMinum(responseJSON.sumberAirUntukMinum)
                setItemsKuantitasSumberAir(responseJSON.kuantitasSumberAir)
                setItemsKualitasSumberAir(responseJSON.kualitasSumberAir)
                setItemsKondisiAtapKamarMandiMilikSendiri(responseJSON.kondisiAtapKamarMandiMilikSendiri)
                setItemsKondisiLantaiKamarMandiMilikSendiri(responseJSON.kondisiLantaiKamarMandiMilikSendiri)
                setItemsKondisiDindingKamarMandiMilikSendiri(responseJSON.kondisiDindingKamarMandiMilikSendiri)
                setItemsKondisiBakAirKamarMandiMilikSendiri(responseJSON.kondisiBakAirKamarMandiMilikSendiri)
                setItemsKondisiSaluranPembuanganKamarMandiMilikSendiri(responseJSON.kondisiSaluranPembuanganKamarMandiMilikSendiri)
                setItemsKondisiWCKamarMandiMilikSendiri(responseJSON.kondisiWcKamarMandiMilikSendiri)
                setItemsKondisiAtapToiletMilikSendiri(responseJSON.kondisiAtapToiletMilikSendiri)
                setItemsKondisiLantaiToiletMilikSendiri(responseJSON.kondisiLantaiToiletMilikSendiri)
                setItemsKondisiDindingToiletMilikSendiri(responseJSON.kondisiDindingToiletMilikSendiri)
                setItemsKondisiBakAirToiletMilikSendiri(responseJSON.kondisiBakAirToiletMilikSendiri)
                setItemsSaluranPembuanganToiletMilikSendiri(responseJSON.kondisiSaluranPembuanganToiletMilikSendiri)
                setItemsKondisiWCToiletMilikSendiri(responseJSON.kondisiWcToiletMilikSendiri)
                return;
            }
            setItemsKamarMandiDanToiletTerpisah([])
            setItemsKepemilikanKamarMandi([])
            setItemsKepemilikanToilet([])
            setItemsSumberAirUntukMandiDanCuci([])
            setItemsSumberAirUntukMinum([])
            setItemsKuantitasSumberAir([])
            setItemsKualitasSumberAir([])
            setItemsKondisiAtapKamarMandiMilikSendiri([])
            setItemsKondisiLantaiKamarMandiMilikSendiri([])
            setItemsKondisiDindingKamarMandiMilikSendiri([])
            setItemsKondisiBakAirKamarMandiMilikSendiri([])
            setItemsKondisiSaluranPembuanganKamarMandiMilikSendiri([])
            setItemsKondisiWCKamarMandiMilikSendiri([])
            setItemsKondisiAtapToiletMilikSendiri([])
            setItemsKondisiLantaiToiletMilikSendiri([])
            setItemsKondisiDindingToiletMilikSendiri([])
            setItemsKondisiBakAirToiletMilikSendiri([])
            setItemsSaluranPembuanganToiletMilikSendiri([])
            setItemsKondisiWCToiletMilikSendiri([])
        } catch (error) {
            setItemsKamarMandiDanToiletTerpisah([])
            setItemsKepemilikanKamarMandi([])
            setItemsKepemilikanToilet([])
            setItemsSumberAirUntukMandiDanCuci([])
            setItemsSumberAirUntukMinum([])
            setItemsKuantitasSumberAir([])
            setItemsKualitasSumberAir([])
            setItemsKondisiAtapKamarMandiMilikSendiri([])
            setItemsKondisiLantaiKamarMandiMilikSendiri([])
            setItemsKondisiDindingKamarMandiMilikSendiri([])
            setItemsKondisiBakAirKamarMandiMilikSendiri([])
            setItemsKondisiSaluranPembuanganKamarMandiMilikSendiri([])
            setItemsKondisiWCKamarMandiMilikSendiri([])
            setItemsKondisiAtapToiletMilikSendiri([])
            setItemsKondisiLantaiToiletMilikSendiri([])
            setItemsKondisiDindingToiletMilikSendiri([])
            setItemsKondisiBakAirToiletMilikSendiri([])
            setItemsSaluranPembuanganToiletMilikSendiri([])
            setItemsKondisiWCToiletMilikSendiri([])
        }
    }

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueKamarMandiDanToiletTerpisah:', valueKamarMandiDanToiletTerpisah);
        if (__DEV__) console.log('doSubmitDraft valueKepemilikanKamarMandi:', valueKepemilikanKamarMandi);

        const find = 'SELECT * FROM Table_UK_AirSanitasi WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], async (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    let query = ''
                    if (__DEV__) console.log('db.transaction resultsFind: draft', resultsFind.rows);
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_AirSanitasi (kamarMandiDanToiletTerpisah, kepemilikanKamarMandi, kepemilikanToilet, sumberAirUntukMandiDanCuci, sumberAirUntukMinum, kuantitasSumberAir, KualitasSumberAir, KondisiAtapKamarMandiMilikSendiri, KondisiLantaiKamarMandiMilikSendiri, KondisiDindingKamarMandiMilikSendiri, KondisiBakAirKamarMandiMilikSendiri, KondisiSaluranPembuanganKamarMandiMilikSendiri, KondisiWCKamarMandiMilikSendiri, KondisiAtapToiletMilikSendiri, KondisiLantaiToiletMilikSendiri, KondisiDindingToiletMilikSendiri, KondisiBakAirToiletMilikSendiri, KondisiSaluranPembuanganKamarMandiMilikSendiri, KondisiWCToiletMilikSendiri, idSosialisasiDatabase, SaluranPembuanganToiletMilikSendiri) values ("' + valueKamarMandiDanToiletTerpisah + '","' + valueKepemilikanKamarMandi + '","' + valueKepemilikanToilet + '","' + valueSumberAirUntukMandiDanCuci + '","' + valueSumberAirUntukMinum + '","' + valueKuantitasSumberAir + '","' + valueKualitasSumberAir + '","' + valueKondisiAtapKamarMandiMilikSendiri + '","' + valueKondisiLantaiKamarMandiMilikSendiri + '","' + valueKondisiDindingKamarMandiMilikSendiri + '","' + valueKondisiBakAirKamarMandiMilikSendiri + '", "' + valueKondisiSaluranPembuanganKamarMandiMilikSendiri + '", "' + valueKondisiWCKamarMandiMilikSendiri + '", "' + valueKondisiAtapToiletMilikSendiri + '","' + valueKondisiLantaiToiletMilikSendiri + '","' + valueKondisiDindingToiletMilikSendiri + '","' + valueKondisiBakAirToiletMilikSendiri + '","' + valueKondisiSaluranPembuanganKamarMandiMilikSendiri + '","' + valueKondisiWCToiletMilikSendiri + '","' + id + '", "' + valueSaluranPembuanganToiletMilikSendiri + '" )';
                    } else {
                        query = 'UPDATE Table_UK_AirSanitasi SET kamarMandiDanToiletTerpisah = "' + valueKamarMandiDanToiletTerpisah + '", kepemilikanKamarMandi = "' + valueKepemilikanKamarMandi + '", kepemilikanToilet = "' + valueKepemilikanToilet + '", sumberAirUntukMandiDanCuci = "' + valueSumberAirUntukMandiDanCuci + '", sumberAirUntukMinum = "' + valueSumberAirUntukMinum + '", kuantitasSumberAir = "' + valueKuantitasSumberAir + '", KondisiAtapKamarMandiMilikSendiri = "' + valueKondisiAtapKamarMandiMilikSendiri + '", KondisiLantaiKamarMandiMilikSendiri = "' + valueKondisiLantaiKamarMandiMilikSendiri + '", KondisiDindingKamarMandiMilikSendiri = "' + valueKondisiDindingKamarMandiMilikSendiri + '", KondisiBakAirKamarMandiMilikSendiri = "' + valueKondisiBakAirKamarMandiMilikSendiri + '", KondisiSaluranPembuanganKamarMandiMilikSendiri = "' + valueKondisiSaluranPembuanganKamarMandiMilikSendiri + '" ,KondisiWCKamarMandiMilikSendiri = "' + valueKondisiWCKamarMandiMilikSendiri + '", KondisiAtapToiletMilikSendiri = "' + valueKondisiAtapToiletMilikSendiri + '", KondisiLantaiToiletMilikSendiri = "' + valueKondisiLantaiToiletMilikSendiri + '", KondisiDindingToiletMilikSendiri = "' + valueKondisiDindingToiletMilikSendiri + '", KondisiBakAirToiletMilikSendiri = "' + valueKondisiBakAirToiletMilikSendiri + '", SaluranPembuanganToiletMilikSendiri = "' + valueSaluranPembuanganToiletMilikSendiri + '",  KondisiWCToiletMilikSendiri = "' + valueKondisiWCToiletMilikSendiri + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitDraft db.transaction insert/update query: =====>>>>', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update error: ==>', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update success ====>');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_KondisiRumah", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_AirSanitasi RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_AirSanitasi ERROR:', error);
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
        if (!valueKepemilikanToilet || typeof valueKepemilikanToilet === 'undefined' || valueKepemilikanToilet === '' || valueKepemilikanToilet === 'null') return alert('Kepemilikan Toilet (*) tidak boleh kosong');
        if (!valueKamarMandiDanToiletTerpisah || typeof valueKamarMandiDanToiletTerpisah === 'undefined' || valueKamarMandiDanToiletTerpisah === '' || valueKamarMandiDanToiletTerpisah === 'null') return alert('Kamar Mandi dan Toliet Terpisah (*) tidak boleh kosong');
        if (!valueKepemilikanKamarMandi || typeof valueKepemilikanKamarMandi === 'undefined' || valueKepemilikanKamarMandi ==='' || valueKepemilikanKamarMandi === 'null') return alert('Kepemilikan Kamar Mandi(*) tidak boleh kosong');
        if (!valueSumberAirUntukMandiDanCuci|| typeof valueSumberAirUntukMandiDanCuci === 'undefined' || valueSumberAirUntukMandiDanCuci ==='' || valueSumberAirUntukMandiDanCuci === 'null') return alert('Sumber Air Untuk Mandi Dan Cuci(*) tidak boleh kosong');
        if (!valueSumberAirUntukMinum|| typeof valueSumberAirUntukMinum === 'undefined' || valueSumberAirUntukMinum ==='' || valueSumberAirUntukMinum === 'null') return alert('Sumber Air Untuk Minum(*) tidak boleh kosong');
        if (!valueKuantitasSumberAir|| typeof valueKuantitasSumberAir=== 'undefined' || valueKuantitasSumberAir==='' || valueKuantitasSumberAir=== 'null') return alert('Kuantitas SumberAir(*) tidak boleh kosong');
        if (!valueKualitasSumberAir|| typeof valueKualitasSumberAir=== 'undefined' || valueKualitasSumberAir==='' || valueKualitasSumberAir=== 'null') return alert('Kualitas Sumber Air(*) tidak boleh kosong');
        if (!valueKondisiAtapKamarMandiMilikSendiri|| typeof valueKondisiAtapKamarMandiMilikSendiri=== 'undefined' || valueKondisiAtapKamarMandiMilikSendiri==='' || valueKondisiAtapKamarMandiMilikSendiri=== 'null') return alert('Kondisi Atap Kamar Mandi Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiLantaiKamarMandiMilikSendiri|| typeof valueKondisiLantaiKamarMandiMilikSendiri=== 'undefined' || valueKondisiLantaiKamarMandiMilikSendiri==='' || valueKondisiLantaiKamarMandiMilikSendiri=== 'null') return alert('Kondisi Lantai Kamar Mandi Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiDindingKamarMandiMilikSendiri|| typeof valueKondisiDindingKamarMandiMilikSendiri=== 'undefined' || valueKondisiDindingKamarMandiMilikSendiri==='' || valueKondisiDindingKamarMandiMilikSendiri=== 'null') return alert('Kondisi Dinding Kamar Mandi Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiBakAirKamarMandiMilikSendiri|| typeof valueKondisiDindingKamarMandiMilikSendiri=== 'undefined' || valueKondisiDindingKamarMandiMilikSendiri==='' || valueKondisiDindingKamarMandiMilikSendiri=== 'null') return alert('Kondisi Dinding Kamar Mandi Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiSaluranPembuanganKamarMandiMilikSendiri|| typeof valueKondisiSaluranPembuanganKamarMandiMilikSendiri=== 'undefined' || valueKondisiSaluranPembuanganKamarMandiMilikSendiri==='' || valueKondisiSaluranPembuanganKamarMandiMilikSendiri=== 'null') return alert('Kondisi Saluran Pembuangan Kamar Mandi Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiWCKamarMandiMilikSendiri|| typeof valueKondisiWCKamarMandiMilikSendiri=== 'undefined' || valueKondisiWCKamarMandiMilikSendiri==='' || valueKondisiWCKamarMandiMilikSendiri=== 'null') return alert('Kondisi WC Kamar Mandi Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiAtapToiletMilikSendiri|| typeof valueKondisiAtapToiletMilikSendiri=== 'undefined' || valueKondisiAtapToiletMilikSendiri==='' || valueKondisiAtapToiletMilikSendiri=== 'null') return alert('Kondisi Atap Toilet Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiLantaiToiletMilikSendiri|| typeof valueKondisiLantaiToiletMilikSendiri=== 'undefined' || valueKondisiLantaiToiletMilikSendiri==='' || valueKondisiLantaiToiletMilikSendiri=== 'null') return alert('Kondisi Lantai Toilet Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiDindingToiletMilikSendiri|| typeof valueKondisiDindingToiletMilikSendiri=== 'undefined' || valueKondisiDindingToiletMilikSendiri==='' || valueKondisiDindingToiletMilikSendiri=== 'null') return alert('Kondisi Dinding Toilet Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiBakAirToiletMilikSendiri|| typeof valueKondisiBakAirToiletMilikSendiri=== 'undefined' || valueKondisiBakAirToiletMilikSendiri==='' || valueKondisiBakAirToiletMilikSendiri=== 'null') return alert('Kondisi Bak Air Toilet Milik Sendiri(*) tidak boleh kosong');
        if (!valueSaluranPembuanganToiletMilikSendiri|| typeof valueSaluranPembuanganToiletMilikSendiri=== 'undefined' || valueSaluranPembuanganToiletMilikSendiri==='' || valueSaluranPembuanganToiletMilikSendiri=== 'null') return alert('Saluran Pembuangan Toilet Milik Sendiri(*) tidak boleh kosong');
        if (!valueKondisiWCToiletMilikSendiri|| typeof valueKondisiWCToiletMilikSendiri=== 'undefined' || valueKondisiWCToiletMilikSendiri==='' || valueKondisiWCToiletMilikSendiri=== 'null') return alert('Kondisi WC Toilet Milik Sendiri(*) tidak boleh kosong');       

        if (submmitted) return true;

        setSubmmitted(true);

        await doSubmitDraft('submit');

        const find = 'SELECT * FROM Table_UK_Master WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind: doSubmitSave', resultsFind.rows);

                    if (dataLengthFind === 0) {
                        alert('UK Master not found');
                        navigation.goBack();
                        return;
                    }

                    // if (screenState === 2) {
                    //     let query = 'UPDATE Table_UK_Master SET status = "3" WHERE idSosialisasiDatabase = "' + id + '"';
                    //     if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update query:', query);

                    //     db.transaction(
                    //         tx => {
                    //             tx.executeSql(query);
                    //         }, function(error) {
                    //             if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update error:', error.message);
                    //             setSubmmitted(false);
                    //         },function() {
                    //             if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update success');
                                
                    //             if (__DEV__) {
                    //                 db.transaction(
                    //                     tx => {
                    //                         tx.executeSql("SELECT * FROM Table_UK_Master", [], (tx, results) => {
                    //                             if (__DEV__) console.log('SELECT * FROM Table_UK_Master RESPONSE:', results.rows);
                    //                         })
                    //                     }, function(error) {
                    //                         if (__DEV__) console.log('SELECT * FROM Table_UK_Master ERROR:', error);
                    //                     }, function() {}
                    //                 );
                    //             }
                    //         }
                    //     );
                    // }

                    setSubmmitted(false);
                    alert('Berhasil');
                    AsyncStorage.setItem(`isFormUKKondisiAirBersihDanSanitasiDone_${id}`, '1');
                    navigation.goBack();
                    
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction find error:', error.message);
                    setSubmmitted(false);
                })
            }
        );
    }

    const renderFormKamarMandiDanToiletTerpisah = () => (
        <View style={styles.MT8}>
            <Text>Kamar Mandi dan Toliet Terpisah (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKamarMandiDanToiletTerpisah}
                    onValueChange={(itemValue, itemIndex) => setValueKamarMandiDanToiletTerpisah(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKamarMandiDanToiletTerpisah.map((x, i) => <Picker.Item key={i} label={x.kamarMandiDanToiletTerpisahDetail } value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKepemilikanKamarMandi = () => (
        <View style={styles.MT8}>
            <Text>Kepemilikan Kamar Mandi (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKepemilikanKamarMandi}
                    onValueChange={(itemValue, itemIndex) => setValueKepemilikanKamarMandi(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKepemilikanKamarMandi.map((x, i) => <Picker.Item key={i} label={x.kepemilikanKamarMandiDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKepemilikanToilet = () => (
        <View style={styles.MT8}>
            <Text>Kepemilikan Toilet (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKepemilikanToilet}
                    onValueChange={(itemValue, itemIndex) => setValueKepemilikanToilet(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKepemilikanToilet.map((x, i) => <Picker.Item key={i} label={x.kepemilikanToiletDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormSumberAirUntukMandiDanCuci = () => (
        <View style={styles.MT8}>
            <Text>Sumber Air Untuk Mandri & Cuci (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueSumberAirUntukMandiDanCuci}
                    onValueChange={(itemValue, itemIndex) => setValueSumberAirUntukMandiDanCuci(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsSumberAirUntukMandiDanCuci.map((x, i) => <Picker.Item key={i} label={x.sumberAirUntukMandiDanCuciDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormSumberAirUntukMinum = () => (
        <View style={styles.MT8}>
            <Text>Sumber Air Untuk Minum (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueSumberAirUntukMinum}
                    onValueChange={(itemValue, itemIndex) => setValueSumberAirUntukMinum(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsSumberAirUntukMinum.map((x, i) => <Picker.Item key={i} label={x.sumberAirUntukMinumDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKuantitasSumberAir = () => (
        <View style={styles.MT8}>
            <Text>Kuantitas Sumber Air</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKuantitasSumberAir}
                    onValueChange={(itemValue, itemIndex) => setValueKuantitasSumberAir(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKuantitasSumberAir.map((x, i) => <Picker.Item key={i} label={x.kuantitasSumberAirDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKualitasSumberAir = () => (
        <View style={styles.MT8}>
            <Text>Kualitas Sumber Air</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKualitasSumberAir}
                    onValueChange={(itemValue, itemIndex) => setValueKualitasSumberAir(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKualitasSumberAir.map((x, i) => <Picker.Item key={i} label={x.kualitasSumberAirDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiAtapKamarMandiMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Atas Kamar Mandi Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiAtapKamarMandiMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiAtapKamarMandiMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiAtapKamarMandiMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiAtapKamarMandiMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiLantaiKamarMandiMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Lantai Kamar Mandi Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiLantaiKamarMandiMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiLantaiKamarMandiMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiLantaiKamarMandiMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiLantaiKamarMandiMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiDindingKamarMandiMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Dinding Kamar Mandi Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiDindingKamarMandiMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiDindingKamarMandiMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiDindingKamarMandiMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiDindingKamarMandiMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiBakAirKamarMandiMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Bak Air Kamar Mandi Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiBakAirKamarMandiMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiBakAirKamarMandiMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiBakAirKamarMandiMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiBakAirKamarMandiMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    
    const renderFormKondisiSaluranPembuanganKamarMandiMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Saluran Pembuangan Kamar Mandi Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiSaluranPembuanganKamarMandiMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiSaluranPembuanganKamarMandiMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiSaluranPembuanganKamarMandiMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiSaluranPembuanganKamarMandiMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiWCKamarMandiMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi WC Kamar Mandi Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiWCKamarMandiMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiWCKamarMandiMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiWCKamarMandiMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiWcKamarMandiMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiAtapToiletMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Atap Toilet Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiAtapToiletMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiAtapToiletMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiAtapToiletMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiAtapToiletMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiLantaiToiletMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Lantai Toilet Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiLantaiToiletMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiLantaiToiletMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiLantaiToiletMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiLantaiToiletMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiDindingToiletMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Dinding Toilet Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiDindingToiletMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiDindingToiletMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiDindingToiletMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiDindingToiletMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )
    
    const renderFormKondisiBakAirToiletMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Bak Air Toilet Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiBakAirToiletMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiBakAirToiletMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiBakAirToiletMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiBakAirToiletMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormSaluranPembuanganToiletMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Saluran Pembuangan Toilet Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueSaluranPembuanganToiletMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueSaluranPembuanganToiletMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsSaluranPembuanganToiletMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiSaluranPembuanganToiletMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiWCToiletMilikSendiri = () => (
        <View style={styles.MT8}>
            <Text>Kondisi WC Toilet Milik Sendiri</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiWCToiletMilikSendiri}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiWCToiletMilikSendiri(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKondisiWCToiletMilikSendiri.map((x, i) => <Picker.Item key={i} label={x.kondisiWcToiletMilikSendiriDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderButtonSaveDraft = () =>  (
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

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormKamarMandiDanToiletTerpisah()}
            {renderFormKepemilikanKamarMandi()}
            {renderFormKepemilikanToilet()}
            {renderFormSumberAirUntukMandiDanCuci()}
            {renderFormSumberAirUntukMinum()}
            {renderFormKuantitasSumberAir()}
            {renderFormKualitasSumberAir()}
            {renderFormKondisiAtapKamarMandiMilikSendiri()}
            {renderFormKondisiLantaiKamarMandiMilikSendiri()}
            {renderFormKondisiDindingKamarMandiMilikSendiri()}
            {renderFormKondisiBakAirKamarMandiMilikSendiri()}
            {renderFormKondisiSaluranPembuanganKamarMandiMilikSendiri()}
            {renderFormKondisiWCKamarMandiMilikSendiri()}
            {renderFormKondisiAtapToiletMilikSendiri()}
            {renderFormKondisiLantaiToiletMilikSendiri()}
            {renderFormKondisiDindingToiletMilikSendiri()}
            {renderFormKondisiBakAirToiletMilikSendiri()}
            {renderFormSaluranPembuanganToiletMilikSendiri()}
            {renderFormKondisiWCToiletMilikSendiri()}
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
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>INISIASI</Text>
                    </View>
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

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Kondisi Air Bersih & Sanitasi</Text>
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

export default InisiasiFormUKKondisiAirBersihDanSanitasi;
