import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet, ImageBackground, TextInput, ToastAndroid, Image, ActivityIndicator, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Camera } from 'expo-camera'
import { Button } from 'react-native-elements'
import { showMessage } from "react-native-flash-message"
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Geolocation from 'react-native-geolocation-service';

import db from '../../../database/Database'
import { replaceSpecialChar } from '../../../utils/Functions'
import { ApiDukcapil } from '../../../../dataconfig'

const MIN_TANGGAL_LAHIR = 15;
const MAX_TANGGAL_LAHIR = 64;
const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 8;

const DataDiri = ({route}) => {
    const uniqueNumber = (new Date().getTime()).toString(36);
    const { id, groupName, namaNasabah, nomorHandphone, screenState } = route.params

    const navigation = useNavigation()
    const phoneRef = useRef(undefined)
    const camera = useRef(null)
    const [loading, setLoading] = useState(false)
    let [date, setDate] = useState(new Date())

    //STATE DATA DIRI
    let [fotokartuIdentitas, setFotoKartuIdentitas] = useState()
    let [jenisKartuIdentitas, setJenisKartuIdentitas] = useState()
    let [nomorIdentitas, setNomorIdentitas] = useState()
    let [namaNasabahSosialisasi, setNamaNasabahSosialisasi] = useState(namaNasabah)
    let [namaCalonNasabah, setNamaCalonNasabah] = useState(namaNasabah)
    let [tempatLahir, setTempatLahir] = useState()
    let [tanggalLahir, setTanggalLahir] = useState()
    let [statusPerkawinan, setStatusPerkawinan] = useState()
    let [alamatIdentitas, setAlamatIdentitas] = useState()
    let [alamatDomisili, setAlamatDomisili] = useState()
    let [fotoSuratKeteranganDomisili, setFotoSuratKeteranganDomisili] = useState()
    let [dataProvinsi, setDataProvinsi] = useState(null)
    let [dataKabupaten, setDataKabupaten] = useState()
    let [dataKecamatan, setDataKecamatan] = useState()
    let [dataKelurahan, setDataKelurahan] = useState()

    //STATE DATA KARTU KELUARGA
    let [fotoKartuKeluarga, setFotoKartuKeluarga] = useState()
    let [nomorKartuKeluarga, setNomorKartuKeluarga] = useState()

    //STATE DATA DIRI PRIBADI
    let [fullName, setFullName] = useState(namaNasabah)
    let [namaAyah, setNamaAyah] = useState()
    let [noTelfon, setNoTelfon] = useState(nomorHandphone !== 'undefined' ? nomorHandphone : '')
    let [jumlahAnak, setJuma] = useState()
    let [jumlahTanggungan, setJumlahTanggungnan] = useState()
    let [statusRumahTinggal, setStatusRumahTinggal] = useState()
    let [lamaTinggal, setLamaTinggal] = useState()

    //STATE DATA SUAMI
    let [namaSuami, setNamaSuami] = useState()
    let [fotoKartuIdentitasSuami, setFotoKartuIdentitasSuami] = useState()
    let [statusSuami, setStatusSuami] = useState(false)

    //STATE DATA PENJAMIN
    let [statusHubunganKeluarga, setStatusHubunganKeluarga] = useState()
    let [namaPenjamin, setNamaPenjamin] = useState()
    let [fotoDataPenjamin, setFotoDataPenjamin] = useState()

    let [showSos, setShowSos] = useState(false)
    let [tanggalSos, setTanggalSos] = useState()
    let [open, setOpen] = useState(false)
    let [value, setValue] = useState(null)
    let [nohp, setNohp] = useState()
    let [sisipan, setSisipan] = useState(false)
    let [baru, setBaru] = useState(false)
    let [statusNasabah, setStatusNasabah] = useState()

    let [showCalendar, setShowCalendar] = useState(false)
    
    let [currentDate, setCurrentDate] = useState()
    let [sumberDana, setSumberDana] = useState()

    let [cameraShow, setCameraShow] = useState()
    let [buttonCam, SetButtonCam] = useState(false)

    let [testData, setTestData] = useState([])

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const [items, setItems] = useState([])
    const [itemsMarrige, setItemsMarriege] = useState([])
    
    /* START DEFINE BY MUHAMAD YUSUP HAMDANI (YPH) */
    const dataPilihanAnak = [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'}
    ];
    const dataPilihanTanggungan = [
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'}
    ];
    const [openJenisKartuIdentitas, setOpenJenisKartuIdentitas] = useState(false);
    const [valueJenisKartuIdentitas, setValueJenisKartuIdentitas] = useState(null);
    const [itemsJenisKartuIdentitas, setItemsJenisKartuIdentitas] = useState([]);
    const [openStatusPerkawinan, setOpenStatusPerkawinan] = useState(false);
    const [valueStatusPerkawinan, setValueStatusPerkawinan] = useState(null);
    const [itemsStatusPerkawinan, setItemsStatusPerkawinan] = useState([]);
    const [openJumlahAnak, setOpenJumlahAnak] = useState(false);
    const [valueJumlahAnak, setValueJumlahAnak] = useState('0');
    const [itemsJumlahAnak, setItemsJumlahAnak] = useState(dataPilihanAnak);
    const [openJumlahTanggungan, setOpenJumlahTanggungan] = useState(false);
    const [valueJumlahTanggungan, setValueJumlahTanggungan] = useState(null);
    const [itemsJumlahTanggungan, setItemsJumlahTanggungan] = useState(dataPilihanTanggungan);
    const [openStatusRumahTinggal, setOpenStatusRumahTinggal] = useState(false);
    const [valueStatusRumahTinggal, setValueStatusRumahTinggal] = useState(null);
    const [itemsStatusRumahTinggal, setItemsStatusRumahTinggal] = useState([
        {
            label: 'Milik Sendiri',
            value: '1'
        }
    ]);
    const [openStatusHubunganKeluarga, setOpenStatusHubunganKeluarga] = useState(false);
    const [valueStatusHubunganKeluarga, setValueStatusHubunganKeluarga] = useState('1');
    const [itemsStatusHubunganKeluarga, setItemsStatusHubunganKeluarga] = useState([]);
    const [submmitted, setSubmmitted] = useState(false);
    const [dataWilayahMobile, setDataWilayahMobile] = useState([]);
    const [statusAgreement, setStatusAgreement] = useState(false);
    const [usahaPekerjaanSuami, setUsahaPekerjaanSuami] = useState('');
    const [jumlahTenagaKerjaSuami, setJumlahTenagaKerjaSuami] = useState('0');
    const [location, setLocation] = useState(null);
    const [valueReligion, setValueReligion] = useState(null);
    const [itemsReligion, setItemsReligion] = useState([]);
    const [namaGadisIbu, setNamaGadisIbu] = useState('');
    const [key_dataPenjamin, setKey_dataPenjamin] = useState(`formUK_dataPenjamin_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_dataSuami, setKey_dataSuami] = useState(`formUK_dataSuami_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_kartuKeluarga, setKey_kartuKeluarga] = useState(`formUK_kartuKeluarga_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_keteranganDomisili, setKey_keteranganDomisili] = useState(`formUK_keteranganDomisili_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [key_kartuIdentitas, setKey_kartuIdentitas] = useState(`formUK_kartuIdentitas_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [addressDomisiliLikeIdentitas, setAddressDomisiliLikeIdentitas] = useState(false);
    const [valueNomorIdentitas, setValueNomorIdentitas] = useState('0');
    const [fetchCheckNIK, setFetchCheckNIK] = useState(false);
    /* END DEFINE BY MUHAMAD YUSUP HAMDANI (YPH) */

    useEffect(() => {
        (async () => {
            /* START DEFINE BY MUHAMAD YUSUP HAMDANI (YPH) */
            let queryUKDataDiri = `SELECT * FROM Table_UK_DataDiri WHERE idSosialisasiDatabase = '` + id + `';`
            const getUKDataDiri = () => {
                db.transaction(
                    tx => {
                        tx.executeSql(queryUKDataDiri, [], async (tx, results) => {
                            let dataLength = results.rows.length;
                            if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri length:', dataLength);
                            if (dataLength > 0) {
                                
                                let data = results.rows.item(0);
                                if (__DEV__) console.log('tx.executeSql data:', data);

                                if (data.foto_ktp_penjamin) setKey_dataPenjamin(data.foto_ktp_penjamin);
                                if (data.foto_ktp_suami) setKey_dataSuami(data.foto_ktp_suami);
                                if (data.foto_kk) setKey_kartuKeluarga(data.foto_kk);
                                if (data.foto_Surat_Keterangan_Domisili) setKey_keteranganDomisili(data.foto_Surat_Keterangan_Domisili);
                                if (data.foto_Kartu_Identitas) setKey_kartuIdentitas(data.foto_Kartu_Identitas);

                                const fotoDataPenjamin = data.foto_ktp_penjamin ? await AsyncStorage.getItem(data.foto_ktp_penjamin) : '';
                                const fotoDataSuami = data.foto_ktp_suami ? await AsyncStorage.getItem(data.foto_ktp_suami) : '';
                                const fotoKartuKeluarga = data.foto_kk ? await AsyncStorage.getItem(data.foto_kk) : '';
                                const fotoKeteranganDomisili = data.foto_Surat_Keterangan_Domisili ? await AsyncStorage.getItem(data.foto_Surat_Keterangan_Domisili) : '';
                                const fotoKartuIdentitas = data.foto_Kartu_Identitas ? await AsyncStorage.getItem(data.foto_Kartu_Identitas) : '';

                                if (__DEV__) console.log('fotoDataPenjamin :', data.foto_ktp_penjamin, fotoDataPenjamin);
                                if (__DEV__) console.log('fotoDataSuami :', data.foto_ktp_suami, fotoDataSuami);
                                if (__DEV__) console.log('fotoKartuKeluarga :', data.foto_kk, fotoKartuKeluarga);
                                if (__DEV__) console.log('fotoKeteranganDomisili :', data.foto_Surat_Keterangan_Domisili, fotoKeteranganDomisili);
                                if (__DEV__) console.log('fotoKartuIdentitas :', data.foto_Kartu_Identitas, fotoKartuIdentitas);

                                if (data.foto_Kartu_Identitas !== null && typeof data.foto_Kartu_Identitas !== 'undefined') setFotoKartuIdentitas(fotoKartuIdentitas);
                                if (data.jenis_Kartu_Identitas !== null && typeof data.jenis_Kartu_Identitas !== 'undefined') setValueJenisKartuIdentitas(data.jenis_Kartu_Identitas);
                                if (data.nomor_Identitas !== null && typeof data.nomor_Identitas !== 'undefined') setNomorIdentitas(data.nomor_Identitas);
                                if (data.nama_lengkap !== null && typeof data.nama_lengkap !== 'undefined') {
                                    setNamaCalonNasabah(data.nama_lengkap);
                                    setFullName(data.nama_lengkap);
                                }
                                if (data.tempat_lahir !== null && typeof data.tempat_lahir !== 'undefined') setTempatLahir(data.tempat_lahir);
                                if (data.tanggal_Lahir !== null && typeof data.tanggal_Lahir !== 'undefined') setTanggalLahir(data.tanggal_Lahir);
                                if (data.status_Perkawinan !== null && typeof data.status_Perkawinan !== 'undefined') setValueStatusPerkawinan(data.status_Perkawinan);
                                if (data.alamat_Identitas !== null && typeof data.alamat_Identitas !== 'undefined') setAlamatIdentitas(data.alamat_Identitas);
                                if (data.alamat_Domisili !== null && typeof data.alamat_Domisili !== 'undefined') setAlamatDomisili(data.alamat_Domisili);
                                if (data.foto_Surat_Keterangan_Domisili !== null && typeof data.foto_Surat_Keterangan_Domisili !== 'undefined') setFotoSuratKeteranganDomisili(fotoKeteranganDomisili);
                                if (data.provinsi !== null && typeof data.provinsi !== 'undefined') setDataProvinsi(data.provinsi);
                                if (data.kabupaten !== null && typeof data.kabupaten !== 'undefined') setDataKabupaten(data.kabupaten);
                                if (data.kecamatan !== null && typeof data.kecamatan !== 'undefined') setDataKecamatan(data.kecamatan);
                                if (data.kelurahan !== null && typeof data.kelurahan !== 'undefined') setDataKelurahan(data.kelurahan);
                                if (data.foto_kk !== null && typeof data.foto_kk !== 'undefined') setFotoKartuKeluarga(fotoKartuKeluarga);
                                if (data.no_kk !== null && typeof data.no_kk !== 'undefined') setNomorKartuKeluarga(data.no_kk);
                                if (data.nama_ayah !== null && typeof data.nama_ayah !== 'undefined') setNamaAyah(data.nama_ayah);
                                if (data.nama_gadis_ibu !== null && typeof data.nama_gadis_ibu !== 'undefined') setNamaGadisIbu(data.nama_gadis_ibu);
                                if (data.no_tlp_nasabah !== null && typeof data.no_tlp_nasabah !== 'undefined') setNoTelfon(data.no_tlp_nasabah);
                                if (data.agama !== null && typeof data.agama !== 'undefined') setValueReligion(data.agama);
                                if (data.jumlah_anak !== null && typeof data.jumlah_anak !== 'undefined') setValueJumlahAnak(data.jumlah_anak);
                                if (data.jumlah_tanggungan !== null && typeof data.jumlah_tanggungan !== 'undefined') setValueJumlahTanggungan(data.jumlah_tanggungan);
                                if (data.status_rumah_tinggal !== null && typeof data.status_rumah_tinggal !== 'undefined') setValueStatusRumahTinggal(data.status_rumah_tinggal);
                                if (data.lama_tinggal !== null && typeof data.lama_tinggal !== 'undefined') setLamaTinggal(data.lama_tinggal);
                                if (data.nama_suami !== null && typeof data.nama_suami !== 'undefined' && data.foto_Kartu_Identitas !== 'undefined') setNamaSuami(data.nama_suami);
                                if (data.usaha_pekerjaan_suami !== null && typeof data.usaha_pekerjaan_suami !== 'undefined') setUsahaPekerjaanSuami(data.usaha_pekerjaan_suami);
                                if (data.jumlah_tenaga_kerja_suami !== null && typeof data.jumlah_tenaga_kerja_suami !== 'undefined') setJumlahTenagaKerjaSuami(data.jumlah_tenaga_kerja_suami);
                                if (data.foto_ktp_suami !== null && typeof data.foto_ktp_suami !== 'undefined') setFotoKartuIdentitasSuami(fotoDataSuami);
                                if (data.suami_diluar_kota !== null && typeof data.suami_diluar_kota !== 'undefined') setStatusSuami(data.suami_diluar_kota === 'true' || data.suami_diluar_kota === '1' ? true : false);
                                if (data.status_hubungan_keluarga !== null && typeof data.status_hubungan_keluarga !== 'undefined') setValueStatusHubunganKeluarga(data.status_hubungan_keluarga);
                                if (data.nama_penjamin !== null && typeof data.nama_penjamin !== 'undefined') setNamaPenjamin(data.nama_penjamin);
                                if (data.foto_ktp_penjamin !== null && typeof data.foto_ktp_penjamin !== 'undefined') setFotoDataPenjamin(fotoDataPenjamin);
                                if (data.is_pernyataan_dibaca !== null && typeof data.is_pernyataan_dibaca !== 'undefined') setStatusAgreement(data.suami_diluar_kota === 'true' || data.is_pernyataan_dibaca === '1' ? true : false);
                                if (data.is_alamat_domisili_sesuai_ktp !== null && typeof data.is_alamat_domisili_sesuai_ktp !== 'undefined') setAddressDomisiliLikeIdentitas(data.is_alamat_domisili_sesuai_ktp === 'true' || data.is_alamat_domisili_sesuai_ktp === '1' ? true : false);
                                if (data.is_nik_valid_dukcapil !== null && typeof data.is_nik_valid_dukcapil !== 'undefined') setValueNomorIdentitas(data.is_nik_valid_dukcapil);
                            }
                            return true;
                        }, function(error) {
                            if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri error:', error.message);
                        })
                    }
                )
            }
            const getStorageStatusHubunganKeluarga = async () => {
                if (__DEV__) console.log('getStorageStatusHubunganKeluarga loaded');
        
                try {
                    const response = await AsyncStorage.getItem('RelationStatus');
                    if (response !== null) {
                        const responseJSON = JSON.parse(response);
                        if (responseJSON.length > 0 ?? false) {
                            var responseFiltered = responseJSON.map((data, i) => {
                                return { label: data.relationStatus, value: data.id };
                            }) ?? [];
                            if (__DEV__) console.log('getStorageStatusHubunganKeluarga responseFiltered:', responseFiltered);
                            setItemsStatusHubunganKeluarga(responseFiltered);
                            return;
                        }
                    }
                    setItemsStatusHubunganKeluarga([]);
                } catch (error) {
                    setItemsStatusHubunganKeluarga([]);
                }
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
                            setItemsStatusRumahTinggal(responseFiltered);
                            return;
                        }
                    }
                    setItemsStatusRumahTinggal([]);
                } catch (error) {
                    setItemsStatusRumahTinggal([]);
                }
            }
            const getStorageWilayahMobile = async () => {
                if (__DEV__) console.log('getStorageWilayahMobile loaded');
        
                try {
                    const response = await AsyncStorage.getItem('WilayahMobile');
                    if (response !== null) {
                        const responseJSON = JSON.parse(response);
                        if (responseJSON.length > 0 ?? false) {
                            setDataWilayahMobile(responseJSON);
                            return;
                        }
                    }
                    setDataWilayahMobile([]);
                } catch (error) {
                    setDataWilayahMobile([]);
                }
            }
            const getStorageReligion = async () => {
                if (__DEV__) console.log('getStorageReligion loaded');
        
                try {
                    const response = await AsyncStorage.getItem('Religion');
                    if (response !== null) {
                        const responseJSON = JSON.parse(response);
                        if (responseJSON.length > 0 ?? false) {
                            var responseFiltered = responseJSON.map((data, i) => {
                                return { label: data.religion, value: data.id };
                            }) ?? [];
                            if (__DEV__) console.log('getStorageReligion responseFiltered:', responseFiltered);
                            setItemsReligion(responseFiltered);
                            return;
                        }
                    }
                    setItemsReligion([]);
                } catch (error) {
                    setItemsReligion([]);
                }
            }
            
            const getLocation = async () => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        setLocation(position);
                        if (__DEV__) console.log(position);
                    },
                    (error) => {
                        // See error code charts below.
                        setLocation(null);
                        if (__DEV__) console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            };
            getUKDataDiri();
            getStorageStatusHubunganKeluarga();
            getStorageRumahTinggal();
            getStorageWilayahMobile();
            getStorageReligion();
            getLocation();
            /* END DEFINE BY MUHAMAD YUSUP HAMDANI (YPH) */

            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');

            const tanggal = await AsyncStorage.getItem('TransactionDate')
            setCurrentDate(tanggal)

            const identityType = await AsyncStorage.getItem('IdentityType')
            const marriageStatus = await AsyncStorage.getItem('MarriageStatus')

            let identityLength = JSON.parse(identityType).length
            let marriageLength = JSON.parse(marriageStatus).length

            let arrayIdentity = []
            let arrayMarriage = []

            for(let a = 0; a < identityLength; a++) {
                let data = JSON.parse(identityType)[a]
                arrayIdentity.push({label: data.identityCard, value: data.id})
            }
            for(let a = 0; a < marriageLength; a++) {
                let data = JSON.parse(marriageStatus)[a]
                arrayMarriage.push({label: data.marriageStatusDetail, value: data.id})
            }

            if (__DEV__) console.log('arrayIdentity:', arrayIdentity);
            if (__DEV__) console.log('arrayMarriage:', arrayMarriage);

            setItems(arrayIdentity)
            setItemsMarriege(arrayMarriage)

            setItemsJenisKartuIdentitas(arrayIdentity);
            setItemsStatusPerkawinan(arrayMarriage);
            
        })();
    }, []);

    useEffect(() => {
        if (__DEV__) console.log('useEffect valueStatusPerkawinan:', valueStatusPerkawinan);

        if (valueStatusPerkawinan !== '1') {
            setNamaPenjamin('');
            setFotoDataPenjamin();
            setValueStatusHubunganKeluarga('');
        } else {
            setNamaPenjamin(namaSuami);
            setFotoDataPenjamin(fotoKartuIdentitasSuami);
            setValueStatusHubunganKeluarga('1');
        }
    }, [valueStatusPerkawinan]);

    useEffect(() => {
        if (__DEV__) console.log('useEffect statusSuami:', statusSuami);

        if (statusSuami) {
            setNamaPenjamin('');
            setFotoDataPenjamin();
        } else {
            setNamaPenjamin(namaSuami);
            setFotoDataPenjamin(fotoKartuIdentitasSuami);
        }
    }, [statusSuami]);

    const checkNIK = () => {
        if (__DEV__) console.log('checkNIK loaded');

        if (!nomorIdentitas || typeof nomorIdentitas === 'undefined' || nomorIdentitas === '' || nomorIdentitas === 'null') return alert('Nomor Identitas (*) tidak boleh kosong');
        
        const body = {
            NIK: nomorIdentitas
        };

        setFetchCheckNIK(true);
        fetch(`${ApiDukcapil}/dukcapil/check`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (__DEV__) console.log('$post /dukcapil/check success:', responseJson);
            if (responseJson.code === 400) {
                setValueNomorIdentitas('0');
                setFetchCheckNIK(false);
                Alert.alert('Error', responseJson.message);
                return;
            }

            setValueNomorIdentitas('1');
            setFetchCheckNIK(false);
            Alert.alert('Berhasil', 'Nomor Identitas terdaftar di dukcapil');
        })
    }

    if (hasPermission === null) {
        return <View />
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
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

    const onRefreshLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setLocation(position);
                ToastAndroid.show("Long, Lat refresh!", ToastAndroid.SHORT);
                if (__DEV__) console.log(position);
            },
            (error) => {
                // See error code charts below.
                setLocation(null);
                if (__DEV__) console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const dateLahirHandler = (event, date) => {
        if (__DEV__) console.log('dateLahirHandler loaded');

        let dateValue = moment(date).format('YYYY-MM-DD');
        let rangeDateValue = moment().diff(moment(moment(dateValue).format("DD-MM-YYYY"), "DD-MM-YYYY"), 'years');
        if (__DEV__) console.log('dateLahirHandler rangeDateValue:', rangeDateValue);
        if (__DEV__) console.log('dateLahirHandler dateValue:', dateValue);

        if (rangeDateValue > MIN_TANGGAL_LAHIR && rangeDateValue < MAX_TANGGAL_LAHIR) {
            setShowCalendar(false);
            setTanggalLahir(dateValue);
            return;
        }

        ToastAndroid.show(`${rangeDateValue} tahun, Usia tidak valid`, ToastAndroid.SHORT);
        setShowCalendar(false);
    }

    const JenisKartuIdentitas = (value) => {
        // console.log(value)
        setJenisKartuIdentitas(value)
    }

    const MarriageStatus = (value) => {
        setStatusPerkawinan(value)
    }

    const sumberDataHandler = (text) => {
        setSumberDana(text)
    }

    const doSubmitDataPenjamin = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDataPenjamin loaded');
        if (__DEV__) console.log('doSubmitDataPenjamin valueStatusHubunganKeluarga:', valueStatusHubunganKeluarga);
        if (__DEV__) console.log('doSubmitDataPenjamin namaPenjamin:', namaPenjamin);
        if (__DEV__) console.log('doSubmitDataPenjamin fotoDataPenjamin:', fotoDataPenjamin);

        const find = 'SELECT * FROM Table_UK_DataDiri WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_DataDiri (nama_lengkap, status_hubungan_keluarga, nama_penjamin, foto_ktp_penjamin, idSosialisasiDatabase) values ("' + namaNasabah + '","' + namaPenjamin + '","' + fotoKartuIdentitasSuami + '","' + key_dataPenjamin + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_DataDiri SET status_hubungan_keluarga = "' + valueStatusHubunganKeluarga + '", nama_penjamin = "' + namaPenjamin + '", foto_ktp_penjamin = "' + key_dataPenjamin + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitDataPenjamin db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDataPenjamin db.transaction insert/update error:', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitDataPenjamin db.transaction insert/update success');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_DataDiri", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri ERROR 4:', error);
                                    }, function() {}
                                );
                            }
                            return resolve(true);
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataDiriPribadi db.transaction find error:', error.message);
                    return resolve(true);
                })
            }
        );
    });

    const doSubmitDataSuami = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDataSuami loaded');
        if (__DEV__) console.log('doSubmitDataSuami namaSuami:', namaSuami);
        if (__DEV__) console.log('doSubmitDataSuami usahaPekerjaanSuami:', usahaPekerjaanSuami);
        if (__DEV__) console.log('doSubmitDataSuami jumlahTenagaKerjaSuami:', jumlahTenagaKerjaSuami);
        if (__DEV__) console.log('doSubmitDataSuami fotoKartuIdentitasSuami:', fotoKartuIdentitasSuami);
        if (__DEV__) console.log('doSubmitDataSuami statusSuami:', statusSuami);

        const find = 'SELECT * FROM Table_UK_DataDiri WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_DataDiri (nama_lengkap, nama_suami, usaha_pekerjaan_suami, jumlah_tenaga_kerja_suami, foto_ktp_suami, suami_diluar_kota, idSosialisasiDatabase) values ("' + namaNasabah + '","' + namaSuami + '","' + key_dataSuami + '","' + statusSuami + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_DataDiri SET nama_suami = "' + namaSuami + '", usaha_pekerjaan_suami = "' + usahaPekerjaanSuami + '", jumlah_tenaga_kerja_suami = "' + jumlahTenagaKerjaSuami + '", foto_ktp_suami = "' + key_dataSuami + '", suami_diluar_kota = "' + statusSuami + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitDataSuami db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDataSuami db.transaction insert/update error:', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitDataSuami db.transaction insert/update success');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_DataDiri", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri ERROR 5:', error);
                                    }, function() {}
                                );
                            }
                            return resolve(true);
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataDiriPribadi db.transaction find error:', error.message);
                    return resolve(true);
                })
            }
        );
    });

    const doSubmitDataDiriPribadi = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDataDiriPribadi loaded');
        if (__DEV__) console.log('doSubmitDataDiriPribadi fullName:', fullName);
        if (__DEV__) console.log('doSubmitDataDiriPribadi namaAyah:', namaAyah);
        if (__DEV__) console.log('doSubmitDataDiriPribadi namaGadisIbu:', namaGadisIbu);
        if (__DEV__) console.log('doSubmitDataDiriPribadi noTelfon:', noTelfon);
        if (__DEV__) console.log('doSubmitDataDiriPribadi valueJumlahAnak:', valueJumlahAnak);
        if (__DEV__) console.log('doSubmitDataDiriPribadi valueJumlahTanggungan:', valueJumlahTanggungan);
        if (__DEV__) console.log('doSubmitDataDiriPribadi valueStatusRumahTinggal:', valueStatusRumahTinggal);
        if (__DEV__) console.log('doSubmitDataDiriPribadi lamaTinggal:', lamaTinggal);
        if (__DEV__) console.log('doSubmitDataDiriPribadi agama:', valueReligion);

        const find = 'SELECT * FROM Table_UK_DataDiri WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_DataDiri (nama_lengkap, nama_ayah, nama_gadis_ibu, no_tlp_nasabah, jumlah_anak, jumlah_tanggungan, status_rumah_tinggal, lama_tinggal, agama, idSosialisasiDatabase) values ("' + namaNasabah + '","' + namaAyah + '","' + namaGadisIbu + '","' + noTelfon + '","' + valueJumlahAnak + '","' + valueJumlahTanggungan + '","' + valueStatusRumahTinggal + '","' + lamaTinggal + '","' + valueReligion + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_DataDiri SET nama_ayah = "' + namaAyah + '", nama_gadis_ibu = "' + namaGadisIbu + '", no_tlp_nasabah = "' + noTelfon + '", jumlah_anak = "' + valueJumlahAnak + '", jumlah_tanggungan = "' + valueJumlahTanggungan + '", status_rumah_tinggal = "' + valueStatusRumahTinggal + '", lama_tinggal = "' + lamaTinggal + '", agama = "' + valueReligion + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitDataDiriPribadi db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDataDiriPribadi db.transaction insert/update error:', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitDataDiriPribadi db.transaction insert/update success');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_DataDiri", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri ERROR 6:', error);
                                    }, function() {}
                                );
                            }
                            return resolve(true);
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataDiriPribadi db.transaction find error:', error.message);
                    return resolve(true);
                })
            }
        );
    });

    const doSubmitKK = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitKK loaded');
        if (__DEV__) console.log('doSubmitKK fotoKartuKeluarga:', fotoKartuKeluarga);
        if (__DEV__) console.log('doSubmitKK nomorKartuKeluarga:', nomorKartuKeluarga);

        const find = 'SELECT * FROM Table_UK_DataDiri WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_DataDiri (nama_lengkap, foto_kk, no_kk, idSosialisasiDatabase) values ("' + namaNasabah + '","' + key_kartuKeluarga + '","' + nomorKartuKeluarga + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_DataDiri SET foto_kk = "' + key_kartuKeluarga + '", no_kk = "' + nomorKartuKeluarga + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitKK db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitKK db.transaction insert/update error:', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitKK db.transaction insert/update success');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_DataDiri", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri ERROR 1:', error);
                                    }, function() {}
                                );
                            }
                            return resolve(true);
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitKK db.transaction find error:', error.message);
                    return resolve(true);
                })
            }
        );
    });

    const doSubmitDataIdentitasDiri = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDataIdentitasDiri loaded');
        if (__DEV__) console.log('doSubmitDataIdentitasDiri namaNasabah:', namaNasabah);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri fotokartuIdentitas:', fotokartuIdentitas);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri valueJenisKartuIdentitas:', valueJenisKartuIdentitas);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri nomorIdentitas:', nomorIdentitas);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri namaCalonNasabah:', namaCalonNasabah);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri tempatLahir:', tempatLahir);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri tanggalLahir:', tanggalLahir);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri valueStatusPerkawinan:', valueStatusPerkawinan);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri alamatIdentitas:', alamatIdentitas);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri alamatDomisili:', alamatDomisili);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri fotoSuratKeteranganDomisili:', fotoSuratKeteranganDomisili);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri dataProvinsi:', dataProvinsi);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri dataKabupaten:', dataKabupaten);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri dataKecamatan:', dataKecamatan);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri dataKelurahan:', dataKelurahan);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri longitude:', location?.coords?.longitude ?? '0');
        if (__DEV__) console.log('doSubmitDataIdentitasDiri latitude:', location?.coords?.latitude ?? '0');
        if (__DEV__) console.log('doSubmitDataIdentitasDiri statusAgreement:', statusAgreement);
        if (__DEV__) console.log('doSubmitDataIdentitasDiri valueNomorIdentitas:', valueNomorIdentitas);

        if (addressDomisiliLikeIdentitas) {
            alamatDomisili = alamatIdentitas;
            fotoSuratKeteranganDomisili = 'data:image/jpeg;base64,';
        }

        const longitude = location?.coords?.longitude ?? '0';
        const latitude = location?.coords?.latitude ?? '0';
        const status_agreement = statusAgreement ? '1' : '0';

        const find = 'SELECT * FROM Table_UK_DataDiri WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_DataDiri (foto_Kartu_Identitas, jenis_Kartu_Identitas, nomor_Identitas, nama_lengkap, tempat_lahir, tanggal_Lahir, status_Perkawinan, alamat_Identitas, alamat_Domisili, foto_Surat_Keterangan_Domisili, provinsi, kabupaten, kecamatan, kelurahan, longitude, latitude, is_pernyataan_dibaca, is_alamat_domisili_sesuai_ktp, is_nik_valid_dukcapil, idSosialisasiDatabase) values ("' + key_kartuIdentitas + '","' + valueJenisKartuIdentitas + '","' + nomorIdentitas + '","' + namaCalonNasabah + '","' + tempatLahir + '","' + tanggalLahir + '","' + valueStatusPerkawinan + '","' + alamatIdentitas + '","' + alamatDomisili + '","' + key_keteranganDomisili + '","' + dataProvinsi + '","' + dataKabupaten + '","' + dataKecamatan + '","' + dataKelurahan + '","' + longitude + '","' + latitude + '","' + status_agreement + '","' + addressDomisiliLikeIdentitas + '","' + valueNomorIdentitas + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_DataDiri SET foto_Kartu_Identitas = "' + key_kartuIdentitas + '", jenis_Kartu_Identitas = "' + valueJenisKartuIdentitas + '", nomor_Identitas = "' + nomorIdentitas + '", nama_lengkap = "' + namaCalonNasabah + '", tempat_lahir = "' + tempatLahir + '", tanggal_Lahir = "' + tanggalLahir + '", status_Perkawinan = "' + valueStatusPerkawinan + '", alamat_Identitas = "' + alamatIdentitas + '", alamat_Domisili = "' + alamatDomisili + '", foto_Surat_Keterangan_Domisili = "' + key_keteranganDomisili + '", provinsi = "' + dataProvinsi + '", kabupaten = "' + dataKabupaten + '", kecamatan = "' + dataKecamatan + '", kelurahan = "' + dataKelurahan + '", longitude = "' + longitude + '", latitude = "' + latitude + '", is_pernyataan_dibaca = "' + status_agreement + '", is_alamat_domisili_sesuai_ktp = "' + addressDomisiliLikeIdentitas + '", is_nik_valid_dukcapil = "' + valueNomorIdentitas + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update error:', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update success');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_DataDiri", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri ERROR 2:', error);
                                    }, function() {}
                                );
                            }
                            return resolve(true);
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction find error:', error.message);
                    return resolve(true);
                })
            }
        );
    })

    const doSubmitSave = async () => {
        if (__DEV__) console.log('doSubmitSave loaded');

        if (!statusAgreement) return true;

        if (!fotokartuIdentitas || typeof fotokartuIdentitas === 'undefined' || fotokartuIdentitas === '' || fotokartuIdentitas === 'null') return alert('Foto Kartu Identitas (*) tidak boleh kosong');
        if (!valueJenisKartuIdentitas || typeof valueJenisKartuIdentitas === 'undefined' || valueJenisKartuIdentitas ==='' || valueJenisKartuIdentitas === 'null') return alert('Jenis Kartu Identitas (*) tidak boleh kosong');
        if (!nomorIdentitas || typeof nomorIdentitas === 'undefined' || nomorIdentitas === '' || nomorIdentitas === 'null') return alert('Nomor Identitas (*) tidak boleh kosong');
        if (!namaCalonNasabah || typeof namaCalonNasabah === 'undefined' || namaCalonNasabah === '' || namaCalonNasabah === 'null') return alert('Nama Lengkap (*) tidak boleh kosong');
        if (!tempatLahir || typeof tempatLahir === 'undefined' || tempatLahir === '' || tempatLahir === 'null') return alert('Tempat Lahir (*) tidak boleh kosong');
        if (!tanggalLahir || typeof tanggalLahir === 'undefined' || tanggalLahir === '' || tanggalLahir === 'null') return alert('Tanggal Lahir (*) tidak boleh kosong');
        if (!valueStatusPerkawinan || typeof valueStatusPerkawinan === 'undefined' || valueStatusPerkawinan === '' || valueStatusPerkawinan === 'null') return alert('Status Perkawinan (*) tidak boleh kosong');
        if (!alamatIdentitas || typeof alamatIdentitas === 'undefined' || alamatIdentitas === '' || alamatIdentitas === 'null') return alert('Alamat Identitas (*) tidak boleh kosong');
        if (!addressDomisiliLikeIdentitas) {
            if (!alamatDomisili || typeof alamatDomisili === 'undefined' || alamatDomisili === '' || alamatDomisili === 'null') return alert('Alamat Domisili (*) tidak boleh kosong');
            if (!fotoSuratKeteranganDomisili || typeof fotoSuratKeteranganDomisili === 'undefined' || fotoSuratKeteranganDomisili === '' || fotoSuratKeteranganDomisili === 'null') return alert('Foto Surat Keterangan Domisili (*) tidak boleh kosong');
        }
        if (!dataProvinsi || typeof dataProvinsi === 'undefined' || dataProvinsi === '' || dataProvinsi === 'null') return alert('Provinsi (*) tidak boleh kosong');
        if (!dataKabupaten || typeof dataKabupaten === 'undefined' || dataKabupaten === '' || dataKabupaten === 'null') return alert('Kabupaten (*) tidak boleh kosong');
        if (!dataKecamatan || typeof dataKecamatan === 'undefined' || dataKecamatan === '' || dataKecamatan === 'null') return alert('Kecamatan (*) tidak boleh kosong');
        if (!dataKelurahan || typeof dataKelurahan === 'undefined' || dataKelurahan === '' || dataKelurahan === 'null') return alert('Kelurahan (*) tidak boleh kosong');

        if (!fotoKartuKeluarga || typeof fotoKartuKeluarga === 'undefined' || fotoKartuKeluarga === '' || fotoKartuKeluarga === 'null') return alert('Foto Kartu Keluarga (*) tidak boleh kosong');
        if (!nomorKartuKeluarga || typeof nomorKartuKeluarga === 'undefined' || nomorKartuKeluarga ==='' || nomorKartuKeluarga ==='null') return alert('Nomor Kartu Keluarga (*) tidak boleh kosong');

        if (!fullName || typeof fullName === 'undefined' || fullName === '' || fullName === 'null') return alert('Nama Lengkap (*) tidak boleh kosong');
        if (!namaAyah || typeof namaAyah === 'undefined' || namaAyah ==='' || namaAyah === 'null') return alert('Nama Ayah (*) tidak boleh kosong');
        if (!namaGadisIbu || typeof namaGadisIbu === 'undefined' || namaGadisIbu ==='' || namaGadisIbu === 'null') return alert('Nama Gadis Ibu Kandung (*) tidak boleh kosong');
        if (!noTelfon || typeof noTelfon === 'undefined' || noTelfon ==='' || noTelfon === 'null') return alert('No. Telp/HP Nasabah (*) tidak boleh kosong');
        if (!valueJumlahAnak || typeof valueJumlahAnak === 'undefined' || valueJumlahAnak ==='' || valueJumlahAnak === 'null') return alert('Jumlah Anak (*) tidak boleh kosong');
        if (!valueJumlahTanggungan || typeof valueJumlahTanggungan === 'undefined' || valueJumlahTanggungan ==='' || valueJumlahTanggungan === 'null') return alert('Jumlah Tanggungan (*) tidak boleh kosong');
        if (!valueStatusRumahTinggal || typeof valueStatusRumahTinggal === 'undefined' || valueStatusRumahTinggal ==='' || valueStatusRumahTinggal === 'null') return alert('Status Rumah Tinggal (*) tidak boleh kosong');
        if (!lamaTinggal || typeof lamaTinggal === 'undefined' || lamaTinggal ==='' || lamaTinggal === 'null') return alert('Lama Tinggal (Dalam Tahun) (*) tidak boleh kosong');
        if (!valueReligion || typeof valueReligion === 'undefined' || valueReligion ==='' || valueReligion === 'null') return alert('Agama (*) tidak boleh kosong');

        if (valueStatusPerkawinan === "1") {
            if (!namaSuami || typeof namaSuami === 'undefined' || namaSuami === '' || namaSuami === 'null') return alert('Nama Suami (*) tidak boleh kosong');
            if (!usahaPekerjaanSuami || typeof usahaPekerjaanSuami === 'undefined' || usahaPekerjaanSuami === '' || usahaPekerjaanSuami === 'null') return alert('Usaha/Pekerjaan Suami (*) tidak boleh kosong');
            if (!fotoKartuIdentitasSuami || typeof fotoKartuIdentitasSuami === 'undefined' || fotoKartuIdentitasSuami === 'null' || fotoKartuIdentitasSuami === 'null') return alert('Foto Kartu Identitas Suami (*) tidak boleh kosong');
        }

        if (!valueStatusHubunganKeluarga || typeof valueStatusHubunganKeluarga === 'undefined' || valueStatusHubunganKeluarga === '' || valueStatusHubunganKeluarga === 'null') return alert('Status Hubungan Keluarga (*) tidak boleh kosong');
        if (!namaPenjamin || typeof namaPenjamin === 'undefined' || namaPenjamin === '' || namaPenjamin === 'null') return alert('Nama Penjamin (*) tidak boleh kosong');
        if (!fotoDataPenjamin || typeof fotoDataPenjamin === 'undefined' || fotoDataPenjamin === '' || fotoDataPenjamin === 'null') return alert('Foto Kartu Identitas Penjamin (*) tidak boleh kosong');

        if (submmitted) return true;

        setSubmmitted(true);

        await doSubmitDataIdentitasDiri('submit');
        await doSubmitKK('submit');
        await doSubmitDataDiriPribadi('submit');
        await doSubmitDataSuami('submit');
        await doSubmitDataPenjamin('submit');

        const find = 'SELECT * FROM Table_UK_Master WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind > 0) {
                        setSubmmitted(false);
                        alert('Berhasil');
                        navigation.goBack();
                        return;
                    }

                    query = 'INSERT INTO Table_UK_Master (namaNasabah, status, idSosialisasiDatabase) values ("' + namaNasabah + '", "1", "' + id + '")';

                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update error:', error.message);
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
                })
            }
        );
    }

    const takePicture = async (type) => {
        try {
            setLoading(true)
            SetButtonCam(true)
            const options = { quality: 0.5, base64: true };
            const data = await camera.current.takePictureAsync(options)

            if (type === "dataPenjamin") {
                AsyncStorage.setItem(key_dataPenjamin, 'data:image/jpeg;base64,' + data.base64);
                setFotoDataPenjamin(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }else if (type === "dataSuami") {
                if (!statusSuami) {
                    AsyncStorage.setItem(key_dataPenjamin, 'data:image/jpeg;base64,' + data.base64);
                    setFotoDataPenjamin(data.uri);
                }

                AsyncStorage.setItem(key_dataSuami, 'data:image/jpeg;base64,' + data.base64);
                setFotoKartuIdentitasSuami(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }else if (type === "kartuKeluarga") {
                AsyncStorage.setItem(key_kartuKeluarga, 'data:image/jpeg;base64,' + data.base64);
                setFotoKartuKeluarga(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }else if (type === "keteranganDomisili") {
                AsyncStorage.setItem(key_keteranganDomisili, 'data:image/jpeg;base64,' + data.base64);
                setFotoSuratKeteranganDomisili(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }else if (type === "kartuIdentitas") {
                AsyncStorage.setItem(key_kartuIdentitas, 'data:image/jpeg;base64,' + data.base64);
                setFotoKartuIdentitas(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }
        } catch (error) {}
    };

    const submitHandler = () => null;

    const renderPickerKabupaten = () => {
        return [...new Map(dataWilayahMobile.map(item => [item['Nama_KabKot'], item])).values()].filter(data => data.ID_Provinsi === dataProvinsi).map((x, i) => <Picker.Item key={i} label={x.Nama_KabKot} value={x.ID_Kabkot} />);
    }

    const renderPickerKecamatan = () => {
        return [...new Map(dataWilayahMobile.map(item => [item['Nama_KabKot'], item])).values()].filter(data => data.ID_Kabkot === dataKabupaten).map((x, i) => <Picker.Item key={i} label={x.Nama_Kecamatan} value={x.ID_Kecamatan} />);
    }

    const renderPickerKelurahan = () => {
        return dataWilayahMobile.filter(data => data.ID_Kecamatan === dataKecamatan).map((x, i) => <Picker.Item key={i} label={x.Nama_KelurahanDesa} value={x.ID_KelDes} />);
    }

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>INISIASI</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Form Uji Kelayakan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupName}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{namaNasabah}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{currentDate}</Text>
                    {/* <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{id}</Text> */}
                </ImageBackground>
            </View>

            {cameraShow === 1 ? (
                <View style={{flex: 1, marginTop: 20, borderRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF', marginBottom: 20}}>
                    {fotokartuIdentitas === undefined ? (
                        <Camera 
                            ref={camera}
                            style={styles.preview}
                            type={Camera.Constants.Type.back}
                            // flashMode={Camera.Constants.FlashMode.on}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel'
                            }}
                        >
                            {loading &&
                                <View style={styles.loading}>
                                    <ActivityIndicator size="large" color="#737A82" />
                                </View>
                            }
                            <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', top: 0 }}>
                                <TouchableOpacity 
                                    style={{
                                        flex: 0,
                                        backgroundColor: '#EB3C27',
                                        borderRadius: 5,
                                        padding: 5,
                                        paddingHorizontal: 5,
                                        alignSelf: 'center',
                                        margin: 20,
                                    }} 
                                    onPress={() => setCameraShow(0)
                                }>
                                    <Text style={{ fontSize: 14, color: '#FFF' }}> Batal </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                                <TouchableOpacity 
                                    disabled={ buttonCam }
                                    style={{
                                        flex: 0,
                                        backgroundColor: buttonCam === true ? '#737A82' : '#FFF',
                                        borderRadius: 5,
                                        padding: 15,
                                        paddingHorizontal: 20,
                                        alignSelf: 'center',
                                        margin: 20,
                                    }} 
                                    onPress={() => takePicture("kartuIdentitas")
                                }>
                                    <Text style={{ fontSize: 14 }}> Ambil Foto Kartu Identitas </Text>
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: fotokartuIdentitas }} style={styles.previewPhoto}/>
                            <View style={{ 
                                position: 'absolute', 
                                bottom: 35, 
                                left: 30, 
                                backgroundColor: 'white',
                                borderRadius: 10
                            }}>
                                <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoKartuIdentitas(undefined)} >Batal</Text>
                            </View>
                            <View style={{ 
                                position: 'absolute', 
                                bottom: 35, 
                                right: 30, 
                                backgroundColor: 'white',
                                borderRadius: 10
                            }}>
                                <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setCameraShow(0)} >Simpan</Text>
                            </View>
                            {/* <Text style={styles.cancel} onPress={() => setFotoDataPenjamin(null)} >Cancel</Text> */}
                            {/* <Text style={styles.next} >Simpan Foto KTP</Text> */}
                        </View>
                    )}
                </View>
            ) : cameraShow === 2 ? (
                    <View style={{flex: 1, marginTop: 20, borderRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF', marginBottom: 20}}>
                        {fotoSuratKeteranganDomisili === undefined ? (
                            <Camera 
                                ref={camera}
                                style={styles.preview}
                                type={Camera.Constants.Type.back}
                                // flashMode={Camera.Constants.FlashMode.on}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message: 'We need your permission to use your camera',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel'
                                }}
                            >
                                {loading &&
                                    <View style={styles.loading}>
                                        <ActivityIndicator size="large" color="#737A82" />
                                    </View>
                                }

                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', top: 0 }}>
                                    <TouchableOpacity 
                                        style={{
                                            flex: 0,
                                            backgroundColor: '#EB3C27',
                                            borderRadius: 5,
                                            padding: 5,
                                            paddingHorizontal: 5,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }} 
                                        onPress={() => setCameraShow(0)
                                    }>
                                        <Text style={{ fontSize: 14, color: '#FFF' }}> Batal </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                                    <TouchableOpacity
                                        disabled={ buttonCam }
                                        style={{
                                            flex: 0,
                                            backgroundColor: buttonCam === true ? '#737A82' : '#FFF',
                                            borderRadius: 5,
                                            padding: 15,
                                            paddingHorizontal: 20,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }} 
                                        onPress={() => takePicture("keteranganDomisili")}
                                    >
                                        <Text style={{ fontSize: 14 }}> Ambil Foto Surat Keterangan Domisili </Text>
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: fotoSuratKeteranganDomisili }} style={styles.previewPhoto}/>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    left: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoSuratKeteranganDomisili(undefined)} >Batal</Text>
                                </View>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    right: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setCameraShow(0)} >Simpan</Text>
                                </View>
                                {/* <Text style={styles.cancel} onPress={() => setFotoDataPenjamin(null)} >Cancel</Text> */}
                                {/* <Text style={styles.next} >Simpan Foto KTP</Text> */}
                            </View>
                        )}
                    </View>
            ) : cameraShow === 3 ? (
                    <View style={{flex: 1, marginTop: 20, borderRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF', marginBottom: 20}}>
                        {fotoKartuKeluarga === undefined ? (
                            <Camera 
                                ref={camera}
                                style={styles.preview}
                                type={Camera.Constants.Type.back}
                                // flashMode={Camera.Constants.FlashMode.on}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message: 'We need your permission to use your camera',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel'
                                }}
                            >

                                {loading &&
                                    <View style={styles.loading}>
                                        <ActivityIndicator size="large" color="#737A82" />
                                    </View>
                                }

                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', top: 0 }}>
                                    <TouchableOpacity 
                                        style={{
                                            flex: 0,
                                            backgroundColor: '#EB3C27',
                                            borderRadius: 5,
                                            padding: 5,
                                            paddingHorizontal: 5,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }} 
                                        onPress={() => setCameraShow(0)
                                    }>
                                        <Text style={{ fontSize: 14, color: '#FFF' }}> Batal </Text>
                                    </TouchableOpacity>
                                </View>
                            
                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                                    <TouchableOpacity 
                                        disabled={ buttonCam }
                                        style={{
                                            flex: 0,
                                            backgroundColor: buttonCam === true ? '#737A82' : '#FFF',
                                            borderRadius: 5,
                                            padding: 15,
                                            paddingHorizontal: 20,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }} 
                                        onPress={() => takePicture("kartuKeluarga")}
                                    >
                                        <Text style={{ fontSize: 14 }}> Ambil Foto Kartu Keluarga </Text>
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: fotoKartuKeluarga }} style={styles.previewPhoto}/>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    left: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoKartuKeluarga(undefined)} >Batal</Text>
                                </View>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    right: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setCameraShow(0)} >Simpan</Text>
                                </View>
                                {/* <Text style={styles.cancel} onPress={() => setFotoDataPenjamin(null)} >Cancel</Text> */}
                                {/* <Text style={styles.next} >Simpan Foto KTP</Text> */}
                            </View>
                        )}
                    </View>
            ) : cameraShow === 4 ? (
                    <View style={{flex: 1, marginTop: 20, borderRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF', marginBottom: 20}}>
                        {fotoKartuIdentitasSuami === undefined ? (
                            <Camera 
                                ref={camera}
                                style={styles.preview}
                                type={Camera.Constants.Type.back}
                                // flashMode={Camera.Constants.FlashMode.on}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message: 'We need your permission to use your camera',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel'
                                }}
                            >

                                {loading &&
                                    <View style={styles.loading}>
                                        <ActivityIndicator size="large" color="#737A82" />
                                    </View>
                                }

                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', top: 0 }}>
                                    <TouchableOpacity 
                                        style={{
                                            flex: 0,
                                            backgroundColor: '#EB3C27',
                                            borderRadius: 5,
                                            padding: 5,
                                            paddingHorizontal: 5,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }} 
                                        onPress={() => setCameraShow(0)
                                    }>
                                        <Text style={{ fontSize: 14, color: '#FFF' }}> Batal </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                                    <TouchableOpacity
                                        disabled={ buttonCam }
                                        style={{
                                            flex: 0,
                                            backgroundColor: buttonCam === true ? '#737A82' : '#FFF',
                                            borderRadius: 5,
                                            padding: 15,
                                            paddingHorizontal: 20,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }}
                                        onPress={() => takePicture("dataSuami")}
                                    >
                                        <Text style={{ fontSize: 14 }}> Ambil Foto Kartu Identitas Suami </Text>
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: fotoKartuIdentitasSuami }} style={styles.previewPhoto}/>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    left: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoKartuIdentitasSuami(undefined)} >Batal</Text>
                                </View>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    right: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setCameraShow(0)} >Simpan</Text>
                                </View>
                                {/* <Text style={styles.cancel} onPress={() => setFotoDataPenjamin(null)} >Cancel</Text> */}
                                {/* <Text style={styles.next} >Simpan Foto KTP</Text> */}
                            </View>
                        )}
                    </View>
            ) : cameraShow === 5 ? (
                    <View style={{flex: 1, marginTop: 20, borderRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF', marginBottom: 20}}>
                        {fotoDataPenjamin === undefined ? (
                            <Camera 
                                ref={camera}
                                style={styles.preview} 
                                type={Camera.Constants.Type.back}
                                // flashMode={Camera.Constants.FlashMode.on}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message: 'We need your permission to use your camera',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel'
                                }}
                            >

                                {loading &&
                                    <View style={styles.loading}>
                                        <ActivityIndicator size="large" color="#737A82" />
                                    </View>
                                }

                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', top: 0 }}>
                                    <TouchableOpacity 
                                        style={{
                                            flex: 0,
                                            backgroundColor: '#EB3C27',
                                            borderRadius: 5,
                                            padding: 5,
                                            paddingHorizontal: 5,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }} 
                                        onPress={() => setCameraShow(0)
                                    }>
                                        <Text style={{ fontSize: 14, color: '#FFF' }}> Batal </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                                    <TouchableOpacity
                                        disabled={ buttonCam }
                                        style={{
                                            flex: 0,
                                            backgroundColor: buttonCam === true ? '#737A82' : '#FFF',
                                            borderRadius: 5,
                                            padding: 15,
                                            paddingHorizontal: 20,
                                            alignSelf: 'center',
                                            margin: 20,
                                        }}
                                        onPress={() => takePicture("dataPenjamin")}
                                    >
                                        <Text style={{ fontSize: 14 }}> Ambil Foto Data Penjamin </Text>
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: fotoDataPenjamin }} style={styles.previewPhoto}/>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    left: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoDataPenjamin(undefined)} >Batal</Text>
                                </View>
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 35, 
                                    right: 30, 
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setCameraShow(0)} >Simpan</Text>
                                </View>
                                {/* <Text style={styles.cancel} onPress={() => setFotoDataPenjamin(null)} >Cancel</Text> */}
                                {/* <Text style={styles.next} >Simpan Foto KTP</Text> */}
                            </View>
                        )}
                    </View>
            ) : (
                <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                    <Text style={{fontSize: 25, fontWeight: 'bold', margin: 20}}>Form Data Diri Pribadi</Text>
                    <ScrollView style={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>

                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1}}>Data Identitas Diri</Text>
                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Identitas (*)</Text>
                            
                            <TouchableOpacity onPress={() => setCameraShow(1)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 2, borderRadius: 10}}>
                                    {fotokartuIdentitas === undefined ? (
                                        <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                            <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                        </View>
                                    ) : (
                                        <Image source={{ uri: fotokartuIdentitas }} style={styles.thumbnailPhoto}/>
                                    )}
                                </View>
                            </TouchableOpacity>

                            <View style={{marginLeft: 20}}>
                                <Text style={{fontSize: 12, color: '#EB3C27', fontStyle: 'italic'}}>*Gunakan latar belakang Polos</Text>
                            </View>
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jenis Kartu Identitas (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={valueJenisKartuIdentitas}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setValueJenisKartuIdentitas(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {itemsJenisKartuIdentitas.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                                </Picker>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nomor Identitas (*)</Text>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex:1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                    <View style={{flex: 1}}>
                                        <TextInput value={nomorIdentitas} keyboardType='numeric' onChangeText={(text) => setNomorIdentitas(text)} placeholder="Masukkan Nomor Identitas" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                    </View>
                                    <View>
                                        <FontAwesome5 name={'id-badge'} size={18} />
                                    </View>
                                </View>
                                {valueJenisKartuIdentitas === '1' && (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => fetchCheckNIK ? null : checkNIK()}
                                            style={{ backgroundColor: fetchCheckNIK ? 'gray' : '#003049', borderRadius: 10, borderWidth: 1, padding: 8, alignContent: 'center', marginLeft: 8 }}
                                        >
                                            <Text style={{ color: 'white' }}>{fetchCheckNIK ? 'Loading...' : 'Cek Data'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            {valueJenisKartuIdentitas === '1' && valueNomorIdentitas === '1' && <Text style={{ color: '#3CB371', fontWeight: 'bold', marginTop: 6 }}>* Nomor Identitas KTP Terdaftar di dukcapil</Text>}
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Lengkap (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput 
                                        value={namaCalonNasabah} 
                                        onChangeText={(text) => {
                                            setFullName(replaceSpecialChar(text));
                                            setNamaCalonNasabah(replaceSpecialChar(text));
                                        }}
                                        placeholder="Masukkan Nama Lengkap" 
                                        style={{ fontSize: 15, color: "#545454", height: 38 }} 
                                    />
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-badge'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Tempat Lahir (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={tempatLahir} onChangeText={(text) => setTempatLahir(text)} placeholder="Masukkan Tempat Lahir" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-badge'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Tanggal Lahir (*)</Text>
                            <TouchableOpacity onPress={() => setShowCalendar(true)} style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={tanggalLahir} placeholder="Pilih tanggal lahir" editable={false} style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ marginHorizontal: 8 }}>{moment().diff(moment(moment(tanggalLahir).format("DD-MM-YYYY"), "DD-MM-YYYY"), 'years') || '0'} tahun</Text>
                                    <FontAwesome5 name={'id-badge'} size={18} />
                                </View>
                            </TouchableOpacity>
                            <Text style={{fontSize: 12, color: '#EB3C27', fontStyle: 'italic'}}>* Usia maximum {MIN_TANGGAL_LAHIR + 1}-{MAX_TANGGAL_LAHIR - 1} tahun</Text>
                            {showCalendar && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={dateLahirHandler}
                                    maximumDate={new Date()}
                                />
                            )}
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Status Perkawinan (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={valueStatusPerkawinan}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setValueStatusPerkawinan(itemValue);
                                    }}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {itemsStatusPerkawinan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                                </Picker>
                            </View>
                        </View>

                        <View style={{margin: 20, marginBottom: 4}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Alamat Identitas (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={alamatIdentitas} onChangeText={(text) => setAlamatIdentitas(text)} placeholder="Masukkan Alamat Identitas" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 18}}>
                            <Checkbox
                                status={addressDomisiliLikeIdentitas ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setAddressDomisiliLikeIdentitas(!addressDomisiliLikeIdentitas);
                                }}
                            />
                            <Text style={{flex: 1, fontSize: 15, fontWeight: 'bold'}}>Apakah alamat domisili sesuai dengan KTP</Text>
                        </View>
                        
                        {!addressDomisiliLikeIdentitas && (
                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Alamat Domisili (*)</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                    <View style={{flex: 1}}>
                                        <TextInput value={alamatDomisili} onChangeText={(text) => setAlamatDomisili(text)} placeholder="Masukkan Alamat Domisili" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                    </View>
                                    <View>
                                        <FontAwesome5 name={'address-card'} size={18} />
                                    </View>
                                </View>
                            </View>
                        )}

                        {!addressDomisiliLikeIdentitas && (
                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Surat Keterangan Domisili (*)</Text>
                                
                                <TouchableOpacity onPress={() => setCameraShow(2)}>
                                    <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 2, borderRadius: 10}}>
                                        {fotoSuratKeteranganDomisili === undefined ? (
                                            <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                                <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                            </View>
                                        ) : (
                                            <Image source={{ uri: fotoSuratKeteranganDomisili }} style={styles.thumbnailPhoto}/>
                                        )}
                                    </View>
                                </TouchableOpacity>

                                <View style={{marginLeft: 20}}>
                                    <Text style={{fontSize: 12, color: '#EB3C27', fontStyle: 'italic'}}>*Gunakan latar belakang Polos</Text>
                                </View>
                            </View>
                        )}

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Provinsi (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={dataProvinsi}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setDataProvinsi(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {[...new Map(dataWilayahMobile.map(item => [item['Nama_Provinsi'], item])).values()].map((x, i) => <Picker.Item key={i} label={x.Nama_Provinsi} value={x.ID_Provinsi} />)}
                                </Picker>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Kabupaten (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={dataKabupaten}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setDataKabupaten(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {renderPickerKabupaten()}
                                </Picker>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Kecamatan (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={dataKecamatan}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setDataKecamatan(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {renderPickerKecamatan()}
                                </Picker>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Kelurahan (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={dataKelurahan}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setDataKelurahan(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {renderPickerKelurahan()}
                                </Picker>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Long, Lat (*)</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 6, padding: 12 }}>
                                <Text style={{ flex: 1 }}>{location?.coords?.longitude ?? '0'}, {location?.coords?.latitude ?? '0'}</Text>
                                <FontAwesome5 name={'sync'} size={18} onPress={() => onRefreshLocation()} />
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => doSubmitDataIdentitasDiri()}
                            />
                        </View>

                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1}}>Kartu Keluarga</Text>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Keluarga (*)</Text>
                            
                            <TouchableOpacity onPress={() => setCameraShow(3)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 2, borderRadius: 10}}>
                                    {fotoKartuKeluarga === undefined ? (
                                        <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                            <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                        </View>
                                    ) : (
                                        <Image source={{ uri: fotoKartuKeluarga }} style={styles.thumbnailPhoto}/>
                                    )}
                                </View>
                            </TouchableOpacity>

                            <View style={{marginLeft: 20}}>
                                <Text style={{fontSize: 12, color: '#EB3C27', fontStyle: 'italic'}}>*Gunakan latar belakang Polos</Text>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nomor Kartu Keluarga (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={nomorKartuKeluarga} keyboardType='numeric' onChangeText={(text) => setNomorKartuKeluarga(text)} placeholder="Masukkan Nomor KK" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => doSubmitKK()}
                            />
                        </View>


                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1}}>Data Diri Pribadi</Text>
                        
                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Lengkap (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput
                                        value={fullName}
                                        onChangeText={(text) => {
                                            setFullName(replaceSpecialChar(text));
                                            setNamaCalonNasabah(replaceSpecialChar(text));
                                        }}
                                        placeholder="Masukkan Nama Lengkap" 
                                        style={{ fontSize: 15, color: "#545454", height: 38 }} 
                                    />
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Ayah (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={namaAyah} onChangeText={(text) => setNamaAyah(replaceSpecialChar(text))} placeholder="Masukkan Nama Lengkap Ayah" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Gadis Ibu Kandung (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={namaGadisIbu} onChangeText={(text) => setNamaGadisIbu(replaceSpecialChar(text))} placeholder="Masukkan Nama Lengkap Gadis Ibu Kandung" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>No. Telp/HP Nasabah (*)</Text>
                            <View style={{borderWidth: 1, padding: 5, borderRadius: 10, marginLeft: 2}}>
                                <TextInput value={noTelfon} onChangeText={(text) => setNoTelfon(text)} placeholder="08xxxxxxxxxx" keyboardType = "number-pad" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Agama (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={valueReligion}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setValueReligion(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {itemsReligion.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                                </Picker>
                            </View>
                        </View>

                        <View style={{marginHorizontal: 20, marginBottom: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jumlah Anak (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={valueJumlahAnak}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setValueJumlahAnak(itemValue)}
                                >
                                    {itemsJumlahAnak.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                                </Picker>
                            </View>
                        </View>

                        <View style={{marginHorizontal: 20, marginBottom: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jumlah Tanggungan (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={valueJumlahTanggungan}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setValueJumlahTanggungan(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {itemsJumlahTanggungan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                                </Picker>
                            </View>
                        </View>

                        <View style={{marginHorizontal: 20, marginBottom: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Status Rumah Tinggal (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                <Picker
                                    selectedValue={valueStatusRumahTinggal}
                                    style={{ height: 50, width: withTextInput }}
                                    onValueChange={(itemValue, itemIndex) => setValueStatusRumahTinggal(itemValue)}
                                >
                                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                    {itemsStatusRumahTinggal.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                                </Picker>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Lama Tinggal (Dalam Tahun) (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={lamaTinggal} onChangeText={(text) => setLamaTinggal(text)}  placeholder="Masukkan Periode Tinggal" keyboardType = "number-pad" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'chart-pie'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => doSubmitDataDiriPribadi()}
                            />
                        </View>

                    {["1"].includes(valueStatusPerkawinan) && (
                        <>
                            <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1}}>Data Suami</Text>
                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Suami (*)</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                    <View style={{flex: 1}}>
                                        <TextInput 
                                            value={namaSuami} 
                                            onChangeText={(text) => {
                                                if (!statusSuami) setNamaPenjamin(replaceSpecialChar(text));
                                                setNamaSuami(replaceSpecialChar(text));
                                            }} 
                                            placeholder="Masukkan Nama Suami" 
                                            style={{ fontSize: 15, color: "#545454", height: 38 }}
                                        />
                                    </View>
                                    <View>
                                        <FontAwesome5 name={'address-card'} size={18} />
                                    </View>
                                </View>
                            </View>

                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Usaha/Pekerjaan Suami (*)</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                    <View style={{flex: 1}}>
                                        <TextInput value={usahaPekerjaanSuami} onChangeText={(text) => setUsahaPekerjaanSuami(text)} placeholder="" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                    </View>
                                    <View />
                                </View>
                            </View>

                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jumlah Tenaga Kerja</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                    <View style={{flex: 1}}>
                                        <TextInput value={jumlahTenagaKerjaSuami} onChangeText={(text) => setJumlahTenagaKerjaSuami(text)} placeholder="1" keyboardType = "number-pad" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                    </View>
                                    <View />
                                </View>
                            </View>

                            <View style={{margin: 20, marginBottom: 4}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Identitas Suami (*)</Text>
                                
                                <TouchableOpacity onPress={() => setCameraShow(4)}>
                                    <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 2, borderRadius: 10}}>
                                        {fotoKartuIdentitasSuami === undefined ? (
                                            <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                                <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                            </View>
                                        ) : (
                                            <Image source={{ uri: fotoKartuIdentitasSuami }} style={styles.thumbnailPhoto}/>
                                        )}
                                    </View>
                                </TouchableOpacity>

                                <View style={{marginLeft: 20}}>
                                    <Text style={{fontSize: 12, color: '#EB3C27', fontStyle: 'italic'}}>*Gunakan latar belakang Polos</Text>
                                </View>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 18, marginBottom: 20}}>
                                <Checkbox
                                    status={statusSuami ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setStatusSuami(!statusSuami);
                                    }}
                                />
                                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Suami di luar kota / tidak di tempat</Text>
                            </View>

                            <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                                <Button
                                    title="Save Draft"
                                    buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                    titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                    onPress={() => doSubmitDataSuami()}
                                />
                            </View>
                        </>
                    )}

                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1, marginBottom: 20}}>Data Penjamin (1)</Text>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Status Hubungan Keluarga (*)</Text>
                            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                                {valueStatusHubunganKeluarga === '1' && !statusSuami ? (
                                    <Text style={{ padding: 16 }}>SUAMI</Text>
                                ) : (
                                    <Picker
                                        selectedValue={valueStatusHubunganKeluarga}
                                        style={{ height: 50, width: withTextInput }}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (__DEV__) console.log('Status Hubungan Keluarga:', itemValue);

                                            if (itemValue === '2') {
                                                setNamaPenjamin(namaAyah);
                                                setValueStatusHubunganKeluarga(itemValue);
                                                return;
                                            }
                                            if (itemValue === '3') {
                                                setNamaPenjamin(namaGadisIbu);
                                                setValueStatusHubunganKeluarga(itemValue);
                                                return;
                                            }
                                            
                                            setNamaPenjamin('');
                                            setValueStatusHubunganKeluarga(itemValue);
                                        }}
                                    >
                                        <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                                        {itemsStatusHubunganKeluarga.filter((x) => x.value !== '1').map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                                    </Picker>
                                )}
                            </View>

                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Penjamin (*)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 2, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={namaPenjamin} onChangeText={(text) => setNamaPenjamin(replaceSpecialChar(text))} placeholder="Masukkan Nama Penjamin" style={{ fontSize: 15, color: "#545454", height: 38 }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Identitas Penjamin (*)</Text>

                            <TouchableOpacity onPress={() => setCameraShow(5)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 2, borderRadius: 10}}>
                                    {fotoDataPenjamin === undefined ? (
                                        <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                            <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                        </View>
                                    ) : (
                                        <Image source={{ uri: fotoDataPenjamin }} style={styles.thumbnailPhoto}/>
                                    )}
                                </View>
                            </TouchableOpacity>
                            
                            <View style={{marginLeft: 20}}>
                                <Text style={{fontSize: 12, color: '#EB3C27', fontStyle: 'italic'}}>*Gunakan latar belakang Polos</Text>
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => doSubmitDataPenjamin()}
                            />
                        </View>
                        
                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Pernyataan Calon Nasabah</Text>
                            <View style={
                                {
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginBottom: 20,
                                    width: dimension.width - (32 * 3),
                                    borderWidth: 1, 
                                    borderRadius: 10,
                                    paddingHorizontal: 4,
                                    paddingVertical: 12
                                }
                            }>
                                <Checkbox
                                    status={statusAgreement ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setStatusAgreement(!statusAgreement);
                                    }}
                                />
                                <Text style={{flex: 1, fontSize: 12}}>Informasi data pribadi yang saya kemukakan disini adalah benar adanya dan telah sesuai, selanjutnya saya memberikan persetujuan bagi PNM untuk menggunakan dan memberikan data tersebut untuk keperluan apapun bagi pihak manapun yang berdasarkan pertimbangan PNM perlu dan penting untuk dilakukan sesuai dengan ketentuan hukum yang berlaku.</Text>
                            </View>
                        </View>

                        <View style={{alignItems: 'center', marginVertical: 20}}>
                            <Button
                                title="SUBMIT"
                                onPress={() => doSubmitSave()}
                                buttonStyle={{backgroundColor: statusAgreement ? '#EB3C27' : 'gray', width: dimension.width/2}}
                                titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                            />
                        </View>

                    </ScrollView>

                </View>
            )}
        </View>
    )
}

export default DataDiri

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 20,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    cancel: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: 'transparent',
        color: '#FFF',
        fontWeight: '600',
        fontSize: 17,
    },
    next: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: 'transparent',
        color: '#FFF',
        fontWeight: '600',
        fontSize: 17,
    },
    previewPhoto: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 20
    },
    thumbnailPhoto: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 5,
        borderRadius: 10
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdownPlaceholderStyle: {
        fontWeight: 'bold',
        fontSize: 17,
        margin: 10, 
        color: '#545851'
    },
    dropdownContainerStyle: {
        marginLeft: 2,
        marginTop: 5,
        borderColor: "#003049",
        width: dimension.width / 1.5,
        borderWidth: 2
    },
    dropdownStyle: {
        marginLeft: 2,
        borderColor: "black",
        width: dimension.width / 1.5, 
        borderRadius: 10,
        borderWidth: 1
    },
    dropdownLabelStyle: {
        fontWeight: 'bold',
        fontSize: 17,
        margin: 10,
        color: '#545851'
    }
})
