import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ActionButton from 'react-native-action-button'
import { scale, verticalScale } from 'react-native-size-matters'

import db from '../../database/Database'

const MenuflowPencairan = () => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState("");
    let [aoName, setAoName] = useState();
    let [menuShow, setMenuShow] = useState(0);
    let [menuToggle, setMenuToggle] = useState(false);
    let [data, setData] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const getUserData = () => {
            AsyncStorage.getItem('userData', (error, result) => {
                if (error) __DEV__ && console.log('userData error:', error);

                let data = JSON.parse(result);
                setBranchId(data.kodeCabang);
                setBranchName(data.namaCabang);
                setUname(data.userName);
                setAoName(data.AOname);
                console.log(data)
            });
        }

        getUserData();
        getSosialisasiDatabase();

        // AsyncStorage.getItem('userData', (error, result) => {
        //     let dt = JSON.parse(result)

        //     setBranchId(dt.kodeCabang)
        //     setBranchName(dt.namaCabang)
        //     setUname(dt.userName)
        //     setAoName(dt.AOname)
        // })

        // let GetInisiasi = 'SELECT lokasiSosialisasi, COUNT(namaCalonNasabah) as jumlahNasabah FROM Sosialisasi_Database GROUP BY lokasiSosialisasi;'
        // db.transaction(
        //     tx => {
        //         tx.executeSql(GetInisiasi, [], (tx, results) => {
        //             console.log(JSON.stringify(results.rows._array))
        //             let dataLength = results.rows.length
        //             // console.log(dataLength)

        //             var arrayHelper = []
        //             for(let a = 0; a < dataLength; a ++) {
        //                 let data = results.rows.item(a)
        //                 arrayHelper.push({'groupName' : data.lokasiSosialisasi, 'totalnasabah': data.jumlahNasabah, 'date': '08-09-2021'})
        //                 // console.log("this")
        //                 // console.log(data.COUNT(namaCalonNasabah))
        //             }
        //             console.log(arrayHelper)
        //             setData(arrayHelper)
        //         }
        //         )
        //     }
        // )

        // AsyncStorage.getItem('DwellingCondition', (error, result) => {
        //     console.log(result)
        // })
    }, []);

    const getSosialisasiDatabase = () => {
        if (__DEV__) console.log('getSosialisasiDatabase loaded');
        if (__DEV__) console.log('getSosialisasiDatabase keyword:', keyword);

        let query = 'SELECT lokasiSosialisasi, COUNT(namaCalonNasabah) as jumlahNasabah FROM Sosialisasi_Database WHERE lokasiSosialisasi LIKE "%'+ keyword +'%" GROUP BY lokasiSosialisasi';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getSosialisasiDatabase results:', results.rows);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'groupName' : data.lokasiSosialisasi, 'totalnasabah': data.jumlahNasabah, 'date': '08-09-2021'});
                    }
                    setData(ah);
                })
            }
        )
    }

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View
            style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 10,
                alignItems: "center",
            }}
            >
                <View style={{height: dimension.height/4, marginHorizontal: 10, borderRadius: 20, marginTop: 30, flex: 1}}>
                    <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover"}} imageStyle={{borderRadius: 20}}>

                        <TouchableOpacity onPress={() => navigation.replace('FrontHome')} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, margin: 20, width: dimension.width/3}}>
                            <View>
                                <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                            </View>
                            <Text style={{flex: 1, textAlign: 'center', borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>MENU</Text>
                        </TouchableOpacity>

                        <Text numberOfLines={2} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5, marginHorizontal: 20}}>{branchName}</Text>
                        <Text numberOfLines={2} style={{fontSize: 13, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{branchId} - {branchName}</Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{uname} - {aoName}</Text>
                    </ImageBackground>
                </View>
            </View>

            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', margin: 20}}>Pencairan</Text>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-around',}}>
                    <TouchableOpacity onPress={() => navigation.navigate('ListPencairan',{groupName: "TOTO"})} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                        <FontAwesome5 name="credit-card" size={50} color="#FFFCFA" />
                        <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Pencairan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('TandaTanganPencairan')} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                        <FontAwesome5 name="signature" size={50} color="#FFFCFA" />
                        <Text numberOfLines={2} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Tanda Tangan</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Preview', {idProspek : "90091228"})} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                        <FontAwesome5 name="user-check" size={50} color="#FFFCFA" />
                        <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Preview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SyncPencairan')} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                        <FontAwesome5 name="sync" size={50} color="#FFFCFA" />
                        <Text numberOfLines={2} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Sync Data</Text>
                    </TouchableOpacity>
                </View>
                {uname.includes("SY") ? 
                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                    <TouchableOpacity onPress={() => navigation.navigate('UploadBuktiPem')} style={{width: dimension.width/1.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                        <FontAwesome5 name="upload" size={50} color="#FFFCFA" />
                        <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Upload Nota Pembelian</Text>
                    </TouchableOpacity>
                </View>
                :null}
            </View>
        </View>
    )
}

export default MenuflowPencairan

const styles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowRadius: 10,
        shadowColor: '#003049',
        shadowOpacity: 0.3,
        shadowOffset: { height: 10 },
    },
    menu: {
        backgroundColor: '#003049'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
})