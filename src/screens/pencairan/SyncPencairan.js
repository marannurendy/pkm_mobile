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
    let [isLoaded, setLoaded] = useState(false)
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
    }, []);

    const getSyncDataPencairan = () => {
        if (__DEV__) console.log('getKelompokPencairan loaded');
        if (__DEV__) console.log('getKelompokPencairan keyword:', keyword);

        let query = 'SELECT count(B.Nama_Kelompok) as JumlahNasabah, B.Nama_Kelompok as Nama_Kelompok, B.Kelompok_ID as Kelompok_ID '+
                    'FROM Table_Pencairan_Post A LEFT JOIN Table_Pencairan B on A.Kelompok_ID = B.Kelompok_Id Group By B.Nama_Kelompok';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getKelompokPencairan results:', results.rows);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'Nama_Kelompok' : data.Nama_Kelompok, 'JumlahNasabah': data.JumlahNasabah, 'Kelompok_ID':data.Kelompok_ID});
                    }
                    setData(ah);
                    console.log(ah)
                })
            }
        )
    }

    const doSubmit = (Kelompok_ID) => {
        if (__DEV__) console.log('post pencairan loaded');
        if (__DEV__) console.log('post pencairan keyword:', keyword);
        setLoaded(true)
        let query = 'SELECT A.* FROM Table_Pencairan_Post A '+
                    'LEFT JOIN Table_Pencairan B on A.Kelompok_ID = B.Kelompok_Id '+
                    'where B.kelompok_Id = "'+ Kelompok_ID +'" and A.LRP_TTD_AO is not null and A.LRP_TTD_Nasabah is not null';
        db.transaction(
            tx => {
                tx.executeSql(query, [], async (tx, results) => {
                    if (__DEV__) console.log('post pencairan results:', results.rows);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({
                            "FP4": "",
                            "Foto_Kegiatan": null,
                            "Foto_Pencairan": await AsyncStorage.getItem(data.Foto_Pencairan),
                            "ID_Prospek": data.ID_Prospek,
                            "Is_Batal": null,
                            "Is_Dicairkan": data.Is_Dicairkan,
                            "Is_Ludin": null,
                            "Is_PMU": null,
                            "Jml_Cair_PMU": null,
                            "Jml_RealCair": data.Jml_RealCair,
                            "Jml_Sisa_UP": null,
                            "Jml_UP": "0",
                            "LRP_TTD_AO": await AsyncStorage.getItem(data.LRP_TTD_AO),
                            "LRP_TTD_Nasabah": await AsyncStorage.getItem(data.LRP_TTD_Nasabah),
                            "TTD_KC": await AsyncStorage.getItem(data.TTD_KC),
                            "TTD_KK": await AsyncStorage.getItem(data.TTD_KK),
                            "TTD_KSK": await AsyncStorage.getItem(data.TTD_KSK),
                            "TTD_Nasabah": await AsyncStorage.getItem(data.TTD_Nasabah),
                            "TTD_Nasabah_2": await AsyncStorage.getItem(data.TTD_Nasabah_2)
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
                        if (responseJSON.code === 200) {
                            ToastAndroid.show("Sync Data berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) console.log('doSubmitPencairan db.transaction insert/update success');
                            for(let a = 0; a < ah.length; a++){
                                const queryDeleteSosialisasiDatabase = 'DELETE FROM Table_Pencairan_Post where ID_Prospek = "'+ ah[a].ID_Prospek +'"';
                            
                                db.transaction(
                                    tx => {
                                        tx.executeSql(queryDeleteSosialisasiDatabase, [], (tx, results) => {
                                            if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} RESPONSE:`, results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} ERROR:`, error);
                                    }, function() {}
                                );
                                const queryDeleteJumlah = 'Update Table_Pencairan set Jumlah_Kelompok = CAST((CAST(Jumlah_Kelompok as int) - '+ dataLength +') as varchar) where kelompok_Id = "'+ Kelompok_ID +'"';
                                db.transaction(
                                    tx => {
                                        tx.executeSql(queryDeleteJumlah, [], (tx, results) => {
                                            if (__DEV__) console.log(`${queryDeleteJumlah} RESPONSE:`, results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log(`${queryDeleteJumlah} ERROR:`, error);
                                    }, function() {}
                                );
                            }
                            return true;
                        }
                    })
                })
            }
        )
        buttonFinish();
    }

    const buttonFinish = async () => {
        setLoaded(false)
        navigation.replace('FrontHome')
    }

    // LIST VIEW PENCAIRAN
    const renderItemSos = ({ item }) => (
        <ItemSos data={item}  >  
        </ItemSos>
    )

    const ItemSos = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#FFF', borderColor: '#0D67B2', borderWidth:1}} 
            onPress={() => doSubmit(data.Kelompok_ID)}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessageSos Nama_Kelompok={data.Nama_Kelompok} JumlahNasabah={data.JumlahNasabah} />
            </View>
        </TouchableOpacity>
    )
    const ListMessageSos = ({ Nama_Kelompok, JumlahNasabah }) => {
        return(
            <View style={styles.containerList}>
                <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                <View style={{marginLeft: 16}}>
                    <Text numberOfLines={1} style={{marginRight: 20}}>{Nama_Kelompok}</Text>
                    <Text>{JumlahNasabah} Orang</Text>
                </View>
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
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.replace("FlowPencairan")} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('FrontHome')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>Home</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Sync Data Pencairan</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>Search</Text>
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
                            onSubmitEditing={() => getSyncDataPencairan()}
                        />
                    </View>
                </View>

                <SafeAreaView style={{flex: 1}}>
                    {isLoaded === true ? 
                    (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{padding: 10, borderRadius: 15, backgroundColor: '#FFF'}}>
                                <Text style={{fontWeight: 'bold', color: '#545851'}}>Mohon Tunggu...</Text>
                            </View>
                        </View>
                    ) : (
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
                            ListEmptyComponent={_listEmptyComponent}
                        /> 
                    </View>
                    )}
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
    containerList: {
        flexDirection: 'row',
        margin:16,
        width: "85%",
        alignContent: 'center',
        alignItems: 'center'
    },
})