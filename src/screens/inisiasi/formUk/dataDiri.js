import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet, ImageBackground, TextInput, ViewPropTypes, Image, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker'
import PhoneInput from 'react-native-phone-input'
import { Camera } from 'expo-camera'
import { Button } from 'react-native-elements'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { showMessage } from "react-native-flash-message"

import db from '../../../database/Database'

const dimension = Dimensions.get('screen')

const DataDiri = ({route}) => {

    const { groupName, namaNasabah } = route.params

    const navigation = useNavigation()
    const phoneRef = useRef(undefined)
    const camera = useRef(null)
    const [loading, setLoading] = useState(false)
    let [date, setDate] = useState(new Date())

    //STATE DATA DIRI
    let [fotokartuIdentitas, setFotoKartuIdentitas] = useState()
    let [jenisKartuIdentitas, setJenisKartuIdentitas] = useState()
    let [nomorIdentitas, setNomorIdentitas] = useState()
    let [namaCalonNasabah, setNamaCalonNasabah] = useState()
    let [tempatLahir, setTempatLahir] = useState()
    let [tanggalLahir, setTanggalLahir] = useState()
    let [statusPerkawinan, setStatusPerkawinan] = useState()
    let [alamatIdentitas, setAlamatIdentitas] = useState()
    let [alamatDomisili, setAlamatDomisili] = useState()
    let [fotoSuratKeteranganDomisili, setFotoSuratKeteranganDomisili] = useState()
    let [dataProvinsi, setDataProvinsi] = useState()
    let [dataKabupaten, setDataKabupaten] = useState()
    let [dataKecamatan, setDataKecamatan] = useState()
    let [dataKelurahan, setDataKelurahan] = useState()

    //STATE DATA KARTU KELUARGA
    let [fotoKartuKeluarga, setFotoKartuKeluarga] = useState()
    let [nomorKartuKeluarga, setNomorKartuKeluarga] = useState()

    //STATE DATA DIRI PRIBADI
    let [fullName, setFullName] = useState()
    let [namaAyah, setNamaAyah] = useState()
    let [noTelfon, setNoTelfon] = useState()
    let [jumlahAnak, setJuma] = useState()
    let [jumlahTanggungan, setJumlahTanggungnan] = useState()
    let [statusRumahTinggal, setStatusRumahTinggal] = useState()
    let [lamaTinggal, setLamaTinggal] = useState()

    //STATE DATA SUAMI
    let [namaSuami, setNamaSuami] = useState()
    let [fotoKartuIdentitasSuami, setFotoKartuIdentitasSuami] = useState()
    let [statusSuami, setStatusSuami] = useState()

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

    const [itemJumlahAnak, setItemJumlahAnak] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'},
    ])
    const [itemJumlahTanggungan, setItemJumlahTanggungan] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'},
    ])

    useEffect(() => {

        (async () => {

            let GetInisiasi = `SELECT * FROM Table_UK_DataDiri WHERE nama_lengkap = '` + namaNasabah + `';`
            const getDataDraft = () => {
                db.transaction(
                    tx => {
                        tx.executeSql(GetInisiasi, [], (tx, results) => {
                            let dataLength = results.rows.length
                            // console.log(dataLength)
                            if(dataLength > 0) {
                                let data = results.rows.item(0)
                                data.nomor_Identitas !== "undefined" ? console.log("this") : console.log("that")
                                data.foto_Kartu_Identitas !== "undefined" ? setFotoKartuIdentitas(data.foto_Kartu_Identitas) : setFotoKartuIdentitas()
                                data.jenis_Kartu_Identitas !== "undefined" ? setJenisKartuIdentitas(data.jenis_Kartu_Identitas) : setJenisKartuIdentitas()
                                data.nomor_Identitas !== "undefined" ? setNomorIdentitas(data.nomor_Identitas) : setNomorIdentitas()
                                data.nama_lengkap !== "undefined" ? setNamaCalonNasabah(data.nama_lengkap) : setNamaCalonNasabah()
                                data.tempat_lahir !== "undefined" ? setTempatLahir(data.tempat_lahir) : setTempatLahir()
                                data.tanggal_Lahir !== "undefined" ? setTanggalLahir(data.tanggal_Lahir) : setTanggalLahir()
                                data.status_Perkawinan !== "undefined" ? setStatusPerkawinan(data.status_Perkawinan) : setStatusPerkawinan()
                                data.alamat_Identitas !== "undefined" ? setAlamatIdentitas(data.alamat_Identitas) : setAlamatIdentitas()
                                data.alamat_Domisili !== "undefined" ? setAlamatDomisili(data.alamat_Domisili) : setAlamatIdentitas()
                                data.foto_Surat_Keterangan_Domisili !== "undefined" ? setFotoSuratKeteranganDomisili(data.foto_Surat_Keterangan_Domisili) : setFotoSuratKeteranganDomisili()
                                data.provinsi !== "undefined" ? setDataProvinsi(data.provinsi) : setDataProvinsi()
                                data.kabupaten !== "undefined" ? setDataKabupaten(data.kabupaten) : setDataKabupaten()
                                data.kecamatan !== "undefined" ? setDataKecamatan(data.kecamatan) : setDataKecamatan()
                                data.kelurahan !== "undefined" ? setDataKelurahan(data.kelurahan) : setDataKelurahan()
                            }
                        }, function(error){
                            console.log("error")
                            console.log('Transaction ERROR: ' + error.message);
                        })
                    }
                )
            }
            getDataDraft()

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

            setItems(arrayIdentity)
            setItemsMarriege(arrayMarriage)
            
          })();
    }, [])

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

    const dateLahirHandler = (event, date) => {
        let dateValue = moment(date).format('YYYY-MM-DD')
        setShowCalendar(false)
        setTanggalLahir(dateValue)
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

    const SubmitDataDiri = () => {
        // console.log("this")
        try{
            // console.log("try")
            let getUkList = `SELECT * FROM Table_UK_DataDiri WHERE nama_lengkap ='` + namaNasabah + `'`
            let insertUkList = `INSERT INTO Table_UK_DataDiri (
                foto_Kartu_Identitas,
                jenis_Kartu_Identitas,
                nomor_Identitas,
                nama_lengkap,
                tempat_lahir,
                tanggal_Lahir,
                status_Perkawinan,
                alamat_Identitas,
                alamat_Domisili,
                foto_Surat_Keterangan_Domisili,
                provinsi,
                kabupaten,
                kecamatan,
                kelurahan
            ) VALUES (
                '` + fotokartuIdentitas + `',
                '` + jenisKartuIdentitas + `',
                '` + nomorIdentitas + `',
                '` + namaCalonNasabah + `',
                '` + tempatLahir + `',
                '` + tanggalLahir + `',
                '` + statusPerkawinan + `',
                '` + alamatIdentitas + `',
                '` + alamatDomisili + `',
                '` + fotoSuratKeteranganDomisili + `',
                '` + dataProvinsi + `',
                '` + dataKabupaten + `',
                '` + dataKecamatan + `',
                '` + dataKelurahan + `'
            );`

            let UpdateUkList = `UPDATE Table_UK_DataDiri SET 
                foto_Kartu_Identitas = '` + fotokartuIdentitas + `',
                jenis_Kartu_Identitas = '` + jenisKartuIdentitas + `',
                nomor_Identitas = '` + nomorIdentitas + `',
                nama_lengkap = '` + namaCalonNasabah + `',
                tempat_lahir = '` + tempatLahir + `',
                tanggal_Lahir = '` + tanggalLahir + `',
                status_Perkawinan = '` + statusPerkawinan + `',
                alamat_Identitas = '` + alamatIdentitas + `',
                alamat_Domisili = '` + alamatDomisili + `',
                foto_Surat_Keterangan_Domisili = '` + fotoSuratKeteranganDomisili + `',
                provinsi = '` + dataProvinsi + `',
                kabupaten = '` + dataKabupaten + `',
                kecamatan = '` + dataKecamatan + `',
                kelurahan = '` + dataKelurahan + `' WHERE nama_lengkap = '` + namaNasabah + `'`

                console.log(getUkList)
                console.log(UpdateUkList)

            db.transaction(
                tx => {
                    tx.executeSql(getUkList, [], (tx, results) => {
                        let dataLength = results.rows.length

                        if(dataLength === 0) {
                            console.log("insert")
                            db.transaction(
                                tx => {
                                    tx.executeSql(insertUkList)
                                }, function(error) {
                                    console.log('Transaction ERROR: ' + error.message);
                                },function() {
                                    flashNotification("Sukses", "Simpan Data Draft Berhasil", "#ff6347", "#fff")
                                }
                            )
                        }else{
                            console.log("update")
                            db.transaction(
                                tx => {
                                    tx.executeSql(UpdateUkList)
                                }, function(error){
                                    console.log('Transaction ERROR: ' + error.message);
                                },function() {
                                    flashNotification("Sukses", "Update Data Draft Berhasil", "#ff6347", "#fff")
                                }
                            )
                        }
                    }, function(error){
                        console.log("error")
                        console.log('Transaction ERROR: ' + error.message);
                    })
                }
            )
        }catch(error){
            console.log("error")
            console.log('Transaction ERROR: ' + error.message);
        }
    }

    const takePicture = async (type) => {
        try {
            setLoading(true)
            SetButtonCam(true)
            const options = { quality: 0.5, base64: true };
            const data = await camera.current.takePictureAsync(options)

            console.log(data.uri, '<<<<<<<<<<<<<<<<<<<<<');

            if (type === "dataPenjamin") {
                setFotoDataPenjamin(data.uri)
                setLoading(false)
                SetButtonCam(false)
            }else if (type === "dataSuami") {
                setFotoKartuIdentitasSuami(data.uri)
                setLoading(false)
                SetButtonCam(false)
            }else if (type === "kartuKeluarga") {
                setFotoKartuKeluarga(data.uri)
                setLoading(false)
                SetButtonCam(false)
            }else if (type === "keteranganDomisili") {
                setFotoSuratKeteranganDomisili(data.uri)
                setLoading(false)
                SetButtonCam(false)
            }else if (type === "kartuIdentitas") {
                setFotoKartuIdentitas(data.uri)
                setLoading(false)
                SetButtonCam(false)
            }
        } catch (error) {
            console.log(error, "ERROR <<<<<<<<<<<<<")
        }
    };

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.replace('UjiKelayakan', {groupName: groupName})} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>UJI KELAYAKAN</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Form Uji Kelayakan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupName}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{namaNasabah}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{currentDate}</Text>
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
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Identitas</Text>
                            
                            <TouchableOpacity onPress={() => setCameraShow(1)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
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
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jenis Kartu Identitas</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={"Pilih Jenis Kartu Identitas"}
                                placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                dropDownContainerStyle={{marginLeft: 10, marginTop: 5, borderColor: "#003049", width: dimension.width/1.5, borderWidth: 2}}
                                style={{ marginLeft: 10, borderColor: "black", width: dimension.width/1.5, borderRadius: 10, borderWidth: 1 }}
                                labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                onChangeValue={() => JenisKartuIdentitas(value)}
                            />
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nomor Identitas</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={nomorIdentitas} keyboardType='numeric' onChangeText={(text) => setNomorIdentitas(text)} placeholder="Masukkan Nomor Identitas" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-badge'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Lengkap</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={namaCalonNasabah} onChangeText={(text) => setNamaCalonNasabah(text)} placeholder="Masukkan Nama Lengkap" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-badge'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Tempat Lahir</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={tempatLahir} onChangeText={(text) => setTempatLahir(text)} placeholder="Masukkan Tempat Lahir" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-badge'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Tanggal Lahir</Text>
                            <TouchableOpacity onPress={() => setShowCalendar(true)} style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={tanggalLahir} placeholder="Pilih tanggal lahir" editable={false} style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-badge'} size={18} />
                                </View>
                            </TouchableOpacity>
                            {showCalendar && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={dateLahirHandler}
                                />
                            )}
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Status Perkawinan</Text>
                            <DropDownPicker
                                open={open}
                                value={statusPerkawinan}
                                items={itemsMarrige}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={"Pilih Status"}
                                placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                dropDownContainerStyle={{marginLeft: 10, marginTop: 5, borderColor: "#003049", width: dimension.width/1.5, borderWidth: 2}}
                                style={{ marginLeft: 10, borderColor: "black", width: dimension.width/1.5, borderRadius: 10, borderWidth: 1 }}
                                labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                onChangeValue={() => MarriageStatus(value)}
                            />
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Alamat Identitas</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={alamatIdentitas} onChangeText={(text) => setAlamatIdentitas(text)} placeholder="Masukkan Alamat Identitas" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Alamat Domisili</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={alamatDomisili} onChangeText={(text) => setAlamatDomisili(text)} placeholder="Masukkan Alamat Domisili" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Surat Keterangan Domisili</Text>
                            
                            <TouchableOpacity onPress={() => setCameraShow(2)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
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

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Provinsi</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={dataProvinsi} onChangeText={(text) => setDataProvinsi(text)} placeholder="Masukkan Nama Provinsi" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'location-arrow'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Kabupaten</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={dataKabupaten} onChangeText={(text) => setDataKabupaten(text)} placeholder="Masukkan Nama Kabupaten" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'location-arrow'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Kecamatan</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={dataKecamatan} onChangeText={(text) => setDataKecamatan(text)} placeholder="Masukkan Nama Kecamatan" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'location-arrow'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Kelurahan</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={dataKelurahan} onChangeText={(text) => setDataKelurahan(text)} placeholder="Masukkan Nama Kelurahan" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'location-arrow'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => SubmitDataDiri()}
                            />
                        </View>

                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1}}>Kartu Keluarga</Text>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Keluarga</Text>
                            
                            <TouchableOpacity onPress={() => setCameraShow(3)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
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
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nomor Kartu Keluarga</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={nomorKartuKeluarga} onChangeText={(text) => setNomorKartuKeluarga(text)} placeholder="Masukkan Nomor KK" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'id-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                onPress={() => alert('Sukses')}
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => submitHandler()}
                            />
                        </View>


                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1}}>Data Diri Pribadi</Text>
                        
                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Lengkap</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={fullName} onChangeText={(text) => setFullName(text)} placeholder="Masukkan Nama Lengkap" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Ayah</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput value={namaAyah} onChangeText={(text) => setNamaAyah(text)} placeholder="Masukkan Nama Lengkap Ayah" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>No. Telp/HP Nasabah</Text>
                            <View style={{borderWidth: 1, padding: 5, borderRadius: 10, marginLeft: 10}}>
                                <PhoneInput
                                    style={styles.phoneInput} 
                                    ref={phoneRef}
                                    initialCountry={'id'}
                                    value={noTelfon}
                                    onChangePhoneNumber={setNoTelfon}
                                    allowZeroAfterCountryCode={false}
                                />
                            </View>
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jumlah Anak</Text>
                            <DropDownPicker
                                open={open}
                                value={jumlahAnak}
                                items={itemJumlahAnak}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={"Pilih Jumlah"}
                                placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                dropDownContainerStyle={{marginLeft: 10, marginTop: 5, borderColor: "#003049", width: dimension.width/1.5, borderWidth: 2}}
                                style={{ marginLeft: 10, borderColor: "black", width: dimension.width/1.5, borderRadius: 10, borderWidth: 1 }}
                                labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                onChangeValue={() => console.log('jumlahAnak')}
                            />
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jumlah Tanggungan</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={itemJumlahTanggungan}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={"Pilih Jumlah"}
                                placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                dropDownContainerStyle={{marginLeft: 10, marginTop: 5, borderColor: "#003049", width: dimension.width/1.5, borderWidth: 2}}
                                style={{ marginLeft: 10, borderColor: "black", width: dimension.width/1.5, borderRadius: 10, borderWidth: 1 }}
                                labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                onChangeValue={() => console.log('jumlahTanggungan')}
                            />
                        </View>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Status Rumah Tinggal</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={"Pilih Status"}
                                placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                dropDownContainerStyle={{marginLeft: 10, marginTop: 5, borderColor: "#003049", width: dimension.width/1.5, borderWidth: 2}}
                                style={{ marginLeft: 10, borderColor: "black", width: dimension.width/1.5, borderRadius: 10, borderWidth: 1 }}
                                labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                onChangeValue={() => sumberDataHandler(value)}
                            />
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Lama Tinggal (Dalam Tahun)</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput onChangeText={(text) => setNamanasabah(text)} placeholder="Masukkan Periode Tinggal" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'chart-pie'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                onPress={() => alert('Sukses')}
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => submitHandler()}
                            />
                        </View>

                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1}}>Data Suami</Text>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Suami</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput onChangeText={(text) => setNamanasabah(text)} placeholder="Masukkan Nama Suami" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Identitas Suami</Text>
                            
                            <TouchableOpacity onPress={() => setCameraShow(4)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
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

                        <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 30, marginBottom: 20}}>
                            <BouncyCheckbox 
                                size={20}
                                // isChecked={baru}
                                fillColor={'#003049'}
                                // disableBuiltInState
                                // onPress={() => pickerHandler(2)}
                            />
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>Suami di luar kota / tidak di tempat</Text>
                        </View>

                        <View style={{alignItems: 'flex-end', marginBottom: 20, marginHorizontal: 20}}>
                            <Button
                                title="Save Draft"
                                onPress={() => alert('Sukses')}
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => submitHandler()}
                            />
                        </View>


                    <Text style={{fontSize: 23, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, borderBottomWidth: 1, marginBottom: 20}}>Data Penjamin (1)</Text>

                        <View style={{marginHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Status Hubungan Keluarga</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={"Pilih Status"}
                                placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                dropDownContainerStyle={{marginLeft: 10, marginTop: 5, borderColor: "#003049", width: dimension.width/1.5, borderWidth: 2}}
                                style={{ marginLeft: 10, borderColor: "black", width: dimension.width/1.5, borderRadius: 10, borderWidth: 1 }}
                                labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                                onChangeValue={() => sumberDataHandler(value)}
                            />
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Penjamin</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                                <View style={{flex: 1}}>
                                    <TextInput onChangeText={(text) => setNamanasabah(text)} placeholder="Masukkan Nama Penjamin" style={{ fontSize: 15, color: "#545454" }}/>
                                </View>
                                <View>
                                    <FontAwesome5 name={'address-card'} size={18} />
                                </View>
                            </View>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Kartu Identitas Penjamin</Text>

                            <TouchableOpacity onPress={() => setCameraShow(5)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
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
                                onPress={() => alert('Sukses')}
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/3}}
                                titleStyle={{fontSize: 10, fontWeight: 'bold'}}
                                onPress={() => submitHandler()}
                            />
                        </View>

                        <View style={{alignItems: 'center', marginVertical: 20}}>
                            <Button
                                title="SIMPAN"
                                onPress={() => alert('Sukses')}
                                buttonStyle={{backgroundColor: '#EB3C27', width: dimension.width/2}}
                                titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                                // onPress={() => submitHandler()}
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
        // height: dimension.height,
        // width: dimension.width,
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
        // height: Dimensions.get('window').height,
        // width: Dimensions.get('window').width
    },
    thumbnailPhoto: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 5,
        borderRadius: 10
        // height: Dimensions.get('window').height,
        // width: Dimensions.get('window').width
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
})