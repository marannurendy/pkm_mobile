import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, FlatList, Alert, ToastAndroid, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencyInput from 'react-native-currency-input';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import 'moment/locale/id';

const window = Dimensions.get('window')
import db from '../database/Database'
import { set } from 'react-native-reanimated';

export default function UpCollection(props) {

    const {id, groupname} = props.route.params
    const [listup, setListup] = useState([])
    const [listJumlahup, setListJumlahup] = useState([])
    const [totalTarik, setTotaltarik] = useState(0)
    const [jumlahnasabah, setjumlahnasabah] = useState(0)
    const [groupid, setGroupid] = useState()
    const [meetingday, setMeetingday] = useState()
    const [meetingtime, setMeetingtime] = useState()
    const [masterListup, setMasterlistup] = useState([])
    const [search, setSearch] = useState()
    const [status, setStatus] = useState([])
    const [masterUP, setMasterup] = useState([])
    const [submit, setSubmit] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()
    var hariIni = moment().format('LLLL')

    const FetchData = async() => {

        moment.locale('id');
        const tanggal = await AsyncStorage.getItem('TransactionDate')

        console.log(tanggal)

        db.transaction(
            tx => {
                setLoading(true)
                tx.executeSql("SELECT * FROM AccountList WHERE GroupID = " + id, [], (tx, results) => {
                    let datalength = results.rows.length

                    if(datalength == 0) {
                        setSubmit(true)
                    }
                }),

                tx.executeSql("SELECT * FROM UpAccountList WHERE GroupID = " + id, [], (tx, results) => {
                    let length = results.rows.length

                    var Helper = []
                    var fuckingHelper = []
                    for(let a = 0; a < length; a++) {
                        Helper.push(results.rows.item(a)) 
                        var data = results.rows.item(a).JumlahUP
                        var dt = results.rows.item(a)
                        fuckingHelper.push({'groupid': dt.GroupID,'clientid': dt.ClientID, 'jumlahup': dt.JumlahUP, 'status': ''})
                    }

                    setListup(Helper)
                    setMasterlistup(Helper)
                    setMasterup(fuckingHelper)

                }),

                tx.executeSql("SELECT * FROM Totalpkm WHERE GroupID = " + "'" + id + "'" + "AND trxdate = " + "'" + tanggal + "'", [], (tx, results) => {
                    let dataTotal = results.rows.item(0)

                    console.log('yang ini ' + dataTotal)

                    if(dataTotal.TtdAccountOfficer != null) {
                        setSubmit(true)
                    }

                    if(dataTotal != undefined) {
                        setTotaltarik(Number(dataTotal.TotalUP))
                        setjumlahnasabah(Number(dataTotal.TotalNasabahup))
                    }else{
                        setTotaltarik(0)
                        setjumlahnasabah(0)
                    }
                })
            },function(error) {
                ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.SHORT);
                // console.log('Transaction ERROR: ' + error.message);
            },function(){
                setLoading(false)
            }
        )
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            FetchData()
        })

    })

    const submitHandler = async() => {
        moment.locale('id');
        const tanggal = await AsyncStorage.getItem('TransactionDate')

        var findstat = listup.filter( ({ status }) => status === '1' );
        var lengthdata = findstat.length
        var statArr = []
        for(let a = 0; a < lengthdata; a++) {
            statArr.push(findstat[a].ClientID)
        }

        var datalength = statArr.length

        var submitUP = "UPDATE UpAccountList SET status = '1' where ClientID IN ("
        for(let b = 0; b < datalength; b++) {
            submitUP = submitUP + "'" + statArr[b] + "'"

            if (b != datalength - 1) {
                submitUP = submitUP + ", ";
            }
        }
        submitUP = submitUP + ");"

        var submitUPreverse = "UPDATE UpAccountList SET status = '0' where ClientID NOT IN ("
        for(let b = 0; b < datalength; b++) {
            submitUPreverse = submitUPreverse + "'" + statArr[b] + "'"

            if (b != datalength - 1) {
                submitUPreverse = submitUPreverse + ", ";
            }
        }
        submitUPreverse = submitUPreverse + ");"

        db.transaction(
            tx => {
                tx.executeSql("SELECT * FROM Totalpkm WHERE GroupID = " + "'" + id + "'" + "AND trxdate = " + "'" + tanggal + "'", [], (tx, results) => {
                    console.log("SELECT * FROM Totalpkm WHERE GroupID = " + "'" + id + "'" + "AND trxdate = " + "'" + tanggal + "'")
                    let dataTotal = results.rows.item(0)

                    if(dataTotal != undefined) {
                        db.transaction(
                            tx => {
                                tx.executeSql("UPDATE Totalpkm SET TotalUP = " + "'" + totalTarik + "', " + "TotalNasabahup = " + "'" + jumlahnasabah + "', " + "trxdate = " + "'" + tanggal + "' " + "WHERE GroupID = " + "'" + id + "'" + "AND trxdate = " + "'" + tanggal + "'")
                            },function(error) {
                                ToastAndroid.show("Ada kesalahan penginputan : " + error + " Mohon periksa kembali atau hubungi Helpdesk", ToastAndroid.LONG);
                            },function() {
                                db.transaction(
                                    tx => {
                                        tx.executeSql(submitUP)
                                    },function(error) {
                                        ToastAndroid.show("Ada kesalahan penginputan : " + error + " Mohon periksa kembali atau hubungi Helpdesk", ToastAndroid.LONG);
                                    },function() {
                                        db.transaction(
                                            tx => {
                                                tx.executeSql(submitUPreverse)
                                            },function(error) {
                                                ToastAndroid.show("Ada kesalahan penginputan : " + error + " Mohon periksa kembali atau hubungi Helpdesk", ToastAndroid.LONG)
                                            },function() {
                                                Alert.alert(
                                                    "Sukses",
                                                    "Tarik UP Berhasil Dilakukan",
                                                    [
                                                      { text: "OK", onPress: () => navigation.navigate("Menu", {groupid: id}) }
                                                    ],
                                                    { cancelable: false }
                                                )
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }else{
                        Alert.alert(
                            "Alert!",
                            "Silahkan Lakukan PKM Terlebih dahulu",
                            [
                              { text: "OK", onPress: () => navigation.navigate("Menu", {groupid: id}) }
                            ],
                            { cancelable: false }
                        )
                    }
                })
            }
        )
    }

    const renderItem = ({ item }) => (
        <Item data={item} />    
    )

    const Item = ({ data }) => {

        const BatalHandler = () => {
            let dataLength = listup.length
            var arrayHelper = []

            for(let d = 0; d < dataLength; d++) {
                arrayHelper.push(listup[d].ClientID)
            }

            let thisindex = arrayHelper.indexOf(data.ClientID)
            let newArr = [...listup]
            newArr[thisindex].status = '0'

            setListup(newArr)

            setjumlahnasabah(Number(jumlahnasabah) - Number(1))
            setTotaltarik(Number(totalTarik) - Number(data.JumlahUP))
        }
        
        const TarikHandler = () => {
            let dataLength = listup.length
            var arrayHelper = []

            for(let d = 0; d < dataLength; d++) {
                arrayHelper.push(listup[d].ClientID)
            }

            let thisindex = arrayHelper.indexOf(data.ClientID)
            let newArr = [...listup]
            newArr[thisindex].status = '1'

            setListup(newArr)

            setjumlahnasabah(Number(jumlahnasabah) + Number(1))
            setTotaltarik(Number(totalTarik) + Number(data.JumlahUP))

        }

        return(
        <View style={{ backgroundColor: '#fff', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 10,  backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                                            
                    <View style={{ flexDirection: 'column' }}> 
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account-multiple" color={'black'} size={26} />
                            <View style={{ width: window.width/2, flexDirection: 'column' }}>
                                <Text style={ styles.groupList }>{data.ClientName}</Text>
                                <Text style={{ fontSize: 10, paddingLeft: 10 }}>{data.ClientID}</Text>
                            </View> 
                        </View>
                                                                    
                                                
                        <View style={{ paddingTop: 10 }}>
                            <View style={styles.upBorder}>
                            <CurrencyInput
                                value={data.JumlahUP}
                                unit="Rp "
                                delimiter=","
                                separator="."
                                precision={0}

                                style={{
                                    fontSize: 12,
                                    color: "black"
                                }}
                                editable={false}
                            />
                        </View>
                        </View>
                    </View>
                </View>                                            
                <View>
                    <TouchableOpacity 
                        style={{  backgroundColor: data.status === '1' ? "red" : "#28b358", elevation: 8, borderRadius: 5, height: window.height/25, width: window.width/6.0, justifyContent: 'center' }}
                        onPress={() => data.status === '1' ? BatalHandler() : TarikHandler()}
                    >
                        {data.status === '1' ? 
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>BATAL</Text> :
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>TARIK</Text>                                               
                        }  
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )}

    const updateSearch = (text) => {
        console.log(text)

        if (text) {
            const newData = listup.filter(function (item) {
            const itemData = item.ClientName
            ? item.ClientName.toUpperCase()
            : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        })

            setListup(newData)
            setSearch(text)          

        } else {
            setListup(masterListup)
            setSearch(text)
        }
    }

    return(
        <View style={styles.headerWrapper}>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/>
            <View style={styles.headerCardContainer}>
                <View style={styles.groupDetailWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                        <Text style={{ paddingLeft: 20,fontSize: 17 }}>{id + ' - ' + groupname}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="calendar-multiselect" color='black' size={25} />
                        <Text style={{ paddingLeft: 20, fontSize: 17 }}>{hariIni}</Text>
                    </View>
                </View>
                <View opacity={0.8} style={{ alignItems: 'center', padding: 10 }}>
                    <SearchBar
                        platform="android"
                        containerStyle={{
                            borderRadius: 20,
                            backgroundColor: '#fff',
                            width: 320,
                            height: 30,
                        }}
                        inputContainerStyle={{
                            height: 15
                        }}
                        placeholder="Cari Nama Nasabah" 
                        onChangeText={(text) => updateSearch(text)}
                        value={search} 
                    />
                </View>
            </View>

            <FlatList
                    data={listup}
                    renderItem={renderItem}
                    keyExtractor={item => item.ClientID}
            />

            <View style={styles.buttomBarWrapper}>
                <View>
                <View style={styles.totalSetoranStyle}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>Total Tarik UP :</Text>
                    <Text style={{ color: '#fff', fontSize: 18 }}>{Number(totalTarik)}</Text>
                </View>
                <View>
                    <View style={styles.totalAngsuranStyle}>
                        <Text style={{ color: '#adadad', fontSize: 15 }}>Jumlah Nasabah :</Text>
                        <Text style={{ color: '#adadad', fontSize: 15 }}>{jumlahnasabah}</Text>
                    </View>
                </View>
                </View>
                <View>
                    <View>
                        <TouchableOpacity 
                            disabled={submit}
                            style={{
                                elevation: 8,
                                borderRadius: 5,
                                backgroundColor: submit === false ? "#28b358" : "#E6E6E6",
                                height: window.height/20,
                                width: window.width/3.7,
                                justifyContent: 'center'
                            }}
                            onPress={() => submitHandler()
                        }>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                    
                    
            </View>

                {loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                } 

        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 15,
    },
    textTitle: {
        textAlign: 'center'
    },
    headerWrapper:{
        flex: 1,
    },
    headerCardContainer: {
        backgroundColor: '#0D67B2',
        height: window.height/5,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        padding: 15
    },
    groupDetailWrapper: {
        backgroundColor: '#fff',
        height: window.height/9,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },
    DetailTextStyle: {
        fontSize: 15
    },
    accountContainer: {
        backgroundColor: '#E6E6E6',
        borderRadius: 20,
        borderRadius: 10,
        height: window.height/18,
        width: window.width/1.2,
        paddingLeft: 10,
        padding: 5
    },
    RadioStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    Detailtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    currencyInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 0,
        height: window.height/18,
        width: window.width/2.5
    },
    currrencyContainer: {
        alignItems: 'flex-end'
    },
    deviderStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.7,
        width: window.width/1.5,
        padding: 10,
    },
    paymentStyle: {
        fontSize: 16
    },
    totalDepoStyle: {
        borderBottomWidth: 1,
        height: window.height/18,
        width: window.width/3.0
    },
    buttomBarWrapper: {
        backgroundColor: '#0D67B2',
        height: window.height/7,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    totalCollectStyle: {
        height: window.height/18,
        width: window.width/3.0
    },
    totalSetoranStyle: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',

    },
    totalAngsuranStyle: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    submitButtonContainer: {
        elevation: 8,
        borderRadius: 5,
        backgroundColor: "#28b358",
        height: window.height/20,
        width: window.width/3.7,
        justifyContent: 'center'
    },
    groupList: {
        fontSize: 13,
        fontWeight: 'bold',
        paddingLeft: 10,
        flexWrap: 'wrap',
        flex: 3,
    },
    upBorder: {
        borderWidth: 1,
        borderRadius: 10,
        height: window.height/20,
        width: window.width/2.5
    },
    clientName: {
        flexWrap: 'wrap',
        flex: 0.2
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
})