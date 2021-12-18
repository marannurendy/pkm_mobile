import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, Modal, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { WebView } from 'react-native-webview';
import { Button } from 'react-native-elements';

import db from '../../database/Database'

const window = Dimensions.get('window');

const Siklus = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [data, setData] = useState([]);
    let [dataNasabah, setDataNasabah] = useState(route.params.data);
    let [akadmenu, setakadmenu] = useState(0);
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
                        ah.push({'groupName' : data.lokasiSosialisasi, 'Nomor': '08-09-2021'});
                    }
                    setData([{'groupName' :'Vina binti Supardi', 'Nomor': '900900102/3000000/25'}]);
                })
            }
        )
    }
    
    // Simpan Handler
    const submitHandler = () => {
        navigation.navigate("FormFP4")
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
            {akadmenu == 0 ?(
            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Form Siklus Pertama</Text>

                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Produk Pembiayaan</Text>
                            <TextInput 
                                style={{flex: 1, padding: 5, borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                editable={false} selectTextOnFocus={false}
                                value={dataNasabah.Jenis_Pembiayaan}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Plafond</Text>
                            <TextInput 
                                style={{flex: 1, padding: 5, borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                editable={false} selectTextOnFocus={false}
                                value={dataNasabah.Jumlah_Pinjaman}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Term Pembiayaan</Text>
                            <TextInput 
                                editable={false} selectTextOnFocus={false}
                                style={{flex: 1, padding: 5, borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                value={dataNasabah.Term_Pembiayaan}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Jumlah UP</Text>
                            <TextInput 
                                editable={false} selectTextOnFocus={false}
                                value={((parseInt(dataNasabah.Jumlah_Pinjaman) * parseInt(dataNasabah.Term_Pembiayaan)) / 100).toString()}
                                style={{flex: 1, padding: 5, borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Total Pencairan</Text>
                            <TextInput 
                                editable={false} selectTextOnFocus={false}
                                value={(parseInt(dataNasabah.Jumlah_Pinjaman) - ((parseInt(dataNasabah.Jumlah_Pinjaman) * parseInt(dataNasabah.Term_Pembiayaan)) / 100)).toString()}
                                style={{flex: 1, padding: 5, borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                returnKeyType="done"
                            />
                            
                            <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                                <Button
                                    title="SIMPAN"
                                    onPress={() => setakadmenu(1)}
                                    buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                                    titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
            ) : (
            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>Pencairan Pembiayaan {"\n"}Form FP 4</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <View style={styles.F1}>
                        <WebView
                            source={{ uri: `http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/INISIASI/FP4_KONVE_T1.html?ID_Prospek=4` }}
                            startInLoadingState={true}
                            style={styles.F1}
                        />
                    </View>
                </View>
                <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                    <Button
                        title="OK"
                        buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                        titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                    />
                </View>
            </View>
            )}
        </View>
    )
}

export default Siklus

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
    signature: {
        height: window.height/4,
        flex: 1
      },
      buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        margin: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // height: window.height
      },
      modalView: {
        backgroundColor: "#ECE9E4",
        // borderRadius: 5,
        // alignItems: "center",
        // shadowColor: "#000",
        height: window.height,
        width: window.width,
        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
      },
      bodyContainer: {
        flex: 1,
        marginVertical: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        backgroundColor: 'white'
    },
    F1: {
        flex: 1
    },
})