import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import DropDownPicker from 'react-native-dropdown-picker'
import PhoneInput from 'react-native-phone-input'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from 'react-native-elements'
import { showMessage } from "react-native-flash-message"

import db from '../../database/Database';

const Sosialisasi = () => {

    const dimension = Dimensions.get('screen')
    const phoneRef = useRef(undefined)
    const navigation = useNavigation()

    moment.locale('id');
    var hariIni = moment().format('YYYY-MM-DD')

    let [show, setShow] = useState(false)
    let [showSos, setShowSos] = useState(false)
    let [tanggalInput, setTanggalInput] = useState(hariIni)
    let [tanggalSos, setTanggalSos] = useState(hariIni)
    let [date, setDate] = useState(new Date())
    let [dateSos, setDateSos] = useState(new Date())
    let [open, setOpen] = useState(false)
    let [value, setValue] = useState(null)
    let [nohp, setNohp] = useState()
    let [sisipan, setSisipan] = useState(false)
    let [baru, setBaru] = useState(true)
    let [statusNasabah, setStatusNasabah] = useState(2)
    
    let [lokasiSos, setLokasiSos] = useState()
    let [namaNasabah, setNamanasabah] = useState()
    let [sumberDana, setSumberDana] = useState()


    const [items, setItems] = useState([
        {label: 'Referral', value: '1'},
        {label: 'Aparat', value: '2'},
        {label: 'Mandiri', value: '3'},
        {label: 'Lainnya', value: '4'}
    ])

    const dateHandler = (event, date) => {
        let dateValue = moment(date).format('YYYY-MM-DD')
        console.log("ini biasa" + dateValue)
        setShow(false)
        setTanggalInput(dateValue)
    }

    useEffect(() => {
        console.log("this " + hariIni)
    })

    const dateSosHandler = (eventSos, dateSos) => {
        let dateValue = moment(dateSos).format('YYYY-MM-DD')
        console.log("ini sos" + dateValue)
        setShowSos(false)
        setTanggalSos(dateValue)
    }

    const pickerHandler = (type) => {
        if(type === 1) {
            setSisipan(true)
            setBaru(false)
        }else if (type === 2) {
            setBaru(true)
            setSisipan(false)
        }

        setStatusNasabah(type)
    }

    const sumberDataHandler = (text) => {
        setSumberDana(text)
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
        if(tanggalInput === null || tanggalInput === undefined) {
            flashNotification("Alert", "Silahkan pilih tanggal input", "#ff6347", "#fff")
        }else if(sumberDana === null || sumberDana === undefined) {
            flashNotification("Alert", "Silahkan pilih sumber informasi", "#ff6347", "#fff")
        }else if(namaNasabah === null || namaNasabah === undefined) {
            flashNotification("Alert", "Silahkan masukkan nama nasabah", "#ff6347", "#fff")
        }else if(statusNasabah === null || statusNasabah === undefined) {
            flashNotification("Alert", "Silahkan pilih status nasabah", "#ff6347", "#fff")
        }else if(tanggalSos === null || tanggalSos === undefined) {
            flashNotification("Alert", "Silahkan pilih tanggal sosialisasi", "#ff6347", "#fff")
        }else if(lokasiSos === null || lokasiSos === undefined) {
            flashNotification("Alert", "Silahkan masukkan lokasi sosialisasi", "#ff6347", "#fff")
        }else{
            Alert.alert(
                "Input Data Sukses",
                "Apakah anda ingin menyimpan data sosialisasi ?",
                [
                    { text: "YA", onPress: () => {

                        try{
                            db.transaction(
                                tx => {
                                    tx.executeSql(`INSERT INTO Sosialisasi_Database (
                                        tanggalInput, 
                                        sumberId, 
                                        namaCalonNasabah, 
                                        nomorHandphone, 
                                        status, 
                                        tanggalSosialisas, 
                                        lokasiSosialisasi,
                                        type
                                    ) values (
                                        '` + tanggalInput + `',
                                        '` + sumberDana + `',
                                        '` + namaNasabah + `',
                                        '` + nohp + `',
                                        '` + statusNasabah + `',
                                        '` + tanggalSos + `',
                                        '` + lokasiSos + `',
                                        '1'
                                    )`)
                                },function(error) {
                                    console.log('Transaction ERROR: ' + error.message);
                                },function(){
                                    navigation.replace("Inisiasi")
                                }
                            )
                        }catch(error){
                            console.log(error)
                        }
                    }}
                ],
                { cancelable: true}
            )
        }

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
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>INISIASI</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Input Sosialisasi</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', margin: 20}}>Form Prospek Baru</Text>
                <ScrollView style={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>

                    <View style={{margin: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Tanggal Input</Text>
                        <TouchableOpacity onPress={() => setShow(true)} style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                            <View style={{flex: 1}}>
                                <TextInput value={tanggalInput} placeholder="Silahkan masukkan tanggal input" editable={false} style={{ fontSize: 15, color: "#545454" }}/>
                            </View>
                            <View>
                                <FontAwesome5 name={'calendar-alt'} size={18} />
                            </View>
                        </TouchableOpacity>
                        {show && (
                            <DateTimePicker
                                value={date}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={dateHandler}
                            />
                        )}
                    </View>

                    <View style={{marginHorizontal: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Sumber</Text>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder={"Pilih Sumber Informasi"}
                            placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                            dropDownContainerStyle={{marginLeft: 10, marginTop: 5, borderColor: "#003049", width: dimension.width/1.5, borderWidth: 2}}
                            style={{ marginLeft: 10, borderColor: "black", width: dimension.width/1.5, borderRadius: 10, borderWidth: 1 }}
                            labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                            onChangeValue={() => sumberDataHandler(value)}
                        />
                    </View>

                    <View style={{margin: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Nama Calon Nasabah</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                            <View style={{flex: 1}}>
                                <TextInput onChangeText={(text) => setNamanasabah(text)} placeholder="Masukkan Nama Calon Nasabah" style={{ fontSize: 15, color: "#545454" }}/>
                            </View>
                            <View>
                                <FontAwesome5 name={'user-edit'} size={18} />
                            </View>
                        </View>
                    </View>

                    <View style={{margin: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>No. Telp/HP Calon Nasabah</Text>
                        <View style={{borderWidth: 1, padding: 5, borderRadius: 10, marginLeft: 10}}>
                            <PhoneInput
                                style={styles.phoneInput} 
                                ref={phoneRef}
                                initialCountry={'id'}
                                value={nohp}
                                onChangePhoneNumber={setNohp}
                                allowZeroAfterCountryCode={false}
                            />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 20}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <BouncyCheckbox 
                                size={30}
                                isChecked={sisipan}
                                fillColor={'#003049'}
                                disableBuiltInState
                                onPress={() => pickerHandler(1)}
                            />
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>Nasabah Sisipan</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <BouncyCheckbox 
                                size={30}
                                isChecked={baru}
                                fillColor={'#003049'}
                                disableBuiltInState
                                onPress={() => pickerHandler(2)}
                            />
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>Nasabah Baru</Text>
                        </View>
                    </View>

                    <View style={{margin: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Tanggal Sosialisasi</Text>
                        <TouchableOpacity onPress={() => setShowSos(true)} style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                            <View style={{flex: 1}}>
                                <TextInput value={tanggalSos} placeholder="Silahkan pilih tanggal Sosialisasi" editable={false} style={{ fontSize: 15, color: "#545454" }}/>
                            </View>
                            <View>
                                <FontAwesome5 name={'calendar-alt'} size={18} />
                            </View>
                        </TouchableOpacity>
                        {showSos && (
                            <DateTimePicker
                                value={dateSos}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={dateSosHandler}
                            />
                        )}
                    </View>

                    <View style={{margin: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Lokasi Sosialisasi</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 5, paddingHorizontal: 10, marginLeft: 10, borderRadius: 10}}>
                            <View style={{flex: 1}}>
                                <TextInput onChangeText={(text) => setLokasiSos(text)} placeholder="Masukkan Lokasi Sosialisasi" style={{ fontSize: 15, color: "#545454" }}/>
                            </View>
                            <View>
                                <FontAwesome5 name={'location-arrow'} size={18} />
                            </View>
                        </View>
                    </View>

                    <View style={{alignItems: 'center', marginBottom: 20}}>
                        <Button
                            title="SIMPAN"
                            onPress={() => submitHandler()}
                            buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                        />
                    </View>

                </ScrollView>

            </View>
        </View>
    )
}

export default Sosialisasi

const styles = StyleSheet.create({
    
})