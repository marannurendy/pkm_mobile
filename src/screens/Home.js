import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image, StatusBar, ToastAndroid, Dimensions, Modal, useWindowDimensions, LogBox, TextPropTypes } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo'
import { FAB } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';
import {ApiSync, Get_notification, Get_Date, ApiSyncInisiasi} from '../../dataconfig/index'
import moment from 'moment';
import 'moment/locale/id';
import { Card, Button } from 'react-native-elements';
import RenderHtml from 'react-native-render-html'
import { scale, verticalScale } from 'react-native-size-matters'

import db from '../database/Database';
// import { Text } from 'native-base';
// import { ScrollView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';
import FrontHomeSync from './HomeSync';
const window = Dimensions.get('window');

export default function FrontHome() {
    const [cabangid, setCabangid] = useState("")
    const [namacabang, setNamacabang] = useState("")
    const [username, setUsername] = useState("")
    const [aoname, setAoname] = useState("")
    const [loading, setLoading] = useState(false)
    const [buttonstat, setButtonstat] = useState(true)
    const [buttonDis, setButtonDis] = useState(false)
    const [data, setData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)

    const netInfo = useNetInfo()
    const apiSync = ApiSync
    const apiSyncInisiasi = ApiSyncInisiasi

    LogBox.ignoreAllLogs()


    const navigation = useNavigation()

    const pkmHandler = () => {
        navigation.navigate('Sync')
    }

    const parHandler = () => {
        // navigation.navigate('MeetingPAR', {cabangid: cabangid})
        // navigation.navigate('MeetingPAR', {cabangid: cabangid, uname: username})
        navigation.navigate('IndividualMeeting', {cabangid: cabangid, uname: username})

    }

    const itemReadyHandler = () => {
        console.log("shit")
        db.transaction(
            tx => {
                tx.executeSql("SELECT * FROM GroupList WHERE OurBranchID = '"+cabangid+"' AND syncby = '"+username+"'", [], (tx, results) => {
                    var testLength = results.rows.length

                    console.log("yang ini " + testLength)
                    if(testLength > 0) {
                        setButtonstat(false)
                        fetchData()
                    }else{
                        setButtonstat(true)
                        fetchData()
                    }
                })
            }
        )
    }

    const fetchData = () => {
        setLoading(true)
        fetch(ApiSync + Get_notification)
          .then((response) => response.json())
          .then((json) => {
            if(json.responseDescription === "success") {
                // console.log(json)
              setData(json.data)
              setModalVisible(!modalVisible)
              return false
            }else{
              setLoading(false)
            }
          })
          .catch((error) => console.error(error))
          .finally(() => {
              setLoading(false)
              return false
            });
    }

    const checkConnection = () => {
        if(netInfo.isConnected === true){
            fetchData()
            return false
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            itemReadyHandler()
            // fetchData()
        });

        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);

            setCabangid(dt.kodeCabang)
            setNamacabang(dt.namaCabang)
            setUsername(dt.userName)
            setAoname(dt.AOname)
        })

        // const timer = setTimeout(() => {
        //     checkConnection()
        //   }, 3600)

        return unsubscribe
    })

    const renderItem = ({ item }) => (
        <Item data={item} />    
    )

    const Item = ({ data }) => (
        <TouchableOpacity>
            <View>
                <NewsList  Id={data.Id} HeadContent={data.HeadContent} ImageUri={data.ImgUrl} MainContent={data.MainContent} />
            </View>
        </TouchableOpacity>
    )

    const NewsList = ({ Id, HeadContent, ImageUri, MainContent }) => {

        const source = {
            html: MainContent
        };

        const { width } = useWindowDimensions();

        return(
          <View>
              <Card>
                  <Card.Title style={{fontSize: 18, color: "#a2a2db", }} >{HeadContent}</Card.Title>
                  <Card.Divider />
                  <RenderHtml
                        contentWidth={width}
                        source={source}
                  />
                  
              </Card>
          </View>
        )
      }

    const ModalNotification = () => {
        return(
          <View style={{flex: 1}}>
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>                            
                            <Image source={require('../images/notifHead.jpeg')} style={{width: window.width/1.3, height: window.height/3.5}} />
                        </View>
                        <View style={{alignItems: 'center', margin: 10, padding: 10, backgroundColor: '#b3b7fe', borderRadius: 10}}>
                            <Text style={{fontWeight: 'bold', color: '#fff'}}>Notification !</Text>
                        </View>
                        <ScrollView style={{marginVertical: 10}}>
                            {loading ? <Text>Loading...</Text> : 
                            ( <View style={{ justifyContent:  'space-between'}}>
                                <FlatList
                                    data={data}
                                    keyExtractor={(Id, index) => index.toString()}
                                    renderItem={renderItem}
                                />
                                <Button 
                                    icon={ <FontAwesome5 name="check" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                    title= {"OKAY"}  
                                    buttonStyle={{margin: 10, backgroundColor: '#b3b7fe'}}
                                    onPress={() => {
                                        setModalVisible(!modalVisible)
                                        itemReadyHandler()
                                    }}
                                />
                            </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
                </View> 
        )
      }

    async function syncData() {
        moment.locale('id');
        var tanggal = moment().format('YYYY-MM-DD')

        var getListGroup = apiSync + 'GetListGroup' + '/' + cabangid + '/' + username
        var getListCollection = apiSync + 'GetCollectionList' + '/' + cabangid + '/' + username
        var queryUP = apiSync + 'Shit' + '/' + cabangid + '/' + username
        var getPAR = apiSync + 'GetCollectionListPAR' + '/' + cabangid + '/' + username
        var getPKMIndividual = apiSync + 'GetCollectionListPKMIndividual' + '/' + cabangid + '/' + username

        var getMasterData = apiSyncInisiasi + 'GetMasterData/'

        console.log(getListGroup, getListCollection, queryUP, getPAR, getPKMIndividual)

        const insertListGroup = (responseJson) => ( new Promise((resolve, reject) => {
            try{
                var query = 'INSERT INTO GroupList (OurBranchID, GroupName, GroupID, MeetingDay, AnggotaAktif, JumlahTagihan, MeetingPlace, MeetingTime, syncby) values';

                if(responseJson != null) {
                    // console.log('group '+responseJson.length)
                    for (let i = 0; i < responseJson.length; i++) {
                        query = query + "('"
                        + responseJson[i].OurBranchID
                        + "','"
                        + responseJson[i].GroupName
                        + "','"
                        + responseJson[i].GroupID
                        + "','"
                        + responseJson[i].MeetingDay
                        + "','"
                        + responseJson[i].AnggotaAktif
                        + "','"
                        + responseJson[i].JumlahTagihan
                        + "','"
                        + responseJson[i].MeetingPlace
                        + "','"
                        + responseJson[i].MeetingTime
                        + "','"
                        + username
                        + "')";
                        if (i != responseJson.length - 1) {
                            query = query + ",";
                        }
                    }
                    query = query + ";";
                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }
                        ,function(error) {
                            console.log('Transaction ERROR: ' + error.message);
                            alert('Transaction ERROR: ' + error.message)
                            // ToastAndroid.show("error : Terjadi kesalahan dalam pengambilan data" + error, ToastAndroid.SHORT)
                            reject('Gagal input Data PKM !')
                        },function() {
                            resolve('berhasil')
                        }
                     )
    
                    } else {
                        Alert.alert("Kelompok tidak tersedia, Mohon lakukan pengecekan !")
                        db.transaction(
                            tx => {
                                tx.executeSql("DELETE FROM ListGroup")
                                tx.executeSql("DELETE FROM GroupList")
                                tx.executeSql("DELETE FROM UpAccountList")
                                tx.executeSql("DELETE FROM PAR_AccountList")
                                tx.executeSql("DELETE FROM AccountList")
                                tx.executeSql("DELETE FROM Totalpkm")
                                tx.executeSql("DELETE FROM pkmTransaction")
                                tx.executeSql("DELETE FROM parTransaction")
                                tx.executeSql("DELETE FROM DetailKehadiran")
                                tx.executeSql("DELETE FROM DetailUP")
                                tx.executeSql("DELETE FROM DetailPAR")
                                tx.executeSql("DELETE FROM Detailpkm")
                            },function(error) {
                                ToastAndroid.show("Something Went Wrong : " + error, ToastAndroid.SHORT);
                                reject('Gagal Memproses Data')
                                alert('Transaction ERROR: ' + error.message)
                            }, function() {
                                setLoading(false)
                                reject('Data Kelompok Kosong, silahkan Cek kembali !')
                            }
                        )                 
    
                    }
            } catch {
                reject('Gagal input data ke local storage')
            }
        }))

        const insertgetListCollection = (responseJson) => (new Promise((resolve, reject) =>  {
            try{
                var query = 'INSERT INTO AccountList (OurBranchID, GroupName, GroupID, MeetingDay, ClientID, ClientName, AccountID, ProductID, InstallmentAmount, rill, ke, VolSavingsBal, StatusPAR, syncby) values';

                if(responseJson != null) {
                        for (let d = 0; d < responseJson.length; d++) {
                        query = query + "('"
                        + responseJson[d].OurBranchID
                        + "','"
                        + responseJson[d].GroupName
                        + "','"
                        + responseJson[d].GroupID
                        + "','"
                        + responseJson[d].MeetingDay
                        + "','"
                        + responseJson[d].ClientID
                        + "','"
                        + responseJson[d].ClientName
                        + "','"
                        + responseJson[d].AccountID
                        + "','"
                        + responseJson[d].ProductID
                        + "','"
                        + responseJson[d].InstallmentAmount
                        + "','"
                        + responseJson[d].Rill
                        + "','"
                        + responseJson[d].Ke
                        + "','"
                        + responseJson[d].VolSavingsBal
                        + "','"
                        + responseJson[d].StatusPAR
                        + "','"
                        + username
                        + "')";
                        if (d != responseJson.length - 1) {
                            query = query + ",";
                        }
                    }
                    query = query + ";";
                    db.transaction(
                        tx => {
                            tx.executeSql(query)
                        }
                        ,function(error) {
                            console.log(error.message)
                            reject('Gagal input data nasabah PKM')
                        },function() {
                            resolve('berhasil')
                        }
                    )
                }
            }catch{
                reject('Gagal input data nasabah PKM ke local storage !')
            }
        }))

        const insertListUP = (responseJson) => (new Promise((resolve, reject) => {
            try{
                var upQuery = 'INSERT INTO UpAccountList (OurBranchID, ClientID, ClientName, GroupID, GroupName, MeetingDay, JumlahUP, syncby) values '

                if(responseJson != null) {
    
                for(let u = 0;u < responseJson.length;u++) {
                    upQuery = upQuery + "('"
                    + responseJson[u].OurBranchID
                    + "','"
                    + responseJson[u].ClientID
                    + "','"
                    + responseJson[u].ClientName
                    + "','"
                    + responseJson[u].GroupID
                    + "','"
                    + responseJson[u].GroupName
                    + "','"
                    + responseJson[u].MeetingDay
                    + "','"
                    + responseJson[u].CompSavingsBal
                    + "','"
                    + username
                    + "')";
                    if (u != responseJson.length - 1) {
                        upQuery = upQuery + ",";
                    }
                }
                upQuery = upQuery + ";";
                db.transaction(
                    tx => {
                        tx.executeSql(upQuery)
                    }
                    ,function(error) {
                        console.log('Transaction ERROR: ' + error.message);
                        reject('Gagal input Data Uang Pertanggungjawaban')
                    }
                    , function() {
                        resolve('berhasil')
                    }
                )
                }else{
                    resolve('berhasil')
                }
            }catch{
                console.log('catch')
                db.transaction(
                    tx => {
                        tx.executeSql("DELETE FROM ListGroup")
                        tx.executeSql("DELETE FROM GroupList")
                        tx.executeSql("DELETE FROM UpAccountList")
                        tx.executeSql("DELETE FROM PAR_AccountList")
                        tx.executeSql("DELETE FROM AccountList")
                        tx.executeSql("DELETE FROM Totalpkm")
                        tx.executeSql("DELETE FROM pkmTransaction")
                        tx.executeSql("DELETE FROM parTransaction")
                        tx.executeSql("DELETE FROM DetailKehadiran")
                        tx.executeSql("DELETE FROM DetailUP")
                        tx.executeSql("DELETE FROM DetailPAR")
                        tx.executeSql("DELETE FROM Detailpkm")
                    },function(error) {
                        console.log('gagal hapus')
                        alert('Transaction ERROR: ' + error.message)
                        reject('Gagal Memeproses Data UP')
                    },function() {
                        console.log('sukses hapus')
                        reject('Terjadi Kesalahan Sync, Mohon lakukan pengecekan !')
                    }
                )

            }
        }))

        const insertListPAR = (responseJson) => (new Promise((resolve, reject) => {
            try{
                if(responseJson != null){
                    var parQuery = 'INSERT INTO PAR_AccountList (OurBranchID, ClientID, ClientName, AccountID, ProductID, GroupID, GroupName, ODAmount, syncby) values '
        
                    for(let p = 0;p < responseJson.length;p++) {
                        parQuery = parQuery + "('"
                        + responseJson[p].OurBranchID
                        + "','"
                        + responseJson[p].ClientID
                        + "','"
                        + responseJson[p].ClientName
                        + "','"
                        + responseJson[p].AccountID
                        + "','"
                        + responseJson[p].ProductID
                        + "','"
                        + responseJson[p].GroupID
                        + "','"
                        + responseJson[p].GroupName
                        + "','"
                        + responseJson[p].InstallmentAmount
                        + "','"
                        + username
                        + "')";
                        if (p != responseJson.length - 1) {
                            parQuery = parQuery + ",";
                        }
                    }
                    parQuery = parQuery + ";";
                    db.transaction(
                        tx => {
                            tx.executeSql(parQuery)
                        }
                        ,function(error) {
                            reject('Gagal input Data Uang PAR')
                            alert('Transaction ERROR: ' + error.message)
                        }
                        , function() {
                            resolve('berhasil')
                        }
                    )
                }else{
                    resolve('berhasil')
                }
            }catch{
                db.transaction(
                    tx => {
                        tx.executeSql("DELETE FROM ListGroup")
                        tx.executeSql("DELETE FROM GroupList")
                        tx.executeSql("DELETE FROM UpAccountList")
                        tx.executeSql("DELETE FROM PAR_AccountList")
                        tx.executeSql("DELETE FROM AccountList")
                        tx.executeSql("DELETE FROM Totalpkm")
                        tx.executeSql("DELETE FROM pkmTransaction")
                        tx.executeSql("DELETE FROM parTransaction")
                        tx.executeSql("DELETE FROM DetailKehadiran")
                        tx.executeSql("DELETE FROM DetailUP")
                        tx.executeSql("DELETE FROM DetailPAR")
                        tx.executeSql("DELETE FROM Detailpkm")
                    },function(error) {
                        reject('Gagal Memeproses Data PAR')
                        alert('Transaction ERROR: ' + error.message)
                    }, function() {
                        reject('Gagal input Data Uang PAR')
                    }
                ) 
            }
        }))

        try{
            setButtonDis(true)
            setLoading(true)
            const responseListGroup = await fetch(getListGroup)
            const json = await responseListGroup.json(responseListGroup)
            await insertListGroup(json)
            const responseListCollection = await fetch(getListCollection)
            const jsonCollection = await responseListCollection.json(responseListCollection)
            await insertgetListCollection(jsonCollection)
            const responseListUP = await fetch(queryUP)
            const jsonListUP = await responseListUP.json(responseListUP)
            await insertListUP(jsonListUP)
            const responseListPAR = await fetch(getPKMIndividual)
            const jsongetPAR = await responseListPAR.json(responseListPAR)
            await insertListPAR(jsongetPAR)
            const getDate = await fetch(ApiSync+Get_Date)
            const jsongetDate = await getDate.json(getDate)

            //get master data
            const MasterData = await fetch(getMasterData)
            const jsonMasterData = await MasterData.json(MasterData)

            console.log(JSON.stringify(jsonMasterData.data.marriageStatus))

            AsyncStorage.setItem('SyncDate', jsongetDate.currentDate)
            AsyncStorage.setItem('TransactionDate', jsongetDate.currentDate)
            AsyncStorage.setItem('Absent', JSON.stringify(jsonMasterData.data.absent))
            AsyncStorage.setItem('Religion', JSON.stringify(jsonMasterData.data.religion))
            AsyncStorage.setItem('LivingType', JSON.stringify(jsonMasterData.data.livingType))
            AsyncStorage.setItem('IdentityType', JSON.stringify(jsonMasterData.data.identityType))
            AsyncStorage.setItem('PartnerJob', JSON.stringify(jsonMasterData.data.partnerJob))
            AsyncStorage.setItem('DwellingCondition', JSON.stringify(jsonMasterData.data.dwellingCondition))
            AsyncStorage.setItem('ResidenceLocation', JSON.stringify(jsonMasterData.data.residenceLocation))
            AsyncStorage.setItem('PembiayaanLain', JSON.stringify(jsonMasterData.data.pembiayaanLain))
            AsyncStorage.setItem('Education', JSON.stringify(jsonMasterData.data.education))
            AsyncStorage.setItem('Product', JSON.stringify(jsonMasterData.data.product))
            AsyncStorage.setItem('EconomicSector', JSON.stringify(jsonMasterData.data.economicSector))
            AsyncStorage.setItem('RelationStatus', JSON.stringify(jsonMasterData.data.relationStatus))
            AsyncStorage.setItem('MarriageStatus', JSON.stringify(jsonMasterData.data.marriageStatus))
            AsyncStorage.setItem('HomeStatus', JSON.stringify(jsonMasterData.data.homeStatus))
            AsyncStorage.setItem('Referral', JSON.stringify(jsonMasterData.data.referral))
            AsyncStorage.setItem('TransFund', JSON.stringify(jsonMasterData.data.transFund))


            Alert.alert(
                "Sukses",
                "Sync Berhasil Dilakukan",
                [
                    { text: "OK", onPress: () => {

                    }
                    }
                ],
                { cancelable: false }
            )

            console.log("this")

            setLoading(false)
            setButtonDis(true)
            setButtonstat(false)
        }catch(error) {
            console.log(error)
            ToastAndroid.show("error : " + error, ToastAndroid.LONG);
            setLoading(false)
            setButtonDis(false)
        }
        

    }

    if (!buttonDis) {
        return (
            <FrontHomeSync 
                // username={username}
                // cabangid={cabangid}
                username={'AO12-90091'} /* DATA DUMMY */
                cabangid={90091} /* DATA DUMMY */
                aoname={aoname}
                namacabang={namacabang}
                onSuccess={() => setButtonDis(true)}
            />
        )
    }

    return(
        // <View style={styles.container}>            
        <View style={{flex: 1, backgroundColor: '#0D67B2'}}>            
            {/* <ImageBackground source={require("../images/backtestMenu.png")} style={styles.image}>                 */}
            {/* <ImageBackground style={styles.image}>                 */}
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />

            {/* <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                {ModalNotification()}
            </Modal> */}

            {/* <Image source={{uri: "http://devapipkm.pnm.co.id/pkmBackofficeDev/assets/NotificationAssets/Asset1.jpeg"}}/> */}
                <View 
                    style={{
                        marginTop: scale(35),
                        paddingHorizontal: scale(15),
                        alignItems: 'flex-end'
                    }}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        {/* <View style={{ borderWidth: 2, borderRadius: 50, padding: 5, borderColor: "rgba(48,97,216,1)" }}> */}
                        <View>
                            <MaterialCommunityIcons name="menu" color={'#fff'} size={scale(25)} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{marginHorizontal: scale(15)}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}>Hi, {aoname}</Text>
                    <Text style={{color: '#fff'}}>{username}</Text>
                    <Text style={{color: '#fff'}}>{namacabang}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <View style={{marginTop: scale(15), marginLeft: scale(15), flex: 4, borderRadius: scale(10), padding: scale(5), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: scale(13), marginLeft: scale(10), fontWeight: 'bold', color: '#545851'}}>
                            STATUS
                        </Text>
                        <View style={buttonDis === true ? {marginLeft: scale(10), flex: 1, borderRadius: scale(10), padding: scale(5), backgroundColor: '#0CB35D'} : {marginLeft: scale(10), flex: 1, borderRadius: scale(10), padding: 5, backgroundColor: '#C73D3D'}}>
                            {buttonDis === true ? 
                                <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#fff'}}>Berhasil Sync</Text> : 
                                <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#fff'}}>Belum Sync</Text>
                            }
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={buttonDis === true ? {marginTop: scale(15), marginRight: scale(15), flex: 2, marginLeft: scale(10),borderRadius: scale(10), padding: scale(10), backgroundColor: '#CCCCC4', alignItems: 'center'} : {marginTop: scale(15), marginRight: scale(15), flex: 2, marginLeft: scale(10),borderRadius: scale(10), padding: scale(10), backgroundColor: '#0CB35D', alignItems: 'center'}}
                        // style={{marginTop: 30, marginRight: 20, flex: 2, marginLeft: 10,borderRadius: 10, padding: 10, backgroundColor: '#0CB35D', alignItems: 'center'}}
                        onPress={() => syncData()}
                    >
                        <MaterialCommunityIcons name="sync" color={'#FFF'} size={30} />
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1, marginTop: scale(10), borderTopLeftRadius: scale(20), borderTopRightRadius: scale(20), marginHorizontal: scale(5), backgroundColor: '#fff'}}>
                {/* <View style={{flex: 1, marginTop: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 10}}> */}
                    
                    <View style={{marginHorizontal: scale(20), marginTop: scale(20), flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                        {/* <Shadow></Shadow> */}

                        <TouchableOpacity style={{borderWidth: 2, height: window.height/3, width: window.width/2.5, borderRadius: 20, backgroundColor: '#fff'}} onPress={() => pkmHandler()}>
                            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                <Text style={{fontSize: scale(30), fontWeight: 'bold'}}>
                                    PKM
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{height: window.height/3, width: window.width/2.5, flexDirection: 'column', justifyContent: 'space-between'}}>

                            <TouchableOpacity style={{borderWidth: 2, height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: '#fff'}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                        PENAGIHAN
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{borderWidth: 2, height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: '#fff'}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                        PELUNASAN
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>

                    <View style={{marginHorizontal: 20, marginBottom: 20, flex: 1, justifyContent: 'space-between'}}>

                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => navigation.navigate('Inisiasi')} style={{borderWidth: 2, height: window.width/3, flex: 1, borderRadius: 20, backgroundColor: '#fff'}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                                        INISIASI
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                            <TouchableOpacity style={{borderWidth: 2, height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: '#fff'}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                        PENCAIRAN
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{borderWidth: 2, height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: '#fff'}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                        UMi Corner
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>
            
                </View>

                {/* <View style={{margin: 20}}> */}
                    {/* <TouchableOpacity style={ styles.imageStyle } onPress={() => pkmHandler()}> */}
                    {/* <TouchableOpacity style={ styles.imageStyle }>
                        <View>
                            <Image source={require('../images/pkm.png')} style={{ width: window.width/1.5, height: window.height/5, borderRadius: 7 }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={ styles.imageStyle } onPress={() => parHandler()}>
                        <View>
                            <Image source={require('../images/pkm_individual.png')} style={{ width: window.width/1.5, height: window.height/5, borderRadius: 7 }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={ styles.imageStyle } onPress={() => navigation.navigate('UmiCornerLanding')}>
                        <View>
                            <View style={{ width: window.width/1.5, height: window.height/5, borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../images/Umi.png')} style={{width:window.width/1.5, height:window.height/14}} />
                            </View>
                        </View>
                    </TouchableOpacity> */}

                    
                {/* </View>  */}

                {/* <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center' }}>
                        <FAB
                            style={{ position: 'absolute', margin: 30, backgroundColor: '#0D67B2', borderWidth: 2, borderColor: '#fff' }}
                            large
                            icon="sync"
                            visible={buttonstat}
                            disabled={buttonDis}
                            onPress={() => syncData()}
                        />
                    </View>
                </View> */}
            {/* </ImageBackground> */}

                {loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                } 

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    bodyContainer: {
        flex: 0.7,
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: 'center',

    },
    menuContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    imageStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        backgroundColor: "#fff",
        borderRadius: 7
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        // height: window.height
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        // alignItems: "center",
        shadowColor: "#000",
        height: window.height/1.3,
        width: window.width/1.3,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    htmlView: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    menuChocolate: {
        borderRadius: 20
    },
    chocoStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
})