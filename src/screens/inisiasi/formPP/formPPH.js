import React, { useEffect, useState } from 'react';
import { 
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TextInput,
    ActivityIndicator,
    Modal,
    KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Checkbox } from 'react-native-paper';
import moment from 'moment';
import { showMessage } from "react-native-flash-message"
import 'moment/locale/id';
import { ApiSyncPostInisiasi } from '../../../../dataconfig/apisync/apisync';

import db from '../../../database/Database';
import { style } from 'styled-system';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import { getSyncData } from '../../../actions/sync';

const dimension = Dimensions.get('screen');

const InisiasiFormPPH = ({ route }) => {
    const { source } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState('');
    const [data, setData] = useState([])
    const [keyword, setKeyword] = useState('');
    const [fetching, setFetching] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [statusMelakukan, setStatusMelakukan] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            generateDate();
            getData(source)
        })

        return unsubscribe
    }, []);

    const getData = async (val) => {
        console.log(val)
        // let queryGetGroup = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah, a.isSisipan, a.status FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE b.status = " + val + " GROUP BY a.kelompok, b.Nasabah_Id "
        // let queryGetGroup = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah, a.status FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok GROUP BY a.kelompok "
        let queryGetGroup2 = "SELECT * FROM Table_PP_ListNasabah WHERE status <> 'null' AND status = " + 3
        let queryGetGroup3 = "SELECT DISTINCT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah, a.isSisipan, a.status FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE a.status <> 'null' AND a.status <> '4' AND b.status = " + val + " GROUP BY a.kelompok"
        

        const listData = (queryGetGroup) => (new Promise ((resolve,reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetGroup, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let dataArr = []

                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a)
                                dataArr.push(data)
                            }
                            resolve(dataArr)
                        })
                    }, function(error) {
                        alert(error)
                    }
                )
            }catch(error){
                alert(error)
            }
        }))

        const listDataGet = await listData(queryGetGroup3)
        console.log(listDataGet.length)
        setData(listDataGet)
    }

    const generateDate = () => {
        if (source === '2') return setDate(moment(new Date()).add(1, 'days'));
        if (source === '3') return setDate(moment(new Date()).add(2, 'days'));

        setDate(new Date());
    }

    const actionItemhandler = (data) => {
        let param = {
            groupName : data.groupName,
            jumlahNasabah : data.jumlahNasabah,
            val : source
        }

        navigation.navigate('InisiasiFormPPAbsen', {param})
    }

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

    const syncHandler = async (val) => {
            let queryGetDataPP = "SELECT * FROM Table_PP_ListNasabah WHERE isPP = '" + val + "'"
            let queryGetGroupPP = "SELECT DISTINCT kelompok FROM Table_PP_ListNasabah WHERE status <> 'null'"

            var listKelompok = []

            const getDataKelompok = (queryGetGroupPP) => (new Promise ((resolve, reject) => {
                try{
                    db.transaction(
                        tx => {
                            tx.executeSql(queryGetGroupPP, [], (tx, results) => {
                                let dataLength = results.rows.length
                                let dataGroup = []

                                for(let a = 0; a < dataLength; a++) {
                                    let data = results.rows.item(a)
                                    dataGroup.push({groupName : data.kelompok})
                                }
                                resolve(dataGroup)
                            })
                        }, function(error){
                            alert(error)
                        }
                    )
                }catch(error){
                    alert(error)
                }
            }))

            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetDataPP, [], (tx, results) => {
                            let length = results.rows.length

                            for(let a = 0; a < length; a++) {
                                let data = results.rows.item(a)
                                let ketAbsen = data.AbsPP === '1' ? "Hadir" : data.AbsPP === '2' ? "Tidak Hadir" : "Tanpa Keterangan"
                                let dataSend = {ID_Absen: data.AbsPP, ID_MPP: val, ID_Prospek: data.Nasabah_Id, Keterangan_Absen: ketAbsen, Nama_Kelompok: data.kelompok, Sub_Kelompok: data.subKelompok}

                                listKelompok.push(data.groupName)

                                console.log(dataSend)

                                try{
                                    fetch(ApiSyncPostInisiasi + "post_pp", {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                        'Content-Type': 'application/json'
                                                },
                                            body: JSON.stringify(dataSend)
                                        })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        console.log("second")
                    
                                        console.log(responseJson)
                                        if(responseJson.code === 200) {
                                            flashNotification("Success", "Data berhasil di proses", "#ffbf47", "#fff")
                                            if(val === '1' || val === 1) {
                                                var queryUpdate = `UPDATE Table_PP_ListNasabah SET status = 2, AbsPP = '0' WHERE Nasabah_Id = '` + data.Nasabah_Id + `'`
                                            }else if(val === '2' || val === 2) {
                                                if(data.isSisipan === '1' || data.isSisipan === 1){
                                                    var queryUpdate = `UPDATE Table_PP_ListNasabah SET status = 4, AbsPP = '0' WHERE Nasabah_Id = '` + data.Nasabah_Id + `'`
                                                }else{
                                                    var queryUpdate = `UPDATE Table_PP_ListNasabah SET status = 3, AbsPP = '0' WHERE Nasabah_Id = '` + data.Nasabah_Id + `'`
                                                }
                                            }else if(val === '3' || val === 3) {
                                                var queryUpdate = `UPDATE Table_PP_ListNasabah SET status = 4, AbsPP = '0' WHERE Nasabah_Id = '` + data.Nasabah_Id + `'`
                                            }
                    
                                            db.transaction(
                                                tx => {
                                                    // tx.executeSql("DELETE FROM Table_PP_ListNasabah WHERE Nasabah_Id = '" + data.Nasabah_Id + "'")
                                                    // tx.executeSql("DELETE FROM Table_PP_Kelompok WHERE kelompok = '" + kelompok + "'")
                                                    tx.executeSql(queryUpdate)
                                                },function(error) {
                                                    console.log('Transaction ERROR: ' + error.message);
                                                  }, function() {
                                                    getData(val)
                                                    console.log('Delete Table OK');
                                              }
                                            )

                                        }else{
                                            // setLoading(false)
                                            flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + responseJson.message, "#ff6347", "#fff")
                                        }
                                    }).catch((error) => {
                                        // setLoading(false)
                                        flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error.message, "#ff6347", "#fff")
                                    })
                                }catch(error){
                                    console.log("disini")
                                    // setLoading(false)
                                    flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error, "#ff6347", "#fff")
                                }

                            }
                        })
                    }, function(error){
                        alert(error)
                    }
                )
            }catch(error){
                alert(error)
            }

            if(val === 1 || val === '1') {
                const dataGroup = await getDataKelompok(queryGetGroupPP)
                let dataLength = dataGroup.length

                const getDataKelompokPP = (query) => (new Promise((resolve, reject) => {
                    try{
                        db.transaction(
                            tx => {
                                tx.executeSql(query, [], (tx, results) => {
                                    let length = results.rows.length
                                    for(let a = 0; a < length; a++) {
                                        let b = results.rows.item(a)

                                        resolve(b)
                                    }
                                })
                            }, function(error){
                                alert(error)
                            }
                        )
                    }catch(error){
                        alert(error)
                    }
                }))

                const getDataJumlahPP = (query) => (new Promise((resolve, reject) => {
                    try{
                        db.transaction(
                            tx => {
                                tx.executeSql(query, [], (tx, results) => {
                                    let length = results.rows.length
                                    for(let a = 0; a < length; a++) {
                                        let b = results.rows.item(a)

                                        resolve(b)
                                    }
                                })
                            }, function(error){
                                alert(error)
                            }
                        )
                    }catch(error){
                        alert(error)
                    }
                }))

                try{
                    for(let a = 0; a < dataLength; a++) {
                        let groupName = dataGroup[a].groupName
                        let queryGetGroupDetail = "SELECT * FROM Table_PP_Kelompok WHERE kelompok = '" + groupName + "'"
                        let queryGetGroup = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE b.kelompok = '" + groupName + "' GROUP BY a.kelompok "

                        console.log(queryGetGroup)
                        const dataGroupCollect = await getDataKelompokPP(queryGetGroupDetail)
                        const dataGroupTotal = await getDataJumlahPP(queryGetGroup)

                        let dataSend = {ClientTotal: dataGroupTotal.jumlahNasabah.toString(), GroupProduct: dataGroupCollect.group_Produk, HariPertemuan: dataGroupCollect.hari_Pertemuan, IDKelompok : "", ID_DK_Mobile: dataGroupCollect.kelompok_Id, LokasiPertemuan: dataGroupCollect.lokasi_Pertemuan, NamaKelompok: dataGroupCollect.kelompok, OurBranchID: dataGroupCollect.branchid, TanggalPertemuan: dataGroupCollect.tanggal_Pertama, WaktuPertemuan: dataGroupCollect.waktu_Pertemuan}

                        if(dataGroupCollect.isSisipan === 1 || dataGroupCollect.isSisipan === '1') {
                            dataSend = {ClientTotal: dataGroupTotal.jumlahNasabah.toString(), GroupProduct: dataGroupCollect.group_Produk, HariPertemuan: dataGroupCollect.hari_Pertemuan, IDKelompok : dataGroupCollect.kelompok_Id, ID_DK_Mobile: "", LokasiPertemuan: dataGroupCollect.lokasi_Pertemuan, NamaKelompok: dataGroupCollect.kelompok, OurBranchID: dataGroupCollect.branchid, TanggalPertemuan: dataGroupCollect.tanggal_Pertama, WaktuPertemuan: dataGroupCollect.waktu_Pertemuan}  
                        }

                        try{
                            fetch(ApiSyncPostInisiasi + "post_data_kelompok", {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                                'Content-Type': 'application/json'
                                        },
                                    body: JSON.stringify(dataSend)
                                })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.log("second")
            
                                console.log(responseJson)
                                if(responseJson.code === 200) {
                                    flashNotification("Success", "Data berhasil di proses", "#ffbf47", "#fff")
                                    getData(val)
                                }else{
                                    flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + responseJson.message, "#ff6347", "#fff")
                                }
                            }).catch((error) => {
                                flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error.message, "#ff6347", "#fff")
                            })
                        }catch(error){
                            console.log("disini")
                            flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error, "#ff6347", "#fff")
                        }
                    }
                }catch(error){
                    alert(error)
                }
            }

    }

    const renderHeader = () => (
        <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>BACK</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={stylesheet.containerItem} 
            onPress={() => actionItemhandler(data)}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage groupName={data.groupName} jumlahNasabah={data.jumlahNasabah} status={data.status} isSisipan={data.isSisipan} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ groupName, jumlahNasabah, status, isSisipan }) => {
        if(source === '1') {
            return (
                <View style={stylesheet.containerList}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                        <View style={styles.ML16}>
                            <Text numberOfLines={1} style={[stylesheet.textList, {marginRight: 100}]}>{groupName}</Text>
                            <Text>{jumlahNasabah} Orang</Text>
                            {isSisipan === '1' ? (<Text style={{borderWidth: 1, marginTop: 10, textAlign: 'center', borderRadius: 5, paddingHorizontal: 10, marginRight: 100}}>Sisipan</Text>) : (<View></View>)}
                        </View>
                    </View>
                    {status === "0" ? (<View></View>) : (<FontAwesome5 name="check" size={20} color="#17BEBB" />)}
                </View>
            )
        }else if(source === '2') {
            return (
                <View style={stylesheet.containerList}>
                    <View style={{ flexDirection: 'row' }}>
                        <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                        <View style={styles.ML16}>
                            <Text numberOfLines={1} style={[stylesheet.textList, {marginRight: 100}]}>{groupName}</Text>
                            <Text>{jumlahNasabah} Orang</Text>
                            {isSisipan === '1' ? (<Text style={{borderWidth: 1, marginTop: 10, textAlign: 'center', borderRadius: 5, paddingHorizontal: 10, marginRight: 100}}>Sisipan</Text>) : (<View></View>)}
                        </View>
                    </View>
                    {status === "2" ? (<FontAwesome5 name="check" size={20} color="#17BEBB" />) : (<View></View>)}
                </View>
            )
        }else if(source === '3') {
            return (
                <View style={stylesheet.containerList}>
                    <View style={{ flexDirection: 'row' }}>
                        <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                        <View style={styles.ML16}>
                            <Text numberOfLines={1} style={[stylesheet.textList, {marginRight: 100}]}>{groupName}</Text>
                            <Text>{jumlahNasabah} Orang</Text>
                        </View>
                    </View>
                    {status === "3" ? (<FontAwesome5 name="check" size={20} color="#17BEBB" />) : (<View></View>)}
                </View>
            )
        }
        
    }

    const empty = () => (
        <View style={styles.P16}>
            <Text>Data kosong</Text>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <View style={stylesheet.containerProspek}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={stylesheet.textProspek}>Persiapan Pembiayaan {source}</Text>
                    {source === '3' ? (<View></View>) : (
                        <TouchableOpacity onPress={() => syncHandler(source)} style={{ alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', borderRadius: 20, fontSize: 16, fontWeight: 'bold', marginHorizontal: 20}}>SYNC</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={stylesheet.containerSearch}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={styles.MH8} />
                    <TextInput 
                        placeholder={"Cari Kelompok"}
                        style={
                            {
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
                <SafeAreaView style={{flex: 1}}>
                    {fetching === undefined ? (
                        <View style={stylesheet.loading}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    ) : (
                        <View style={stylesheet.containerMain}>
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                enabledGestureInteraction={true}
                                renderItem={renderItem}
                                ListEmptyComponent={empty}
                            />
                        </View>
                    )}
                </SafeAreaView>
            </View>
        </View>
    )

    const renderHeaderModal = () => (
        <View
            style={[styles.MB16, styles.FDRow]}
        >
            <Text style={{ flex: 1, fontSize: 18 }}>PP{source} - GANG KELINCI</Text>
            <FontAwesome5 name="times-circle" size={22} color="#2e2e2e" onPress={() => setVisible(!visible)} />
        </View>
    )

    const renderBodyModal = () => (
        <View style={styles.F1}>
            <View>
                <Text>Tanggal PP 1</Text>
                <View style={[styles.P16, styles.MT8, { borderWidth: 1, borderRadius: 6 }]}>
                    <Text>{moment(date).format('LL')}</Text>
                </View>
            </View>
            <View style={[styles.FDRow, { alignItems: 'center', marginLeft: -8 }]}>
                <Checkbox
                    status={statusMelakukan ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setStatusMelakukan(!statusMelakukan);
                    }}
                />
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Melakukan PP{source}</Text>
            </View>
        </View>
    )

    const renderFooterModal = () => (
        <View style={styles.FDRow}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => alert(JSON.stringify(statusMelakukan))}
            >
                <View style={[styles.buttonSubmitContainer, { padding: 8 }]}>
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderModal = () => (
        <Modal            
            animationType={"fade"}  
            transparent={true}  
            visible={visible}  
            onRequestClose={() =>{ console.log("Modal has been closed.") } }
            KeyboardSpacer
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.modalContainer}>  
                    <View style={styles.modalBody}>
                        {renderHeaderModal()}
                        {renderSpace()}
                        {renderBodyModal()}
                        {renderFooterModal()}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )

    const renderSpace = () => (
        <View style={[styles.spaceGray, styles.MB8, { borderWidth: 1, borderColor: 'whitesmoke' }]} />
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
            {renderModal()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
    containerProspek: { 
        ...styles.F1,
        ...styles.MT16,
        ...styles.MH16,
        backgroundColor: colors.PUTIH
    },
    textProspek: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        margin: 5
    },
    containerSearch: { 
        ...styles.FDRow,
        ...styles.MH8,
        ...styles.MT4,
        borderWidth: 1, 
        alignItems: 'center', 
        backgroundColor: colors.PUTIH, 
        borderRadius: 16
    },
    containerMain: { 
        ...styles.MT16,
        justifyContent: 'space-between'
    },
    containerItem: { 
        ...styles.F1,
        ...styles.MH8,
        ...styles.M4,
        borderRadius: 16, 
        backgroundColor: colors.PUTIH, 
        borderWidth: 1, 
    },
    containerList: {
        ...styles.FDRow,
        ...styles.M16,
        width: "85%",
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textList: {
        ...styles.MB4,
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.HITAM
    }
});

export default InisiasiFormPPH;
