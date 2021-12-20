import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, FlatList, SafeAreaView, ToastAndroid, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { ApiSyncPostInisiasi } from '../../../dataconfig/apisync/apisync'

import db from '../../database/Database'

const SyncPencairan = () => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
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
            });
        }

        getUserData();
        getSyncDataPencairan();

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

    const getSyncDataPencairan = () => {
        if (__DEV__) console.log('getKelompokPencairan loaded');
        if (__DEV__) console.log('getKelompokPencairan keyword:', keyword);

        let query = 'SELECT ID_Prospek as Nama_Kelompok, count(ID_Prospek) as JumlahNasabah FROM Table_Pencairan_Post Group By Nama_Kelompok';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getKelompokPencairan results:', results.rows);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'Nama_Kelompok' : data.Nama_Kelompok, 'JumlahNasabah': data.JumlahNasabah});
                    }
                    setData(ah);
                    console.log(ah)
                })
            }
        )
    }

    const doSubmit = () => {
        if (__DEV__) console.log('post pencairan loaded');
        if (__DEV__) console.log('post pencairan keyword:', keyword);

        let query = 'SELECT * FROM Table_Pencairan_Post';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('post pencairan results:', results.rows);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({
                            "FP4": "",
                            "Foto_Kegiatan": null,
                            "Foto_Pencairan": data.Foto_Pencairan,
                            "ID_Prospek": null,
                            "Is_Batal": null,
                            "Is_Dicairkan": data.Is_Dicairkan,
                            "Is_Ludin": null,
                            "Is_PMU": null,
                            "Jml_Cair_PMU": null,
                            "Jml_RealCair": data.Jml_RealCair,
                            "Jml_Sisa_UP": null,
                            "Jml_UP": data.Jml_UP,
                            "LRP_TTD_AO": data.LRP_TTD_AO,
                            "LRP_TTD_Nasabah": data.LRP_TTD_Nasabah,
                            "TTD_KC": data.TTD_KC,
                            "TTD_KK": data.TTD_KK,
                            "TTD_KSK": data.TTD_KSK,
                            "TTD_Nasabah": data.TTD_Nasabah,
                            "TTD_Nasabah_2": data.TTD_Nasabah_2
                        });
                    }
                    fetch(ApiSyncPostInisiasi + 'post_pencairan', {
                        method: 'POST',
                        headers: {
                            Accept:
                                'application/json',
                                'Content-Type': 'application/json'
                            },
                        body: JSON.stringify(ah)
                    })
                    .then((response) => response.json())
                    .then((responseJSON) => {
                        if (__DEV__) console.error('$post /post_inisiasi/post_pencairan response', responseJSON);
                        if (responseJSON.code === 200) {
                            ToastAndroid.show("Sync Data berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) console.log('doSubmitPencairan db.transaction insert/update success');

                            const queryDeleteSosialisasiDatabase = "DELETE FROM Table_Pencairan_Post";
                            db.transaction(
                                tx => {
                                    tx.executeSql(queryDeleteSosialisasiDatabase, [], (tx, results) => {
                                        if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} RESPONSE:`, results.rows);
                                    })
                                }, function(error) {
                                    if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} ERROR:`, error);
                                }, function() {}
                            );
                            navigation.goBack();
                            return true;
                        }
                    })
                })
            }
        )
    }

    // LIST VIEW PENCAIRAN
    const renderItemSos = ({ item }) => (
        <ItemSos data={item}  >  
        </ItemSos>
    )

    const ItemSos = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#CADADA'}} 
            onPress={() => doSubmit()}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessageSos Nama_Kelompok={data.Nama_Kelompok} JumlahNasabah={data.JumlahNasabah} />
            </View>
        </TouchableOpacity>
    )
    const ListMessageSos = ({ Nama_Kelompok, JumlahNasabah }) => {
        return(
            <View style={{ flex: 1, margin: 20}}>
                <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, color: '#545851'}} >{Nama_Kelompok}</Text>
                <Text>Total Prospek : {JumlahNasabah}</Text>
            </View>
        )
    }
    // END LIST VIEW PENCAIRAN

    const _listEmptyComponent = () => {
        return (
            <View
                style={
                    {
                        padding: 16
                    }
                }
            >
                <Text>Data kosong</Text>
            </View>
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
                <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>Sync Data</Text>
                    <View style={{borderWidth: 1, marginLeft: 20, flex: 1, marginTop: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                        <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
                        <TextInput 
                            placeholder={"Cari Kelompok"} 
                            style={
                                {
                                    flex: 1,
                                    padding: 5,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20
                                }
                            }
                            onChangeText={(text) => setKeyword(text)}
                            value={keyword}
                            returnKeyType="done"
                            onSubmitEditing={() => getSosialisasiDatabase()}
                        />
                    </View>
                </View>

                <SafeAreaView style={{flex: 1}}>
                    <View style={{ justifyContent:  'space-between'}}>
                        <FlatList
                            // contentContainerStyle={styles.listStyle}
                            // refreshing={refreshing}
                            // onRefresh={() => _onRefresh()}
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            enabledGestureInteraction={true}
                            // onEndReachedThreshold={0.1}
                            // onEndReached={() => handleEndReach()}
                            renderItem={renderItemSos}
                            // style={{height: '88.6%'}}
                            //ListEmptyComponent={_listEmptyComponent}
                        /> 
                    </View>
                </SafeAreaView>
            </View>
        </View>
    )
}

export default SyncPencairan

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