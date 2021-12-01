import React, { useEffect } from 'react'
import { View, ImageBackground, Dimensions, StyleSheet, StatusBar, Alert, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {ApiSync} from '../../dataconfig/index'
import moment from 'moment'
import 'moment/locale/id'

const window = Dimensions.get('window')
import db from '../database/Database';
import IndividualMeeting from './IndividualMeeting'

export default function SplashScreen() {

    const navigation = useNavigation()
    moment.locale('id');
    var today = moment().format('YYYY-MM-DD')

    const DeleteData = () => {
        try{
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
                }, function() {
                    AsyncStorage.removeItem('userData')
                    navigation.replace('Login')
                }
            )
        }catch{
            ToastAndroid.show("Something Went Wrong : " + error, ToastAndroid.SHORT)
        }
    }

    const AutoSyncPKM = () => {
        console.log('masuk')
        moment.locale('id');
        var tanggal = moment().format('YYYY-MM-DD')
        
        var ts = this
        var queryjoin = "SELECT * FROM pkmTransaction INNER JOIN Totalpkm ON Totalpkm.GroupID = pkmTransaction.GroupID WHERE Totalpkm.TtdKetuaKelompok IS NOT NULL"
        var queryUP = "SELECT UpAccountList.ClientID, JumlahUP, TtdAccountOfficer, TtdKetuaKelompok FROM UpAccountList INNER JOIN Totalpkm ON UpAccountList.GroupID = Totalpkm.GroupID WHERE status = '1' AND Totalpkm.TtdKetuaKelompok IS NOT NULL"

        console.log(queryUP)

        try{
            db.transaction(
                tx => {
                    console.log('kesini')
                    tx.executeSql(queryUP, [], (tx, results) => {
                        let datalengthUP = results.rows.length

                        console.log('ini up ')

                        if(datalengthUP != 0) {
                            var ArrayHelp = []
                            var upArray = []
                            const dataForm = new FormData()
    
                            for(let a = 0; a < datalengthUP; a++) {
                                var dt = results.rows.item(a)
                                ArrayHelp.push(results.rows.item(a))
                                dataForm.append('clientid',dt.ClientID)
                                dataForm.append('jumlahup',Number(dt.JumlahUP))
                                dataForm.append('TtdAccountOfficer',dt.TtdAccountOfficer)
                                dataForm.append('TtdKetuaKelompok',dt.TtdKetuaKelompok)
                                
                                upArray.push(dt.ClientID)
                            }
    
                            try {
                                let UpSync = ApiSync + 'ReqShitUPnew'
                                return fetch(UpSync, {
                                method:'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'multipart/form-data'
                                },
                                body: dataForm,
                                })
                                .then((response) => response.text())
                                .then((responseText) => {
                                    db.transaction(
                                        tx => {
                                            for(let p = 0; p < datalengthUP; p++) {
                                                tx.executeSql("DELETE FROM UpAccountList WHERE ClientID = '" + upArray[p] + "'")
                                            }
                                        },function(error) {
                                            console.log('Transaction ERROR: ' + error.message);
                                        },function() {
                                            console.log('Delete Table OK');
                                      }
                                    )
                                })
                            } catch(error) {
                                ToastAndroid.show("error input UP: " + error.message, ToastAndroid.SHORT);
                            }            
                        }
                    },function(error) {
                        console.log('kesini bos')
                        console.log('Transaction ERROR: ' + error.message);
                    },function() {
                        console.log('suskes')
                  })
                },function(error) {
                    console.log(error.message)
                    ToastAndroid.show("Something Went Wrong : " + error, ToastAndroid.SHORT)
                },function() {
                    try{
                        db.transaction(
                            tx => {
                                tx.executeSql(queryjoin, [], (tx, results) => {
                                    let datalength = results.rows.length

                                    console.log('ini pkm ' + datalength)

                                    if(datalength != 0) {

                                        var HelperCoy = []
                                        const dataForm = new FormData()
                                        for(let a = 0; a < datalength; a++) {
                                            var dt = results.rows.item(a)
                                            HelperCoy.push(results.rows.item(a))

                                            dataForm.append('AccountID',dt.AccountID)
                                            dataForm.append('Angsuran',dt.Angsuran)
                                            dataForm.append('Attendance',dt.Attendance)
                                            dataForm.append('ClientID',dt.ClientID)
                                            dataForm.append('ClientName',dt.ClientName)
                                            dataForm.append('GroupID',dt.GroupID)
                                            dataForm.append('IDKetuaKelompok',dt.IDKetuaKelompok)
                                            dataForm.append('KetuaKelompok',dt.KetuaKelompok)
                                            dataForm.append('MeetingDay',dt.MeetingDay)
                                            dataForm.append('ProductID',dt.ProductID)
                                            dataForm.append('Setoran',dt.Setoran)
                                            dataForm.append('Tarikan',dt.Tarikan)
                                            dataForm.append('Titipan',dt.Titipan)
                                            dataForm.append('TotalAngsuran',dt.TotalAngsuran)
                                            dataForm.append('TotalSetor',dt.TotalSetor)
                                            dataForm.append('TotalSetoran',dt.TotalSetoran)
                                            dataForm.append('TotalTitipan',dt.TotalTitipan)
                                            dataForm.append('TotalUP',dt.TotalUP)
                                            dataForm.append('TtdAccountOfficer',dt.TtdAccountOfficer)
                                            dataForm.append('TtdKetuaKelompok',dt.TtdKetuaKelompok)
                                            dataForm.append('userName',dt.userName)
                                            dataForm.append('CreatedDate',dt.trxdate)
                                            
                                        }

                                        Alert.alert(
                                            "Alert",
                                            "Anda Memiliki riwayat PKM yang belum di sync, semua riwayat masukan akan dikirim.",
                                            [
                                              { text: "OK", onPress: () => {

                                                try{
                                                    let PkmSync = ApiSync + 'ReqShit'
                                                    return fetch(PkmSync, {
                                                        method:'POST',
                                                        headers: {
                                                            'Accept': 'application/json',
                                                            'Content-Type': 'multipart/form-data'
                                                        },
                                                        body: dataForm,
                                                    })
                                                    .then((response) => response.text())
                                                    .then((responseText) => {
                    
                                                        Alert.alert(
                                                            "Sukses",
                                                            "Data Berhasil Dikirim",
                                                            [
                                                              { text: "OK", onPress: () => {
                                                                  db.transaction(
                                                                      tx => {
                                                                          tx.executeSql("DELETE FROM AccountList")
                                                                          tx.executeSql("DELETE FROM pkmTransaction")
                                                                          tx.executeSql("DELETE FROM Totalpkm WHERE")
                                                                      },function(error) {
                                                                          console.log('Transaction ERROR: ' + error.message);
                                                                        }, function() {
                                                                            console.log('Delete Table OK');
                                                                    }
                                                                  )
                                                              } }
                                                            ],
                                                            { cancelable: false }
                                                        )
                                                    })
                                                }catch(error){
                                                    alert("error sync PKM: " + error.message)
                                                }
                                                    
                                              }}
                                            ],
                                            { cancelable: false }
                                        )
                                    }
                                })
                            },function(error) {
                                console.log('Transaction ERROR: ' + error.message);
                              }, function() {

                                    var submitpar = "SELECT * FROM DetailPAR"

                                    try{
                                        db.transaction(
                                            tx => {
                                                tx.executeSql(submitpar, [], (tx, results) => {
                                                    var panjangData = results.rows.length
                                                    
                                                    if(panjangData != 0) {
                                                        var ArrayHelp = []
                                                        var parArray = []
                                                        const dataForm = new FormData()
                                
                                                        for(let a = 0; a < panjangData; a++) {
                                                            var dt = results.rows.item(a)
                                                            ArrayHelp.push(results.rows.item(a))
                                                            dataForm.append('AOSign',dt.AOSign)
                                                            dataForm.append('accountid',dt.accountid)
                                                            dataForm.append('cabangid',dt.cabangid)
                                                            dataForm.append('clientSign',dt.clientSign)
                                                            dataForm.append('clientid',dt.clientid)
                                                            dataForm.append('createdby',dt.createdby)
                                                            dataForm.append('groupid',dt.groupid)
                                                            dataForm.append('jumlahpar',dt.jumlahpar)
                                                            dataForm.append('CreatedDate',tanggal)
                                
                                                            parArray.push(dt.clientid)
                                                        }
                                                        // console.log(ArrayHelp)
                                
                                                        Alert.alert(
                                                            "Alert",
                                                            "Anda Memiliki riwayat PKM INDIVIDUAL yang belum di sync, semua riwayat masukan akan dikirim.",
                                                            [
                                                              { text: "OK", onPress: () => {

                                                                    try{
                                                                        let IndividualSync = ApiSync + 'PostPKMIndividual'
                                                                        return fetch(IndividualSync, {
                                                                            method:'POST',
                                                                            headers: {
                                                                                'Accept': 'application/json',
                                                                                'Content-Type': 'multipart/form-data'
                                                                            },
                                                                            body: dataForm,
                                                                        })
                                                                        .then((response) => response.text())
                                                                        .then((responseText) => {
                                        
                                                                            Alert.alert(
                                                                                "Sukses",
                                                                                "Data Berhasil Dikirim",
                                                                                [
                                                                                { text: "OK", onPress: () => {
                                                                                    db.transaction(
                                                                                        tx => {
                                                                                            for(let p = 0; p < panjangData; p++) {
                                                                                                tx.executeSql("DELETE FROM PAR_AccountList WHERE ClientID = '" + parArray[p] + "'")
                                                                                                tx.executeSql("DELETE FROM DetailPAR WHERE clientid = '"+ parArray[p] +"'")
                                                                                            }
                                                                                        },function(error) {
                                                                                            console.log('Transaction ERROR: ' + error.message);
                                                                                        },function() {
                                                                                                console.log('Delete Table OK');
                                                                                        }
                                                                                    )
                                                                                } }
                                                                                ],
                                                                                { cancelable: false }
                                                                            )
                                                                        })
                                                                    }catch(error){
                                                                        alert("error sync PKM INDIVIDUAL: " + error.message)
                                                                    }
                                                                    
                                                              }}
                                                            ],
                                                            { cancelable: false }
                                                        )
                                                        
                                                    }
                                                })
                                            },function(error) {
                                                console.log('Transaction ERROR: ' + error.message);
                                            },function() {
                                                DeleteData()
                                            }
                                        )
                                    }catch{
                                        ToastAndroid.show("Something Went Wrong : " + error, ToastAndroid.SHORT)
                                    }
                              }
                        )
                    }catch{
                        ToastAndroid.show("Something Went Wrong : " + error, ToastAndroid.SHORT)
                    }
                }
            )
        }catch{
            ToastAndroid.show("Something Went Wrong : " + error, ToastAndroid.SHORT)
        }
    }

    useEffect(() => {
        setTimeout( () => {

            AsyncStorage.getItem('SyncDate', (error, result) => {
                var SyncDate = result

                console.log(SyncDate)

                if(SyncDate != null) {
                    if(today != SyncDate) {
                        AutoSyncPKM()
                    }else{
                        console.log('ini kalau sama')
                        AsyncStorage.getItem('userData', (error, result) => {
                            const dt = JSON.parse(result);
                    
                            if(dt != null) {
                                navigation.replace('FrontHome')
                            }else{
                                navigation.replace('Login')
                            }
                                
                        })
                    }
                }else{
                    AsyncStorage.getItem('userData', (error, result) => {
                        const dt = JSON.parse(result);
                
                        if(dt != null) {
                            navigation.replace('FrontHome')
                        }else{
                            navigation.replace('Login')
                        }
                            
                    })
                }

                
            })

        }, 3000)
    }, [navigation])

    return(
        <View>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
            <ImageBackground
                source={require("../images/Splash.png")}
                style={styles.background}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%"
      },
})
