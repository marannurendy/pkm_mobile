import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ActionButton from 'react-native-action-button'
import { scale, verticalScale } from 'react-native-size-matters'

import db from '../../database/Database'

const ListPencairan = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [menuShow, setMenuShow] = useState(0);
    let [menuToggle, setMenuToggle] = useState(false);
    let [Kelompok, setKelompok] = useState(route.params.data);
    let [NamaKelompok, setNamaKelompok] = useState(route.params.dataKelompok);
    let [data, setData] = useState();
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
        getPencairanDatabase();
    }, []);

    const getPencairanDatabase = () => {
        if (__DEV__) console.log('getPencairanDatabase loaded');
        if (__DEV__) console.log('getPencairanDatabase keyword:', keyword);
        console.log(route.params.data)
        let query = 'SELECT * FROM Table_Pencairan_Nasabah where Kelompok_ID = "'+ route.params.data +'" and Nama_Prospek LIKE "%'+ keyword +'%"';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getPencairanDatabase results:', results.rows);
                    let dataLength = results.rows.length
                    console.log(dataLength)
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'Kelompok_ID' : data.Kelompok_ID, 
                            'Nama_Kelompok': data.Nama_Kelompok,
                            'Alamat_Domisili': data.Alamat_Domisili,
                            'Nomor_Identitas': data.Nomor_Identitas,
                            'Nama_Penjamin': data.Nama_Penjamin,
                            'Jumlah_Pinjaman': data.Jumlah_Pinjaman,
                            'Jenis_Pembiayaan': data.Jenis_Pembiayaan,
                            'Jasa': data.Jasa,
                            'Term_Pembiayaan': data.Term_Pembiayaan,
                            'Angsuran_Per_Minggu': data.Angsuran_Per_Minggu,
                            'TTD_Nasabah': data.TTD_Nasabah,
                            'TTD_KC': data.TTD_KC,
                            'TTD_Nasabah_2': data.TTD_Nasabah_2,
                            'TTD_KSK': data.TTD_KSK,
                            'TTD_KK': data.TTD_KK,
                            'Foto_Pencairan': data.Foto_Pencairan,
                            'LRP_TTD_Nasabah': data.LRP_TTD_Nasabah,
                            'LRP_TTD_AO': data.LRP_TTD_AO,
                            'ClientID': data.ClientID,
                            'Nama_Prospek': data.Nama_Prospek,
                            'Nama_Tipe_Pencairan':data.Nama_Tipe_Pencairan,
                            'ID_Prospek':data.ID_Prospek,
                        });
                    }
                    setData(ah)
                    console.log(ah)
                })
            }
        )
    }

    // LIST VIEW PENCAIRAN
    const renderItemSos = ({ item }) => (
        <ItemSos data={item} />  
    )

    const ItemSos = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#FFF', borderColor: '#0D67B2', borderWidth:1}} 
            onPress={() => data.Jenis_Pembiayaan.includes('S') == true || data.Jenis_Pembiayaan.includes('Y') == true ? 
                           navigation.replace('AkadWakalah', {data: data}) : navigation.replace('Perjanjian', {data: data})}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessageSos Nama_Prospek={data.Nama_Prospek} Nomor_Identitas={data.Nomor_Identitas} />
            </View>
        </TouchableOpacity>
    )
    const ListMessageSos = ({ Nama_Prospek, Nomor_Identitas }) => {
        return(
            <View style={styles.containerList}>
                <FontAwesome5 name="user" size={32} color="#2e2e2e" />
                <View style={{marginLeft: 16}}>
                    <Text numberOfLines={1} style={{marginRight: 20}}>{Nama_Prospek}</Text>
                    <Text>{Nomor_Identitas}</Text>
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
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Pencairan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{NamaKelompok}</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Pencairan</Text>
                    </View>
                    <View style={{borderWidth: 1, marginLeft: 20, flex: 1, marginTop: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, maxHeight:50}}>
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
                            onSubmitEditing={() => getPencairanDatabase()}
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
                            ListEmptyComponent={_listEmptyComponent}
                        /> 
                    </View>
                </SafeAreaView>
            </View>
        </View>
    )
}

export default ListPencairan

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