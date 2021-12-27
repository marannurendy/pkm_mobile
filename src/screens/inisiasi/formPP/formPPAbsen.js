import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message"
import db from '../../../database/Database';
import { RadioButton } from 'react-native-paper'
import { getSyncData } from '../../../actions/sync';

const dimension = Dimensions.get('screen');

const InisiasiFormPPAbsen = ({ route }) => {
    // const { branchid, namaSub, num, status, subKelompok } = route.params;
    const { param } = route.params;

    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getData()
        })

        return unsubscribe
    }, [])

    const getData = async () => {
        let queryGetVerif = "SELECT * FROM Table_PP_ListNasabah WHERE kelompok = '" + param.groupName + "' AND status = " + param.val

        console.log(queryGetVerif)

        const getDataPP = (queryGetVerif) => (new Promise ((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetVerif, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let dataArr = []

                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a)

                                dataArr.push(data)
                            }

                            resolve(dataArr)
                        })
                    }
                )
            }catch(error){
                alert(error)
                reject(error)
            }
        }))

        const dataPP = await getDataPP(queryGetVerif)

        console.log(dataPP)

        setData(dataPP)

    }

    const getSelected = (id) => selectedItems.includes(id);
    const selectItems = (id) => {
        if (selectedItems.includes(id)) {
            const newListItems = selectedItems.filter(
                listItem => listItem !== id
            );
            return setSelectedItems([...newListItems]);
        }
        setSelectedItems([...selectedItems, id]);
    };

    // const renderList = () => data.map((x, i) => (
    //     <TouchableOpacity
    //         key={i}
    //         onPress={() => selectItems(x.Nasabah_Id)}
    //         style={[styles.MB16]}
    //     >
    //         <View style={[styles.FDRow, styles.P16, { borderWidth: 1, borderRadius: 8, alignItems: 'center' }]}>
    //             <View style={styles.checkbox}>
    //                 {getSelected(x.Nasabah_Id) ? <FontAwesome5 name="check" size={16} color={colors.DEFAULT} /> : <Text>{`     `}</Text>}
    //             </View>
    //             <Text style={styles.F1}>{x.Nama_Nasabah}</Text>
    //             <Text>{x.lokasiSos}</Text>
    //         </View>
    //     </TouchableOpacity>
    // ))

    const attendanceHandler = (text, index) => {
        // let newValue = text;
        // console.log(text, index)

        let newArr = [...data]
        newArr[index].AbsPP = text

        console.log(newArr)

        setData(newArr)
        // setData(prevState => {
        //     let newItem = { ...prevState, AbsPP: newValue };

        //     // sync with [arent array]
        //     console.log(newItem)

        //     // onChange(index, newItem);

        //     // return newItem;
        // });

    };

    const renderList = () => data.map((x, i) => (
        <TouchableOpacity
            key={i}
            onPress={() => selectItems(x.Nasabah_Id)}
            style={[styles.MB16]}
        >
            <View style={[styles.P16, { borderWidth: 1, borderRadius: 8}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.checkbox, {backgroundColor: "#0D67B2", borderColor: '#FFF'}]}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, marginHorizontal: 5, color: "#FFF"}} >{x.Nama_Nasabah.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.F1, {fontSize: 16}]}>{x.Nama_Nasabah}</Text>
                </View>

                <View style={{borderBottomWidth: 1, marginVertical: 10}} />

                <Text style={styles.F1}>Form Kehadiran</Text>
                <View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                            value= "1"
                            status={ data[i].AbsPP === '1' ? 'checked' : 'unchecked'}
                            onPress={() => attendanceHandler('1', i)} 
                        />
                        <Text>1. Hadir</Text>
                    </View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                            value= "2"
                            status={ data[i].AbsPP === '2' ? 'checked' : 'unchecked'}
                            onPress={() => attendanceHandler('2', i)} 
                        />
                        <Text>2. Tidak Hadir</Text>
                    </View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                            value= "3"
                            status={ data[i].AbsPP === '3' ? 'checked' : 'unchecked'}
                            onPress={() => attendanceHandler('3', i)} 
                        />
                        <Text>3. Mengundurkan Diri</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    ))

    const renderMain = () => (
        <View style={[styles.F1, styles.P16]}>
            <ScrollView>
                {renderList()}
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

    const tambahHandler = () => {

        // console.log("this => " + data)

        // console.log(data)
        let length = data.length
        // if(length < 7) return flashNotification("Caution!", "Jumlah nasabah tidak memenuhi kriteria pembentukan kelompok", "#FF7900", "#fff")

        let dataHadir = []
        let numKetKelompok = []
        for(let a = 0; a < length; a++) {
            let b = data[a].AbsPP
            let c = data[a].is_Ketua_Kelompok
            if(b === null || b === undefined || b === "null" || b === "undefined") flashNotification("Caution!", "Absen belum lengkap", "#FF7900", "#fff")
            if(b === 1 || b === "1") dataHadir.push(b)
            if(c === "1" || c === 1) numKetKelompok.push(data[a])
        }

        let q = dataHadir.length

        // if(numKetKelompok.length < 1) flashNotification("Caution!", "Ketua kelompok belum di tentukan", "#FF7900", "#fff")
        // if(q < 7) flashNotification("Caution!", "Jumlah nasabah yang menghadiri pertemuan kelompok tidak cukup", "#FF7900", "#fff")

        try{
            for(let a = 0; a < length; a++) {
                let queryUpdateAbsen = "UPDATE Table_PP_ListNasabah SET isPP = '" + param.val + "', AbsPP = '" + data[a].AbsPP + "' WHERE Nasabah_Id = '" + data[a].Nasabah_Id + "'"

                db.transaction(
                    tx => {
                        tx.executeSql(queryUpdateAbsen)
                    }, function(error) {
                        alert(error)
                    }
                )

                if(param.val === '3' || param.val === 3) {
                    var queryUpdate = `UPDATE Table_PP_ListNasabah SET status = 4, AbsPP = '0' WHERE Nasabah_Id = '` + data[a].Nasabah_Id + `'`

                    db.transaction(
                        tx => {
                            tx.executeSql(queryUpdate)
                        }, function(error) {
                            alert(error)
                        }
                    )
                }
            }
            let queryUpdateKelompok = "UPDATE Table_PP_Kelompok SET status = '" + param.val + "' WHERE kelompok = '" + param.groupName + "'"

            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryUpdateKelompok)
                    }, function(error) {
                        alert("error")
                    }
                )
            }catch(error){
                alert(error)
            }
            
            alert("Persiapan Pembiayaan 1 berhasil dilakukan")

            navigation.goBack()
        }catch(error){
            alert(error)
        }
    }

    const renderButton = () => (
        <View style={[styles.FDRow, styles.P16]}>
            <TouchableOpacity
                // onPress={() => alert(JSON.stringify(selectedItems))}
                onPress={() => tambahHandler()}
                style={[styles.F1, styles.MR16]}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SUBMIT</Text>
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
        <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>BACK</Text>
                </TouchableOpacity>
                <Text style={{ color: colors.PUTIH }}>{param.groupName}</Text>
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

export default InisiasiFormPPAbsen;
