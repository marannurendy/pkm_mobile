import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator, ToastAndroid, Alert, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { ApiSyncPostInisiasi } from '../../../dataconfig/apisync/apisync';
import db from '../../database/Database'
import { style } from 'styled-system'

const dimension = Dimensions.get('screen');

const Verifikasi = ({ route }) => {
    const { groupName } = route.params;
    const navigation = useNavigation();
    const dimension = Dimensions.get('screen');
    const [currentDate, setCurrentDate] = useState();
    const [data, setData] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GetInfo();
            getDataDiri();
        });
        return unsubscribe;
    }, [navigation]);

    const getDataDiri = () => {
        if (__DEV__) console.log('getDataDiri loaded');
        if (__DEV__) console.log('getDataDiri keyword:', keyword);

        let query = 'SELECT * FROM Table_UK_DataDiri WHERE status_Verif = "1" AND status_UK_Pass = "1" AND status_Verifikasi_Pass = "0" AND lokasi_sosialisasi = "'+ groupName +'" AND nama_lengkap LIKE "%'+ keyword +'%"';
        // let query = 'SELECT * FROM Table_UK_DataDiri WHERE lokasi_sosialisasi = "'+ groupName +'" AND nama_lengkap LIKE "%'+ keyword +'%"';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getDataDiri results:', results.rows);
                    let dataLength = results.rows.length;

                    var ah = [];
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({ "namaNasabah": data.nama_lengkap, "nomorHandphone": data.no_tlp_nasabah, "status": data.status_Verif, "groupName": data.lokasi_sosialisasi, "idProspek": data.id_prospek, "syncVerif": data.sync_Verif });
                    }
                    setData(ah)
                })
            }
        );
    }

    const GetInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal)
    }

    const doSync = () => {
        if (submitted) return true;

        if (data.length > 0) {
            Alert.alert(
                "Sync Verifikasi",
                "Apakah kamu yakin akan melakukan sync sekarang (pastikan koneksi internet sudah lancar)?",
                [
                    {
                        text: "Cancel",
                        onPress: () => __DEV__ && console.log("cancel pressed"),
                        style: "cancel"
                    },
                    { 
                        text: "OK", 
                        onPress: () => {
                            if (__DEV__) console.log("doSync loaded");
                            if (__DEV__) console.log("doSync data:", data);

                            setSubmitted(true);
                            const nestedPromise = async (items = []) => {
                                return await Promise.all(
                                    items.map(async item => {
                                        const body = await AsyncStorage.getItem(`formVerifikasi_body_${item.idProspek}`);
                                        if (__DEV__) console.log('doSync nestedPromise item:', item);
                                        if (__DEV__) console.log('doSync nestedPromise body:', body);

                                        if (item.syncVerif === '1' && body) {
                                            return fetch(ApiSyncPostInisiasi + 'post_verif_status', {
                                                method: 'POST',
                                                headers: {
                                                    Accept:
                                                        'application/json',
                                                        'Content-Type': 'application/json'
                                                    },
                                                body: body
                                            })
                                            .then((response) => response.json())
                                            .then((responseJSON) => {
                                                if (__DEV__) console.error('$post /post_inisiasi/post_verif_status response', responseJSON);

                                                const queryDeleteSosialisasiDatabase = "DELETE FROM Sosialisasi_Database WHERE id_prospek = '" + item.idProspek + "'";
                                                const queryDeleteUKDataDiri = "DELETE FROM Table_UK_DataDiri WHERE id_prospek = '" + item.idProspek + "'";
                                                const queryDeleteUKProdukPembiayaan = "DELETE FROM Table_UK_ProdukPembiayaan WHERE id_prospek = '" + item.idProspek + "'";
                                                const queryDeleteUKKondisiRumah = "DELETE FROM Table_UK_KondisiRumah WHERE id_prospek = '" + item.namaNasabah + "'";
                                                const queryDeleteUKSektorEkonomi = "DELETE FROM Table_UK_SektorEkonomi WHERE id_prospek = '" + item.namaNasabah + "'";
                                                const queryDeleteUKPendapatanNasabah = "DELETE FROM Table_UK_PendapatanNasabah WHERE id_prospek = '" + item.namaNasabah + "'";
                                                const queryDeleteUKPermohonanPembiayaan = "DELETE FROM Table_UK_PermohonanPembiayaan WHERE id_prospek = '" + item.namaNasabah + "'";
                                                db.transaction(
                                                    tx => {
                                                        tx.executeSql(queryDeleteSosialisasiDatabase, [], (tx, results) => {
                                                            if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} RESPONSE:`, results.rows);
                                                        })
                                                    }, function(error) {
                                                        if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} ERROR:`, error);
                                                    }, function() {}
                                                );
                                                db.transaction(
                                                    tx => {
                                                        tx.executeSql(queryDeleteUKDataDiri, [], (tx, results) => {
                                                            if (__DEV__) console.log(`${queryDeleteUKDataDiri} RESPONSE:`, results.rows);
                                                        })
                                                    }, function(error) {
                                                        if (__DEV__) console.log(`${queryDeleteUKDataDiri} ERROR:`, error);
                                                    }, function() {}
                                                );
                                                db.transaction(
                                                    tx => {
                                                        tx.executeSql(queryDeleteUKProdukPembiayaan, [], (tx, results) => {
                                                            if (__DEV__) console.log(`${queryDeleteUKProdukPembiayaan} RESPONSE:`, results.rows);
                                                        })
                                                    }, function(error) {
                                                        if (__DEV__) console.log(`${queryDeleteUKProdukPembiayaan} ERROR:`, error);
                                                    }, function() {}
                                                );
                                                db.transaction(
                                                    tx => {
                                                        tx.executeSql(queryDeleteUKKondisiRumah, [], (tx, results) => {
                                                            if (__DEV__) console.log(`${queryDeleteUKKondisiRumah} RESPONSE:`, results.rows);
                                                        })
                                                    }, function(error) {
                                                        if (__DEV__) console.log(`${queryDeleteUKKondisiRumah} ERROR:`, error);
                                                    }, function() {}
                                                );
                                                db.transaction(
                                                    tx => {
                                                        tx.executeSql(queryDeleteUKSektorEkonomi, [], (tx, results) => {
                                                            if (__DEV__) console.log(`${queryDeleteUKSektorEkonomi} RESPONSE:`, results.rows);
                                                        })
                                                    }, function(error) {
                                                        if (__DEV__) console.log(`${queryDeleteUKSektorEkonomi} ERROR:`, error);
                                                    }, function() {}
                                                );
                                                db.transaction(
                                                    tx => {
                                                        tx.executeSql(queryDeleteUKPendapatanNasabah, [], (tx, results) => {
                                                            if (__DEV__) console.log(`${queryDeleteUKPendapatanNasabah} RESPONSE:`, results.rows);
                                                        })
                                                    }, function(error) {
                                                        if (__DEV__) console.log(`${queryDeleteUKPendapatanNasabah} ERROR:`, error);
                                                    }, function() {}
                                                );
                                                db.transaction(
                                                    tx => {
                                                        tx.executeSql(queryDeleteUKPermohonanPembiayaan, [], (tx, results) => {
                                                            if (__DEV__) console.log(`${queryDeleteUKPermohonanPembiayaan} RESPONSE:`, results.rows);
                                                        })
                                                    }, function(error) {
                                                        if (__DEV__) console.log(`${queryDeleteUKPermohonanPembiayaan} ERROR:`, error);
                                                    }, function() {}
                                                );
                                            })
                                            .catch((error) => {
                                                if (__DEV__) console.log('$post /post_inisiasi/post_verif_status response', error);

                                                ToastAndroid.show(error.message || 'Something went wrong', ToastAndroid.SHORT);
                                            });
                                        }
                                    })
                                )
                            }
                
                            nestedPromise(data).then(response => {
                                if (__DEV__) console.log('nestedPromise response', response);

                                ToastAndroid.show(`Sync selesai`, ToastAndroid.SHORT);
                                setSubmitted(false);
                                setTimeout(() => {
                                    getDataDiri();
                                }, 600);
                            });

                            return 'ASYNC VERIFIKASI DONE';
                        }
                    }
                ]
            );
        } else {
            ToastAndroid.show(`Sync kosong`, ToastAndroid.SHORT);
        }
    }

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={styles.containerItem} 
            onPress={() => {
                if (data.syncVerif === '1') return ToastAndroid.show('Menunggu sync', ToastAndroid.SHORT);

                navigation.navigate('VerifikasiFormReview', {
                    groupName: data.groupName,
                    namaNasabah: data.namaNasabah,
                    nomorHandphone: data.nomorHandphone,
                    idProspek: data.idProspek
                })
            }}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage namaNasabah={data.namaNasabah} status={data.status} syncVerif={data.syncVerif} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ namaNasabah, status, syncVerif }) => {
        return(
            <View style={[styles.containerList, { alignItems: 'center' }]}>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={2} style={[styles.textList]}>{namaNasabah}</Text>
                </View>
                {syncVerif === '1' && <FontAwesome5 name="sync" size={15} color="#2e2e2e" style={{ marginLeft: 8 }} />}
            </View>
        )
    }

    const empty = () => {
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

    return (
        <View style={styles.container}>
            <View style={styles.containerInisiasi}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonInisiasi}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={styles.titleInisiasi}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>INISIASI</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.containerHeader}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
                    <Text style={[styles.textImageBackground, { fontSize: 30 }]}>Verifikasi</Text>
                    <Text style={[styles.textImageBackground, { fontSize: 20 }]}>{groupName}</Text>
                    <Text style={[styles.textImageBackground, { fontSize: 20 }]}>{currentDate}</Text>
                </ImageBackground>
            </View>
            <View style={styles.containerProspek}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.textProspek, { flex: 1 }]}>Daftar Prospek</Text>
                </View>
                <View style={styles.containerSearch}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
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
                        onSubmitEditing={() => getDataDiri()}
                    />
                </View>
                <SafeAreaView style={{flex: 1}}>
                    {data.length === 0 ? (
                        <View style={{ padding: 16 }}>
                            <Text>Data kosong</Text>
                        </View>
                    ) : (
                        <ScrollView>
                            <View style={styles.containerMain}>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item, index) => index.toString()}
                                    enabledGestureInteraction={true}
                                    renderItem={renderItem}
                                    ListEmptyComponent={empty}
                                />
                            </View>
                        </ScrollView>
                    )}
                    {data.length > 0 && (
                        <TouchableOpacity
                            onPress={() => doSync()}
                            style={{ margin: 16 }}
                        >
                            <View
                                style={{ backgroundColor: submitted ? 'gray' : '#3CB371', padding: 16, borderRadius: 8 }}
                            >
                                <Text style={{ color: 'white', textAlign: 'center' }}>{submitted ? 'LOADING...' : 'TEKAN UNTUK SYNC'}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </SafeAreaView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ECE9E4", 
        width: dimension.width, 
        height: dimension.height, 
        flex: 1
    },
    containerInisiasi: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 40,
        alignItems: "center",
        paddingHorizontal: 20
    },
    buttonInisiasi: {
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#BCC8C6", 
        borderRadius: 10
    },
    titleInisiasi: {
        fontSize: 18, 
        paddingHorizontal: 15, 
        fontWeight: 'bold'
    },
    containerHeader: {
        height: dimension.height/5, 
        marginHorizontal: 30, 
        borderRadius: 20, 
        marginTop: 30
    },
    containerImageBackground: {
        flex: 1, 
        resizeMode: "cover", 
        justifyContent: 'center',
        borderRadius: 20
    },
    textImageBackground: {
        marginHorizontal: 35, 
        fontSize: 30, 
        fontWeight: 'bold', 
        color: '#FFF', 
        marginBottom: 5
    },
    containerProspek: {
        flex: 1, 
        borderTopRightRadius: 20, 
        borderTopLeftRadius: 20, 
        marginTop: 20, 
        marginHorizontal: 20, 
        backgroundColor: '#FFF'
    },
    textProspek: {
        fontSize: 18, 
        fontWeight: 'bold', 
        margin: 16
    },
    containerSearch: {
        borderWidth: 1, 
        marginHorizontal: 10, 
        marginTop: 5, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF', 
        borderRadius: 20
    },
    containerMain: {
        justifyContent: 'space-between', 
        marginTop: 20
    },
    containerItem: {
        margin: 5, 
        borderRadius: 20, 
        backgroundColor: '#FFF', 
        flex: 1, 
        borderWidth: 1, 
        marginHorizontal: 15
    },
    containerList: {
        width: "85%",
        margin: 20,
        flexDirection: 'row'
    },
    textList: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        color: '#545851'
    }
});

export default Verifikasi;
