import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import db from '../../../database/Database';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';

const InisiasiFormPP = ({ route }) => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [data, setData] = useState([])
    const [keyword, setKeyword] = useState('');
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GetInfo();
            getData();
        })

        return unsubscribe
    }, []);

    const GetInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal)
    }

    const getData = async () => {
        // let queryGetdataGroup = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah, a.status, a.isSisipan, a.isTahapLanjut FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE b.status = " + 4 + " GROUP BY a.kelompok "
        // let queryGetdataGroup1 = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah, a.status, a.isSisipan, a.isTahapLanjut FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE b.status = " + 4 + " GROUP BY a.kelompok, b.Nasabah_Id "
        let queryGetdataGroup2 = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah, a.status, b.isSisipan, b.isTahapLanjut FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE a.status <> 'null' AND b.status = " + 4 + " GROUP BY a.kelompok, b.isSisipan"
        let queryGetdataGroup3 = "SELECT * FROM Table_PP_Kelompok"

        // let queryGetdataGroup = "SELECT * FROM Table_PP_ListNasabah WHERE status <> 'null'"

        const getDataPembiayaan = (queryGetdataGroup) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetdataGroup, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let data = []

                            for(let a = 0; a < dataLength; a++) {
                                let i = results.rows.item(a)

                                data.push(i)
                            }

                            resolve(data)
                        })
                    }
                )
            }catch(error){
                alert(error)
            }
        }))

        const data = await getDataPembiayaan(queryGetdataGroup2)
        console.log(data)
        setData(data)
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
            onPress={() => navigation.navigate('InisiasiFormPPList', { ...data })}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage groupName={data.groupName} jumlahNasabah={data.jumlahNasabah} isSisipan={data.isSisipan} isTahapLanjut={data.isTahapLanjut} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ groupName, jumlahNasabah, isSisipan, isTahapLanjut }) => {
        return (
            <View style={stylesheet.containerList}>
                <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                <View style={styles.ML16}>
                    <Text numberOfLines={1} style={[stylesheet.textList, {marginRight: 20}]}>{groupName}</Text>
                    <Text>{jumlahNasabah} Orang</Text>
                    {isSisipan === '1' ? (<Text style={{marginTop: 10, textAlign: 'center', borderRadius: 5, paddingHorizontal: 10, marginRight: 50, fontWeight: 'bold', paddingVertical: 5, backgroundColor: '#D07A04', color: '#FFF'}}>Sisipan</Text>) : (<View></View>)}
                    {isTahapLanjut === '1' ? (<Text style={{marginTop: 10, textAlign: 'center', borderRadius: 5, paddingHorizontal: 10, marginRight: 50, fontWeight: 'bold', paddingVertical: 5, backgroundColor: '#1AA36D', color: '#FFF'}}>Tahap Lanjut</Text>) : (<View></View>)}
                </View>
            </View>
        )
    }

    const empty = () => (
        <View style={styles.P16}>
            <Text>Data kosong</Text>
        </View>
    )

    const findKelompok = async () => {
        let queryFind = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah, a.status, a.isSisipan, a.isTahapLanjut FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE a.status <> 'null' AND b.status = " + 4 + " AND a.kelompok LIKE '%" + keyword + "%' GROUP BY a.kelompok"

        const getDataPembiayaan = (queryGetdataGroup) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetdataGroup, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let data = []

                            for(let a = 0; a < dataLength; a++) {
                                let i = results.rows.item(a)

                                data.push(i)
                            }

                            resolve(data)
                        })
                    }
                )
            }catch(error){
                alert(error)
            }
        }))

        const data = await getDataPembiayaan(queryFind)
        console.log(data)
        setData(data)
    }

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <View style={stylesheet.containerProspek}>
                <Text style={stylesheet.textProspek}>Persetujuan Pembiayaan</Text>
                <View style={stylesheet.containerSearch}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={styles.MH8} />
                    <TextInput 
                        placeholder={"Cari Kelompok"}
                        style={
                            {
                                padding: 5,
                                flex: 1
                            }
                        }
                        onChangeText={(text) => setKeyword(text)}
                        value={keyword}
                        returnKeyType="done"
                        onSubmitEditing={() => findKelompok()}
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

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
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
        margin: 16
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
        alignItems: 'center'
    },
    textList: {
        ...styles.MB4,
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.HITAM
    }
});

export default InisiasiFormPP;
