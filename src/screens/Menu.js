import React from 'react';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar, Alert, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiSync, PostPKM} from '../../dataconfig/index'
import moment from 'moment';
import { showMessage } from "react-native-flash-message"
import 'moment/locale/id';

import db from '../database/Database';
// import { deleteDatabase } from 'react-native-sqlite-storage';

const window = Dimensions.get('window');


function DetailPKM(props) {

    // var day = String;
    var dayid = props.meetingday
    var day = (dayid == 2 ? 'Senin' : dayid == 3 ? 'Selasa' : dayid == 4 ? 'Rabu' : dayid == 5 ? 'Kamis' : dayid == 6 ? 'Jumat' : dayid == 7 ? 'Sabtu' : '');
    return(
        <View>
            <Text> {day} </Text>
            <Text> {props.anggotaAktif} </Text>
            <CurrencyInput
                value={props.jumlahTagihan}
                unit="Rp "
                delimiter=","
                separator="."
                precision={0}
                editable= {false}
                style={{
                    color: '#000000',
                    fontSize: 14,
                    paddingTop: 0,
                    height: 30
                }}
            />
        </View>
    );
}

function MeetingDetail(props) {
    return(
        <View>
            <Text style={{ paddingLeft: 5 }}>Alamat :</Text>
            <Text style={{ paddingLeft: 15, fontSize: 15 }}>{ props.meetingAddress }</Text>
            <Text style={{ paddingLeft: 5, paddingTop: 5 }}>Waktu Pertemuan :</Text>
            <Text style={{ paddingLeft: 15, fontSize: 15 }}>{ props.meetingTime }</Text>
        </View>
    )
}

const dataSync = {"pkm" : [], "up" : [], "sign": []}

export default class Menu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            groupid : props.route.params.groupid,
            groupname : props.route.params.groupname,
            username : props.route.params.username,
            groupList : [],
            statusTtd : true,
            statusPkm : false,
            statusSync : true,
            statusPar : true,
            tarikUP : false,
            branchID : '', 
            namaCabang : '',
            Username : '',
            AOname : '',
            loading : false,
            existingUP : [],
            nip : '',
            dataUp : [],
            dataPkm : [],
            sign : []
        }

        var query = 'SELECT DISTINCT * FROM GroupList where GroupID = ';
        query = query + this.state.groupid;
        var queryHeader = 'SELECT * FROM Totalpkm where GroupID = ';
        queryHeader = queryHeader + this.state.groupid
        
        // console.log(query);
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    let dataLength = results.rows.length;
                  //   alert(dataLength);
                    let helperArray = [];
                    for(let d = 0; d < dataLength; d++) {
                        helperArray.push(results.rows.item(d));
                    }
                    this.setState({
                        groupList: helperArray,
                    });
                    // console.log(this.state.groupList);

                },
                tx.executeSql(queryHeader, [], (tx, results) => {
                    let dataLength = results.rows.length
                    // alert(dataLength)
                    var tes = this
                    
                    if(dataLength > 0) {
                        tes.setState({
                            status: false
                        })
                    }else{
                        tes.setState({
                            status: true
                        })
                    }
                }));
            }
        )
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    componentDidMount(){

        moment.locale('id');
        const tanggal = AsyncStorage.getItem('TransactionDate')
        console.log(tanggal)
            this._unsubscribe = this.props.navigation.addListener('focus', () => {
                var query = 'SELECT DISTINCT * FROM GroupList where GroupID = ';
                query = query + this.state.groupid;
                var queryHeader = 'SELECT * FROM Totalpkm where GroupID = ';
                queryHeader = queryHeader + this.state.groupid + " AND TotalSetoran IS NOT NULL";
                var queryCekSync = "SELECT TtdKetuaKelompok, TtdAccountOfficer FROM Totalpkm where GroupID = ";
                queryCekSync = queryCekSync + this.state.groupid;
                var cekup = "SELECT * FROM DetailUP";
                var queryCekSign = "SELECT * FROM Totalpkm WHERE GroupID = " + "'" + this.state.groupid + "'" + "AND trxdate = " + "'" + tanggal + "'" + "AND TtdKetuaKelompok IS NOT NULL"

                db.transaction(
                    tx => {
                        tx.executeSql(query, [], (tx, results) => {
                            let dataLength = results.rows.length;
                            let helperArray = [];
                            for(let d = 0; d < dataLength; d++) {
                                helperArray.push(results.rows.item(d));
                            }
                            this.setState({
                                groupList: helperArray,
                            });
                        }),
                        tx.executeSql(queryHeader, [], (tx, results) => {
                            let dataLength = results.rows.length
                            var tes = this
                            
                            if(dataLength > 0) {
                                tes.setState({
                                    statusTtd: false
                                })
                            }else{
                                tes.setState({
                                    statusTtd: true
                                })
                            }
                        }),
                        tx.executeSql(queryCekSync, [], (tx, results) => {
                            let a = results.rows.item(0)
                            var verifTtd = a.TtdKetuaKelompok
                            var verifAO = a.TtdAccountOfficer
                            var test = this

                            if(verifTtd != null && verifAO != null) {
                                // console.log('ngga null')
                                test.setState({
                                    statusSync: false
                                })
                            }else{
                                // console.log('null nih')
                                test.setState({
                                    statusSync: true
                                })
                            }
                        }),
                        tx.executeSql(cekup, [], (tx, results) => {
                            let panjangtest = results.rows.length
                            var arrTest = []
                            for(let a = 0; a < panjangtest; a++) {
                                arrTest.push(results.rows.item(a))
                            }
                        }),
                        tx.executeSql(queryCekSign, [], (tx, results) => {
                            let cekSignLength = results.rows.length

                            if(cekSignLength != 0) {
                                this.setState({
                                    statusTtd : true
                                })
                            }
                        })
                    }
                )

                AsyncStorage.getItem('userData', (error, result) => {
                    const dt = JSON.parse(result);
                    this.setState({
                        branchID: dt.kodeCabang,
                        namaCabang: dt.namaCabang,
                        Username: dt.userName,
                        AOname: dt.AOname,
                        nip: dt.nip,
                    })
                })
            });
          
    }

    async syncTest(id) {
        moment.locale('id');
        var tanggal = moment().format('YYYY-MM-DD')

        // this.setState({
        //     loading: true
        // })

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
        
        var ts = this
        var queryHeader = 'SELECT * FROM Totalpkm WHERE GroupID = ' + id
        var queryFuck = 'SELECT * FROM pkmTransaction WHERE GroupID = ' + id
        var queryjoin = `SELECT 
                            pkmTransaction.GroupID,
                            pkmTransaction.AccountID, 
                            pkmTransaction.Angsuran, 
                            pkmTransaction.Attendance, 
                            pkmTransaction.ClientID, 
                            pkmTransaction.Setoran, 
                            pkmTransaction.Tarikan, 
                            pkmTransaction.Titipan,
                            Totalpkm.userName,
                            Totalpkm.trxdate
                        FROM pkmTransaction 
                        INNER JOIN Totalpkm ON Totalpkm.GroupID = pkmTransaction.GroupID 
                        WHERE pkmTransaction.GroupID = ` + id
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
                            TtdKetuaKelompok,
                            TtdAccountOfficer,
                            trxdate,
                            longitude,
                            latitude
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
                            // let dataLength = results.rows.length
                            // var datasign = []
                            // for(let a = 0; a < dataLength; a++) {
                            //     datasign.push(results.rows.item(a))
                            // }

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
        // var dataSyncs = { "pkm": CollectDatapkm, "up": CollectDataup,  }

        console.log(dataSync)

        if(CollectDatapkm.length > 0 ) {
            try{
                return fetch(ApiSync+PostPKM, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                                    'Content-Type': 'application/json'
                            },
                        body: JSON.stringify(dataSync)
                    })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    if(responseJson.ResponseStatus === true) {
                        flashNotification("Success", "Data berhasil di proses", "#ffbf47", "#fff")
                        this.setState({
                            loading: false
                        })
                        db.transaction(
                            tx => {
                                tx.executeSql("DELETE FROM AccountList WHERE GroupID = '" + id + "'")
                                tx.executeSql("DELETE FROM pkmTransaction WHERE GroupID = '" + id + "'")
                                tx.executeSql("DELETE FROM Totalpkm WHERE GroupID = '" + id + "'")
                            },function(error) {
                                console.log('Transaction ERROR: ' + error.message);
                              }, function() {
                                  console.log('Delete Table OK');
                          }
                        )
                    }else{
                        flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + responseJson.Message, "#ff6347", "#fff")
                        this.setState({
                            loading: false
                        })
                    }
                })
            }catch(error){
                flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error, "#ff6347", "#fff")
                this.setState({
                    loading: false
                })
            }
        }else{
            flashNotification("Alert", "Data PKM telah di kirim", "#ff6347", "#fff")
        }
    }

    render() {

        // alert(this.state.groupid);        

        const {groupid, groupname, username} = this.state;

        return(
            <View style={styles.container}>
                <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = 'transparent' translucent={true}/>
                <View style={styles.rectStack}>
                    <View style={styles.rect}>
                        <View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                            <Text style={styles.groupTitle}>{this.state.branchID} - {this.state.namaCabang}</Text>
                        </View>
                        <View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                            <Text style={styles.groupTitle2}>{groupid} - {groupname}</Text>
                        </View>
                    </View>
                    <View style={styles.rect2}>
                        <View style={{ padding:15 }}>
                            <Text>Hari PKM</Text>
                            <Text>Anggota Aktif</Text>
                            <Text>Jumlah Tagihan</Text>
                        </View>
                        <View style={{ padding:15 }}>
                        {this.state.groupList.map((item, index) => (
                            <View key={index}>
                                <DetailPKM meetingday={item.MeetingDay} anggotaAktif={item.AnggotaAktif} jumlahTagihan={item.JumlahTagihan} />
                            </View>
                        ))}   
                        </View>
                        
                    </View>
                </View>
                <ScrollView>
                    <View>
                        <View style={{ flexDirection:'row', justifyContent: 'space-evenly', padding: 10 }}>
                            <TouchableOpacity disabled={this.state.statusPkm} onPress={() => this.props.navigation.navigate('Meeting', {id : groupid, group : groupname})} >
                                <View style={{ alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="account-group" color={this.state.statusPkm == false ? "#0D67B2" : "#E6E6E6"} size={60}
                                    />
                                    <Text style={styles.logoLable}>PKM</Text>
                                </View>
                            </TouchableOpacity> 
                            <TouchableOpacity disabled={this.state.tarikUP} onPress={() => this.props.navigation.navigate('UpCollection', {id : groupid, groupname : groupname})} >
                                <View style={{ alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="currency-usd-circle-outline" color={this.state.tarikUP == false ? "#0D67B2" : "#E6E6E6"} size={60} />
                                    <Text style={styles.logoLable}>Tarik UP</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection:'row', justifyContent: 'space-evenly', padding: 10 }}>
                            {/* <TouchableOpacity disabled={this.state.statusTtd} onPress={() => this.props.navigation.navigate('Sign', {id: groupid, username: username})}> */}
                            <TouchableOpacity disabled={this.state.statusTtd} onPress={() => this.props.navigation.navigate('SignNew', {id: groupid, username: username})}>
                                <View style={{ alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="account-check" color={this.state.statusTtd == false ? "#0D67B2" : "#E6E6E6"} size={60} />
                                    <Text style={styles.logoLable}>Ttd</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Report', {groupid: this.state.groupid, cabangid: this.state.branchID})}>
                                <View style={{ alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="download-outline" color={'#0D67B2'} size={60} />
                                    <Text style={styles.logoLable}>Report</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection:'row', justifyContent: 'space-evenly', padding: 10 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Survei', {groupid: this.state.groupid, nip: this.state.nip})}>
                                <View style={{ alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="book-account" color={'#0D67B2'} size={60} />
                                    <Text style={styles.logoLable}>PKMB</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.state.statusSync} onPress={() => this.syncTest(groupid)}>
                                <View style={{ alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="database-sync" color={this.state.statusSync == false ? "#0D67B2" : "#E6E6E6"} size={60} />
                                    <Text style={styles.logoLable}>Sync Data</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </ScrollView>
                <View style={styles.meetingContainer}>
                    <View style={styles.meetingStyle}>
                        <View style={styles.cardBottomContainer}>
                            <View style={{ position: 'absolute', bottom: window.height/6.5, left: window.width/1.25}}>
                                <MaterialCommunityIcons name="map-marker" color={'#0D67B2'} size={40} />
                            </View>
                            <View style={{ padding: 10 }}>
                                {this.state.groupList.map((item,index) => (
                                    <View key={index}>
                                        <MeetingDetail meetingAddress={item.MeetingPlace} meetingTime={item.MeetingTime} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {this.state.loading &&
                        <View style={styles.loading}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                }   

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
      },
      rect: {
        width: window.width,
        height: window.width / 3.5,
        backgroundColor: "#0D67B2",
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        padding: 10,
        alignItems: 'center'
      },
      rect2: {
        flexDirection: 'row',
        top: 90,
        width: 250,
        height: 90,
        position: "absolute",
        backgroundColor: "#E6E6E6",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
      },
      rectStack: {
        width: window.width,
        height: window.width / 1.9,
        alignItems: 'center',
      },
      groupTitle: {
          color: '#fff',
          fontSize: 20,
          flexWrap: 'wrap',
          textAlign: 'center'
      },
      groupTitle2: {
        color: '#fff',
        fontSize: 17,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
      logoLable: {
          fontWeight: 'bold'
      },
      bottomParent: {
          width: window.width,
          height: window.width / 2.0,
          alignItems: 'center',
      },
      bottomContainer: {
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: "rgba(48,97,216,1)",
          top: 110,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
      },
      cardBottomContainer: {
        width: window.width/1.1,
        height: window.height/5.5,
        bottom: window.height/40,
        position: 'absolute',
        backgroundColor: "#E6E6E6",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
      },
      meetingContainer: {
          height: window.height/4.7,
          justifyContent: 'flex-end',
          alignItems: 'center',
        //   height: window.height/100
      },
      meetingStyle: {
        width: window.width,
        height: window.width / 10,
        backgroundColor: "#0D67B2",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center'
      },
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