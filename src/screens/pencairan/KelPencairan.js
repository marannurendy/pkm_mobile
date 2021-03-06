import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ActionButton from 'react-native-action-button'
import { scale, verticalScale } from 'react-native-size-matters'

import db from '../../database/Database'

const KelPencairan = () => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
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
        getKelompokPencairan();
    }, []);

    const getKelompokPencairan = () => {
        if (__DEV__) console.log('getKelompokPencairan loaded');
        if (__DEV__) console.log('getKelompokPencairan keyword:', keyword);

        let query = 'SELECT * FROM Table_Pencairan WHERE Nama_Kelompok LIKE "%'+ keyword +'%"';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getKelompokPencairan results:', results.rows);
                    let dataLength = results.rows.length
                    console.log(dataLength)
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

    // LIST VIEW PENCAIRAN
    const renderItemSos = ({ item }) => (
        <ItemSos data={item}  >  
        </ItemSos>
    )

    const ItemSos = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#FFF', borderColor: '#0D67B2', borderWidth:1}} 
            onPress={() => HandlerButton(data.kelompok_Id, data.Nama_Kelompok)}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessageSos Nama_Kelompok={data.Nama_Kelompok} Jumlah_Kelompok={data.Jumlah_Kelompok} />
            </View>
        </TouchableOpacity>
    )
    const ListMessageSos = ({ Nama_Kelompok, Jumlah_Kelompok }) => {
        return(
            <View style={styles.containerList}>
                <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                <View style={{marginLeft: 16}}>
                    <Text numberOfLines={1} style={{marginRight: 20}}>{Nama_Kelompok}</Text>
                    <Text>{Jumlah_Kelompok} Orang</Text>
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

    const HandlerButton = async (kelompok_id, Nama_Kelompok) => {
        AsyncStorage.setItem("Kelompok_id_Pencairan", kelompok_id)
        AsyncStorage.setItem("Nama_Kelompok", Nama_Kelompok)
        const a = await AsyncStorage.getItem("Kelompok_id_Pencairan")
        const b = await AsyncStorage.getItem("Nama_Kelompok")
        if(a != undefined && b != undefined){
            navigation.navigate('FlowPencairan', {kelompok_Id:kelompok_id, Open:0})
        }
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
                            <Text style={{flex: 1, textAlign: 'center', borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>Home</Text>
                        </TouchableOpacity>

                        <Text numberOfLines={2} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5, marginHorizontal: 20}}>{branchName}</Text>
                        <Text numberOfLines={2} style={{fontSize: 13, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{branchId} - {branchName}</Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{uname} - {aoName}</Text>
                    </ImageBackground>
                </View>
            </View>

            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>Pencairan</Text>
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
                            onSubmitEditing={() => getKelompokPencairan()}
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

export default KelPencairan

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