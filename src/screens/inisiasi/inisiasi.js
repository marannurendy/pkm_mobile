import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, FlatList, SafeAreaView, Platform, PermissionsAndroid, ScrollView, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ActionButton from 'react-native-action-button'
import { scale, verticalScale } from 'react-native-size-matters'

import db from '../../database/Database'

const Inisasi = () => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [menuShow, setMenuShow] = useState(0);
    let [menuToggle, setMenuToggle] = useState(false);
    let [data, setData] = useState([]);
    let [dataVerifikasi, setDataVerifikasi] = useState([]);

    let [roleCheck, setRoleCheck] = useState(0)
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUserData();
            getSosialisasiDatabase();
            getUKDataDiriVerifikasi();
        });

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
        
        const onLoadCheck = async () => {
            const roleUser = await AsyncStorage.getItem('roleUser')
            if(roleUser === 'KC'){
                setRoleCheck(1)
            }else if(roleUser === 'SAO'){
                setRoleCheck(2)
            }else if(roleUser === 'AO'){
                setRoleCheck(3)
            }
        }
        
        onLoadCheck()
        hasLocationPermission();

        return unsubscribe;
    }, [navigation]);

    const hasLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                ToastAndroid.show("You can use the location", ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Location permission denied", ToastAndroid.SHORT);
            }
        } catch (err) {
            console.log('hasLocationPermission error:', err);
        }
    };

    const getSosialisasiDatabase = () => {
        if (__DEV__) console.log('getSosialisasiDatabase loaded');
        if (__DEV__) console.log('getSosialisasiDatabase keyword:', keyword);

        let query = 'SELECT a.lokasiSosialisasi, COUNT(a.namaCalonNasabah) as jumlahNasabah FROM Sosialisasi_Database a WHERE a.lokasiSosialisasi LIKE "%'+ keyword +'%" GROUP BY a.lokasiSosialisasi';
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

    const getUKDataDiriVerifikasi = () => {
        if (__DEV__) console.log('getUKDataDiri loaded');
        if (__DEV__) console.log('getUKDataDiri keyword', keyword);

        let query = 'SELECT lokasi_sosialisasi, COUNT(lokasi_sosialisasi) as jumlah FROM Table_UK_DataDiri WHERE status_Verif = "1" AND status_UK_Pass = "1" AND status_Verifikasi_Pass = "0" AND lokasi_sosialisasi LIKE "%'+ keyword +'%" GROUP BY lokasi_sosialisasi';
        // let query = 'SELECT lokasi_sosialisasi, COUNT(lokasi_sosialisasi) as jumlah FROM Table_UK_DataDiri WHERE lokasi_sosialisasi LIKE "%'+ keyword +'%" GROUP BY lokasi_sosialisasi';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getUKDataDiri results:', results.rows);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'groupName' : data.lokasi_sosialisasi, 'totalnasabah': data.jumlah, 'date': '08-09-2021'});
                    }
                    setDataVerifikasi(ah);
                })
            }
        )
    }

    const menuHandler = () => {
        setMenuShow(0)
    }

    const sosPressHandler = () => {
        setMenuShow(1)
    }

    const ukPressHandler = () => {
        setMenuShow(2)
    }

    const verifPressHandler = () => {
        setMenuShow(3)
    }

    const ppPressHandler = () => {
        setMenuShow(4)
    }

    // LIST VIEW SOSIALISASI
    const renderItemSos = ({ item }) => (
        <ItemSos data={item} />    
    )
    const pressHandlerSos = (groupid, groupName, branchId, Username) => {
        navigation.navigate("MeetingMenu", {groupid: groupid})
    }
    const ItemSos = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#CADADA'}} 
            onPress={() => navigation.navigate('UjiKelayakan', {groupName: data.groupName})}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessageSos groupName={data.groupName} date={data.date} totalNasabah={data.totalnasabah} />
            </View>
        </TouchableOpacity>
    )
    const ListMessageSos = ({ groupName, date, totalNasabah }) => {
        return(
            <View style={{ flex: 1, margin: 20}}>
                <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, color: '#545851'}} >{groupName}</Text>
                <Text>{date}</Text>
                {/* <Text>Total Nasabah : {totalNasabah}</Text> */}
            </View>
        )
    }
    // END LIST VIEW SOSIALISASI

    // LIST VIEW UJI KELAYAKAN
    const renderItemUk = ({ item }) => (
        <ItemUk data={item} />    
    )

    const ItemUk = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#CADADA'}}
            onPress={() => navigation.navigate('UjiKelayakan', {groupName: data.groupName})}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessageUk groupName={data.groupName} date={data.date} totalNasabah={data.totalnasabah} />
            </View>
        </TouchableOpacity>
    )
    const ListMessageUk = ({ groupName, date, totalNasabah }) => {
        return(
            <View style={{ flex: 1, margin: 20}}>
                <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, color: '#545851'}} >{groupName}</Text>
                <Text>{date}</Text>
                {/* <Text>Total Nasabah : {totalNasabah}</Text> */}
            </View>
        )
    }
    // END LIST VIEW UJI KELAYAKAN

    // LIST VIEW VERIFIKASI
    const renderItemVerif = ({ item }) => (
        <ItemVerif data={item} />    
    )
    const pressHandlerVerif = (groupid, groupName, branchId, Username) => {
        navigation.navigate("MeetingMenu", {groupid: groupid})
    }
    const ItemVerif = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#CADADA'}}
            onPress={() => navigation.navigate('Verifikasi', {groupName: data.groupName})}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessageVerif groupName={data.groupName} date={data.date} totalNasabah={data.totalnasabah} />
            </View>
        </TouchableOpacity>
    )
    const ListMessageVerif = ({ groupName, date, totalNasabah }) => {
        return(
            <View style={{ margin: 20}}>
                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5, color: '#545851' }}>{groupName}</Text>
                <Text>{date}</Text>
                <Text>Total Nasabah : {totalNasabah}</Text>
            </View>
        )
    }
    // END LIST VIEW VERIFIKASI

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
                <View style={{height: menuShow === 0 ? dimension.height/2.5 : dimension.height/4, marginHorizontal: 10, borderRadius: 20, marginTop: 30, flex: 1}}>
                    <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover"}} imageStyle={{borderRadius: 20}}>

                        <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, margin: 20, width: dimension.width/3}}>
                            <View>
                                <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                            </View>
                            <Text style={{flex: 1, textAlign: 'center', borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>INISIASI</Text>
                        </TouchableOpacity>

                        <Text numberOfLines={2} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5, marginHorizontal: 20}}>{branchName}</Text>
                        <Text numberOfLines={2} style={{fontSize: 13, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{branchId} - {branchName}</Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{uname} - {aoName}</Text>

                        {/* <View style={{flex: 1, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, marginVertical: 20, marginHorizontal: 20, backgroundColor: '#BCC8C6'}}> */}
                        {menuShow === 0 ? (
                            <View style={{flex: 1, borderRadius: 10, marginVertical: 20, marginHorizontal: 20, backgroundColor: '#FFFCFA', padding: 10}}>
                                <Text style={{fontWeight: 'bold'}}>Status Proses Pengajuan</Text>

                                <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 5, paddingVertical: 10, flex: 1}}>
                                    <View style={{width: dimension.width/6, borderRadius: 10, backgroundColor: '#003049', padding: 5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 25, color: '#FFF'}}>0</Text>
                                        <Text numberOfLines={1} style={{fontWeight: 'bold', color: '#FFF', marginHorizontal: 10}}>Sosialisasi</Text>
                                    </View>

                                    <View style={{width: dimension.width/6, borderRadius: 10, backgroundColor: '#D62828', padding: 5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 25, color: '#FFF'}}>0</Text>
                                        <Text numberOfLines={1} style={{fontWeight: 'bold', color: '#FFF', marginHorizontal: 10}}>UK</Text>
                                    </View>

                                    <View style={{width: dimension.width/6, borderRadius: 10, backgroundColor: '#F77F00', padding: 5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 25, color: '#FFF'}}>0</Text>
                                        <Text numberOfLines={1} style={{fontWeight: 'bold', color: '#FFF', marginHorizontal: 10}}>Verifikasi</Text>
                                    </View>

                                    <View style={{width: dimension.width/6, borderRadius: 10, backgroundColor: '#17BEBB', padding: 5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 25, color: '#FFF'}}>0</Text>
                                        <Text numberOfLines={1} style={{fontWeight: 'bold', color: '#FFF', marginHorizontal: 10}}>PP</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View></View>
                        )}
                        
                    </ImageBackground>
                </View>
            </View>

            {menuShow === 0 ? (
                <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', margin: 20}}>MENU</Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around',}}>
                        <TouchableOpacity disabled={roleCheck === 1 ? true : roleCheck === 2 ? false : false} onPress={() => sosPressHandler()} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor:  roleCheck === 1 ? '#E6E6E6' : '#003049', padding: 20}}>
                            <FontAwesome5 name="share-alt-square" size={50} color="#FFFCFA" />
                            <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Sosialisasi</Text>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={roleCheck === 1 ? true : roleCheck === 2 ? false : false} onPress={() => ukPressHandler()} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor:  roleCheck === 1 ? '#E6E6E6' : '#D62828', padding: 20}}>
                            <FontAwesome5 name="clipboard-check" size={50} color="#FFFCFA" />
                            <Text numberOfLines={2} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Uji Kelayakan</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                        <TouchableOpacity disabled={roleCheck === 3 ? true : false} onPress={() => verifPressHandler()} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: roleCheck === 3 ? '#E6E6E6' : '#F77F00', padding: 20}}>
                            <FontAwesome5 name="user-check" size={50} color="#FFFCFA" />
                            <Text numberOfLines={1} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Verifikasi</Text>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={roleCheck === 3 ? true : false} onPress={() => ppPressHandler()} style={{width: dimension.width/2.5, height: dimension.height/6, borderRadius: 20, backgroundColor: roleCheck === 3 ? '#E6E6E6' : '#17BEBB', padding: 20}}>
                            <FontAwesome5 name="get-pocket" size={50} color="#FFFCFA" />
                            <Text numberOfLines={2} style={{color: "#FFFCFA", fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Persiapan Pembiayaan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : menuShow === 1 ? (
                <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                    <View style={{alignItems: 'flex-end', marginTop: 20, marginHorizontal: 20}}>
                        <TouchableOpacity onPress={() => menuHandler()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, width: dimension.width/3}}>
                            <Text style={{flex: 1, textAlign: 'center', margin: 5, borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>MENU</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Sosialisasi</Text>
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
                                ListEmptyComponent={_listEmptyComponent}
                            /> 
                        </View>
                    </SafeAreaView>

                    <ActionButton buttonColor="#003049">
                        <ActionButton.Item buttonColor='#D62828' title="Prospek Baru" onPress={() => navigation.navigate('Sosialisasi')}>
                            <FontAwesome5 name="user-plus" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#F77F00' title="Prospek Lama" onPress={() => {}}>
                            <FontAwesome5 name="user-edit" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>

                </View>
            ) : menuShow === 2 ? (
                <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                    <View style={{alignItems: 'flex-end', marginTop: 20, marginHorizontal: 20}}>
                        <TouchableOpacity onPress={() => menuHandler()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, width: dimension.width/3}}>
                            <Text style={{flex: 1, textAlign: 'center', margin: 5, borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>MENU</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Uji Kelayakan</Text>
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
                                renderItem={renderItemUk}
                                // style={{height: '88.6%'}}
                                ListEmptyComponent={_listEmptyComponent}
                            /> 
                        </View>
                    </SafeAreaView>
                </View>
            ) : menuShow === 3 ? (
                <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                    <View style={{alignItems: 'flex-end', marginTop: 20, marginHorizontal: 20}}>
                        <TouchableOpacity onPress={() => menuHandler()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, width: dimension.width/3}}>
                            <Text style={{flex: 1, textAlign: 'center', margin: 5, borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>MENU</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Verifikasi</Text>
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
                                onSubmitEditing={() => getUKDataDiriVerifikasi()}
                            />
                        </View>
                    </View>

                    <SafeAreaView style={{flex: 1}}>
                        <View style={{ justifyContent:  'space-between'}}>
                            <FlatList
                                data={dataVerifikasi}
                                keyExtractor={(item, index) => index.toString()}
                                enabledGestureInteraction={true}
                                renderItem={renderItemVerif}
                                ListEmptyComponent={_listEmptyComponent}
                            /> 
                        </View>
                    </SafeAreaView>
                </View>
            ) : (
                <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                    <View style={{alignItems: 'flex-end', marginTop: 20, marginHorizontal: 20}}>
                        <TouchableOpacity onPress={() => menuHandler()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, width: dimension.width/3}}>
                            <Text style={{flex: 1, textAlign: 'center', margin: 5, borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>MENU</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Persiapan Pembiayaan</Text>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <View style={{width: '100%', height: dimension.height/2.5}}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{height: dimension.height/6}} >
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('InisiasiFormPPKelompokIntro')}
                                    style={{width: dimension.width/2, margin: 10, backgroundColor: '#17BEBB', borderRadius: 40, paddingHorizontal: 20, paddingTop: 30}}
                                >
                                    <FontAwesome5 name={'users'} size={50} color={'#FFF'} />
                                    <View style={{flex: 1}}>
                                        <Text numberOfLines={1} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>Kelompok</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('InisiasiFormPPH', { source: '1' })}
                                    style={{width: dimension.width/2, margin: 10, backgroundColor: '#17BEBB', borderRadius: 40, paddingHorizontal: 20, paddingTop: 30}}
                                >
                                    <FontAwesome5 name={'calendar'} size={50} color={'#FFF'} />
                                    <View style={{flex: 1}}>
                                        <Text numberOfLines={1} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>PP Hari 1</Text>
                                    </View>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('InisiasiFormPPH', { source: '2' })}
                                    style={{width: dimension.width/2, margin: 10, backgroundColor: '#17BEBB', borderRadius: 40, paddingHorizontal: 20, paddingTop: 30}}
                                >
                                    <FontAwesome5 name={'calendar-alt'} size={50} color={'#FFF'} />
                                    <View style={{flex: 1}}>
                                        <Text numberOfLines={1} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>PP Hari 2</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('InisiasiFormPPH', { source: '3' })}
                                    style={{width: dimension.width/2, margin: 10, backgroundColor: '#17BEBB', borderRadius: 40, paddingHorizontal: 20, paddingTop: 30}}
                                >
                                    <FontAwesome5 name={'calendar-check'} size={50} color={'#FFF'} />
                                    <View style={{flex: 1}}>
                                        <Text numberOfLines={1} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>PP Hari 3</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('InisiasiFormPP')}
                                    style={{width: dimension.width/2, margin: 10, backgroundColor: '#17BEBB', borderRadius: 40, paddingHorizontal: 20, paddingTop: 30}}
                                >
                                    <FontAwesome5 name={'money-check'} size={50} color={'#FFF'} />
                                    <View style={{flex: 1}}>
                                        <Text numberOfLines={2} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>Persetujuan Pembiayaan</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>

                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderWidth: 1, height: dimension.height/6}} > */}

                        

                    {/* </ScrollView> */}

                </View>
            )
            }

        </View>
    )
}

export default Inisasi

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