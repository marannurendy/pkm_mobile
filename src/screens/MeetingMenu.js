import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import db from '../database/Database'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { showMessage } from "react-native-flash-message"
import { flex } from 'styled-system'
import {ApiSync, PostPKM} from '../../dataconfig/index'
import { scale, verticalScale } from 'react-native-size-matters'

const MeetingMenu = ({route}) => {

    const navigation = useNavigation()
    const dimension = Dimensions.get('screen')

    const { groupid } = route.params

    let [userName, setUserName] = useState()
    let [currentDate, setCurrentDate] = useState()
    let [branchid, setBranchid] = useState()
    let [branchName, setBranchName] = useState()
    let [groupInfo, setGroupInfo] = useState()
    let [isLoaded, setLoaded] = useState(false)

    let [loading, setLoading] = useState(false)
    let [isSync, setIsSync] = useState(false)

    let [buttonPkm, setButtonPkm] = useState(true)
    let [buttonUp, setButtonUp] = useState(true)
    let [buttonTtd, setButtonTtd] = useState(true)
    let [buttonPkmb, setButtonPkmb] = useState(true)
    let [buttonSync, setButtonSync] = useState(true)
    // let [jumlahTagih, setJumlahTagih] = useState()

    useEffect(() => {
        // console.log("this")
        const unsubscribe = navigation.addListener('focus', () => {
            GetInfo()
            console.log("this")
        })

        return unsubscribe
    }, [])

    const GetInfo = async () => {

        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)

        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);

            setBranchid(dt.kodeCabang)
            setBranchName(dt.namaCabang)
            setUserName(dt.userName)
        })

        var query = 'SELECT DISTINCT * FROM GroupList where GroupID = ' + groupid
        var queryHeader = 'SELECT * FROM Totalpkm where GroupID = ' + groupid + " AND TotalSetoran IS NOT NULL"
        var queryCekSync = "SELECT TtdKetuaKelompok, TtdAccountOfficer FROM Totalpkm where GroupID = " + groupid
        var cekup = "SELECT * FROM DetailUP";
        var queryCekSign = "SELECT * FROM Totalpkm WHERE GroupID = " + "'" + groupid + "'" + "AND trxdate = " + "'" + tanggal + "'" + "AND TtdKetuaKelompok IS NOT NULL"

        const SelectGroupInfo = (query) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(query, [], (tx, results) => {
                            resolve (results.rows.item(0))
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const DataGroupInfo = await SelectGroupInfo(query)
        // console.log(DataGroupInfo)

        if(DataGroupInfo.Status === null) {
            setButtonPkm(false)
            setButtonUp(false)
            setButtonPkmb(false)
        }else if(DataGroupInfo.Status === '1') {
            setButtonPkm(false)
            setButtonUp(false)
            setButtonPkmb(false)
            setButtonTtd(false)
        }else if(DataGroupInfo.Status === '3') {
            setButtonPkm(false)
            setButtonUp(false)
            setButtonPkmb(true)
            setButtonTtd(true)
            setButtonSync(false)
        }else if(DataGroupInfo.Status === '2') {
            setButtonPkm(false)
            setButtonUp(false)
            setButtonPkmb(true)
            setButtonTtd(false)
            setButtonSync(false)
        }else if(DataGroupInfo.Status === '5') {
            setButtonPkm(true)
            setButtonUp(true)
            setButtonPkmb(true)
            setButtonTtd(true)
            setButtonSync(true)
            setIsSync(true)
        }

        setGroupInfo(DataGroupInfo)
        // setJumlahTagih(number(DataGroupInfo.JumlahTagihan))
        setLoaded(true)
    }

    const SyncData = async (id) => {
        setLoading(true)

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
        
        var queryjoin = `SELECT 
                            AccountList.GroupID,
                            AccountList.AccountID, 
                            AccountList.InstallmentAmount, 
                            AccountList.attendStatus, 
                            AccountList.ClientID, 
                            AccountList.withDraw, 
                            AccountList.savings,
                            Totalpkm.userName,
                            Totalpkm.trxdate
                        FROM AccountList 
                        INNER JOIN Totalpkm ON Totalpkm.GroupID = AccountList.GroupID 
                        WHERE AccountList.GroupID = ` + id
        var queryUP =   `SELECT 
                            UpAccountList.ClientID, 
                            JumlahUP 
                        FROM UpAccountList 
                        INNER JOIN Totalpkm ON UpAccountList.GroupID = Totalpkm.GroupID 
                        WHERE UpAccountList.GroupID = ` + "'" + id + "' " + "AND status = '1'"
        var querySign = `SELECT 
                            userName,
                            GroupID,
                            IDKetuaKelompok,
                            trxdate,
                            longitude,
                            latitude,
                            TtdKetuaKelompok,
                            TtdAccountOfficer
                        FROM Totalpkm
                        WHERE GroupID = ` + id

        const SelectDatapkm = (queryjoin) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryjoin, [], (tx, results) => {
                            let dataLength = results.rows.length
                            var datapkm = []
                            for(let a = 0; a < dataLength; a++) {
                                datapkm.push(results.rows.item(a))
                            }

                            resolve (datapkm)
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const SelectDataup = (queryUP) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryUP, [], (tx, results) => {
                            let dataLength = results.rows.length
                            var dataup = []
                            for(let a = 0; a < dataLength; a++) {
                                dataup.push(results.rows.item(a))
                            }

                            resolve (dataup)
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const SelectDatasign = (querySign) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(querySign, [], (tx, results) => {
                            resolve (results.rows.item(0))
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const CollectDatapkm = await SelectDatapkm(queryjoin)
        const CollectDataup = await SelectDataup(queryUP)
        const CollectDatasign = await SelectDatasign(querySign)
        
        var dataSync = { "pkm": CollectDatapkm, "up": CollectDataup, "sign": CollectDatasign }

        // console.log(dataSync)

        const token = await AsyncStorage.getItem('token');
        if (_DEV_) console.log('ACTIONS TOKEN', token);

        const timeOut = (milisecond, promise) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error("Request Timeout, perhatikan jaringan anda lalu coba sync beberapa saat lagi."))
                }, milisecond)
                promise.then(resolve, reject)
            })
        }

        if(CollectDatapkm.length > 0 ) {
            try{
                console.log(ApiSync+PostPKM)
                timeOut(60000, fetch(ApiSync+PostPKM, {
                    method: 'POST',
                    headers: {
                        Authorization: token,
                        Accept: 'application/json',
                                'Content-Type': 'application/json'
                        },
                    body: JSON.stringify(dataSync)
                }))
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)

                    console.log(responseJson)
                    if(responseJson.ResponseStatus === true) {
                        flashNotification("Success", "Data berhasil di proses", "#ffbf47", "#fff")

                        setLoading(false)

                        var queryUpdate = `UPDATE GroupList SET Status = '5' WHERE GroupID = '` + id + `'`

                        setIsSync(true)
                        setButtonPkm(true)
                        setButtonUp(true)
                        setButtonSync(true)

                        db.transaction(
                            tx => {
                                tx.executeSql("DELETE FROM AccountList WHERE GroupID = '" + id + "'")
                                tx.executeSql("DELETE FROM pkmTransaction WHERE GroupID = '" + id + "'")
                                tx.executeSql("DELETE FROM Totalpkm WHERE GroupID = '" + id + "'")
                                tx.executeSql(queryUpdate)
                            },function(error) {
                                console.log('Transaction ERROR: ' + error.message);
                              }, function() {
                                console.log('Delete Table OK');
                          }
                        )
                    }else{
                        setLoading(false)
                        flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + responseJson.Message, "#ff6347", "#fff")
                    }
                }).catch((error) => {
                    setLoading(false)
                    flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. \nError : " + error.message, "#ff6347", "#fff")
                })
            }catch(error){
                console.log("disini")
                setLoading(false)
                flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. Error : " + error, "#ff6347", "#fff")
            }
        }else{
            setLoading(false)
            flashNotification("Alert", "Data PKM telah di kirim", "#ff6347", "#fff")
        }

        setLoading(true)

    }

    return (
        <ImageBackground source={require("../../assets/Image/Background.png")} style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View
            style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM</Text>
                </TouchableOpacity>
            </View>

            <View style={{marginHorizontal: 20, marginTop: 20}}>
                {isLoaded ? 
                    <View>
                        <Text numberOfLines={2} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>{groupInfo.GroupName}</Text>
                        <View>
                            <Text style={{fontSize: 15, color: '#FFF'}}>{groupInfo.GroupID}</Text>
                            <Text numberOfLines={1} style={{fontSize: 15, color: '#FFF'}}>{branchid} - {branchName}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 10, marginRight: 10, alignItems: 'center', borderRadius: 5, padding: 5, backgroundColor: '#FFF', width: dimension.width/1.5}}>
                            <FontAwesome5 name="calculator" size={15} color="#2e2e2e" style={{marginRight: 5}} />
                            <Text>Jumlah Tagihan: Rp.{Number(groupInfo.JumlahTagihan)}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', marginTop: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5, backgroundColor: '#FFF'}}>
                                <FontAwesome5 name="calendar-alt" size={15} color="#2e2e2e" style={{marginRight: 5}} />
                                <Text>{currentDate}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5, backgroundColor: '#FFF'}}>
                                <FontAwesome5 name="user-friends" size={15} color="#2e2e2e" style={{marginRight: 5}} />
                                <Text>{groupInfo.AnggotaAktif}</Text>
                            </View>
                        </View>
                    </View>
                : 
                    <View style={{marginTop: 20, justifyContent: 'flex-start'}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold', color: '#FFF'}}>Mohon Tunggu...</Text>
                    </View>
                }
            </View>

            <View style={{flex: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#FFF', marginTop: 35, padding: 20}}>
                <View>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>Status Sync</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 5}}>
                        <View style={ isSync === true ? {width: dimension.width/2.5, padding: 5, alignItems: 'center', borderRadius: 20, backgroundColor: '#46995B'} : {borderWidth: 1, width: dimension.width/2.5, padding: 5, alignItems: 'center', borderRadius: 20}}>
                            <Text style={ isSync === true ? {fontWeight: 'bold', color: '#FFF'} : {fontWeight: 'bold', color: 'black'} }>Berhasil Sync</Text>
                        </View>
                        <View style={ isSync === true ? {borderWidth: 1, width: dimension.width/2.5, padding: 5, alignItems: 'center', borderRadius: 20} : {width: dimension.width/2.5, padding: 5, alignItems: 'center', borderRadius: 20, backgroundColor: '#C73D3D'}}>
                            <Text style={ isSync === true ? {fontWeight: 'bold', color: 'black'} : {fontWeight: 'bold', color: '#FFF'}}>Belum Sync</Text>
                        </View>
                    </View>
                </View>

                <View style={{marginTop: 30, flex: 1, padding: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>MENU</Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}>
                        <TouchableOpacity disabled={buttonPkm} onPress={() => navigation.navigate('GroupCollection', {groupid: groupid})} style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: buttonPkm === true ? '#CCCCC4' : '#32908F'}}>
                            <FontAwesome5 name="users" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: scale(20), color: '#FAFAF8'}}>PKM</Text> 
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={buttonUp} style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: buttonUp === true ? '#CCCCC4' : '#FF521B'}}>
                            <FontAwesome5 name="user-check" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: scale(20), color: '#FAFAF8'}}>UP</Text> 
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={buttonTtd} onPress={() => navigation.navigate('SignNew', {id: groupid, username: userName})} style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: buttonTtd === true ? '#CCCCC4' : '#9C482E'}}>
                            <FontAwesome5 name="signature" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: scale(15), color: '#FAFAF8'}}>Tanda Tangan</Text> 
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}>
                        <TouchableOpacity onPress={() => navigation.navigate('Report', {groupid: groupid, cabangid: branchid})} style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: '#E94F37'}}>
                            <FontAwesome5 name="clipboard-check" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: scale(17), color: '#FAFAF8'}}>Report</Text> 
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('PkmBermakna')} disabled={buttonPkmb} style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: buttonPkmb === true ? '#CCCCC4' : '#F4A634'}}>
                            <FontAwesome5 name="clipboard-list" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: scale(17), color: '#FAFAF8'}}>PKMB</Text> 
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => SyncData(groupid)} disabled={buttonSync} style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: buttonSync === true ? '#CCCCC4' : '#FAD133'}}>
                            <FontAwesome5 name="sync-alt" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: scale(20), color: '#FAFAF8'}}>Sync</Text> 
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            {loading &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            }

        </ImageBackground>
    )
}

export default MeetingMenu

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }
})