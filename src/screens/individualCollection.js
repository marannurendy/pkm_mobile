import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, SafeAreaView, TextInput, Keyboard, Alert, ActivityIndicator, ToastAndroid, ScrollView, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import db from '../database/Database'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CurrencyInput from 'react-native-currency-input'
import moment from 'moment'
import BottomSheet from 'reanimated-bottom-sheet'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { set } from 'react-native-reanimated'
import {ApiSync} from '../../dataconfig/index';
import { showMessage } from "react-native-flash-message"


const dimension = Dimensions.get('screen')

function IndividualCollection(props) {

    const {cabangid, uname} = props.route.params
    const SelectMemberList = (memberList) => (new Promise((resolve, reject) => {
        try{
            db.transaction(
                tx => {
                    tx.executeSql(memberList, [], (tx, results) => {
                        let dataLength = results.rows.length
                        var dataList = []
                        for(let a = 0; a < dataLength; a++) {
                            let newData = results.rows.item(a);
                            dataList.push(newData);
                        }

                        resolve (dataList)
                    })
                },function(error) {
                    reject(error)
                }
            )
        } catch( error ) {
            reject(error)
        }
    }))

    let [search, setSearch] = useState()
    let [modalVisible, setModalVisible] = useState()
    let [branchID, setBranchID] = useState()
    let [namaCabang, setNamaCabang] = useState()
    let [Username, setUserName] = useState()
    let [AOname, setAOName] = useState()
    let [totalpar, setTotalpar] = useState([])
    let [nasabahTotal, setNasabahTotal] = useState()
    let [loading, setLoading] = useState(false)

    let [limit, setLimit] = useState(10)
    let [offset, setOffset] = useState(0)

    let [memberList, setMemberList] = useState([])
    let [listData, setListData] = useState([])

    let [currentDate, setCurrentDate] = useState()
    let [totalAngsuran, setTotalAngsuran] = useState()

    let [isLoaded, setIsLoaded] = useState(false)

    const btmsheet = React.createRef()

    const navigation = useNavigation()
    moment.locale('id');
    var hariIni = moment().format('LLLL')

    useEffect(() => {

        const unsubscribe  = navigation.addListener('focus', async () => {

            const syncStatus = await AsyncStorage.getItem('userData')
            let DetailData = JSON.parse(syncStatus)
            const tanggal = await AsyncStorage.getItem('TransactionDate')
            setCurrentDate(tanggal)

            setBranchID(DetailData.kodeCabang)
            setNamaCabang(DetailData.namaCabang)
            setUserName(DetailData.userName)
            setAOName(DetailData.AOname)

            setIsLoaded(true)

            FetchdataPKMIndividual(DetailData.kodeCabang, DetailData.userName)
        })

        return unsubscribe
    }, [])

    const FetchdataPKMIndividual = async (id, uname) => {
        setLoading(true)

        let queryGetData = `SELECT * FROM PAR_AccountList WHERE OurBranchID = '` + id + `' AND syncby = '` + uname + `'`

        const DataListMember = await SelectMemberList(queryGetData)
        const statusTotal = DataListMember.reduce((a,v) =>  a = Number(a) + Number(v.jumlahbayar) , 0 )

        setListData(DataListMember)
        setMemberList(DataListMember)
        setTotalAngsuran(statusTotal)
        // DataToFetch(limit, offset)
        setLoading(false)
    }

    const SubmitHandler = async () => {

        setLoading(true)
        let queryCek = `SELECT * FROM PAR_AccountList WHERE OurBranchID = ` + branchID + ` AND status = '` + 1 + `'`
        const DataGet = (queryCek) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryCek, [], (tx, results) => {
                            let dataLength = results.rows.length
                            var listData = []

                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a)
                                listData.push(data)
                            }

                            resolve (listData)
                        })
                    },function(error) {
                        setLoading(false)
                        reject(error)
                    }
                )
            } catch( error ) {
                setLoading(false)
                reject(error)
            }
        }))

        const ListData = await DataGet(queryCek)
        setLoading(false)

        const token = await AsyncStorage.getItem('token');
        if (_DEV_) console.log('ACTIONS TOKEN', token);

        let dataList = ListData.length
        if(dataList > 0) {
            const dataForm = new FormData()
            for(let a = 0; a < dataList; a++) {
                dataForm.append('AOSign',ListData[a].AoSign)
                dataForm.append('accountid',ListData[a].AccountID)
                dataForm.append('cabangid',branchID)
                dataForm.append('clientSign',ListData[a].NasabahSign)
                dataForm.append('clientid',ListData[a].ClientID)
                dataForm.append('createdby',ListData[a].syncby)
                dataForm.append('groupid',ListData[a].GroupID)
                dataForm.append('jumlahpar',ListData[a].jumlahbayar)
                dataForm.append('CreatedDate',currentDate)
            }

            Alert.alert(
                "Alert",
                "Apakah anda yakin akan mengirim semua data ? Semua riwayat masukan akan dihapus.",
                [
                    {
                        text: "BATAL",
                        onPress: () => {
                            setLoading(false)
                        }
                    },
                    { text: "SETUJU", onPress: () => {
                        setLoading(true)
                        let IndividualSync = ApiSync + 'PostPKMIndividual'
                        return fetch(IndividualSync, {
                            method:'POST',
                            headers: {
                                Authorization: token,
                                Accept: 'application/json',
                                'Content-Type': 'multipart/form-data'
                            },
                            body: dataForm,
                        })
                        .then((response) => response.text())
                        .then((responseText) => {
                            setLoading(false)
                            // setLoading(false)
                            Alert.alert(
                                "Sukses",
                                "Data Berhasil Dikirim",
                                [
                                  { text: "OK", onPress: () => {
                                        setLoading(true)
                                      db.transaction(
                                          tx => {
                                            for(let p = 0; p < dataList; p++) {
                                                tx.executeSql("DELETE FROM PAR_AccountList WHERE ClientID = '" + ListData[p].ClientID + "'")
                                                tx.executeSql("DELETE FROM DetailPAR WHERE clientid = '"+ ListData[p].ClientID +"'")
                                            }
                                          },function(error) {
                                                setLoading(false)
                                                console.log('Transaction ERROR: ' + error.message);
                                            }, function() {
                                                setLoading(false)
                                                flashNotification("Success", "Data berhasil di proses", "#ffbf47", "#fff")
                                                FetchdataPKMIndividual(branchID, Username)
                                        }
                                      )
                                  } }
                                ],
                                { cancelable: false }
                            );
                        })
                        .catch((error) => {
                            setLoading(false)
                            flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error.message, "#ff6347", "#fff")
                        });
                  }}
                ],
                { cancelable: true }
            );
        } else {
            setLoading(false)
            flashNotification("Alert", "Belum ada data penagihan yang di isi", "#ff6347", "#fff")
        }
    }

    const flashNotification = (title, message, backgroundColor, color) => {
        showMessage({
            message: title,
            description: message,
            type: "info",
            duration: 3500,
            statusBarHeight: 20,
            backgroundColor: backgroundColor,
            color: color,
            titleStyle: {fontWeight: 'bold', fontSize: 20}
        });
    }

    const renderCollection = ({item}) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity
            disabled={data.status === "1" ? true : false}
            style={data.status === "1" ? { margin: 10, borderRadius: 10, padding: 5, backgroundColor: '#CCCCC4' } : { margin: 10, borderRadius: 10, padding: 5, backgroundColor: '#FFF' }}
            onPress={() => navigation.navigate('FormIndividualCollection', {clientid : data.ClientID, groupid: data.GroupID})}
        >
            <View style={{ backgroundColor: '#0E71C4', flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10 }}>
                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 17, color: '#FFF' }}>{data.ClientName}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#FFF' }}>{data.ClientID}</Text>
            </View>
            <Text>{data.GroupID}</Text>
            <Text>{data.GroupName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, marginTop: 10, padding: 5, borderRadius: 10 }}>
                <Text style={{ flex: 4, fontWeight: 'bold', fontSize: 16 }}>Jumlah Tagihan</Text>
                <CurrencyInput
                    value={data.ODAmount}
                    prefix="Rp "
                    delimiter=","
                    separator="."
                    precision={0}
                    editable= {false}
                    style={{
                        color: 'black',
                        fontSize: 16,
                        padding: 5,
                        flex: 3,
                        borderWidth: 1,
                        borderRadius: 10
                    }}
                    numberOfLines={1}
                />
            </View>
        </TouchableOpacity>
    )

    const searchHandler = (value, data) => {
        let newData = [];
        // console.log(value)
        if (value) {
            newData = data.filter(function(item) {
                const itemData = item.ClientName.toUpperCase();
                const textData = value.toUpperCase();
                return itemData.includes(textData);
            })
            setMemberList([...newData]);
        } else {
            setMemberList([...listData]);
        }
    }

    const renderContent = () => (
        <View style={{ backgroundColor: '#CCCCC4', padding: 12, height: 600,}}>

            <View style={{borderTopWidth: 4, marginBottom: 10, width: 50, borderRadius: 50, alignSelf: 'center', borderColor: '#51534E'}} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 10 }}>
                        <Text style={{ color: '#2e2e2e', fontWeight: 'bold', padding: 5, flex: 3 }}>Total Angsuran</Text>
                        <CurrencyInput
                            value={totalAngsuran}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                padding: 5,
                                flex: 3
                            }}
                            numberOfLines={1}
                        />
                    </View>

                </View>

                <View style={{ flex: 2, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => SubmitHandler()} style={{ paddingHorizontal: 25, paddingVertical: 5, borderRadius: 10, backgroundColor: '#08847C' }}>
                        <Text style={{ fontSize: 17, color: '#FFF', fontWeight: 'bold' }}>SYNC</Text>
                    </TouchableOpacity>
                </View>
            </View>            
        </View>
    );

    return (
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
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
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PENAGIHAN</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 20, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../assets/Image/Banner.png")} blurRadius={1} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                    {isLoaded ? 
                        <View>
                            <Text numberOfLines={2} style={{marginHorizontal: 35, fontSize: 25, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{namaCabang}</Text>
                            <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF'}}>{branchID}</Text>
                            <View style={{flexDirection: 'row', width: dimension.width/2.5, marginHorizontal: 35, marginTop: 10, borderRadius: 5, backgroundColor: '#FAFAF8', padding: 5}}>
                                <FontAwesome5 name="calendar-alt" size={15} color="#2e2e2e" style={{marginRight: 10}} />
                                <Text style={{fontWeight: 'bold', marginRight: 10}}>{currentDate}</Text>
                                <Text style={{fontWeight: 'bold'}}>{moment().format('LT')}</Text>
                            </View>
                        </View>
                    :
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>Mohon Tunggu...</Text>
                        </View>
                    }
                </ImageBackground>
            </View>

            <View style={{marginHorizontal: 20, marginTop: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
                <TextInput 
                    placeholder={"Cari Nama Nasabah"} 
                    style={{flex: 1, padding: 5, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}
                    onChangeText={(value) => {
                        searchHandler(value, memberList)
                    }}
                />
            </View>

            <SafeAreaView style={{flex: 1, marginTop: 10}}>
                {isLoaded === false ? 
                    (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{padding: 10, borderRadius: 15, backgroundColor: '#FFF'}}>
                                <Text style={{fontWeight: 'bold', color: '#545851'}}>Mohon Tunggu...</Text>
                            </View>
                        </View>
                    ) :
                    ( <View style={{ marginHorizontal: 20, borderRadius: 20 }}>
                        <FlatList
                                // contentContainerStyle={styles.listStyle}
                                // refreshing={refreshing}
                                // onRefresh={() => _onRefresh()}
                                data={memberList}
                                keyExtractor={(item, index) => index.toString()}
                                enabledGestureInteraction={true}
                                // onEndReachedThreshold={0.1}
                                // onEndReached={() => handleEndReach()}
                                renderItem={renderCollection}
                                // style={{height: '88.6%'}}
                            />
                    </View>
                    )
                }

            </SafeAreaView>
            <BottomSheet
                ref={btmsheet}
                snapPoints={[300, 120, 90]}
                initialSnap={2}
                borderRadius={20}
                renderContent={renderContent}
            />

                {loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                }
        </View>
    )
}

export default IndividualCollection

const styles = StyleSheet.create({
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