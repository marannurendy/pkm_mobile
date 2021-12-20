import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import db from '../../database/Database'

const MenuflowPencairan = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState("");
    let [aoName, setAoName] = useState();
    let [data, setData] = useState(route.params.kelompok_Id);

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
        getLocalPencairan();
    }, []);

    const getLocalPencairan = () => {
        if (__DEV__) console.log('getLocalPencairan loaded');

        let query = 'SELECT * FROM Table_Pencairan_Post';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getLocalPencairan results');
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'Nama_Kelompok' : data.Nama_Kelompok, 'Jumlah_Kelompok': data.Jumlah_Kelompok, 'kelompok_Id': data.kelompok_Id});
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
                <ScrollView>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', height: 75, marginBottom:10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold', margin: 10}}>Pencairan</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", height: 50, borderRadius: 10, width: dimension.width/3, marginTop:10}}>
                            <Text style={{flex: 1, textAlign: 'center', margin: 5, borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>Kembali</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around',}}>
                        <TouchableOpacity onPress={() => navigation.navigate('ListPencairan',{data: route.params.kelompok_Id})} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                            <FontAwesome5 name="credit-card" size={50} color="#FFFCFA" />
                            <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Pencairan</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => navigation.navigate('TandaTanganPencairan',{data: route.params.kelompok_Id})} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                            <FontAwesome5 name="signature" size={50} color="#FFFCFA" />
                            <Text numberOfLines={2} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Tanda Tangan</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                        <TouchableOpacity onPress={() => navigation.navigate('Preview', {idProspek : route.params.kelompok_Id})} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                            <FontAwesome5 name="user-check" size={50} color="#FFFCFA" />
                            <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Preview</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20, opacity:"50%"}}>
                            <FontAwesome5 name="user-check" size={50} color="#FFFCFA" />
                            <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Preview</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SyncPencairan')} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20}}>
                            <FontAwesome5 name="sync" size={50} color="#FFFCFA" />
                            <Text numberOfLines={2} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Sync Data</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: '#F77F00', padding: 20, opacity:"50%"}}>
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
                </ScrollView>
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