import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, FlatList , Alert, ToastAndroid, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import CurrencyInput from 'react-native-currency-input';
import {ApiSync} from '../../dataconfig/index';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import 'moment/locale/id';

const window = Dimensions.get('window')
import db from '../database/Database'

export default function IndividualMeeting(props) {
    const {cabangid, uname} = props.route.params
    const[listpar, setListPar] = useState([])
    const[masterListpar, setMasterListpar] = useState([])
    const[search, setSearch] = useState()
    const[modalVisible, setModalVisible] = useState()
    const[branchID, setBranchID] = useState()
    const[namaCabang, setNamaCabang] = useState()
    const[Username, setUserName] = useState()
    const[AOname, setAOName] = useState()
    const[totalpar, setTotalpar] = useState([])
    const[nasabahTotal, setNasabahTotal] = useState()
    const[loading, setLoading] = useState(false)

    const navigation = useNavigation()
    moment.locale('id');
    var hariIni = moment().format('LLLL')

    const FetchdataPKMIndividual = () => {
        try{
            db.transaction(
                tx => {
                    setLoading(true)
                    tx.executeSql("SELECT * FROM PAR_AccountList WHERE OurBranchID = '"+cabangid+"' AND syncby = '" + uname + "'", [], (tx, results) => {
                        let length = results.rows.length

                        var Helper = []
                        var funckingHelper = []
                        var total = []
                        for(let a = 0; a < length; a++) {
                            Helper.push(results.rows.item(a)) 
                            let data = results.rows.item(a)
                            let shit = (data.JumlahUP == undefined) ? 0 : data.JumlahUP
                            var totpar = results.rows.item(a).status == null ? 0 : results.rows.item(a).jumlahbayar
                            total.push(totpar)
                            // console.log(shit)
                        }

                        // console.log(Helper)

                        var totalpar = total.reduce((a, v) => a = Number(a) + Number(v), 0 )
                        // console.log('this '+Helper[1].JumlahUP)

                        setListPar(Helper)
                        setMasterListpar(Helper)
                        setTotalpar(totalpar)

                    })
                },function(error) {
                    ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.LONG)
                },function(){
                    setLoading(false)
                    // console.log('sukses')
                }
            )
        }catch{
            ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.LONG)
        }
    }

    const MemoRender = useCallback(() => {
        FetchdataPKMIndividual()
    }, [])

    useEffect(() => {
        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);

            setBranchID(dt.kodeCabang)
            setNamaCabang(dt.namaCabang)
            setUserName(dt.userName)
            setAOName(dt.AOname)
        })

        const unsubscribe  = navigation.addListener('focus', () => {
            MemoRender()
        })

        // console.log(props.route.params.trigger)
        unsubscribe
    })

    const Item = ({ data }) => (
        <TouchableOpacity disabled={data.status == null ? false : true} onPress={() => navigation.navigate('FormPar', {clientid : data.ClientID, accountid : data.AccountID, jumlahpar: data.ODAmount, groupid: data.GroupID})}>
            <View style={{ backgroundColor: '#fff', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 10,  backgroundColor: data.status == null ? '#fff' : '#808080' }}>
                <AccountDetail  clientname={data.ClientName} clientid={data.ClientID} odamount={data.ODAmount} jumlahbayar={data.jumlahbayar} status={data.status} productid={data.ProductID} groupname={data.GroupName} />
            </View>
        </TouchableOpacity>
    )

    const AccountDetail = ({ clientname, clientid, odamount, jumlahbayar, status, productid, groupname }) => {
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                                        
                    <View style={{ flexDirection: 'column' }}> 
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                            <MaterialCommunityIcons name="account-multiple" color={'black'} size={26} />
                            <View style={{ width: window.width/1.35, flexDirection: 'column' }}>
                                <Text style={ styles.groupList }>{clientname}</Text>
                                <Text style={{ fontSize: 13, paddingLeft: 10 }}>{clientid}</Text>
                            </View> 
                        </View>

                        <Divider />

                        <View style={{ padding: 5 , paddingTop: 10}}>
                            <Text style={{ fontSize: 13, paddingLeft: 10 }}>Kode Product: {productid}</Text>
                            <Text style={{ fontSize: 13, paddingLeft: 10, width: window.width/1.5 }}>Nama Kelompok: {groupname}</Text>
                        </View>

                        <View style={{ paddingTop: 20, paddingLeft: 10 }}>
                            <View>
                                <Text style={{ padding: 5 }}>Jumlah Angsuran: </Text>
                                <CurrencyInput
                                    value={status == null ? odamount : jumlahbayar}
                                    unit="Rp "
                                    delimiter=","
                                    separator="."
                                    precision={0}
                                    style= {{
                                        fontSize: 14,
                                        color: 'black',
                                        backgroundColor: '#f2f2f2',
                                        borderRadius: 10,
                                        width: window.width/3,
                                        height: 35,
                                    }}
                                    editable={false}
                                />
                            </View>
                        </View>

                    </View>
                </View>                                            

            </View>
        )
    }

    const renderItem = ({ item }) => (
        <Item data={item} />    
    )

    const updateSearch = (text) => {
        if (text) {
            const newData = listpar.filter(function (item) {
            const itemData = item.ClientName
            ? item.ClientName.toUpperCase()
            : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        })

            setListPar(newData)
            setSearch(text)          

        } else {
            setListPar(masterListpar)
            setSearch(text)
        }
    }

    const submitHandler = (text) => {
        var cabang = cabangid
        var username = uname
        var submitpar = "SELECT * FROM DetailPAR WHERE cabangid = '" + cabang + "' AND createdby = '" + username + "' "

        console.log(submitpar)

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
                            dataForm.append('CreatedDate',dt.trxdate)

                            parArray.push(dt.clientid)
                        }
                        // console.log(ArrayHelp)

                        Alert.alert(
                            "Alert",
                            "Apakah anda yakin akan mengirim semua data ? Semua riwayat masukan akan dihapus.",
                            [
                              { text: "OK", onPress: () => {
                                    setLoading(true)
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
                                        setLoading(false)
    
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
                                                        }, function() {
                                                            console.log('Delete Table OK');
                                                    }
                                                  )
                                              } }
                                            ],
                                            { cancelable: false }
                                        );
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        return false;
                                    });
                              }}
                            ],
                            { cancelable: true }
                        );
                        
                    } else {
                        alert('Anda Belum Melakukan PAR')
                    }
                })
            }
        )
    }

    return(
        <View style={styles.headerWrapper}>
                <View style={styles.headerCardContainer}>
                    <View style={styles.groupDetailWrapper}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                            <Text style={{ paddingLeft: 20,fontSize: 17 }}>{branchID + '-' + namaCabang}</Text>
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
                    data={listpar}
                    renderItem={renderItem}
                    keyExtractor={item => item.AccountID}
                />

                <View style={styles.buttomBarWrapper}>
                    <View>
                    <View style={styles.totalSetoranStyle}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Total Angsuran :</Text>
                        <Text style={{ color: '#fff', fontSize: 18 }}>{totalpar}</Text>
                    </View>
                    </View>
                    <View>
                        <View>
                            <TouchableOpacity style={styles.submitButtonContainer} onPress={() => submitHandler()}>
                                <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Sync PKM</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,

    },
    totalAngsuranStyle: {
        flexDirection: 'row',
        paddingLeft: 10,
        height: 30,
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
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 10,
        flexWrap: 'wrap',
        flex: 3,
    },
    upBorder: {
        borderRadius: 10,
        height: window.height/20,
        width: window.width/2.5,
        borderBottomWidth: 2
    },
    addButton: {
        elevation: 8,
        borderRadius: 5,
        backgroundColor: "#28b358",
        height: window.height/25,
        width: window.width/6.0,
        justifyContent: 'center'
    },
    clientName: {
        flexWrap: 'wrap',
        flex: 0.2
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      accountlist: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
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